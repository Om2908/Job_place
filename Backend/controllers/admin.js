const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/application');
const Notification = require('../models/notification');

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    ).select('-password');

    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: 'approved' },
      { new: true }
    );

    // Send notification to employer
    const notification = new Notification({
      recipient: job.postedBy,
      type: 'JOB_APPROVED',
      title: 'Job Approved',
      message: `Your job posting "${job.title}" has been approved`,
      relatedId: job._id,
      onModel: 'Job'
    });
    await notification.save();

    res.json({ message: 'Job approved successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve job' });
  }
};

const rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { remarks } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      jobId,
      { 
        status: 'rejected',
        adminRemarks: remarks 
      },
      { new: true }
    );

    // Send notification to employer
    const notification = new Notification({
      recipient: job.postedBy,
      type: 'JOB_REJECTED',
      title: 'Job Rejected',
      message: `Your job posting "${job.title}" has been rejected. Reason: ${remarks || 'No reason provided'}`,
      relatedId: job._id,
      onModel: 'Job'
    });
    await notification.save();

    res.json({ message: 'Job rejected successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject job' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserStatus,
  approveJob,
  rejectJob
}; 