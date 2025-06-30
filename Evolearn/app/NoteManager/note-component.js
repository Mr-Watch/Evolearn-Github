import { saveNoteData, removeNoteData } from "./note-manager.js";

class NoteComponent extends HTMLElement {
  constructor(noteIndex, noteDataObject) {
    super();
    this.noteId = noteDataObject.noteId;
    this.noteIndex = noteIndex;
    this._title = noteDataObject.title;
    this.description = noteDataObject.description;
    this.externalNoteId = noteDataObject.externalNoteId;
    this.creationDate = noteDataObject.creationDate;
    this.lastModificationDate = noteDataObject.lastModificationDate;
    this.noteDataObject = noteDataObject;
  }

  connectedCallback() {
    this.classList.add("note", "card", "m-3");
    this.innerHTML = `
        <div class="card-header d-flex align-items-center justify-content-between">
            Note ${this.noteIndex}<span role="button" class="fs-6" data-bs-toggle="tooltip_" data-bs-placement="top"
                data-bs-title="Creation Date">${this.creationDate}</span><span><span role="button"
                class="delete material-icons" data-bs-toggle="tooltip_" data-bs-placement="top"
                data-bs-title="Delete Note">delete</span> <span role="button" class="edit material-icons"
                data-bs-toggle="tooltip_" data-bs-placement="top"
                data-bs-title="Edit | Show Note" data-bs-toggle="modal" data-bs-target=".editor_modal">edit</span></span>
                </div>
                <div class="form-floating mb-3 m-2">
                    <input type="text" class="title form-control" placeholder="" value="${this._title}">
                    <label>Title</label>
                </div>
                <div class="form-floating m-2">
                    <input type="text" class="description form-control" placeholder="" value="${this.description}">
                    <label>Description</label>
                </div>
                <hr>
                <div class="card-footer text-body-secondary">
                    <span class="last_modification" role="button" data-bs-toggle="tooltip_" data-bs-placement="top"
                        data-bs-title="Last Modification Date">${this.lastModificationDate}</span>
                </div>
    `;

    this.elements = {
      title: this.querySelector(".title"),
      description: this.querySelector(".description"),
      deleteButton: this.querySelector(".delete"),
      editButton: this.querySelector(".edit"),
      lastModificationSpan: this.querySelector(".last_modification"),
    };

    this._saveChangeInTitleOrDescription =
      this.saveChangeInTitleOrDescription.bind(this);
    this.elements.title.addEventListener(
      "change",
      this._saveChangeInTitleOrDescription
    );
    this.elements.description.addEventListener(
      "change",
      this._saveChangeInTitleOrDescription
    );

    this._removeNote = this.removeNote.bind(this);
    this.elements.deleteButton.addEventListener("click", this._removeNote, {
      once: true,
    });

    this._editNote = this.editNote.bind(this);
    this.elements.editButton.addEventListener("click", this._editNote);
  }

  saveChangeInTitleOrDescription() {
    this.noteDataObject.title = this.elements.title.value;
    this.noteDataObject.description = this.elements.description.value;
    saveNoteData(this.noteId, this.noteDataObject);
  }

  updateLastModificationDate() {
    this.noteDataObject.lastModificationDate = new Date().toUTCString();
    saveNoteData(this.noteId, this.noteDataObject);
    this.elements.lastModificationSpan.innerText =
      this.noteDataObject.lastModificationDate;
  }

  removeNote() {
    removeNoteData(this.noteId);
    this.closest(".notes").removeNote(this.noteIndex);
    this.disconnectedCallback();
  }

  editNote() {
    this.closest(
      ".notes"
    ).elements.editorBase.firstElementChild.loadContentsFromStorage(
      this.noteIndex,
      this.noteDataObject.externalNoteId
    );
  }

  disconnectedCallback() {
    try {
      this.remove();
    } catch (error) {
      console.error(error)
      console.log("Note Component removed.");
    }
  }
}

customElements.define("note-component", NoteComponent);

export { NoteComponent };
