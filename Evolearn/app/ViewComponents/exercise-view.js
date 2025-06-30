import {
  getExerciseDefinitions,
  getLockedState,
  getExerciseOverride,
} from "../ExerciseManager/exercise-manager.js";
import { returnGoalsFromLocalStorage } from "../GoalManager/goal-manager.js";
import {
  countOccurrence,
  lsg,
  stringToNode,
} from "../AuxiliaryScripts/utils.js";

class ExerciseView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Exercises - From theory to practice!";
    this.urlString = "?view=exerciseView";
    this.exercisesMap = new Map();
  }

  connectedCallback() {
    this.classList.add(
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100",
      "align-items-center",
      "align-content-center"
    );

    this.innerHTML = `
      <h1 class="m-4">Exercises</h1>
      <h3 class="m-4" style="text-align: center;">Here you can find all sorts of different exercises that let you change their options as well as challenge you with unique goals!</h3>
      <div class="item_container d-flex flex-row flex-wrap justify-content-center"></div>
      `;

    this.elements = {
      itemContainer: this.querySelector(".item_container"),
    };

    let exerciseDefinitions = getExerciseDefinitions();
    let exercisesFragment = new DocumentFragment();
    let index = 0;
    for (let exercise of Object.entries(exerciseDefinitions)) {
      index += 1;
      let exerciseGoals = returnGoalsFromLocalStorage(
        exercise[0].replace("_", "")
      );
      let finishedGoals = countOccurrence(exerciseGoals, null);
      let totalGoals =
        exerciseGoals !== null && !Object.hasOwn(exerciseGoals,'error') ? Object.keys(exerciseGoals).length : 0;

      let lockedState = getLockedState(exercise[0]);

      let exerciseElement = stringToNode(`
      <div class="exercise card m-3 border" style="width: 20rem;">
      <img
        src="./Images/sliders-svgrepo-com.svg"
        width="350px"
        height="200px"
        class="icon card-img-top"
        alt="pdf_svg"
      />
      <img
        src="./Images/lock-svgrepo-com.svg"
        width="350px"
        height="200px"
        class="lock card-img-top position-absolute pt-2 d-none"
        alt="pdf_svg"
      />
      <div class="card-body">
        <hr class="mt-0" />
        <h5 class="card-title">Exercise ${index}</h5>
        <p class="card-text mt-3">${exercise[1].title}</p>
        <p class="card-text">${exercise[1].description}</p>
        <p class="card-text">Goals ${finishedGoals}/${totalGoals}</p>
        <div
          class="btn-group-vertical w-100"
          role="group"
        >
          <button class="open_exercise_button btn btn-primary"
          onclick="changeView('exercise',${exercise[0].replace(
            "_",
            ""
          )})">Open Exercise</button>
        </div>
      </div>
    </div>`);

      if (lockedState === 0) {
        exerciseElement.querySelector(".lock").classList.remove("d-none");
        exerciseElement.querySelector(".open_exercise_button").disabled = true;
        exerciseElement.querySelector(".icon").classList.add("gray_out");
      }

      if (getExerciseOverride()) {
        exerciseElement.querySelector(".open_exercise_button").disabled = false;
      }

      exercisesFragment.appendChild(exerciseElement);
      this.exercisesMap.set(exercise[0].replace("_", ""), exerciseElement);
    }
    this.elements.itemContainer.appendChild(exercisesFragment);

    let exerciseIds = JSON.parse(lsg("ExerciseIds"));
    let difference = [];

    if (exerciseIds !== null) {
      if (Object.keys(exerciseIds).length !== 0) {
        difference = exerciseIds.filter(
          (x) => !Object.keys(exerciseDefinitions).includes(x)
        );
      }
    }

    if (difference.length !== 0) {
      let recoveryElement = stringToNode(`
      <div class="card m-3 border" style="width: 20rem;">
      <div class="card-body">
        <div
          class="btn-group-vertical w-100 note_recovery_btn_group"
          role="group"
        >
          
        </div>
      </div>
    </div>`);
      difference.forEach((id) => {
        recoveryElement.querySelector(".note_recovery_btn_group").appendChild(
          stringToNode(`
      <button class="open_quiz_button btn btn-primary"
      onclick="changeView('noteRecovery','e-${id
        .slice(1)
        .replace("_", "-")}')">Recover notes from exercise with id : ${id.slice(
            1
          )}</button>`)
        );
      });
      this.elements.itemContainer.appendChild(recoveryElement);
    }
  }

  updateExercises() {
    this.connectedCallback();
  }
}

customElements.define("exercise-view", ExerciseView);

export { ExerciseView };
