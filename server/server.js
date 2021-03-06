const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3030;
const server = http.Server(app);

require("dotenv").config();

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
app.use(cors());
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

  socket.on("toggleMedia", ({ mediaType, state, to }) => {
    socket.to(to).emit("toggleMedia", { mediaType, state });
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

// youtube data api custom endpoint
const mapSearchResults = (items) => {
  return items.map((item) => {
    const {
      id,
      snippet: { channelTitle, title, thumbnails },
    } = item;
    return {
      videoId: id.videoId,
      channelTitle,
      thumbnail: thumbnails.default,
      title,
    };
  });
};

app.use("/ytsearch", async (req, res) => {
  const query = req.query.q;
  const params = {
    part: "snippet",
    maxResults: 50,
    type: "video",
  };
  let searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}`;
  searchUrl += `&part=${params.part}`;
  searchUrl += `&maxResults=${params.maxResults}`;
  searchUrl += `&type=${params.type}`;
  searchUrl += `&q=${query}`;
  fetch(searchUrl).then((search) => {
    search.json().then((result) => {
      const mappedResult = mapSearchResults(result.items);
      res.send(mappedResult);
    });
  });
});
