const Job = require('../models/Job');
const Application = require('../models/application');
const User = require('../models/User');

// Job Seeker Dashboard Stats
const getJobSeekerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [applications, savedJobs] = await Promise.all([
      Application.find({ seekerId: userId })
        .populate('jobId', 'title companyName location')
        .sort({ createdAt: -1 })
        .limit(5),
      User.findById(userId)
        .select('savedJobs')
        .populate('savedJobs', 'title companyName location jobType')
    ]);

    const stats = {
      totalApplications: applications.length,
      recentApplications: applications,
      savedJobs: savedJobs.savedJobs || []
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Employer Dashboard Stats
const getEmployerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [jobs, applications] = await Promise.all([
      Job.find({ postedBy: userId }),
      Application.find({ 
        jobId: { 
          $in: await Job.find({ postedBy: userId }).distinct('_id') 
        } 
      })
        .populate('seekerId', 'name email')
        .populate('jobId', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'approved').length,
      totalApplications: applications.length,
      recentApplications: applications
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getJobSeekerStats,
  getEmployerStats
}; 