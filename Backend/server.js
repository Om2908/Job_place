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
const {GoogleGenerativeAI}  =require('@google/generative-ai');


const http = require('http');
const { Server } = require('socket.io');  

dotenv.config();
const app = express();


const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});





const server = http.createServer(app);
const io = new Server(server, {  
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

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

const generate = async (question) => {
  try {
    const prompt = question;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    return response.text();
  } catch (error) {
    console.log("response error", error);
  }
};

app.post('/api/content', async (req, res) => {
    var result = await generate(req.body.answer);
    console.log(result);
    res.json({"result" : result});
})




app.set('io', io);

io.on('connection', (socket) => {
  console.log("Client Connected");

  socket.on('authenticate', async (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log("Client Disconnected");
   
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/job');
const applicationRoutes = require('./routes/application');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chat'); 
const notificationRoutes = require('./routes/notification');

app.use('/auth', authRoutes);
app.use('/job', jobRoutes);
app.use('/application', applicationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/chat', chatRoutes);
app.use('/notification',notificationRoutes)


app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('API is running...');  
  // console.log("session ID :",req.sessionID);
});


connectDB()
  .then(() => {
    // console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
