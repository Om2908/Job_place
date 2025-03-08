const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Get all messages
router.get('/messages', auth(['job_seeker']), async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/messages', auth(['job_seeker']), async (req, res) => {
  try {
    const { content } = req.body;
    
    const message = new Message({
      sender: req.user.id,
      content
    });

    await message.save();
    
    // Populate sender info before sending response
    await message.populate('sender', 'name');
    
    // Emit to all connected clients
    req.app.get('io').emit('newMessage', message);
    
    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router; 