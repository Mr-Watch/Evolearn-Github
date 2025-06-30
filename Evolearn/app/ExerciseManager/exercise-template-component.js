import { stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class ExerciseTemplateComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add("exercise", "container_item", "d-flex");
    this.innerHTML = `
    <div class="exercise_view"></div>
    <div class="exercise_options"></div>`;

    this.appendChild(
      stringToStyleSheetNode(`
    .exercise_view {
        overflow: auto !important;
        padding: 10px;
        flex-grow: 2;
        border-right: 2px solid var(--bs-border-color)
    }

    .exercise_options {
        overflow: auto;
        padding: 10px;
        flex-grow: 1;
    }
    `)
    );
    this.exerciseView = this.querySelector(".exercise_view");
    this.exerciseOptions = this.querySelector(".exercise_options");
    this.activateGoal = (goalNumber) => {
      try {
        this.previousElementSibling.activateGoal(goalNumber);
      } catch (error) {
        this.goalNumber = goalNumber;
        console.log("Goals not loaded yet.");
        setTimeout(() => this.activateGoal(this.goalNumber), 1000);
      }
    };
  }
}

customElements.define("exercise-template-component", ExerciseTemplateComponent);

export { ExerciseTemplateComponent };
