const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const app = express();
const port = 3500;
const rootPath = path.join(__dirname, "app");

const server = app.listen(port, () => {
  console.log(`Chat Server listening on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let groupChatHistory = [];
let isTeacherConnected = false;

app.use("/", express.static(rootPath));
app.get("/", (_, res) => {
  res.send("<h1>Chat Server Online</h1>");
});

app.get("*", (_, res) => res.redirect("/"));

const allowedUsers = ["it174973", "it174974"];
const allowedTeachers = ["adamidis", "sarantis"];

io.on("connection", (socket) => {
  console.log("A user connected");
  if (isUser(socket)) {
    socket.emit("connect_successful", groupChatHistory);
  }
  socket.on("disconnect", () => {
    console.log("A User disconnected");
  });
});

io.use((socket, next) => {
  const username = socket.handshake.auth.userName;
  console.log(username);
  if (socket.handshake.auth.userType !== undefined) {
    switch (socket.handshake.auth.userType) {
      case "user":
        if (!allowedUsers.includes(username)) {
          return next(new Error("invalid user"));
        }
        break;
      case "teacher":
        if (!allowedTeachers.includes(username)) {
          return next(new Error("invalid user"));
        }
        break;
    }
  } else {
    console.log("Invalid UserType");
    return next(new Error("invalid user"));
  }
  socket.username = username;
  next();
});

// io.on("connection", (socket) => {
//   socket.on("userMessage", (msg) => {
//     msg.userName = socket.handshake.auth.userName;
//     console.log(msg);
//     io.emit("send data", msg);
//   });
// });

// io.on("connection", (socket) => {
//   socket.on("message_to_everyone", (msg) => {
//     msg.userName = socket.username;
//     msg.dateStamp = new Date().toLocaleDateString();
//     msg.timeStamp = new Date().toLocaleTimeString();
//     groupChatHistory.push(msg);
//     io.emit("message_to_everyone", msg);
//   });
// });

io.on('connection', (socket) => {
  socket.on('message_to_teacher', (msg) => {
    msg.userName = socket.username;
    msg.dateStamp = new Date().toLocaleDateString();
    msg.timeStamp = new Date().toLocaleTimeString();
    groupChatHistory.push(msg);
    io.emit('message_to_everyone', msg);
  });
});

function isTeacher(socket) {
  if (
    socket.handshake.auth.userType === "teacher" &&
    allowedTeachers.includes(socket.handshake.auth.userName)
  ) {
    return true;
  }
  return false;
}

function isUser(socket) {
  if (
    socket.handshake.auth.userType === "user" &&
    allowedUsers.includes(socket.handshake.auth.userName)
  ) {
    return true;
  }
  return false;
}

io.on("connection", (socket) => {
  if (isTeacher(socket)) {
    socket.broadcast.emit("teacher_connected", {
      userID: socket.id,
      username: socket.username,
    });
    isTeacherConnected = true;
  }
});

io.on("connection", (socket) => {
  if (isTeacher(socket)) {
    socket.on("teacher_logging_out", () => {
      if(isTeacherConnected){
        socket.broadcast.emit("teacher_disconnected", {
          userID: socket.id,
          username: socket.username,
        });
        isTeacherConnected = false;
      }
    });
  }
});

io.on("connection", (socket) => {
  socket.on("is_teacher_connected", () => {
    socket.emit("teacher_is_connected", isTeacherConnected);
  });
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
});

process.on("SIGTERM", () => {
  console.warn("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.warn("HTTP server closed");
  });
});
