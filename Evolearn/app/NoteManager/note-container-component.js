import { NoteComponent } from "./note-component.js";
import { EditorComponent } from "./editor-component.js";
import {
  createNote,
  getNoteIds,
  getTeacherNotes,
  loadNoteData,
} from "./note-manager.js";
import { stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";
import { TeacherNoteComponent } from "./teacher-note-component.js";
import { getShowHideNotes } from "../SettingsManagers/note-settings-manager.js";

class NoteContainerComponent extends HTMLElement {
  constructor(noteContainerId) {
    super();
    this.noteContainerId = noteContainerId;
  }

  connectedCallback() {
    this.classList.add("notes", "container_item");
    this.innerHTML = `
    <div class="modal fade editor_modal" data-bs-backdrop="static" tabindex="-1">
    <div class="editor_base modal-dialog modal-dialog-centered justify-content-center">
    </div>
    </div>
    <div class="notes_base d-flex flex-row flex-wrap justify-content-center">
      <div class="add_note position-relative text-center text-muted bg-body border rounded-3 m-3">
      <h1 class="m-4">Add New Note</h1>
      <p class="mb-4">
        You can add as many notes as you like. <br>
        Just make sure you don't go crazy with them!
      </p>
      <button class="btn btn-primary px-5 mb-5" type="button">
        <span class=" d-flex align-items-center justify-content-between">Add Note <span
                class="material-icons">add</span>
        </span>
      </button>
    </div>
    </div>
    `;

    this.appendChild(
      stringToStyleSheetNode(`
      .note {
          max-width: 25rem;
          width: 100%;
          max-height: 30rem;
      }

      .add_note {
          max-width: 25rem;
          width: 100%;
          max-height: 30rem;
      }

      .editor {
          max-width: 45rem;
          width: 85%;
          pointer-events: all;
      }

      .editor_base{
          max-width: none;
      }`)
    );

    this.elements = {
      notesBase: this.querySelector(".notes_base"),
      editorBase: this.querySelector(".editor_base"),
      editorModal: new bootstrap.Modal(this.querySelector(".editor_modal")),
      addNoteButton: this.querySelector(".add_note"),
    };

    this.noteIds = getNoteIds(this.noteContainerId);
    this.notesArray = [];

    this.noteIdsLength = Object.keys(this.noteIds).length;

    if (this.noteIdsLength !== 1) {
      for (let index = 0; index < this.noteIdsLength - 1; index++) {
        let noteData = loadNoteData(Object.entries(this.noteIds)[index + 1][1]);
        this.notesArray.push(new NoteComponent(index + 1, noteData));
      }
    }

    this.notesArray.forEach((note) => {
      this.elements.notesBase.appendChild(note);
    });
    this.elements.editorBase.appendChild(new EditorComponent());
    this.refreshToolTips();

    this._createNewNote = this.createNewNote.bind(this);
    this.elements.addNoteButton.addEventListener("click", this._createNewNote);
    if (getShowHideNotes()) {
      getTeacherNotes(this.noteContainerId, this.renderTeacherNotes.bind(this));
    }
  }

  renderTeacherNotes(data) {
    if (!data.hasOwnProperty("error")) {
      data.forEach((note, index) => {
        let noteElement = new TeacherNoteComponent(index + 1, note);
        this.elements.notesBase.appendChild(noteElement);
      });
    } else {
      console.log("No teacher note file found");
    }
  }

  createNewNote() {
    let tmpIndex = this.notesArray.push(
      new NoteComponent(
        this.notesArray.length + 1,
        createNote(this.noteContainerId)
      )
    );
    this.elements.notesBase.appendChild(this.notesArray[tmpIndex - 1]);
    this.refreshToolTips();
  }

  removeNote(noteIndex) {
    if (this.notesArray.length === 1) {
      this.notesArray = [];
    } else {
      this.notesArray = this.notesArray.splice(noteIndex - 1, 1);
    }
    document.querySelector(".tooltip").remove();
  }

  updateNote(noteIndex) {
    this.notesArray[
      parseInt(noteIndex.split("").at(-1))
    ].updateLastModificationDate();
  }

  refreshToolTips() {
    this.elements.tooltipTriggerList = [];
    this.elements.tooltipTriggerEl = [];
    this.elements.tooltipTriggerList = this.querySelectorAll(
      '[data-bs-toggle="tooltip_"]'
    );
    this.elements.tooltipTriggerEl = [...this.elements.tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }

  disconnectedCallback() {}
}

customElements.define("note-container-component", NoteContainerComponent);

export { NoteContainerComponent };
