const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = socketio(server);
app.use(router);

io.on("connect", (socket) => {
  console.log("got connected!!!");
  socket.on("join", ({ name, room }) => {
    console.log(name, room);
  });

  socket.on("disconnect", () => {
    console.log("disconnected!!!");
  });
});

server.listen(PORT, () => {
  console.log(`server is up and listening on ${PORT}`);
});
