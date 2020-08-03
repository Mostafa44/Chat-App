const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const users = require("./users");

const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = socketio(server);
app.use(router);

io.on("connect", (socket) => {
  console.log("got connected!!!");
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = users.addUser({ id: socket.id, name, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room  ${user.room}`,
    });
    socket.broadcast("message", {
      user: "admin",
      text: `${user.name} has joined the chat`,
    });

    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = users.getUser(socket.id);
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });
    callback();
  });
  socket.on("disconnect", () => {
    console.log("disconnected!!!");
  });
});

server.listen(PORT, () => {
  console.log(`server is up and listening on ${PORT}`);
});
