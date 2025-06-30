import { lss, lsg } from "../AuxiliaryScripts/utils.js";
import { changeSettings } from "../ToastManager/toast-manager.js";

let settings;
initialize();

function initialize() {
  settings = lsg("ToastSettings");

  if (settings === null) {
    settings = { animation: true, autohide: true, delay: 2500 };
    lss("ToastSettings", JSON.stringify(settings));
  } else {
    settings = JSON.parse(settings);
  }
}

function updateSettings() {
  lss("ToastSettings", JSON.stringify(settings));
  changeSettings();
}

function setAnimation(value) {
  settings.animation = value;
  updateSettings();
}

function setAutoHide(value) {
  settings.autohide = value;
  updateSettings();
}

function setDelay(value) {
  settings.delay = value;
  updateSettings();
}

function loadSettings() {
  return {
    animation: settings.animation,
    autohide: settings.autohide,
    delay: settings.delay,
  };
}

export { setAnimation, setAutoHide, setDelay, loadSettings };
