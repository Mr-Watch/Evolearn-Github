class TeacherNoteComponent extends HTMLElement {
  constructor(
    noteIndex,
    {
      title = "",
      description = "",
      content = "",
      creationDate = "",
      lastModificationDate = "",
    }
  ) {
    super();
    this.noteIndex = noteIndex;
    this._title = title;
    this.description = description;
    this.content = content;
    this.creationDate = creationDate;
    this.lastModificationDate = lastModificationDate;
  }

  connectedCallback() {
    this.classList.add("note", "card", "m-3", "border", "border-primary");
    this.innerHTML = `
        <div class="card-header d-flex align-items-center justify-content-between border border-primary">
            Note ${this.noteIndex}<span role="button" class="fs-6">${this.creationDate}</span><span> <span role="button" class="edit material-icons"
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
                    <span class="last_modification" role="button">${this.lastModificationDate}</span>
                </div>
    `;

    this.elements = {
      title: this.querySelector(".title"),
      description: this.querySelector(".description"),
      deleteButton: this.querySelector(".delete"),
      editButton: this.querySelector(".edit"),
      lastModificationSpan: this.querySelector(".last_modification"),
    };

    this._editNote = this.editNote.bind(this);
    this.elements.editButton.addEventListener("click", this._editNote);
  }

  editNote() {
    this.closest(".notes").elements.editorBase.firstElementChild.loadContent(
      this.content
    );
  }
}

customElements.define("teacher-note-component", TeacherNoteComponent);

export { TeacherNoteComponent };
