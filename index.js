const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');  
const port=process.env.PORT||3001;
const app = express();
const server = createServer(app);
const io =new  Server(server);
const bodyParser = require('body-parser');
const notificationroutes=require('./apiroutes/notificationroute');
///const {adminauthentication}=require('./controllers/jwtgeneration');
const registrationroutes=require('./apiroutes/registratioroute');
//const teachersroute=require('./apiroutes/teachersroute');
const userroutes=require('./apiroutes/userroutes');
// socket connection
io.on('connection', (socket) => {
  console.log('New client connected');

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

app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/registration',registrationroutes);
//app.use('/teacher',adminauthentication,teachersroute);
app.use('/notifications',notificationroutes);
app.use('/user',userroutes);
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`))
}
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});
module.exports=io