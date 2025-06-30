import { returnPlainJson } from "../Fetcher/fetcher.js";
import { GoalContainerComponent } from "../GoalManager/goal-container-component.js";
import { NoteContainerComponent } from "../NoteManager/note-container-component.js";
import { createToast } from "../ToastManager/toast-manager.js";
import { closeView } from "../AuxiliaryScripts/view-manager.js";
import { getLockedState, getExerciseOverride } from "./exercise-manager.js";

class ExerciseViewerComponent extends HTMLElement {
  constructor(exerciseId) {
    super();
    this.documentTitle = "Exercise Viewer";
    this.exerciseId = exerciseId;
  }
  connectedCallback() {
    if (getLockedState(`_${this.exerciseId}`) === 0 && !getExerciseOverride()) {
      createToast("warning", "You need to unlock the previous exercise first",true);
      closeView();
      return;
    }

    this.classList.add(
      "exercise_viewer",
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100"
    );
    this.innerHTML = `
        <ul class="nav nav-tabs pt-4 ps-4">
          <li class="nav-item">
            <button class="exercise_button nav-link active">Exercise</button>
          </li>
          <li class="nav-item">
            <button class="goals_button nav-link">
              Goals <span class="goals_badge badge text-bg-secondary"></span>
            </button>
          </li>
          <li class="nav-item">
            <button class="notes_button nav-link">
              Notes <span class="badge text-bg-secondary"></span>
            </button>
          </li>
        </ul>
        <div class="content_container">
        </div>`;

    this.elements = {
      exerciseButton: this.querySelector(".exercise_button"),
      goalsButton: this.querySelector(".goals_button"),
      notesButton: this.querySelector(".notes_button"),
      contentContainer: this.querySelector(".content_container"),
    };

    this.buttonFunctions = {
      exerciseButtonFunction: (e) => this.changeActiveView(e, ".exercise"),
      goalsButtonFunction: (e) => this.changeActiveView(e, ".goals"),
      notesButtonFunction: (e) => this.changeActiveView(e, ".notes"),
    };

    this.elements.exerciseButton.addEventListener(
      "click",
      this.buttonFunctions.exerciseButtonFunction.bind(this)
    );
    this.elements.goalsButton.addEventListener(
      "click",
      this.buttonFunctions.goalsButtonFunction.bind(this)
    );
    this.elements.notesButton.addEventListener(
      "click",
      this.buttonFunctions.notesButtonFunction.bind(this)
    );

    import(`/ContentFiles/ExerciseContentFiles/Exercises/exercise_${this.exerciseId}.js`)
      .then(async (module) => {
        let definition = await returnPlainJson(
          "/ContentFiles/ExerciseContentFiles/exercise_definitions.json"
        );
        let title = definition["_" + this.exerciseId].title;
        this.documentTitle = title;
        window.history.replaceState(
          {},
          title,
          `?view=exercise&item=${this.exerciseId}`
        );
        let element = new module.ExerciseComponent(this.exerciseId);
        element.documentTitle = title;
        this.elements.contentContainer.appendChild(element);
        this.elements.contentContainer
          .querySelector(".exercise")
          .classList.add("_visible");
      })
      .catch((error) => {
        createToast("error", "An error occurred opening the exercise", true);
        console.error(error)
        closeView();
        return;
      });
    this.elements.contentContainer.appendChild(
      new NoteContainerComponent(`e-${this.exerciseId}`)
    );
    this.elements.contentContainer.appendChild(
      new GoalContainerComponent(this.exerciseId)
    );

    this.elements.contentContainer
      .querySelector(".goals")
      .classList.add("invisible");

    this.elements.contentContainer
      .querySelector(".notes")
      .classList.add("invisible");
  }

  changeActiveView(event, activeView) {
    let preVisible = this.querySelector("._visible");
    preVisible.classList.remove("_visible");
    preVisible.classList.add("invisible");
    this.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");
    this.querySelector(activeView).classList.add("_visible");
    this.querySelector(activeView).classList.remove("invisible");
  }
}

customElements.define("exercise-viewer-component", ExerciseViewerComponent);

export { ExerciseViewerComponent };
