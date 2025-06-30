import { BinaryIndividual } from "../../../EvoGen/Individuals/binary.js";
import { BinaryPhenotypes } from "../../../EvoGen/Phenotypes/binary.js";
import { BasicGenotype } from "../../../EvoGen/Visualizations/basic-genotype.js";
import { returnGoalsFromLocalStorage } from "../../../GoalManager/goal-manager.js";
import { createToast } from "../../../ToastManager/toast-manager.js";
import { stringToNode } from "../../../AuxiliaryScripts/utils.js";
import { ExerciseTemplateComponent } from "../../../ExerciseManager/exercise-template-component.js";

class ExerciseComponent3 extends ExerciseTemplateComponent {
  constructor() {
    super();
    this.individual = new BinaryIndividual();
    this.individualVisualization = new BasicGenotype(this.individual);
    this.genotypeSize = this.individual.genotype.length;
    this.phenotypeEvaluation = new BinaryPhenotypes();
    this.phenotype = document.createElement("h3");
    this.phenotype.style.maxWidth = "40rem";
    this.phenotype.classList.add("mt-5", "text-break");
    this.textFieldInteracted = false;

    super.connectedCallback();

    let goals = returnGoalsFromLocalStorage(3);
    if (goals !== null) {
      this.goalsFunctionMap = new Map([
        ["_1", [this.goal1.bind(this)]],
        ["_2", [this.goal2.bind(this)], true],
        ["_3", [this.goal3.bind(this)]],
        ["_4", [this.goal4.bind(this)]],
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
    Select the phenotype representation you want
    <select
      class="form-select mt-2"
      name="phenotype"
    >
      <option selected value="integer">Integer</option>
      <option value="real_number">Real Number</option>
      <option value="schedule">Schedule</option>
    </select>
  </label>

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
    Insert you own genotype or modify the existing one
    <input
      type="text"
      class="form-control mt-2"
      name="genotype_textfield"
      placeholder="eg. 1010101010"
    />
  </label>

  <label class="form-label d-none">
    Insert phenotype formula (x is the integer conversion of the genotype)
    <input
      type="text"
      class="form-control mt-2"
      name="phenotype_formula"
      placeholder="2.5+((x/256)*(20.5-2.5))"
    />
  </label>
  <div class="btn-group" role="group">
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Generate Genotype <span class="material-icons ps-2">calendar_view_month</span>
    </button>
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Reset <span class="material-icons ps-2">restart_alt</span>
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
      genotypeFormula: this.exerciseOptions.querySelector(
        '[name="phenotype_formula"]'
      ),
      genotypeFormulaLabel: this.exerciseOptions.querySelector(
        '[name="phenotype_formula"]'
      ).parentElement,
      buttonGroup: this.exerciseOptions.querySelector(".btn-group"),
    };

    this.elements.exerciseTitle.innerText = this.documentTitle;
    document.title = this.documentTitle;

    this.elements.genotypeSizeRange.value = 5;
    this.genotypeSize = this.elements.genotypeSizeRange.value;

    this.elements.genotypeSizeRange.addEventListener(
      "change",
      this.updateIndividualSize.bind(this)
    );

    this.elements.buttonGroup.children[0].addEventListener(
      "click",
      this.generateGenotype.bind(this)
    );

    this.elements.buttonGroup.children[1].addEventListener(
      "click",
      this.reset.bind(this)
    );

    this.elements.phenotypeSelector.addEventListener(
      "change",
      this.updateSelector.bind(this)
    );

    this.elements.genotypeTextField.addEventListener(
      "change",
      this.updateTextField.bind(this)
    );

    this.generateGenotype();
  }

  generateGenotype() {
    try {
      if (!this.textFieldInteracted) {
        this.individual.generateGenotype(this.genotypeSize);
        this.elements.genotypeTextField.value =
          this.individual.genotype.join("");
      } else {
        this.individual.overrideGenotype(this.elements.genotypeTextField.value);
        this.elements.genotypeSizeRange.value =
          this.elements.genotypeTextField.value.length;
      }
    } catch (error) {
      createToast(
        "error",
        "The genotype you entered is not a valid binary string",
        true
      );
      return;
    }
    this.updateIndividualSize();
    this.selectPhenotypeFunction();
    this.exerciseView.appendChild(this.individualVisualization);
    this.exerciseView.appendChild(this.phenotype);

    this.checkForGoals();
  }

  updateIndividualSize() {
    this.elements.genotypeSizeSpan.innerText =
      this.elements.genotypeSizeRange.value;
    this.genotypeSize = this.elements.genotypeSizeRange.value;
  }

  selectPhenotypeFunction() {
    switch (this.elements.phenotypeSelector.value) {
      case "integer":
        this.generateIntegerPhenotype();
        break;
      case "real_number":
        this.generateRealNumberPhenotype();
        break;
      case "schedule":
        this.generateSchedulePhenotype();
        break;
    }
  }

  updateSelector() {
    if (this.elements.phenotypeSelector.value === "real_number") {
      this.elements.genotypeFormulaLabel.classList.remove("d-none");
    } else {
      this.elements.genotypeFormulaLabel.classList.add("d-none");
    }
    this.selectPhenotypeFunction();
  }

  updateTextField() {
    if (this.textFieldInteracted === false) {
      this.textFieldInteracted = true;
      this.elements.genotypeSizeRange.disabled = true;
    }
    this.updateIndividualSize();
    this.generateGenotype();
  }

  reset() {
    this.elements.genotypeSizeRange.value = 5;
    this.elements.genotypeTextField.value = "";
    this.elements.phenotypeSelector.value = "integer";
    this.elements.genotypeSizeRange.disabled = false;
    this.textFieldInteracted = false;
    this.updateSelector();
    this.updateIndividualSize();
    this.individual.generateGenotype(this.genotypeSize);
    this.selectPhenotypeFunction();
    this.exerciseView.appendChild(this.individualVisualization);
    this.exerciseView.appendChild(this.phenotype);
  }

  generateIntegerPhenotype() {
    let phenotypeText = "";

    for (let index = 0; index < this.genotypeSize; index++) {
      phenotypeText += `${this.individual.genotype[index]}*2<sup>${
        this.genotypeSize - index - 1
      }</sup>`;
      phenotypeText += "+";
    }

    phenotypeText = phenotypeText.slice(0, -1);
    this.phenotypeEvaluation.integer(this.individual);
    phenotypeText += ` = ${this.individual.phenotype}`;
    this.phenotype.innerHTML = phenotypeText;
  }

  generateRealNumberPhenotype() {
    let formula = undefined;
    if (this.elements.genotypeFormula.value !== "") {
      formula = this.elements.genotypeFormula.value;
    } else {
      formula = "2.5+(x/256)*(20.5-2.5)";
    }

    try {
      this.phenotypeEvaluation.realNumber(this.individual, formula);
      formula = formula.replaceAll(
        "x",
        parseInt(this.individual.genotype.join(""), 2)
      );
    } catch (error) {
      createToast(
        "error",
        "The formula you entered is invalid and can not be parsed",
        true
      );
      return;
    }
    this.phenotype.innerHTML = formula + " = " + this.individual.phenotype;
    this.goalsFunctionMap.get("_2")[0]();
  }

  generateSchedulePhenotype() {
    let schedule = stringToNode(`
    <div
    class="d-flex flex-row align-content-center justify-content-center"
  >
    <ul class="job" style="list-style: none; text-align: center">
      <li>Job</li>
    </ul>
    <ul class="time_step" style="list-style: none; text-align: center">
      <li>Time Step</li>
    </ul>
  </div>`);

    this.phenotypeEvaluation.schedule(this.individual);

    for (let job of this.individual.phenotype.keys()) {
      schedule
        .querySelector(".job")
        .appendChild(stringToNode(`<li>${job}<li>`));
    }

    for (let timeStep of this.individual.phenotype.values()) {
      schedule
        .querySelector(".time_step")
        .appendChild(stringToNode(`<li>${timeStep}<li>`));
    }
    this.phenotype.innerHTML = schedule.outerHTML;
    this.goalsFunctionMap.get("_5")[0]();
  }

  checkForGoals() {
    this.goalsFunctionMap.forEach((goal) => {
      if (goal[1] !== true) {
        goal[0]();
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
    if (
      this.elements.genotypeTextField.value === "10101" &&
      this.individual.phenotype === 255
    ) {
      this.activateGoal(2);
      this.goalsFunctionMap.set("_2", () => {});
    }
  }

  goal3() {
    if (this.elements.genotypeTextField.value === "101") {
      this.activateGoal(3);
      this.goalsFunctionMap.set("_3", [() => {}]);
    }
  }
  goal4() {
    if (
      this.elements.genotypeSizeRange.value === "32" &&
      this.elements.genotypeTextField.value ===
        "01100111011001010110111001100101"
    ) {
      this.activateGoal(4);
      this.goalsFunctionMap.set("_4", [() => {}]);
    }
  }

  goal5() {
    if (
      this.elements.genotypeTextField.value === "1111111111111111111111111111"
    ) {
      this.activateGoal(5);
      this.goalsFunctionMap.set("_5", [() => {}]);
    }
  }
}

customElements.define("exercise-component-3", ExerciseComponent3);

export { ExerciseComponent3 as ExerciseComponent, ExerciseComponent3 };
