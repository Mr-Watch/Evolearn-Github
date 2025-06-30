import {
  getRandomInteger,
  stringToStyleSheetNode,
} from "../../../AuxiliaryScripts/utils.js";
import { returnGoalsFromLocalStorage } from "../../../GoalManager/goal-manager.js";
import { createToast } from "../../../ToastManager/toast-manager.js";
import { ExerciseTemplateComponent } from "../../../ExerciseManager/exercise-template-component.js";

class ExerciseComponent1 extends ExerciseTemplateComponent {
  constructor() {
    super();
    this.documentTitle;
    super.connectedCallback();

    let goals = returnGoalsFromLocalStorage(1);
    if (goals !== null) {
      this.goalsFunctionMap = new Map([
        ["_1", [this.goal1.bind(this)]],
        ["_2", [this.goal2.bind(this)]],
        ["_3", [this.goal3.bind(this), true]],
        ["_4", [this.goal4.bind(this)]],
        ["_5", [this.goal5.bind(this), true]],
        ["_6", [this.goal6.bind(this), true]],
        ["_7", [this.goal7.bind(this), true]],
      ]);

      Object.entries(goals).forEach((goal) => {
        if (goal[1] === true) {
          this.goalsFunctionMap.set(goal[1], [() => {}]);
        }
      });
    }
  }

  connectedCallback() {
    this.uppercaseCharacters = "ABCDEFGHIJKLMOPQRSTUVWXYZ ".split("");
    this.lowercaseCharacters = "abcdefghijklmnopqrstuvwxyz ".split("");
    this.numbers = "0123456789 ".split("");

    this.exerciseView.classList.add(
      "d-flex",
      "flex-column",
      "justify-content-between"
    );

    this.exerciseView.innerHTML = `
    <div class="info d-flex flex-column m-3 p-2 border border-2 rounded">
      <h3 class="white_space">Iteration:   <span class="iteration_counter">0</span></h3>
      <hr>
      <h3 class="white_space">Target:   <span class="target_text"></span></h3>
    </div>
    <div class="align-self-center">
      <h2 class="text_container m-3 border border-2 rounded p-3"></h2>
    </div>

    <div class="table_div border border-2 rounded">
      <table class="table table-striped table-striped-columns d-none">
        <thead class="table_head position-sticky">
          <tr>
            <th scope="col">Iteration</th>
            <th scope="col">Generated String</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
    `;

    this.exerciseView.appendChild(
      stringToStyleSheetNode(`
    .info {
      width: fit-content;
    }

    .info > h3 {
      margin: 0.5rem;
    }

    .table_div {
      height: 30%;
      overflow: auto;
    }

    .table_head{
      top: 0;
      left: 0;
      position: absolute;
    }

    .white_space{
      white-space: pre;
    }`)
    );

    this.exerciseView.classList.add("overflow-scroll");

    this.exerciseOptions.classList.add("d-flex", "flex-column", "m-3");

    this.exerciseOptions.innerHTML = `
    <label class="form-label">
    Type the text that you wish to find
    <input
      type="text"
      class="form-control mt-2"
      name="target_text"
      placeholder="For instance type : banana"
    />
  </label>

    Select what characters you want in the character set
    <div class="form-check mt-1">
      <label class="form-check-label">
        <input
          class="form-check-input"
          name="lowercase"
          type="checkbox"
          value="[a-z]"
          checked
        />
        a-z
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input
          class="form-check-input"
          name="uppercase"
          type="checkbox"
          value="[A-Z]"
        />
        A-Z
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label">
        <input
          class="form-check-input"
          name="numbers"
          type="checkbox"
          value="[0-9]"
        />
        0 - 9
      </label>
    </div>

  <label class="form-label">
    Select the termination method of the exercise
    <select class="form-select mt-2" name="termination_select">
      <option selected value="0">Until the string is found</option>
      <option value="1">After a set number of iterations</option>
    </select>
  </label>

  <label class="form-label d-none">
    Iteration Range : <span class="iteration_range">1</span>
    <input
      type="range"
      name="iteration_range"
      class="form-range mt-2"
      min="100"
      step="100"
      max="5000"
    />
  </label>

  <label class="form-label">
    Select how many string records to keep in the table
    <select class="form-select mt-2" name="string_records">
      <option selected value="0">None</option>
      <option value="10">10</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value="1000">1000</option>
    </select>
  </label>

  <label class="form-label">
    Iteration Speed Delay : <span class="iteration_speed"></span>
    <input
      type="range"
      name="iteration_speed"
      class="form-range mt-2"
      min="0"
      step="100"
      max="3000"
    />
  </label>

  <div class="btn-group" role="group">
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
    <button
      type="button"
      class="btn btn-primary d-flex justify-content-center"
    >
      Reset <span class="material-icons ps-2">restart_alt</span>
    </button>
  </div>
    `;

    this.elements = {
      exerciseTitle: this.closest("exercise-viewer-component").querySelector(
        ".exercise_button"
      ),
      iterationCounter: this.exerciseView.querySelector(".iteration_counter"),
      targetStringInView: this.exerciseView.querySelector(".target_text"),
      textContainer: this.exerciseView.querySelector(".text_container"),
      iterationsTable: this.exerciseView.querySelector(".table"),
      targetString: this.exerciseOptions.querySelector('[name="target_text"]'),
      checkLowercase: this.exerciseOptions.querySelector('[name="lowercase"]'),
      checkUppercase: this.exerciseOptions.querySelector('[name="uppercase"]'),
      checkNumbers: this.exerciseOptions.querySelector('[name="numbers"]'),
      stringRecords: this.exerciseOptions.querySelector(
        '[name="string_records"]'
      ),
      terminationSelect: this.exerciseOptions.querySelector(
        '[name="termination_select"]'
      ),
      iterationRange: this.exerciseOptions.querySelector(
        '[name="iteration_range"]'
      ),
      iterationRangeCounter:
        this.exerciseOptions.querySelector(".iteration_range"),
      iterationSpeed: this.exerciseOptions.querySelector(
        '[name="iteration_speed"]'
      ),
      iterationSpeedCounter:
        this.exerciseOptions.querySelector(".iteration_speed"),
      exerciseButtonGroup: this.exerciseOptions.querySelector(".btn-group"),
    };

    this.elements.terminationSelect.addEventListener(
      "click",
      this.updateTerminationMethod.bind(this)
    );

    this.elements.iterationRange.addEventListener(
      "change",
      this.updateIterationRange.bind(this)
    );

    this.elements.stringRecords.addEventListener(
      "change",
      this.updateStringRecords.bind(this)
    );

    this.elements.iterationSpeed.addEventListener(
      "change",
      this.updateIterationSpeed.bind(this)
    );

    this.elements.targetString.addEventListener(
      "change",
      this.updateTargetText.bind(this)
    );

    this.elements.exerciseButtonGroup.firstElementChild.addEventListener(
      "click",
      this.start.bind(this)
    );

    this.elements.exerciseButtonGroup.firstElementChild.nextElementSibling.addEventListener(
      "click",
      this.stop.bind(this)
    );

    this.elements.exerciseButtonGroup.lastElementChild.addEventListener(
      "click",
      this.reset.bind(this)
    );

    this.elements.exerciseTitle.innerText = this.documentTitle;
    document.title = this.documentTitle;

    this.elements.iterationRange.value = "500";
    this.elements.iterationSpeed.value = "1000";
    this.updateTargetText();
    this.updateIterationRange();
    this.updateIterationSpeed();
  }

  toggleInputs(value) {
    this.elements.targetString.disabled = value;
    this.elements.checkLowercase.disabled = value;
    this.elements.checkUppercase.disabled = value;
    this.elements.checkNumbers.disabled = value;
    this.elements.terminationSelect.disabled = value;
    this.elements.iterationRange.disabled = value;
    this.elements.stringRecords.disabled = value;
    this.elements.iterationSpeed.disabled = value;
    this.elements.exerciseButtonGroup.firstElementChild.disabled = value;
    this.elements.exerciseButtonGroup.lastElementChild.disabled = value;
  }

  checkForImpossibleCharacterSet() {
    let tokenizedString = this.targetString.split("");

    for (let index = 0; index < tokenizedString.length; index++) {
      if (!this.characterSet.includes(tokenizedString[index])) {
        return true;
      }
    }
    return false;
  }

  start() {
    this.elements.iterationsTable.querySelector("tbody").replaceChildren();
    this.targetString = this.elements.targetString.value;

    if (this.targetString === "") {
      createToast("info", "You have to first enter a string", true);
      return;
    }

    this.setCharacterSet();

    if (this.characterSet.length === 0) {
      createToast("info", "You need to select a valid character set", true);
      this.goalsFunctionMap.get("_3")[0]();
      return;
    }

    if (this.checkForImpossibleCharacterSet()) {
      createToast(
        "info",
        "The string can not be generated with the specified character set",
        true
      );
      return;
    }

    this.iterations = 0;

    if (this.elements.terminationSelect.value === "1") {
      this.iterationsTarget = this.elements.iterationRange.value;
    }

    if (this.elements.stringRecords.value === "0") {
      this.addTableEntry = (string) => {};
    } else {
      this.numberOfEntriesToKeep = parseInt(this.elements.stringRecords.value);
      this.entriesCount = 0;
      this.addTableEntry = this._addTableEntry;
    }

    this.toggleInputs(true);
    this.intervalFunction();
    this.intervalFunctionInterval = setInterval(
      this.intervalFunction.bind(this),
      this.elements.iterationSpeed.value
    );
    this.checkForGoals();
  }

  intervalFunction() {
    this.iterations += 1;
    this.updateIterationCount();
    let tmpString = this.generateString();
    this.addTableEntry(tmpString);

    this.updateTextContainer(tmpString);

    if (tmpString === this.targetString) {
      createToast("success", "The string was found", true);
      this.stop();
      this.checkForGoals();
      this.goalsFunctionMap.get("_5")[0]();
      this.goalsFunctionMap.get("_6")[0]();
      return;
    }

    if (this.iterationsTarget !== undefined) {
      if (this.iterations === parseInt(this.iterationsTarget)) {
        createToast(
          "info",
          "Iteration limit hit. The string was not found",
          true
        );
        this.stop();
        this.checkForGoals();
        return;
      }
    }
  }

  stop() {
    clearInterval(this.intervalFunctionInterval);
    this.toggleInputs(false);
  }

  reset() {
    this.iterations = 0;
    this.iterationsTarget = undefined;
    this.targetString = "";
    this.elements.targetString.value = "";
    this.elements.iterationCounter.innerText = "0";
    this.elements.textContainer.innerText = "";
    this.elements.targetStringInView.innerText = "";
    this.elements.targetString.value = "";
    this.elements.checkLowercase.checked = true;
    this.elements.checkUppercase.checked = false;
    this.elements.checkNumbers.checked = false;
    this.elements.terminationSelect.value = "0";
    this.elements.iterationRange.value = "500";
    this.elements.stringRecords.value = "0";
    this.elements.iterationSpeed.value = "1000";

    this.elements.iterationsTable.querySelector("tbody").replaceChildren();
    this.updateStringRecords();
    this.updateIterationRange();

    this.updateTerminationMethod();
    this.updateIterationSpeed();
  }

  _addTableEntry(tmpString) {
    if (this.entriesCount === this.numberOfEntriesToKeep) {
      this.goalsFunctionMap.get("_7")[0]();
      this.entriesCount = 0;
      this.elements.iterationsTable.querySelector("tbody").replaceChildren();
    }
    this.entriesCount += 1;

    let entry = document.createElement("tr");
    let iteration = document.createElement("th");
    let string = document.createElement("td");

    iteration.innerText = this.iterations;
    string.innerText = tmpString;
    entry.appendChild(iteration);
    entry.appendChild(string);

    this.elements.iterationsTable.querySelector("tbody").appendChild(entry);
  }

  updateIterationCount() {
    this.elements.iterationCounter.innerText = this.iterations;
  }

  updateTextContainer(string) {
    this.elements.textContainer.innerText = string;
  }

  updateIterationSpeed() {
    this.elements.iterationSpeedCounter.innerText = `${this.elements.iterationSpeed.value}ms`;
  }

  updateIterationRange() {
    this.elements.iterationRangeCounter.innerText =
      this.elements.iterationRange.value;
  }

  updateTargetText() {
    this.elements.targetStringInView.innerText =
      this.elements.targetString.value;
  }

  updateTerminationMethod() {
    if (this.elements.terminationSelect.value === "0") {
      this.elements.iterationRange.parentElement.classList.add("d-none");
      this.iterationsTarget = undefined;
    } else {
      this.elements.iterationRange.parentElement.classList.remove("d-none");
    }
  }

  updateStringRecords() {
    if (this.elements.stringRecords.value !== "0") {
      this.elements.iterationsTable.classList.remove("d-none");
    } else {
      this.elements.iterationsTable.classList.add("d-none");
    }
  }

  setCharacterSet() {
    let characterSet = [];

    if (this.elements.checkLowercase.checked) {
      characterSet = characterSet.concat(this.lowercaseCharacters);
    }

    if (this.elements.checkUppercase.checked) {
      characterSet = characterSet.concat(this.uppercaseCharacters);
    }

    if (this.elements.checkNumbers.checked) {
      characterSet = characterSet.concat(this.numbers);
    }

    this.characterSet = characterSet;
  }

  generateString() {
    let generatedString = "";

    this.targetString.split("").forEach(() => {
      generatedString = generatedString.concat(
        this.characterSet[getRandomInteger(0, this.characterSet.length - 1)]
      );
    });

    return generatedString;
  }

  disconnectedCallback() {
    clearInterval(this.intervalFunctionInterval);
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
    if (this.targetString === "banana") {
      this.activateGoal(1);
      this.goalsFunctionMap.set("_1", [() => {}]);
    }
  }

  goal2() {
    if (this.characterSet.length === 64) {
      this.activateGoal(2);
      this.goalsFunctionMap.set("_2", [() => {}]);
    }
  }

  goal3() {
    this.activateGoal(3);
    this.goalsFunctionMap.set("_3", [() => {}]);
  }
  goal4() {
    if (
      this.targetString === 100 &&
      this.elements.iterationRange.value === "100" &&
      this.elements.iterationSpeed.value === "100" &&
      this.numberOfEntriesToKeep === 100
    ) {
      this.activateGoal(4);
      this.goalsFunctionMap.set("_4", [() => {}]);
    }
  }

  goal5() {
    if (this.elements.iterationSpeed.value === "0") {
      this.activateGoal(5);
      this.goalsFunctionMap.set("_5", [() => {}]);
    }
  }
  goal6() {
    if (this.iterations < 2000 && this.targetString === "cat") {
      this.activateGoal(6);
      this.goalsFunctionMap.set("_6", [() => {}]);
    }
  }
  goal7() {
    if (this.countLogAttempts === undefined) {
      this.countLogAttempts = 0;
    }
    if (this.numberOfEntriesToKeep === 1000) {
      this.countLogAttempts += 1;
    }
    if (
      this.numberOfEntriesToKeep === 1000 &&
      this.countLogAttempts === 5 &&
      this.targetString === "word"
    ) {
      this.activateGoal(7);
      this.goalsFunctionMap.set("_7", [() => {}]);
    }
  }
}

customElements.define("exercise-component-1", ExerciseComponent1);

export { ExerciseComponent1 as ExerciseComponent, ExerciseComponent1 };
