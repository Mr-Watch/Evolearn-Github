import { lss, lsg } from "../AuxiliaryScripts/utils.js";

let settings;
initialize();

function initialize() {
  settings = lsg("EditorSettings");

  if (settings === null) {
    settings = { autosave: false };
    lss("EditorSettings", JSON.stringify(settings));
  } else {
    settings = JSON.parse(settings);
  }
}

function updateSettings() {
  lss("EditorSettings", JSON.stringify(settings));
}

function setEditorAutoSave(value) {
  settings.autosave = value;
  updateSettings();
}

function loadSettings() {
  return {
    autosave: settings.autosave,
  };
}

export { setEditorAutoSave, loadSettings };
