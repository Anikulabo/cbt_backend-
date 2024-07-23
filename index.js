const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3001;
const app = express();
const server = createServer(app);
const io = new Server(server);

// Import routes
const notificationroutes = require('./apiroutes/notificationroute');
const registrationroutes = require('./apiroutes/registratioroute');
const userroutes = require('./apiroutes/userroutes');
const subjectsroutes=require('./apiroutes/subjectsroute');
const teachersroute=require('./apiroutes/teachersroute');
// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('message', 'Hello from server');
  
  // Handle joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client joined room: ${room}`);
  });

  // Handle leaving a room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`Client left room: ${room}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Route setup
app.use('/registration', registrationroutes);
app.use('/notifications', notificationroutes);
app.use('/user', userroutes);
app.use('/subject',subjectsroutes);
app.use('/teacher',teachersroute)
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = { io, server, app };
