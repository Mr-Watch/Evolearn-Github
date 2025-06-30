import { createModal } from "../ModalManager/modal-manager.js";
import * as _ from "../CdnFiles/socket.io.js";
import { stringToNode } from "./utils.js";
import { addNotification } from "../NotificationManager/notification-manager.js";
import { updateNotifications } from "./view-manager.js";
import { getDoNotDisturbState } from "../SettingsManagers/notification-settings-manager.js";

let socket;
const URL = "http://localhost:3000";

socket = io.connect(URL, { autoConnect: true, reconnection: false });

socket.on("pdfDefinitionsChange", async (_) => {
  console.log("Pdf Definitions changed");
  await import("../PdfManager/pdf-state-manager.js").then((module) => {
    module.updatePdfFileDefinitions();
  });
});

socket.on("exerciseDefinitionsChange", async (_) => {
  console.log("Exercise Definitions changed");
  await import("../ExerciseManager/exercise-manager.js").then((module) => {
    module.updateExerciseDefinitions();
  });
});

socket.on("quizDefinitionsChange", async (_) => {
  console.log("Quiz Definitions changed");
  await import("../QuizManager/quiz-manager.js").then((module) => {
    module.updateQuizDefinitions();
  });
});

socket.on("teacherNotification", async (data) => {
  console.log("Teacher Notification received");
  if (!getDoNotDisturbState()) {
    createModal(
      data.title,
      stringToNode(`<div style="white-space: pre-line">${data.message}</div>`),
      undefined,
      "notification",
      undefined,
      true
    );
  } else {
    let badgeNumber = document.querySelector(".notification_badge").innerHTML;

    if (badgeNumber === "") {
      document.querySelector(".notification_badge").innerHTML = `+1`;
    } else {
      badgeNumber = parseInt(badgeNumber.slice(1));
      badgeNumber += 1;
      document.querySelector(
        ".notification_badge"
      ).innerText = `+${badgeNumber}`;
    }
  }
  addNotification(data);
  updateNotifications();
});
