import { lsg } from "../AuxiliaryScripts/utils.js";
import { closeView, updateExerciseView, updatePdfView } from "../AuxiliaryScripts/view-manager.js";
import { NoteContainerComponent } from "./note-container-component.js";
import { updateIds } from "./note-manager.js";

class NoteRecoveryContainerComponent extends NoteContainerComponent {
  constructor(noteContainerId) {
    super(noteContainerId);
    super.connectedCallback();
    this.documentTitle = "Note Recovery";
    setTimeout(this.hideAddNotesButton.bind(this), 100);
  }

  hideAddNotesButton() {
    this.elements.addNoteButton.classList.add("d-none");
  }

  removeNote(noteIndex) {
    super.removeNote(noteIndex);
    super.refreshToolTips();
    let currentIdIndex = JSON.parse(lsg(this.noteContainerId));
    if (currentIdIndex === null) {
      updateIds();
      if(this.noteContainerId.startsWith('p')){
        updatePdfView();
      }else if(this.noteContainerId.startsWith('e')){
        updateExerciseView();
      }
      closeView();
    }
  }
}

customElements.define(
  "note-recovery-container-component",
  NoteRecoveryContainerComponent
);

export { NoteRecoveryContainerComponent };
