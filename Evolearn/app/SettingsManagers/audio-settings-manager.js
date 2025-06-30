import { lss, lsg } from "../AuxiliaryScripts/utils.js";
import { changeSettings } from "../AudioManager/audio-manager.js";

let settings = {};
initialize();

function initialize() {
  settings = lsg("AudioSettings");

  if (settings === null) {
    settings = {
      muteStatus: false,
      volumeNumber: 1,
    };
    lss("AudioSettings", JSON.stringify(settings));
  } else {
    settings = JSON.parse(settings);
  }
}

function updateSettings() {
  lss("AudioSettings", JSON.stringify(settings));
  changeSettings();
}

function setVolumeNumber(value) {
  settings.volumeNumber = value;
  updateSettings();
}

function setMuteStatus(value) {
  settings.muteStatus = value;
  updateSettings();
}

function loadSettings() {
  return [settings.muteStatus, settings.volumeNumber];
}

export { setVolumeNumber, setMuteStatus, loadSettings };
