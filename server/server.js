const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 3030;
const server = http.Server(app);

const corsOptions = {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
};
const io = socketio(server, corsOptions);
server.listen(port);

console.log(
  "\x1b[32;2m%s\x1b[0m",
  `Server running on http://localhost:${port}`
);
/**
 * list of members connected to server
 */
let members = [];

io.on("connection", (socket) => {
  console.log("\x1b[36m%s\x1b[0m", `Socket connected     :: ${socket.id} `);
  /**
   * WebRTC Setup
   */
  // member joined server
  socket.on("join", (nickName) => {
    members.push({ socketId: socket.id, nickName });
    io.emit("newMember", members);
  });
  // member making offer
  socket.on("makeOffer", ({ to, offer, nickName }) => {
    socket.to(to).emit("receiveOffer", { offer, from: socket.id, nickName });
  });
  // recipient of offer responds with answer
  socket.on("makeAnswer", ({ to, answer }) => {
    socket.to(to).emit("receiveAnswer", { answer, from: socket.id });
  });
  // request to end video call
  socket.on("closeVideoCall", (socketId) => {
    socket.to(socketId).emit("closeVideoCall");
  });
  // handle if someone is already in call
  socket.on("alreadyInCall", (socketId) => {
    socket.to(socketId).emit("otherPersonInCall");
  });

  socket.on("disconnect", () => {
    members = members.filter((member) => member.socketId != socket.id);
    console.log("\x1b[91m%s\x1b[0m", `Socket disconnected  :: ${socket.id} `);
    io.emit("newMember", members);
  });
  /**
   * Standard Socket.IO events
   */
  socket.on(
    "youtubePlayer",
    ({ playerState = null, seekTo = null, videoId = null, to }) => {
      socket.to(to).emit("youtubePlayer", { playerState, seekTo, videoId });
      socket.emit({ playerState, seekTo, videoId });
    }
  );
});
