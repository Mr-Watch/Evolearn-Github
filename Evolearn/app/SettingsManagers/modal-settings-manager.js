import { lss, lsg } from "../AuxiliaryScripts/utils.js";
import { changeSettings } from "../ModalManager/modal-manager.js";

let settings;
initialize();

function initialize() {
  settings = lsg("ModalSettings");

  if (settings === null) {
    settings = { backdrop: true, keyboard: true, focus: true };
    lss("ModalSettings", JSON.stringify(settings));
  } else {
    settings = JSON.parse(settings);
  }
}

function updateSettings() {
  lss("ModalSettings", JSON.stringify(settings));
  changeSettings();
}

function setBackDrop(value) {
  settings.backdrop = value;
  updateSettings();
}

function setKeyboard(value) {
  settings.keyboard = value;
  updateSettings();
}

function setFocus(value) {
  settings.focus = value;
  updateSettings();
}

function loadSettings() {
  return {
    backdrop: settings.backdrop,
    keyboard: settings.keyboard,
    focus: settings.focus,
  };
}

export { setBackDrop, setKeyboard, setFocus, loadSettings };
