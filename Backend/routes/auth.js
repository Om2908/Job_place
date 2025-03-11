const express = require('express');
const passport = require('passport');
const app=express();
app.use(express.json());
const router = express.Router();
const auth=require('../middleware/auth')
require('../confing/passport');
const jwt = require('jsonwebtoken');

const {createUser,loginUser,updateUser,forgotPassword,resetPassword, verifyOTP, resendOTP}=require('../controllers/auth')

router.get('/google',  passport.authenticate('google', {  scope: ['profile', 'email'],prompt: 'select_account'  }));

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false
  }),
  async (req, res) => {
    try {
      // console.log("Google callback user:", req.user); 

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user._id, 
          role: req.user.role,
          email: req.user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // console.log("Generated token:", token); // Debug log

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Callback error:", error); // Error log
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Github
router.get('/github', passport.authenticate('github', { scope: ['user:email'],prompt: 'select_account' }));

router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false
  }),
  async (req, res) => {
    try {
      // console.log("Github callback user:", req.user); 

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user._id, 
          role: req.user.role,
          email: req.user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log("Generated token:", token); // Debug log

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Callback error:", error); // Error log
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.put('/update',auth(['job_seeker', 'employer']),updateUser);

module.exports = router;

