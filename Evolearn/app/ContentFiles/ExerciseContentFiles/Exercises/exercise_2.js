import { createToast } from "../../../ToastManager/toast-manager.js";
import {
  getRandomInteger,
  roundToTwoDecimals,
  stringToNode,
  stringToStyleSheetNode,
} from "../../../AuxiliaryScripts/utils.js";
import { ExerciseComponent1 } from "./exercise_1.js";

class ExerciseComponent extends ExerciseComponent1 {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.exerciseView.innerHTML = `
    <div class="info d-flex flex-column m-3 p-2 border border-2 rounded">
      <h5 class="white_space mb-0">Iteration:   <span class="iteration_counter">0</span></h5>
      <hr>
      <h5 class="white_space mb-0">Target:   <span class="target_text"></span></h5>
      <hr>
      <h5 class="white_space mb-0">Previous Fitness:   <span class="previous_fitness"></span></h5>
      <hr>
      <h5 class="white_space mb-0">Current Fitness:  <span class="current_fitness"></span></h5>
    </div>
    <div class="align-self-center">
      <h2 class="previous_best m-3 border border-2 rounded p-3"></h2>
      <h2 class="current_best m-3 border border-2 rounded p-3"></h2>
    </div>
    <div class="table_div border border-2 rounded">
      <table class="table table-striped table-striped-columns d-none">
        <thead class="table_head position-sticky">
          <tr>
            <th scope="col">Iteration</th>
            <th scope="col">Generated String</th>
            <th scope="col">Fitness Percentage</th>
          </tr>
        </thead>
        <tbody>
        <tr class="anchor">
        </tr>
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

    this.exerciseOptions.classList.add(
      "d-flex",
      "flex-column",
      // "justify-content-evenly",
      "m-3"
    );

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
      <option value="0">None</option>
      <option value="10">10</option>
      <option value="50">50</option>
      <option selected value="100">100</option>
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
      previousFitness: this.exerciseView.querySelector(".previous_fitness"),
      currentFitness: this.exerciseView.querySelector(".current_fitness"),
      previousString: this.exerciseView.querySelector(".previous_best"),
      currentString: this.exerciseView.querySelector(".current_best"),
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
    this.updateStringRecords();
    this.updateTargetText();
    this.updateIterationRange();
    this.updateIterationSpeed();
  }

  start() {
    this.elements.iterationsTable.querySelector("tbody").replaceChildren();
    this.addAnchor();
    this.targetString = this.elements.targetString.value;

    if (this.targetString === "") {
      createToast("info", "You have to first enter a string",true);
      return;
    }

    this.setCharacterSet();

    if (this.characterSet.length === 0) {
      createToast("info", "You need to select a valid character set",true);
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
      this.addTableEntry = () => {};
    } else {
      this.numberOfEntriesToKeep = parseInt(this.elements.stringRecords.value);
      this.entriesCount = 0;
      this.addTableEntry = this._addTableEntry;
    }

    this.toggleInputs(true);

    this.previousString = "";
    this.previousFitness = 0;
    this.currentFitness = 0;
    this.currentString = this.generateString();

    this.updatePreviousString();
    this.updateCurrentString();
    this.updatePreviousFitness(this.previousFitness);
    this.updateCurrentFitness(this.previousFitness);
    this.intervalFunction();
    this.intervalFunctionInterval = setInterval(
      this.intervalFunction.bind(this),
      this.elements.iterationSpeed.value
    );
  }

  intervalFunction() {
    this.iterations += 1;
    this.updateIterationCount();
    let { mutatedString, changeIndex, changedCharacter } = this.mutateString(
      this.currentString
    );

    let tmpString = mutatedString;
    let tmpFitness = this.stringFitness(tmpString, this.targetString);
    let tmpCurrentFitness = this.stringFitness(
      this.currentString,
      this.targetString
    );

    let tableStringElement = this.returnMarkedStringElement(
      tmpString,
      changeIndex,
      changedCharacter
    );

    if (tmpFitness > tmpCurrentFitness) {
      tableStringElement.classList.add("bg-info");
      this.previousString = this.currentString;
      this.currentString = tmpString;
      this.previousFitness = this.currentFitness;
      this.currentFitness = tmpFitness;

      this.updatePreviousFitness(this.previousFitness);
      this.updateCurrentFitness(this.currentFitness);
      this.updatePreviousString();
      this.updateCurrentString();
    }

    this.addTableEntry(tableStringElement, tmpFitness);

    if (tmpString === this.targetString) {
      createToast("success", "The string was found", true);
      this.stop();
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
        return;
      }
    }
  }

  addAnchor() {
    let entry = document.createElement("tr");
    entry.classList.add("anchor");
    this.elements.iterationsTable.querySelector("tbody").appendChild(entry);
  }

  reset() {
    this.iterations = 0;
    this.iterationsTarget = undefined;
    this.targetString = "";
    this.elements.iterationCounter.innerText = "0";
    this.elements.targetString.value = "";
    this.elements.iterationCounter.innerTet = "0";
    this.elements.previousFitness.innerText = "";
    this.elements.currentFitness.innerText = "";
    this.elements.previousString.innerText = "";
    this.elements.currentString.innerText = "";
    this.elements.targetStringInView.innerText = "";
    this.elements.targetString.value = "";
    this.elements.checkLowercase.checked = true;
    this.elements.checkUppercase.checked = false;
    this.elements.checkNumbers.checked = false;
    this.elements.terminationSelect.value = "0";
    this.elements.iterationRange.value = "500";
    this.elements.stringRecords.value = "100";
    this.elements.iterationSpeed.value = "1000";

    this.elements.iterationsTable.querySelector("tbody").replaceChildren();
    this.addAnchor();
    this.updateStringRecords();
    this.updateIterationRange();

    this.updateTerminationMethod();
    this.updateIterationSpeed();
  }

  _addTableEntry(tableElement, fitnessPercent) {
    if (this.entriesCount === this.numberOfEntriesToKeep) {
      this.entriesCount = 0;
      this.elements.iterationsTable.querySelector("tbody").replaceChildren();
      this.addAnchor();
    }
    this.entriesCount += 1;

    let entry = document.createElement("tr");
    let iteration = document.createElement("th");
    let fitness = document.createElement("td");

    iteration.innerText = this.iterations;
    fitness.innerText = `${roundToTwoDecimals(fitnessPercent)}%`;
    entry.appendChild(iteration);
    entry.appendChild(tableElement);
    entry.appendChild(fitness);

    this.elements.iterationsTable
      .querySelector("tbody")
      .insertBefore(
        entry,
        this.elements.iterationsTable
          .querySelector("tbody")
          .querySelector(".anchor").nextElementSibling
      );
  }

  updateCurrentString() {
    this.elements.currentString.innerText = this.currentString;
  }

  updatePreviousString() {
    this.elements.previousString.innerText = this.previousString;
  }

  updateCurrentFitness(fitness) {
    this.elements.currentFitness.innerText = `${roundToTwoDecimals(fitness)}%`;
  }

  updatePreviousFitness(fitness) {
    this.elements.previousFitness.innerText = `${roundToTwoDecimals(fitness)}%`;
  }

  stringFitness(startingString, candidateString) {
    let correctLetters = 0;
    startingString = startingString.split("");
    candidateString = candidateString.split("");
    if (startingString.length !== candidateString.length)
      throw new Error("The strings have different lengths");
    let stringLength = startingString.length;

    for (let i = 0; i < stringLength; i++) {
      if (startingString[i] === candidateString[i]) correctLetters++;
    }
    return ((100 * correctLetters) / stringLength / 100) * 100;
  }

  mutateString(baseString) {
    if (baseString.length === 0) return "";
    baseString = baseString.split("");
    let randomIndex = getRandomInteger(0, baseString.length - 1);
    let previousCharacter = baseString[randomIndex];
    baseString[randomIndex] =
      this.characterSet[getRandomInteger(0, this.characterSet.length - 1)];

    return {
      mutatedString: `${baseString.join("")}`,
      changeIndex: randomIndex,
      changedCharacter: previousCharacter,
    };
  }

  returnMarkedStringElement(string, changeIndex, changeCharacter) {
    let tokenizedString = string.split("");
    let firstHalf = tokenizedString.toSpliced(changeIndex).join("");
    let characterToBeChanged = tokenizedString[changeIndex];
    let secondHalf = tokenizedString.toSpliced(0, changeIndex + 1).join("");

    let element = stringToNode(`<p class="mb-0">${firstHalf}
  <span style="text-decoration: line-through; background-color: red; white-space: pre;"
    >${changeCharacter}</span
  ><span style="background-color: green; white-space: pre;">${characterToBeChanged}</span>${secondHalf}
</p>`);

    return element;
  }

  stringFitness(startingString, candidateString) {
    let correctLetters = 0;
    startingString = startingString.split("");
    candidateString = candidateString.split("");
    if (startingString.length !== candidateString.length)
      throw new Error("The strings have different lengths");
    let stringLength = startingString.length;

    for (let i = 0; i < stringLength; i++) {
      if (startingString[i] === candidateString[i]) correctLetters++;
    }
    return ((100 * correctLetters) / stringLength / 100) * 100;
  }
}

customElements.define("exercise-component-2", ExerciseComponent);

export { ExerciseComponent };
