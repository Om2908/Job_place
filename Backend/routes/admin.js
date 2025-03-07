const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getStats, getAllUsers, updateUserStatus } = require('../controllers/admin');

router.get('/stats',  getStats);
router.get('/users',  getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);

module.exports = router; 