const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notification');

router.get('/', auth(['job_seeker']), getUserNotifications);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read',auth(['job_seeker']), markAllAsRead);
router.delete('/:id', auth(['job_seeker']), deleteNotification);

module.exports = router;