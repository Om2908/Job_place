const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./confing/db');
const session = require('express-session');
const passport = require('passport');
require('./confing/passport');
const fileUpload = require('express-fileupload');
const path = require('path');

// Socket.io setup
const http = require('http');
const { Server } = require('socket.io');  // Changed import

dotenv.config();
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {  // Changed initialization
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({ 
  createParentPath: true, 
  limits: {
    fileSize: 8 * 1024 * 1024
  }
}));

app.use(session({secret: 'omitaliya',resave: false,saveUninitialized: true,cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }}));
app.use(passport.initialize());
app.use(passport.session());

// Store io instance on app
app.set('io', io);

// Socket connection handling
// let onlineUsers = 0;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  // onlineUsers++;
  // io.emit('onlineUsers', onlineUsers);

  socket.on('authenticate', async (userId) => {
    socket.join(userId);
    console.log('User authenticated:', userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // onlineUsers--;
    // io.emit('onlineUsers', onlineUsers);
  });
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const applicationRoutes = require('./routes/application');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat');  // Added chat routes

app.use('/auth', authRoutes);
app.use('/job', jobRoutes);
app.use('/application', applicationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/chat', chatRoutes);  // Added chat routes

app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');  // Removed req.user.name as it might not exist
});

// Database connection
connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io listening for connections`);
});
