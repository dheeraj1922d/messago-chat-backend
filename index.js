import express from 'express';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import http from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080; 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      allowedHeaders: ["*"],
      origin: "*"
    }
}
);


// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server
// Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy


io.on('connection', (socket) => {
  console.log('Client connected');
   socket.on('chat msg', (msg) => {
       console.log('Received msg ' + msg);
    
       socket.broadcast.emit('chat msg', msg);
   });
});


// Define a route
app.get('/', (req, res) => {
  res.send('Congratulations HHLD Folks!');
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});