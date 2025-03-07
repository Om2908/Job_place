const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { uploadToS3,s3,GetObjectCommand } = require('../utils/s3Upload');
const {getSignedUrl}=require("@aws-sdk/s3-request-presigner")

// Get profile
router.get('/', auth(['job_seeker']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.profile && user.profile.resume) {
      try {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: user.profile.resume.replace(/^\//, '') // Remove leading slash if present
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        user.profile.resume = url;
      } catch (s3Error) {
        console.error("S3 Error:", s3Error);
        user.profile.resume = null;
      }
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile',
      error: error.message 
    });
  }
});

// Update basic profile
router.put('/basic', auth(['job_seeker']), async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Update experience
router.put('/experience', auth(['job_seeker']), async (req, res) => {
  try {
    const { experience } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.experience = experience;
    await user.save();

    res.json({ message: 'Experience updated successfully', experience: user.profile.experience });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ message: 'Failed to update experience' });
  }
});

// Update education
router.put('/education', auth(['job_seeker']), async (req, res) => {
  try {
    const { education } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.education = education;
    await user.save();

    res.json({ message: 'Education updated successfully', education: user.profile.education });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Failed to update education' });
  }
});

// Update skills
router.put('/skills', auth(['job_seeker']), async (req, res) => {
  try {
    const { skills } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.skills = skills;
    await user.save();

    res.json({ message: 'Skills updated successfully', skills: user.profile.skills });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Failed to update skills' });
  }
});

// Upload resume
router.post('/resume', auth(['job_seeker']), async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const file = req.files.resume;
    const userId = req.user.id;

    // Upload to S3
    const resumeUrl = await uploadToS3(file, `resumes/${userId}/${file.name}`);

    // Update user profile
    const user = await User.findById(userId);
    user.profile.resume = resumeUrl;
    await user.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
});

module.exports = router; 