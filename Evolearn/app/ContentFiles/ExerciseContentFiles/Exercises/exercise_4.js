import { OrderBasedIndividual } from "../../../EvoGen/Individuals/order-based.js";
import { BasicGenotype } from "../../../EvoGen/Visualizations/basic-genotype.js";
import { TspVisualization } from "../../../EvoGen/Visualizations/tsp.js";
import { returnGoalsFromLocalStorage } from "../../../GoalManager/goal-manager.js";
import { createToast } from "../../../ToastManager/toast-manager.js";
import { roundToNDecimals } from "../../../AuxiliaryScripts/utils.js";
import { ExerciseTemplateComponent } from "../../../ExerciseManager/exercise-template-component.js";

class ExerciseComponent4 extends ExerciseTemplateComponent {
  constructor() {
    super();
    this.individual = new OrderBasedIndividual();
    this.individualVisualization = new TspVisualization(this.individual);
    this.genotypeVisualization = new BasicGenotype(this.individual);
    this.genotypeSize = this.individual.genotype.length;

    this.totalDistance = document.createElement("h3");
    this.totalDistance.style.maxWidth = "40rem";
    this.totalDistance.classList.add("mt-5", "text-break");

    this.textFieldDebounce = false;

    super.connectedCallback();

    let goals = returnGoalsFromLocalStorage(4);
    if (goals !== null) {
      this.goalsFunctionMap = new Map([
        ["_1", [this.goal1.bind(this)]],
        ["_2", [this.goal2.bind(this)], true],
        ["_3", [this.goal3.bind(this)]],
        ["_4", [this.goal4.bind(this), true]],
        ["_5", [this.goal5.bind(this), true]],
      ]);

      Object.entries(goals).forEach((goal) => {
        if (goal[1] === true) {
          this.goalsFunctionMap.set(goal[1], [() => {}]);
        }
      });
    }
  }

  connectedCallback() {
    this.exerciseView.classList.add(
      "d-flex",
      "flex-column",
      "align-items-center",
      "overflow-scroll"
    );

    this.exerciseOptions.classList.add("d-flex", "flex-column", "m-3");

    this.exerciseOptions.innerHTML = `
  <label class="form-label">
    Select the size of the genotype : <span class='genotype_size_span'>5</span>
    <input
      class="form-range mt-2"
      type="range"
      min="1"
      max="100"
      step="1"
      name="genotype_size"
    />
  </label>

  <label class="form-label">
    Insert your own path order as a comma separated list or integers
    <input
      type="text"
      class="form-control mt-2"
      name="genotype_textfield"
      placeholder="eg. 1,2,0,9,4"
    />
  </label>
  <div class="btn-group b_group_1" role="group">
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      New Board <span class="material-icons ps-2">calendar_view_month</span>
    </button>
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Reset <span class="material-icons ps-2">restart_alt</span>
    </button>
  </div>
  <div class="btn-group b_group_2 mt-2" role="group">
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Clear Path <span class="material-icons ps-2">backspace</span>
    </button>
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Randomize Path <span class="material-icons ps-2">timeline</span>
    </button>
  </div>`;

    this.elements = {
      exerciseTitle: this.closest("exercise-viewer-component").querySelector(
        ".exercise_button"
      ),
      phenotypeSelector:
        this.exerciseOptions.querySelector('[name="phenotype"]'),
      genotypeSizeRange: this.exerciseOptions.querySelector(
        '[name="genotype_size"]'
      ),
      genotypeSizeSpan: this.exerciseOptions.querySelector(
        ".genotype_size_span"
      ),
      genotypeTextField: this.exerciseOptions.querySelector(
        '[name="genotype_textfield"]'
      ),
      buttonGroup1: this.exerciseOptions.querySelector(".b_group_1"),
      buttonGroup2: this.exerciseOptions.querySelector(".b_group_2"),
    };

    this.elements.exerciseTitle.innerText = this.documentTitle;
    document.title = this.documentTitle;

    this.elements.genotypeSizeRange.value = 5;
    this.genotypeSize = this.elements.genotypeSizeRange.value;

    this.elements.genotypeSizeRange.addEventListener(
      "change",
      this.updateIndividualSize.bind(this)
    );

    this.elements.buttonGroup1.children[0].addEventListener(
      "click",
      this.generateGenotype.bind(this)
    );

    this.elements.buttonGroup1.children[1].addEventListener(
      "click",
      this.reset.bind(this)
    );

    this.elements.buttonGroup2.children[0].addEventListener(
      "click",
      this.clearPath.bind(this)
    );

    this.elements.buttonGroup2.children[1].addEventListener(
      "click",
      this.drawRandomPath.bind(this)
    );

    this.elements.genotypeTextField.addEventListener(
      "change",
      this.updateTextField.bind(this)
    );

    this.elements.genotypeTextField.addEventListener(
      "focusout",
      this.updateTextField.bind(this)
    );

    this.generateGenotype();
    this.drawGenotype();
  }

  generateGenotype() {
    try {
      this.individual.generateGenotype(this.genotypeSize);
    } catch (error) {
      createToast("error", "The order you entered is not valid", true);
      return;
    }
    this.updateIndividualSize();
    this.exerciseView.appendChild(this.individualVisualization);
    this.drawGenotype();
    try {
      this.individualVisualization.generateNewTspCanvas(this.genotypeSize);
      this.individualVisualization.drawPath(this.individual.genotype);
    } catch (error) {
      createToast("error", "You included a point that does not exist", true);
      this.clearPath();
      return;
    }
    this.checkForGoals();
  }

  updateIndividualSize() {
    this.elements.genotypeSizeSpan.innerText =
      this.elements.genotypeSizeRange.value;
    this.genotypeSize = this.elements.genotypeSizeRange.value;
  }

  clearPath() {
    this.individualVisualization.clearPath();
  }

  updateTextField() {
    if (this.elements.genotypeTextField.value === "") {
      return;
    }
    try {
      this.drawPath();
      this.goalsFunctionMap.get("_5")[0]();
    } catch (error) {
      if (this.textFieldDebounce) {
        if (error.message === "point1 is undefined") {
          createToast(
            "error",
            "One of the entered points is outside the length of the genotype",
            true
          );
        } else {
          createToast("error", "The entered path order is invalid.", true);
          this.goalsFunctionMap.get("_4")[0]();
        }
        this.textFieldDebounce = false;
      } else {
        this.textFieldDebounce = true;
      }
      return;
    }
  }

  reset() {
    this.elements.genotypeSizeRange.value = 5;
    this.elements.genotypeTextField.value = "";
    this.elements.genotypeSizeRange.disabled = false;
    this.textFieldDebounce = false;
    this.updateIndividualSize();
    this.generateGenotype();
    this.drawGenotype();
    this.goalsFunctionMap.get("_3")[0]();
  }

  drawGenotype() {
    this.exerciseView.appendChild(this.genotypeVisualization);
    this.totalDistance.innerText = `Total path distance : ${roundToNDecimals(
      this.individualVisualization.totalDistance,
      3
    )}`;
    this.exerciseView.appendChild(this.totalDistance);
  }

  drawPath() {
    this.individual.overrideGenotype(this.elements.genotypeTextField.value);
    this.individualVisualization.drawPath(this.individual.genotype);
    this.drawGenotype();
  }

  drawRandomPath() {
    this.individual.overrideGenotype(
      this.individualVisualization.generateRandomPath(
        this.individual.genotype.length
      )
    );
    this.individualVisualization.drawPath(this.individual.genotype);
    this.drawGenotype();
    // this.goalsFunctionMap.get("_2")[0]();
  }

  checkForGoals() {
    this.goalsFunctionMap.forEach((goal) => {
      if (goal[1] !== true) {
        try {
          goal[0]();
        } catch (error) {
          return;
        }
      } else {
        console.log("Skipping locked goal.");
      }
    });
  }

  goal1() {
    if (this.elements.genotypeSizeRange.value === "100") {
      this.activateGoal(1);
      this.goalsFunctionMap.set("_1", [() => {}]);
    }
  }

  goal2() {
    if (this.resetCount === undefined) {
      this.resetCount = 1;
    }
    this.resetCount += 1;

    if (this.resetCount === 12) {
      this.activateGoal(2);
      this.goalsFunctionMap.set("_2", [() => {}]);
    }
  }

  goal3() {
    if (this.elements.genotypeSizeRange.value === "1") {
      this.activateGoal(3);
      this.goalsFunctionMap.set("_3", [() => {}]);
    }
  }
  goal4() {
    this.activateGoal(4);
    this.goalsFunctionMap.set("_4", [() => {}]);
  }

  goal5() {
    let genotypeSize = parseInt(this.elements.genotypeSizeRange.value);
    let orderSequence = [];

    for (let index = 0; index < genotypeSize; index++) {
      orderSequence.push(index);
    }
    orderSequence = orderSequence.join(",");
    if (orderSequence === this.elements.genotypeTextField.value) {
      this.activateGoal(5);
      this.goalsFunctionMap.set("_5", [() => {}]);
    }
  }
}

customElements.define("exercise-component-4", ExerciseComponent4);

export { ExerciseComponent4 as ExerciseComponent, ExerciseComponent4 };
