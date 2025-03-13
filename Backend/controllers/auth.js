const express = require("express");
const app = express();
app.use(express.json());
const User = require("../models/User");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 45 * 1000); // 45 seconds

    const newUser = new User({ 
      name, 
      email, 
      password,
      role,
      company,
      otp,
      otpExpires,
      isEmailVerified: false
    });

    await newUser.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - CareerHub',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563EB; text-align: center;">Welcome to CareerHub!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering. Please verify your email using this OTP:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="color: #2563EB; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 45 seconds.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px; text-align: center;">CareerHub Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      message: "Registration successful! Please check your email for OTP verification.",
      userId: newUser._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
 
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from response
    user.password = undefined;

    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log('Reset URL:', resetUrl); // Debug log

    // Email content with clickable button
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563EB; text-align: center;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password. Please click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563EB; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background-color: #f3f4f6; 
                    padding: 10px; 
                    border-radius: 5px; 
                    word-break: break-all;">
            ${resetUrl}
          </p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px; text-align: center;">CareerHub Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
      res.json({ 
        message: 'Password reset link sent to your email',
        debug: { resetUrl } 
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ message: 'Error sending password reset email' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add this test function to verify email configuration
const testEmailConfig = async () => {
  try {
    await transporter.verify();
    // console.log('Email configuration is correct');
  } catch (error) {
    console.error('Email configuration error:', error);
  }
};

// Call this when server starts
testEmailConfig();

// Add verify OTP endpoint
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Convert OTP to number
    const numericOTP = parseInt(otp);
    
    if (isNaN(numericOTP)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    if (!Number.isInteger(numericOTP) || numericOTP.toString().length !== 6) {
      return res.status(400).json({ message: 'OTP must be a 6-digit number' });
    }

    const user = await User.findOne({
      email,
      otp: numericOTP,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

// Add resend OTP 
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    user.otp = newOTP;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send new OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New OTP Verification - CareerHub',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #2563EB; text-align: center;">New OTP Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Your new verification OTP is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <h1 style="color: #2563EB; font-size: 36px; letter-spacing: 5px;">${newOTP}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px; text-align: center;">CareerHub Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'New OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};

module.exports = { 
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUser,
  verifyOTP,
  resendOTP
};
