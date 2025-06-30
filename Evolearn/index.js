const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const crypto = require('crypto');
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const rootPath = path.join(__dirname, "app");
app.use(compression());
app.use("/", express.static(rootPath));
app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  readNotifications();
});

const io = new Server(server);

let notifications = [];

function readNotifications() {
  notifications = JSON.parse(
    fs.readFileSync("notifications_log.json", "utf-8")
  );
}

function writeNotifications() {
  fs.writeFileSync("notifications_log.json", JSON.stringify(notifications));
}

function monitorNotificationsFile() {
  fs.watchFile(`./notifications_log.json`, function (_, _) {
    readNotifications();
  });
}

const fileWatcherDefinitions = [
  {
    url: "./app/ContentFiles/PdfContentFiles/",
    fileName: "pdf_definitions.json",
    intent: "pdfDefinitionsChange",
  },
  {
    url: "./app/ContentFiles/ExerciseContentFiles",
    fileName: "exercise_definitions.json",
    intent: "exerciseDefinitionsChange",
  },
  {
    url: "./app/ContentFiles/QuizContentFiles",
    fileName: "quiz_definitions.json",
    intent: "quizDefinitionsChange",
  },
];

function setFileWatcher(url, fileName, intent) {
  fs.watchFile(`${url}/${fileName}`, function (_, _) {
    io.emit(intent);
    console.log(`Intent - ${intent} - Sent`);
  });
}

fileWatcherDefinitions.forEach((definition) => {
  setFileWatcher(definition.url, definition.fileName, definition.intent);
});

monitorNotificationsFile();

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

// io.on("connection", (socket) => {
//   console.log("A user connected");
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

app.get("/teacher", (req, res) => {
  res.sendFile("./teacher.html", { root: rootPath });
});

app.get("/notifications", (req, res) => {
  let lastHash = req.query.hash;
  let notificationIndex = notifications.findIndex(
    (element) => element.hash == lastHash
  );
  let remainingNotifications = notifications.slice(notificationIndex + 1);
  res.json(remainingNotifications);
});

app.post("/notify", async (req, res) => {
  let userName = "test";
  let password = "123";
  password = await digestMessage(password);
  if (userName === req.body.userName && password === req.body.password) {
    io.emit("teacherNotification", req.body);
    let notification = req.body;
    delete notification.userName;
    delete notification.password;
    notifications.push(notification);
    writeNotifications();
    res.json(notification);
  }
});

app.get("/", (_, res) => {
  res.sendFile("/index.html", { root: rootPath });
});

app.get("*", (_, res) => res.redirect("/"));

process.on("SIGTERM", () => {
  writeNotifications();
  console.warn("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.warn("HTTP server closed");
  });
});
