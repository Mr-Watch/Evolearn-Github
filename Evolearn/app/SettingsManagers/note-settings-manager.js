import { lss, lsg } from "../AuxiliaryScripts/utils.js";

let showHideNotes;
initialize();

function initialize() {
  showHideNotes = lsg("ShowHideNotes");

  if (showHideNotes === null) {
    showHideNotes = true;
    lss("ShowHideNotes", JSON.stringify(showHideNotes));
  } else {
    showHideNotes = JSON.parse(showHideNotes);
  }
}

function updateSettings() {
  lss("ShowHideNotes", JSON.stringify(showHideNotes));
}

function setShowHideNotes(value) {
  showHideNotes = value;
  updateSettings();
}

function getShowHideNotes() {
  return showHideNotes;
}

export { setShowHideNotes, getShowHideNotes };
