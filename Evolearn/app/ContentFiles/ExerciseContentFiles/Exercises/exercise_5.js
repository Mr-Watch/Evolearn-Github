import { returnGoalsFromLocalStorage } from "../../../GoalManager/goal-manager.js";
import { cloneCanvas, stringToNode } from "../../../AuxiliaryScripts/utils.js";
import { ExerciseComponent4 } from "./exercise_4.js";

class ExerciseComponent5 extends ExerciseComponent4 {
  constructor() {
    super();
    this.currentBestDistance = 999999999;
    this.iterationCount = 0;
    let goals = returnGoalsFromLocalStorage(5);
    if (goals !== null) {
      this.goalsFunctionMap = new Map([
        [1, this.goal1.bind(this)],
        [2, this.goal2.bind(this)],
        [3, this.goal3.bind(this)],
      ]);

      for (let index = 0; index < goals.length; index++) {
        if (goals[index] === null) {
          this.goalsFunctionMap.set(index + 1, () => {});
        }
      }
    }
    this.goalsFunctionMap = new Map([
      [1, this.goal1.bind(this)],
      [2, this.goal2.bind(this)],
      [3, this.goal3.bind(this)],
    ]);
    for (let index = 0; index < goals.length; index++) {
      if (goals[index] === null) {
        this.goalsFunctionMap.set(index + 1, () => {});
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.elements.genotypeTextField.parentElement.classList.add("d-none");
    this.exerciseOptions.appendChild(
      stringToNode(`
    <label class="form-label mt-2">
    Iteration Speed Delay : <span class="iteration_speed"></span>
    <input
      type="range"
      name="iteration_speed"
      class="form-range mt-2"
      min="0"
      step="100"
      max="3000"
    />
  </label>`)
    );

    this.exerciseOptions.appendChild(
      stringToNode(`
      <label class="form-label">
      Select if you want to record the best or worst total distance
      <select class="form-select mt-2" name="distance_metric">
        <option selected value="best">Best distance (smaller than previous)</option>
        <option value="worst">Worst distance (bigger than previous)</option>
      </select>
    </label>`)
    );

    this.exerciseOptions.appendChild(
      stringToNode(`
  <div class="btn-group b_group_3" role="group">
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Start <span class="material-icons ps-2">play_circle</span>
    </button>
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Stop <span class="material-icons ps-2">stop_circle </span>
    </button>
  </div>`)
    );
    this.exerciseOptions.appendChild(
      stringToNode(
        `<p class="mt-2">Iteration : <span class="iteration_count"></span></p>`
      )
    );
    this.exerciseOptions.appendChild(
      stringToNode(
        `<div class="current_best w-100 h-100 mt-3 overflow-none"></div>`
      )
    );

    this.elements.buttonGroup3 = this.querySelector(".b_group_3");
    this.elements.iterationSpeedRange = this.querySelector(
      '[name="iteration_speed"]'
    );
    this.elements.distanceMetric = this.querySelector(
      '[name="distance_metric"]'
    );

    this.elements.iterationCount = this.querySelector(".iteration_count");

    this.elements.buttonGroup1.children[0].addEventListener(
      "click",
      this.generateNewBoard.bind(this)
    );

    this.elements.iterationSpeedRange.value = "200";
    this.updateIterationSpeed();
    this.updateIterationCount();

    this.elements.distanceMetric.addEventListener(
      "click",
      this.updateDistanceMetric.bind(this)
    );

    this.elements.iterationSpeedRange.addEventListener(
      "change",
      this.updateIterationSpeed.bind(this)
    );

    this.elements.buttonGroup3.children[0].addEventListener(
      "click",
      this.start.bind(this)
    );

    this.elements.buttonGroup3.children[1].addEventListener(
      "click",
      this.stop.bind(this)
    );
  }

  generateNewPath() {
    this.drawRandomPath();
    this.iterationCount += 1;
    this.updateIterationCount();
    this.drawBestCurrentPath(this.elements.distanceMetric.value);
  }

  drawBestCurrentPath(condition) {
    switch (condition) {
      case "best":
        if (this.currentBestDistance > this.getCurrentDistance()) {
          this.putInOptionsMenu(this.getCurrentDistance());
        }
        break;
      case "worst":
        if (this.currentBestDistance < this.getCurrentDistance()) {
          this.putInOptionsMenu(this.getCurrentDistance());
        }
        break;
      default:
        throw Error("Invalid condition");
    }
  }

  putInOptionsMenu(currentBestDistance) {
    this.currentBestDistance = currentBestDistance;
    let currentDistance = this.totalDistance.cloneNode(true);
    let currentVisualization = cloneCanvas(this.individualVisualization.canvas);

    currentVisualization.style.width = "100%";

    this.exerciseOptions
      .querySelector(".current_best")
      .appendChild(currentVisualization);
    this.exerciseOptions
      .querySelector(".current_best")
      .appendChild(currentDistance);
  }

  getCurrentDistance() {
    return this.individualVisualization.totalDistance;
  }

  generateNewBoard() {
    this.iterationCount = 0;
    this.updateIterationCount();
    this.exerciseOptions.querySelector(".current_best").replaceChildren();
    this.updateDistanceMetric();
  }

  start() {
    this.drawInterval = setInterval(
      this.generateNewPath.bind(this),
      this.elements.iterationSpeedRange.value
    );
    this.lockOptions();
  }

  stop() {
    clearInterval(this.drawInterval);
    this.unlockOptions();
  }

  reset() {
    super.reset();
    this.iterationCount = 0;
    this.updateIterationCount();
    this.exerciseOptions.querySelector(".current_best").replaceChildren();
    this.updateDistanceMetric();
    this.elements.iterationSpeedRange.value = "200";
    this.elements.distanceMetric.value === "best";
    this.updateIterationSpeed();
  }

  updateIterationSpeed() {
    this.elements.iterationSpeedRange.parentElement.querySelector(
      ".iteration_speed"
    ).innerText = `${this.elements.iterationSpeedRange.value}ms`;
  }

  updateIterationCount() {
    this.elements.iterationCount.innerText = this.iterationCount;
  }

  updateDistanceMetric() {
    if (this.elements.distanceMetric.value === "best") {
      this.currentBestDistance = 999999999;
    } else {
      this.currentBestDistance = 0;
    }
  }

  lockOptions() {
    Object.values(this.elements.buttonGroup1.children).forEach((button) => {
      button.disabled = true;
    });
    Object.values(this.elements.buttonGroup2.children).forEach((button) => {
      button.disabled = true;
    });
    this.elements.distanceMetric.disabled = true;
    this.elements.genotypeSizeRange.disabled = true;
    this.elements.iterationSpeedRange.disabled = true;
    this.elements.buttonGroup3.children[0].disabled = true;
  }

  unlockOptions() {
    Object.values(this.elements.buttonGroup1.children).forEach((button) => {
      button.disabled = false;
    });
    Object.values(this.elements.buttonGroup2.children).forEach((button) => {
      button.disabled = false;
    });
    this.elements.distanceMetric.disabled = false;
    this.elements.genotypeSizeRange.disabled = false;
    this.elements.iterationSpeedRange.disabled = false;
    this.elements.buttonGroup3.children[0].disabled = false;
  }

  disconnectedCallback() {
    clearInterval(this.drawInterval);
  }
}

customElements.define("exercise-component-5", ExerciseComponent5);

export { ExerciseComponent5 as ExerciseComponent, ExerciseComponent5 };
