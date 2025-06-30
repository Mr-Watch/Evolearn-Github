import { loadSettings } from "../SettingsManagers/audio-settings-manager.js";

const audioFiles = {
  rootDirectory: "./AudioManager/AudioFiles",
  fileNames: {
    notification: "notification.mp3",
    success: "success.mp3",
    warning: "warning.mp3",
    error: "error.mp3",
    chime: "chime.mp3",
    info: "info.mp3",
  },
};

const audioNode = document.createElement("audio");
document.body.appendChild(audioNode);

let muteStatus;
let volumeNumber;
changeSettings();

function changeSettings() {
  [muteStatus, volumeNumber] = loadSettings();
  audioNode.muted = muteStatus;
  audioNode.volume = volumeNumber;
}

function playSound(fileName) {
  if (!muteStatus) {
    if (audioFiles.fileNames[fileName] === undefined) {
      console.error("Invalid audio argument in playSound()");
      return;
    } else {
      audioNode.src = `${audioFiles.rootDirectory}/${audioFiles.fileNames[fileName]}`;
    }
    audioNode.play();
  }
}

export { playSound, changeSettings };
