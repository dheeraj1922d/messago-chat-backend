import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { addMsgToConversation } from "./controller/msg.controller.js";
import msgsRouter from "./router/msgs.route.js"
 
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
  }
});

// io is an instance of the Socket.IO server class that is associated with and attached to the HTTP server
// Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("Client connected");
  const username = socket.handshake.query.username;
  console.log("Username:", username);
  userSocketMap[username] = socket;

  socket.on("chat msg", (msg) => {
    const receiverSocket = userSocketMap[msg.receiver];
    if (receiverSocket) {
      receiverSocket.emit("chat msg", msg);
    }

    addMsgToConversation([msg.sender, msg.receiver], 
      { text: msg.text, sender: msg.sender, receiver: msg.receiver }
    );
  });
});

// Define a route
app.use('/msgs', msgsRouter);

app.get("/", (req, res) => {
  res.send("Congratulations HHLD Folks!");
});

// Start the server
server.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is listening at http://localhost:${port}`);
});
