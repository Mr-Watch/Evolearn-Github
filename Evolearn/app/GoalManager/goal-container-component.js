import {
  activateGoalInLocalStorage,
  getGoalsJson,
  returnGoalsFromLocalStorage,
} from "./goal-manager.js";
import { GoalComponent } from "./goal-component.js";
import { createToast } from "../ToastManager/toast-manager.js";
import {
  createLoadingScreen,
  removeLoadingScreen,
} from "../LoadingScreen/loading-screen-component.js";
import { stringToNode } from "../AuxiliaryScripts/utils.js";
import { unlockExercise } from "../ExerciseManager/exercise-manager.js";
import { updateExerciseView } from "../AuxiliaryScripts/view-manager.js";

class GoalContainerComponent extends HTMLElement {
  constructor(goalContainerId) {
    super();
    this.goalElementsMap = new Map();
    this.goalContainerId = goalContainerId;
    this.remainingGoalsNumber = 0;
  }

  requestGoals() {
    getGoalsJson(this.goalContainerId, this.renderGoals.bind(this));
  }

  renderGoals(data) {
    let documentFragment = new DocumentFragment();
    if (Object.keys(data).length !== 0 && !data.hasOwnProperty("error")) {
      for (let index = 0; index < Object.keys(data).length; index++) {
        let goalObject = Object.entries(data)[index];
        let goal = new GoalComponent(
          goalObject[0],
          goalObject[1].title,
          goalObject[1].description
        );

        documentFragment.appendChild(goal);
        this.goalElementsMap.set(goalObject[0], goal);
      }
      this.appendChild(documentFragment);
      this.toggleAlreadyActiveGoals();
    } else {
      removeLoadingScreen(this);
      this.appendChild(
        stringToNode('<h2 class="m-5">This exercise has no goals</h2>')
      );
      unlockExercise(this.goalContainerId);
      updateExerciseView();
    }
  }

  toggleAlreadyActiveGoals() {
    this.goals = returnGoalsFromLocalStorage(this.goalContainerId);
    this.remainingGoalsNumber = Object.keys(this.goals).length;

    Object.entries(this.goals).forEach((goal) => {
      if (goal[1] === true) {
        this.goalElementsMap.get(goal[0]).activateGoal();
        this.remainingGoalsNumber -= 1;
      }
    });

    this.updateBadge();
    removeLoadingScreen(this);
  }

  activateGoal(goalNumber) {
    if (this.goals[`_${goalNumber}`] !== true) {
      this.goalElementsMap.get(`_${goalNumber}`).activateGoal();
      createToast("success", `You completed Goal ${goalNumber}!`, true);
      activateGoalInLocalStorage(this.goalContainerId, `_${goalNumber}`);
      this.remainingGoalsNumber -= 1;
      this.updateBadge();
    }
  }

  updateBadge() {
    let text = "";
    if (this.remainingGoalsNumber > 0) {
      text = this.remainingGoalsNumber;
    } else {
      text = "";
    }
    try {
      this.closest("exercise-viewer-component").querySelector(
        ".goals_badge"
      ).innerText = text;
    } catch (error) {
      console.log("Goal container is not in an appropriate context");
    }
  }

  connectedCallback() {
    createLoadingScreen(this);
    this.classList.add(
      "goals",
      "container_item",
      "d-flex",
      "flex-column",
      "align-items-center"
    );
    this.requestGoals();
  }
}

customElements.define("goal-container-component", GoalContainerComponent);
export { GoalContainerComponent };
