const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const router = express.Router();
const auth = require('../middleware/auth');
const User = mongoose.models.User || require('../models/User');
const Job = mongoose.models.Job || require('../models/Job');

const { postJob,getallJOb,saveJob,getSavedJobs,getPendingJobs,approveJob,rejectJob} = require('../controllers/job');

router.post('/post',auth(['employer']),postJob);
router.get('/all', async (req, res) => {
  try {
    const { location, jobType, minSalary, maxSalary, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'approved' }; // Only get approved jobs
    
    if (location) query.location = new RegExp(location, 'i');
    if (jobType) query.jobType = jobType;
    if (minSalary) query.salary = { $gte: Number(minSalary) };
    if (maxSalary) query.salary = { ...query.salary, $lte: Number(maxSalary) };

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

router.post('/save/:jobId', auth(['job_seeker']), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    // if job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Add the job to savedJobs
    user.savedJobs.push(jobId);
    

    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Failed to save job', error: error.message });
  }
});

router.delete('/unsave/:jobId', auth(['job_seeker']), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    // Remove job from savedJobs
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    
    // Save without validation
    await user.save({ validateBeforeSave: false });

    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ message: 'Failed to unsave job' });
  }
});

router.get('/saved', auth(['job_seeker']), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('savedJobs');
    
    res.json({ jobs: user.savedJobs || [] });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
});

router.get('/pending', auth(['admin']), getPendingJobs);
router.patch('/approve/:jobId', auth(['admin']), approveJob);
router.patch('/reject/:jobId', auth(['admin']), rejectJob);

module.exports = router;