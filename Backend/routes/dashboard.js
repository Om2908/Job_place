const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getJobSeekerStats, getEmployerStats } = require('../controllers/dashboard');

router.get('/jobseeker', auth(['job_seeker']), getJobSeekerStats);
router.get('/employer', auth(['employer']), getEmployerStats);

module.exports = router; 