import { loadSettings } from "../SettingsManagers/editor-settings-manager.js";
import {
  stringToNode,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";
import { loadNoteData, saveNoteData } from "./note-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";
import { createModal } from "../ModalManager/modal-manager.js";

class EditorComponent extends HTMLElement {
  constructor() {
    super();
    this.isVisible = false;
    this.isAutoSaveOn = loadSettings().autosave;
    this.isFullScreen = false;
    this.currentContentId = "";
    this.previousContentId = "";
  }

  connectedCallback() {
    this.classList.add("editor", "card", "m-3", "d-none");
    this.innerHTML = `
        <div class="card-header d-flex align-items-center justify-content-between"><span>Note <span class="index"></span></span>
            <button type="button" class="btn-close" data-bs-toggle="tooltip" data-bs-placement="top"
            data-bs-title="Close Note Editor"></button>
            </div>
        <div class="sample"></div>
    `;

    this.appendChild(stringToStyleSheetNode(".editor{ z-index: 5000;"));

    this.editor = SUNEDITOR.create(this.querySelector(".sample"), {
      charCounter: true,
      width: "100%",
      height: "400px",
      buttonList: [
        ["font", "fontSize", "formatBlock"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor"],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table"],
        ["fullScreen"],
        ["save"],
      ],
    });

    this.querySelector(".sun-editor-editable").style.overflow = "auto";

    this.elements = {
      closeButton: this.querySelector(".btn-close"),
      saveButton: this.querySelector('[data-command="save"]'),
      fullScreenButton: this.querySelector('[data-command="fullScreen"]'),
      index: this.querySelector(".index"),
      noteContainer: this.closest(".notes"),
    };

    this.elements.saveButton.insertAdjacentElement(
      "afterend",
      stringToNode(`
    <button
      type="button"
      class="toggle_autosave se-btn se-tooltip"
      data-display=""
      tabindex="-1">
      <span class="material-icons">
        text_rotate_vertical
      </span>
      <span class="se-tooltip-inner">
        <span class="se-tooltip-text">Toggle AutoSave</span>
      </span>
    </button>;`)
    );

    this.elements.saveButton.insertAdjacentElement(
      "afterend",
      stringToNode(`
    <button
      type="button"
      class="save_to_clipboard se-btn se-tooltip"
      data-display=""
      tabindex="-1">
      <span class="material-icons">
        inventory
      </span>
      <span class="se-tooltip-inner">
        <span class="se-tooltip-text">Save contents to clipboard</span>
      </span>
    </button>;`)
    );

    this.elements.saveButton.insertAdjacentElement(
      "afterend",
      stringToNode(`
    <button
      type="button"
      class="import_from_clipboard se-btn se-tooltip"
      data-display=""
      tabindex="-1">
      <span class="material-icons">
        post_add
      </span>
      <span class="se-tooltip-inner">
        <span class="se-tooltip-text">Import content to editor</span>
      </span>
    </button>;`)
    );

    this.elements.toggleAutoSaveButton = this.querySelector(".toggle_autosave");
    this.elements.saveToClipboardButton =
      this.querySelector(".save_to_clipboard");

    this.elements.importFromClipboard = this.querySelector(
      ".import_from_clipboard"
    );

    this._saveContentsToStorage = this.saveContentsToStorage.bind(this);
    this.elements.saveButton.addEventListener(
      "click",
      this._saveContentsToStorage
    );

    this.elements.saveToClipboardButton.addEventListener(
      "click",
      this.saveToClipboard.bind(this)
    );

    this.elements.importFromClipboard.addEventListener(
      "click",
      this.openImportModal.bind(this)
    );

    this._hide = this.hide.bind(this);
    this.elements.closeButton.addEventListener("click", this._hide);

    this._toggleAutosave = this.toggleAutosave.bind(this);
    this.elements.toggleAutoSaveButton.addEventListener(
      "click",
      this._toggleAutosave
    );

    this._toggleFullScreen = this.toggleFullScreen.bind(this);
    this.toggleFullScreenTimeout = () => setTimeout(this._toggleFullScreen, 50);

    this.elements.fullScreenButton.addEventListener(
      "click",
      this.toggleFullScreenTimeout
    );

    if (this.isAutoSaveOn) {
      this.elements.toggleAutoSaveButton.classList.add("active");
    }
  }

  toggleFullScreen() {
    if (!this.isFullScreen) {
      this.isFullScreen = true;
    } else {
      this.querySelector(".se-toolbar-sticky-dummy").style.height = "";
      this.querySelector(".se-toolbar").style.position = "relative";
      this.querySelector(".se-toolbar").style.width = "100%";
      this.querySelector(".se-toolbar").style.top = "";
      this.isFullScreen = false;
    }
  }

  toggleAutosave() {
    if (this.isAutoSaveOn) {
      this.isAutoSaveOn = false;
      this.elements.toggleAutoSaveButton.classList.remove("active");
    } else {
      this.isAutoSaveOn = true;
      this.elements.toggleAutoSaveButton.classList.add("active");
    }
  }

  loadContentsFromStorage(index, id) {
    this.elements.index.innerText = index;
    this.currentContentId = id;

    if (!this.isVisible) {
      this.show();
      this.editor.setContents(loadNoteData(this.currentContentId));
    }
  }

  loadContent(content) {
    if (!this.isVisible) {
      this.show();
      this.editor.setContents(content);
    }
  }

  openImportModal() {
    let tmpButton = stringToNode(`
    <button class="confirm_exit btn btn-primary d-flex align-content-center">
    Import
    <span class="material-icons ps-2"> save_alt </span>
  </button>`);
    tmpButton.addEventListener("click", this.importFromClipboard.bind(this));
    createModal(
      "Import Content",
      stringToNode(
        `<textarea id="import_modal" style="width: 100%; overflow-x: hidden; outline: none; border: none;" rows="10" cols="48" placeholder="Paste the content string here"></textarea>`
      ),
      tmpButton
    );
  }

  importFromClipboard() {
    let contentString = document.querySelector("#import_modal").value;
    this.editor.setContents(contentString);
    try {
      document.querySelector(".modal-header .btn-close").click();
    } catch (error) {}
  }

  saveToClipboard() {
    navigator.clipboard.writeText(this.editor.getContents());
    createToast("info", "Content was saved in the clipboard", true);
  }

  saveContentsToStorage() {
    this.elements.noteContainer.updateNote(
      this.currentContentId.replace("-n", "")
    );
    saveNoteData(this.currentContentId, this.editor.getContents());
  }

  show() {
    this.elements.noteContainer.elements.notesBase.classList.add("opacity-25");
    this.elements.noteContainer.elements.editorModal.show();
    document.body.querySelector(".modal-backdrop").remove();
    this.classList.remove("d-none");
    this.classList.add("visible");
    this.isVisible = true;
  }

  hide() {
    this.elements.noteContainer.elements.notesBase.classList.remove(
      "opacity-25"
    );
    this.elements.noteContainer.elements.editorModal.hide();
    this.classList.remove("visible");
    this.classList.add("d-none");
    this.isVisible = false;
    if (this.isAutoSaveOn) {
      this.saveContentsToStorage();
    }
  }
}

customElements.define("editor-component", EditorComponent);

export { EditorComponent };
