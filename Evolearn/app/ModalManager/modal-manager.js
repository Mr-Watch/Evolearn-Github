import {} from "./modal-component.js";
import { loadSettings } from "../SettingsManagers/modal-settings-manager.js";
import { playSound } from "../AudioManager/audio-manager.js";

let options = {};
changeSettings();

function changeSettings() {
  options = loadSettings();
}

let modalStack = [];
let modalVisible = false;

function showModal() {
  if (!modalVisible && modalStack.length !== 0) {
    modalStack.splice(0, 1)[0].show();
    modalVisible = true;
  }
}

function createModal(
  title,
  body,
  footer,
  soundFileName,
  optionsOverride,
  fullScreenEnabled
) {
  let modal = document.createElement("modal-component");
  
  try {
    modal.setModalParameters(title, body, footer, fullScreenEnabled);
  } catch (error) {
    console.error(error);
    modal = null;
    return;
  }

  document.body.appendChild(modal);

  let tmpOptions = (() => {
    if (optionsOverride !== undefined) {
      return optionsOverride;
    } else {
      return options;
    }
  })();

  let modalController = new bootstrap.Modal(modal, tmpOptions);
  modalStack.push(modalController);

  if (soundFileName !== undefined) {
    playSound(soundFileName);
  }
  showModal();

  modal.addEventListener(
    "hidden.bs.modal",
    function () {
      document.body.removeChild(modal);
      modal = null;
      modalController.dispose();
      modalVisible = false;
      showModal();
    },
    { once: true }
  );
}

export { createModal, changeSettings };
