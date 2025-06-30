import { lss, lsg } from "../AuxiliaryScripts/utils.js";

let doNotDisturbState;
initialize();

function initialize() {
  doNotDisturbState = lsg("DoNotDisturbState");

  if (doNotDisturbState === null) {
    doNotDisturbState = false;
    lss("DoNotDisturbState", JSON.stringify(doNotDisturbState));
  } else {
    doNotDisturbState = JSON.parse(doNotDisturbState);
  }
}

function updateSettings() {
  lss("DoNotDisturbState", JSON.stringify(doNotDisturbState));
}

function setDoNotDisturbState(value) {
  doNotDisturbState = value;
  updateSettings();
}

function getDoNotDisturbState() {
  return doNotDisturbState;
}

export { setDoNotDisturbState, getDoNotDisturbState };