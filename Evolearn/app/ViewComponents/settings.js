import { playSound } from "../AudioManager/audio-manager.js";
import { setExerciseOverride } from "../ExerciseManager/exercise-manager.js";
import { createModal } from "../ModalManager/modal-manager.js";
import { setQuizOverride } from "../QuizManager/quiz-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";
import {
  updateExerciseView,
  updateQuizView,
} from "../AuxiliaryScripts/view-manager.js";
import { lsg, lss, stringToNode } from "../AuxiliaryScripts/utils.js";

class SettingsView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Settings - Let's change some stuff";
    this.urlString = "?view=settings";
    this.settings = {};
    this.clickCount = 0;
  }

  connectedCallback() {
    this.classList.add(
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100",
      "p-5"
    );

    this.innerHTML = `
    <h2 class="s m-3">Settings</h2>
    <hr />
    <h3 class="m-3">Application Theme</h3>
    <label
      class="form-label m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      You can choose between light or dark theme, depending on your preference.
      <select class="form-select w-50" name="theme_select">
        <option selected value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
      </select>
    </label>
    <hr />
    <h3
      class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      Volume Control
      <button class="play_sound btn btn-primary ms-5 d-flex align-items-center">
        Play Test Sound <span class="material-icons ps-2">volume_up</span>
      </button>
    </h3>
    <label
      class="form-label m-3 d-flex flex-row flex-wrap justify-content-between"
    >
      You can change the volume level, or mute the sound entirely.
      <input
        type="range"
        name="volume_level"
        class="form-range w-50"
        min="0"
        max="1"
        step="0.01"
      />
      <span class="volume_level">100%</span>
    </label>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        Mute Volume ?
        <input
          class="form-check-input ms-3"
          name="mute_volume"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>

    <hr />
    <h3 class="m-3">Editor AutoSave</h3>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        You can enable/disable global autosave for the note editor.<br />
        This setting can be overwritten temporarily be clicking on the autosave
        button in the editor.
        <input
          class="form-check-input ms-3"
          name="auto_save"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>

    <hr />
    <h3 class="m-3">Teacher Notes</h3>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        You can show/hide the notes included in the study material and the exercises.<br />
        Make sure to check them frequently for any changes.
        <input
          class="form-check-input ms-3"
          name="show_hide_notes"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>

    <hr />
    <h3 class="m-3">Do Not Disturb Mode</h3>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        You can decide whether or not to display the teacher notifications the moment they are send.<br />
        If you enable this mode of operation, the menu notifications item will show you how many you have missed.
        <input
          class="form-check-input ms-3"
          name="do_not_disturb"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>

    <hr />
    <h3
      class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      Offline Support Mode
      <button class="reload_page btn btn-primary d-flex align-items-center">
        Restart Application <span class="material-icons ps-2">restart_alt</span>
      </button>
    </h3>

    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        You can enable/disable the applications ability to function offline.<br>
        The way that it works is by saving every file that you access while using the application in a local cache database.<br>
        None of those files are ever sent to any outside party, they are strictly stored locally.<br>
        It is recommended to refresh to cache all the initial files, so that you will be able to at least open the main page of the application.<br>
        When you are offline, the application will switch to using the cached files (parts of the application will not work if not cached).<br>
        Every time you disable this setting, you also delete all the stored files in the cache. 
        <input
          class="form-check-input ms-3"
          name="service_worker_state"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>
    <hr />

    <h3
      class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      Application Modals
      <button class="open_modal btn btn-primary d-flex align-items-center">
        Open test modal <span class="material-icons ps-2">open_in_new</span>
      </button>
    </h3>
    <label
      class="form-label m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
      ><div>
        You can choose how the modal backdrop behaves.
        <ul>
          <li>
            Enabled - You are able to dismiss a modal by clicking outside of it
          </li>
          <li>Disabled - Backdrop is invisible</li>
          <li>
            Static - You are not able to dismiss a modal by clicking outside of
            it
          </li>
        </ul>
      </div>
      <select class="form-select w-50" name="backdrop_select">
        <option selected value="true">Enabled</option>
        <option value="false">Disabled</option>
        <option value="static">Static</option>
      </select>
    </label>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        Enable the ability to dismiss modals using the ESC key ?
        <input
          class="form-check-input ms-3"
          name="modal_dismiss"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>
    <hr />

    <h3
      class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
    >
      Application Toasts
      <button class="open_toast btn btn-primary d-flex align-items-center">
        Open test toast <span class="material-icons ps-2">clear_all</span>
      </button>
    </h3>

    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        Enable the fade in toast animation ?
        <input
          class="form-check-input ms-3"
          name="toast_animation"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>
    <div class="form-switch ps-0 m-3">
      <label
        class="form-check-label d-flex align-items-center justify-content-between"
      >
        Enable the toast auto-hide feature ?
        <input
          class="form-check-input ms-3"
          name="toast_autohide"
          type="checkbox"
          role="switch"
        />
      </label>
    </div>
    <label
      class="form-label m-3 d-flex flex-row flex-wrap justify-content-between"
    >
      Select how long to keep toast visible in milliseconds.
      <input
        name="toast_delay"
        type="range"
        class="form-range w-50"
        min="100"
        max="15000"
        step="100"
      />
      <span class="toast_delay">1000ms</span>
    </label>

    <hr>
    <h3
    class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
  >
    Export Application Data
    <button class="export_settings btn btn-primary d-flex align-items-center">
      Export<span class="material-icons ps-2">file_upload</span>
    </button>
  </h3>

  <hr>
  <h3
  class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
>
  Import Application Data
  <button class="import_settings btn btn-primary d-flex align-items-center">
    Import<span class="material-icons ps-2">file_download</span>
  </button>
  </h3>
  <hr>
  <h3
  class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
>
  Delete Application Data
  <button class="delete_data btn btn-primary d-flex align-items-center">
    Delete<span class="material-icons ps-2">delete</span>
  </button>
  </h3>
  <hr>
    <h3
    class="m-3 d-flex flex-row flex-wrap justify-content-between align-items-center"
  >
    Reset Settings To Default
    <button class="reset_settings btn btn-primary d-flex align-items-center">
      Reset Settings <span class="material-icons ps-2">restart_alt</span>
    </button>
  </h3>

    <input type="text" value="" class="settings_export d-none">
    `;

    this.elements = {
      secrete: this.querySelector(".s"),
      themeSelect: this.querySelector('[name="theme_select"]'),
      playSoundButton: this.querySelector(".play_sound"),
      volumeLevel: this.querySelector('[name="volume_level"]'),
      volumeLevelSpan: this.querySelector(".volume_level"),
      muteStatus: this.querySelector('[name="mute_volume"]'),
      showHideNotes: this.querySelector('[name="show_hide_notes"]'),
      autoSave: this.querySelector('[name="auto_save"]'),
      service: this.querySelector('[name="service_worker_state"]'),
      doNotDisturb: this.querySelector('[name="do_not_disturb"]'),
      reloadPage: this.querySelector(".reload_page"),
      openModalButton: this.querySelector(".open_modal"),
      backdropSelect: this.querySelector('[name="backdrop_select"]'),
      modalDismiss: this.querySelector('[name="modal_dismiss"]'),
      openToastButton: this.querySelector(".open_toast"),
      toastAnimation: this.querySelector('[name="toast_animation"]'),
      toastAutoHide: this.querySelector('[name="toast_autohide"]'),
      toastDelay: this.querySelector('[name="toast_delay"]'),
      toastDelaySpan: this.querySelector(".toast_delay"),
      importSettingsButton: this.querySelector(".import_settings"),
      exportSettingsButton: this.querySelector(".export_settings"),
      resetSettingsButton: this.querySelector(".reset_settings"),
      settingsExportInput: this.querySelector(".settings_export"),
      deleteAllDataButton: this.querySelector(".delete_data"),
    };

    this.elements.secrete.addEventListener(
      "click",
      this.secretSetting.bind(this)
    );

    this.elements.themeSelect.addEventListener(
      "change",
      this.changeTheme.bind(this)
    );

    this.elements.playSoundButton.addEventListener(
      "click",
      this.playTestSound.bind(this)
    );

    this.elements.volumeLevel.addEventListener(
      "change",
      this.updateVolume.bind(this)
    );

    this.elements.muteStatus.addEventListener(
      "click",
      this.updateMuteStatus.bind(this)
    );

    this.elements.showHideNotes.addEventListener(
      "click",
      this.updateShowHideNotes.bind(this)
    );

    this.elements.autoSave.addEventListener(
      "click",
      this.updateEditorAutoSave.bind(this)
    );

    this.elements.reloadPage.addEventListener(
      "click",
      this.reloadPage.bind(this)
    );
    this.elements.service.addEventListener(
      "click",
      this.updateServiceWorkerState.bind(this)
    );

    this.elements.doNotDisturb.addEventListener(
      "click",
      this.updateDoNotDisturb.bind(this)
    );

    this.elements.openModalButton.addEventListener(
      "click",
      this.openTestModal.bind(this)
    );

    this.elements.backdropSelect.addEventListener(
      "change",
      this.updateModalBackdrop.bind(this)
    );

    this.elements.modalDismiss.addEventListener(
      "click",
      this.updateModalDismiss.bind(this)
    );

    this.elements.openToastButton.addEventListener(
      "click",
      this.openTestToast.bind(this)
    );

    this.elements.toastAnimation.addEventListener(
      "click",
      this.updateToastAnimation.bind(this)
    );

    this.elements.toastAutoHide.addEventListener(
      "click",
      this.updateToastAutoHide.bind(this)
    );

    this.elements.toastDelay.addEventListener(
      "change",
      this.updateToastDelay.bind(this)
    );

    this.elements.importSettingsButton.addEventListener(
      "click",
      this.openSettingsImportModal.bind(this)
    );

    this.elements.exportSettingsButton.addEventListener(
      "click",
      this.exportSettings.bind(this)
    );

    this.elements.resetSettingsButton.addEventListener(
      "click",
      this.resetSettings.bind(this)
    );

    this.elements.deleteAllDataButton.addEventListener(
      "click",
      this.deleteAllData.bind(this)
    );

    this.loadSettings();
  }

  secretSetting() {
    switch (this.clickCount) {
      case 0:
        setExerciseOverride(true);
        this.clickCount += 1;
        createToast("info", "Exercises override enabled");
        updateExerciseView();
        break;
      case 1:
        setQuizOverride(true);
        this.clickCount += 1;
        createToast("info", "Quizzes override enabled");
        updateQuizView();
        break;
      default:
        setExerciseOverride(false);
        setQuizOverride(false);
        this.clickCount = 0;
        createToast("info", "Overrides reset");
        break;
    }
  }

  async changeTheme() {
    import("../SettingsManagers/theme-settings-manager.js").then((module) => {
      module.changeTheme(this.elements.themeSelect.value);
    });
  }

  playTestSound() {
    playSound("chime");
  }

  openTestModal() {
    createModal(
      "Test Modal",
      "This is a test.",
      "...and this is a footer!",
      undefined,
      undefined,
      true
    );
  }

  openTestToast() {
    createToast("info", "This is a test");
  }

  async updateVolume() {
    this.settings.audio.volumeNumber = this.elements.volumeLevel.value;
    this.elements.volumeLevelSpan.innerText = `${Math.round(
      this.settings.audio.volumeNumber * 100
    )}%`;

    await import("../SettingsManagers/audio-settings-manager.js").then(
      (module) => {
        module.setVolumeNumber(this.settings.audio.volumeNumber);
      }
    );
  }

  async updateMuteStatus() {
    this.settings.audio.muteStatus = this.elements.muteStatus.checked;

    if (this.settings.audio.muteStatus) {
      this.elements.volumeLevel.disabled = true;
    } else {
      this.elements.volumeLevel.disabled = false;
    }

    await import("../SettingsManagers/audio-settings-manager.js").then(
      (module) => {
        module.setMuteStatus(this.settings.audio.muteStatus);
      }
    );
  }

  async updateShowHideNotes() {
    this.settings.showHideNotes = this.elements.showHideNotes.checked;

    await import("../SettingsManagers/note-settings-manager.js").then(
      (module) => {
        module.setShowHideNotes(this.settings.showHideNotes);
      }
    );
  }

  async updateDoNotDisturb() {
    this.settings.doNotDisturb = this.elements.doNotDisturb.checked;

    await import("../SettingsManagers/notification-settings-manager.js").then(
      (module) => {
        module.setDoNotDisturbState(this.settings.doNotDisturb);
      }
    );
  }

  async updateEditorAutoSave() {
    this.settings.editor.autoSave = this.elements.autoSave.checked;
    await import("../SettingsManagers/editor-settings-manager.js").then(
      (module) => {
        module.setEditorAutoSave(this.settings.editor.autoSave);
      }
    );
  }

  async updateModalBackdrop() {
    this.settings.modal.backdrop = this.elements.backdropSelect.value;
    await import("../SettingsManagers/modal-settings-manager.js").then(
      (module) => {
        let value = this.settings.modal.backdrop;

        if (value !== "static") {
          value = value === "true";
        }

        module.setBackDrop(value);
      }
    );
  }

  async updateModalDismiss() {
    this.settings.modal.keyboard = this.elements.modalDismiss.checked;
    await import("../SettingsManagers/modal-settings-manager.js").then(
      (module) => {
        module.setKeyboard(this.settings.modal.keyboard);
      }
    );
  }

  async updateToastAnimation() {
    this.settings.toast.animation = this.elements.toastAnimation.checked;
    await import("../SettingsManagers/toast-settings-manager.js").then(
      (module) => {
        module.setAnimation(this.settings.toast.animation);
      }
    );
  }

  async updateToastAutoHide() {
    this.settings.toast.autohide = this.elements.toastAutoHide.checked;
    if (!this.settings.toast.autohide) {
      this.elements.toastDelay.disabled = true;
    } else {
      this.elements.toastDelay.disabled = false;
    }

    await import("../SettingsManagers/toast-settings-manager.js").then(
      (module) => {
        module.setAutoHide(this.settings.toast.autohide);
      }
    );
  }

  async updateToastDelay() {
    this.settings.toast.delay = parseInt(this.elements.toastDelay.value);
    this.elements.toastDelaySpan.innerText = `${this.settings.toast.delay}ms`;
    await import("../SettingsManagers/toast-settings-manager.js").then(
      (module) => {
        module.setDelay(this.settings.toast.delay);
      }
    );
  }

  async updateServiceWorkerState() {
    this.settings.service = this.elements.service.checked;
    if (!this.settings.service) {
      caches.delete("app");
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    await import("../SettingsManagers/service-worker-settings-manager.js").then(
      (module) => module.changeServiceWorkerState(this.settings.service)
    );
    await import("../AuxiliaryScripts/service-worker-initialization.js").then(
      (module) => module.initializeServiceWorker()
    );
  }

  async loadSettings() {
    this.settings.theme = JSON.parse(lsg("ThemePreference"));
    this.settings.audio = JSON.parse(lsg("AudioSettings"));
    this.settings.showHideNotes = JSON.parse(lsg("ShowHideNotes"));
    this.settings.editor = JSON.parse(lsg("EditorSettings"));
    this.settings.service = JSON.parse(lsg("ServiceWorkerState"));
    this.settings.doNotDisturb = JSON.parse(lsg("DoNotDisturbState"));
    this.settings.modal = JSON.parse(lsg("ModalSettings"));
    this.settings.toast = JSON.parse(lsg("ToastSettings"));

    if (this.settings.editor === null) {
      await import("../SettingsManagers/editor-settings-manager.js");
      this.settings.editor = JSON.parse(lsg("EditorSettings"));
    }

    if (this.settings.service === null) {
      await import("../SettingsManagers/service-worker-settings-manager.js");
      this.settings.service = JSON.parse(lsg("ServiceWorkerState"));
    }

    this.elements.themeSelect.value = this.settings.theme;
    this.elements.volumeLevel.value = this.settings.audio.volumeNumber;
    this.elements.volumeLevelSpan.innerText = `${Math.round(
      this.settings.audio.volumeNumber * 100
    )}%`;
    this.elements.muteStatus.checked = this.settings.audio.muteStatus;
    this.elements.showHideNotes.checked = this.settings.showHideNotes;
    this.elements.autoSave.checked = this.settings.editor.autosave;
    this.elements.service.checked = this.settings.service;
    this.elements.doNotDisturb.checked = this.settings.doNotDisturb;

    this.elements.backdropSelect.value = this.settings.modal.backdrop;
    this.elements.modalDismiss.checked = this.settings.modal.keyboard;

    this.elements.toastAnimation.checked = this.settings.toast.animation;
    this.elements.toastAutoHide.checked = this.settings.toast.autohide;
    this.elements.toastDelay.value = parseInt(this.settings.toast.delay);
    this.elements.toastDelaySpan.innerText = `${this.settings.toast.delay}ms`;

    if (!this.settings.toast.autohide) {
      this.elements.toastDelay.disabled = true;
    } else {
      this.elements.toastDelay.disabled = false;
    }

    if (this.settings.audio.muteStatus) {
      this.elements.volumeLevel.disabled = true;
    } else {
      this.elements.volumeLevel.disabled = false;
    }
  }

  exportSettings() {
    this.elements.settingsExportInput.value = JSON.stringify(
      window.localStorage
    );
    this.elements.settingsExportInput.select();
    navigator.clipboard.writeText(this.elements.settingsExportInput.value);
    createToast(
      "info",
      "The Application data has been copied to the clipboard",
      true
    );
  }

  openSettingsImportModal() {
    let tmpButton = stringToNode(`
    <button class="confirm_exit btn btn-primary d-flex align-content-center">
    Import
    <span class="material-icons ps-2"> save_alt </span>
  </button>`);
    tmpButton.addEventListener("click", this.importSettings.bind(this));
    createModal(
      "Import Settings",
      stringToNode(
        `<textarea id="settings_modal" style="width: 100%; overflow-x: hidden; outline: none; border: none;" rows="10" cols="48" placeholder="Paste the settings string here"></textarea>`
      ),
      tmpButton
    );
  }

  importSettings() {
    let settings = {};
    let settingsString = document.querySelector("#settings_modal").value;
    if (settingsString === "") {
      return;
    }

    try {
      settings = JSON.parse(settingsString);
    } catch (error) {
      createToast("error", "The pasted string is invalid", true);
      return;
    }
    window.localStorage.clear();
    for (let setting of Object.entries(settings)) {
      lss(setting[0], setting[1]);
    }

    try {
      document.querySelector(".modal-header .btn-close").click();
    } catch (error) {}

    this.refreshSettings();
  }

  async resetSettings() {
    let settingsToReset = {
      ShowHideNotes: "true",
      EditorSettings: '{"autosave":false}',
      ServiceWorkerState: "false",
      DoNotDisturbState: "false",
      AudioSettings: '{"muteStatus":false,"volumeNumber":1}',
      ThemePreference: '"light"',
      ToastSettings: '{"animation":true,"autohide":true,"delay":2500}',
      ModalSettings: '{"backdrop":true,"keyboard":true,"focus":true}',
    };

    Object.entries(settingsToReset).forEach((setting) =>
      lss(setting[0], setting[1])
    );

    this.refreshSettings();
  }

  deleteAllData() {
    let tmpButton = stringToNode(`
    <button class="confirm_exit btn btn-primary d-flex align-content-center">
    Delete
    <span class="material-icons ps-2"> delete </span>
  </button>`);
    tmpButton.addEventListener("click", this.confirmedDeleteAllData.bind(this));
    createModal(
      "Delete Application Data",
      `<div class="d-flex align-items-center justify-content-center flex-column text-center">
      <span class="material-icons m-2 d-block" style="font-size:5rem">warning</span>
        <br>You can not undo this action !<br>
        Are you ABSOLUTELY sure about this ?<br>
        The application will restart after the deletion.
      </div>`,
      tmpButton,
      "warning"
    );
  }

  confirmedDeleteAllData() {
    console.log("All data cleared");
    caches.delete("app");
    window.localStorage.clear();
    this.reloadPage();
  }

  reloadPage() {
    window.history.replaceState({}, "", ".");
    window.location.reload();
  }

  refreshSettings() {
    this.loadSettings();
    this.changeTheme();
    this.updateVolume();
    this.updateMuteStatus();
    this.updateShowHideNotes();
    this.updateEditorAutoSave();
    this.updateDoNotDisturb();
    this.updateModalBackdrop();
    this.updateModalDismiss();
    this.updateToastAnimation();
    this.updateToastAutoHide();
    this.updateToastDelay();
    this.updateServiceWorkerState();
  }
}

customElements.define("settings-view", SettingsView);

export { SettingsView };
