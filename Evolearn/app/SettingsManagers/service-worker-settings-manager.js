import { lss, lsg } from "../AuxiliaryScripts/utils.js";

let serviceWorkerEnabled;
initialize();

function initialize() {
  serviceWorkerEnabled = lsg("ServiceWorkerState");

  if (serviceWorkerEnabled === null) {
    serviceWorkerEnabled = false;
    lss("ServiceWorkerState", JSON.stringify(serviceWorkerEnabled));
  } else {
    serviceWorkerEnabled = JSON.parse(serviceWorkerEnabled);
  }
}

function updateSettings() {
  lss("ServiceWorkerState", JSON.stringify(serviceWorkerEnabled));
}

function changeServiceWorkerState(value) {
  serviceWorkerEnabled = value;
  updateSettings();
}

function getServiceWorkerState() {
  return serviceWorkerEnabled;
}

export { changeServiceWorkerState, getServiceWorkerState };
