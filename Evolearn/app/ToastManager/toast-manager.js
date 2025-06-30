import {} from "./toast-component.js";
import { playSound } from "../AudioManager/audio-manager.js";
import { loadSettings } from "../SettingsManagers/toast-settings-manager.js";

let options = {};
changeSettings();

function changeSettings() {
  options = loadSettings();
}

let toastContainer = document.createElement("div");
toastContainer.classList.add(
  "toast-container",
  "position-fixed",
  "p-2",
  "bottom-0",
  "end-0"
);

document.body.appendChild(toastContainer);

function createToast(mode, text, soundOption, optionsOverride) {
  let toast = document.createElement("toast-component");
  toastContainer.appendChild(toast);

  try {
    toast.setToastParameters(mode, text);
  } catch (error) {
    console.error(error);
    return;
  }

  let tmpOptions = (() => {
    if (optionsOverride !== undefined) {
      return optionsOverride;
    } else {
      return options;
    }
  })();

  let toastController = new bootstrap.Toast(toast, tmpOptions);
  toastController.show();

  if (soundOption !== undefined) {
    if (soundOption === true) {
      playSound(toast.modes[mode].sound);
    } else if (typeof soundOption === "string") {
      playSound(soundOption);
    }
  }

  let removeToastBound = () => removeToast(toast, toastController);

  toast.addEventListener("hidden.bs.toast", removeToastBound, { once: true });
}

function removeToast(toast, toastController) {
  toastController.dispose();
  toast.remove();
}

export { createToast, changeSettings };
