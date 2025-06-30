import {
  createLoadingScreen,
  removeLoadingScreen,
} from "../LoadingScreen/loading-screen-component.js";
import { createModal } from "../ModalManager/modal-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";
import {
  closeView,
  disableViewManager,
  enableViewManager,
  updateQuizView,
} from "../AuxiliaryScripts/view-manager.js";
import {
  getOccurrence,
  roundToTwoDecimals,
  stringToNode,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";
import { returnFinalResultsModalElement } from "./Utils/final-results.js";
import {
  getLockedState,
  getQuizOverride,
  getQuizJson,
  unlockQuiz,
  updateCanceled,
  updateFailed,
  updatePassed,
} from "./quiz-manager.js";
import { RendererAll } from "./Renderers/renderer-all.js";
import { RendererOne } from "./Renderers/renderer-one.js";
import { RendererSplit } from "./Renderers/renderer-split.js";
import { Timer } from "./Utils/timer.js";
import { showInfoModal } from "./Utils/info.js";

class QuizViewerComponent extends HTMLElement {
  constructor(quizSelector, configuration = undefined, language = "en") {
    super();
    this.quizSelector = quizSelector;
    this.language = language;
    this.languageDefinitions = {
      el: {
        timeRemaining: "Υπόλοιπος χρόνος -- ",
        finishQuizButton: "Ολοκλήρωση Κουίζ",
        cancelAndExitButton: "Ακύρωση Κουίζ",
        lockedState: "Πρέπει να ξεκλειδώσετε το προηγούμενο κουίζ πρώτα",
        yes: "Ναι",
      },
      en: {
        timeRemaining: "Time Remaining -- ",
        finishQuizButton: "Finish Quiz",
        cancelAndExitButton: "Cancel And Exit",
        lockedState: "You need to unlock the previous quiz first",
        yes: "Yes",
      },
    };

    if (configuration !== undefined) {
      this.configurationOverride = configuration;
    }
    this.getQuiz(quizSelector);
  }
  getQuiz(quizSelector) {
    getQuizJson(quizSelector, this.renderQuiz.bind(this));
    this.urlString = `?view=quiz&item=${quizSelector}`;
  }

  renderQuiz(data) {
    this.quiz = data;
    this.connectedCallback();
  }

  connectedCallback() {
    if (this.quiz === undefined) {
      return;
    }
    this.documentTitle = this.quiz.info.title;
    document.title = this.quiz.info.title;

    if (getLockedState(`_${this.quizSelector}`) === 0 && !getQuizOverride()) {
      createToast(
        "warning",
        this.languageDefinitions[this.language].lockedState,
        true
      );
      closeView();
      return;
    }

    createLoadingScreen(this);
    disableViewManager();
    this.questionNumber = this.quiz.questions.length;
    this.info = this.quiz.info;
    if (this.configurationOverride !== undefined) {
      this.configuration = this.configurationOverride;
      this.quiz.configuration = this.configurationOverride;
    } else {
      this.configuration = this.quiz.configuration;
    }

    this.classList.add(
      "quiz_viewer",
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100"
    );

    this.innerHTML += `
    <nav
      class="navbar shadow bg-body-secondary ps-3 p-1 flex-nowrap justify-content-start"
    >
      <p role="button" class="title navbar-brand fs-4 mb-0">${
        this.info.title
      }</p>
      <div class="progress w-100 bg-body-tertiary me-3" role="progressbar">
        <div class="progress-bar" style="width: 0%">0%</div>
      </div>
      <label class="me-2">
      <select class="form-select w-auto" name="language_select">
        <option selected value="en">En</option>
        <option value="el">Ελ</option>
      </select>
    </label>
      <p class="time_remaining navbar-brand fs-6 ms-1 mb-0 d-none">
        <span>${
          this.languageDefinitions[this.language].timeRemaining
        }</span><span class="time"></span>
      </p>
    </nav>
    <div class="content_container">
      <div class="container_item d-flex flex-column align-items-center">
      </div>
    </div>
    <footer
      class="d-flex flex-wrap align-items-center justify-content-between p-2 bg-body-secondary"
    >
      <button class="cancel_and_exit btn btn-primary d-flex align-content-center">
        <span>${
          this.languageDefinitions[this.language].cancelAndExitButton
        }</span>
        <span class="material-icons ps-2"> delete_forever </span>
      </button>
      <ul class="pagination mb-0">
      </ul>
      
      <button class="finish_quiz btn btn-primary d-flex align-content-center">
        <span>${this.languageDefinitions[this.language].finishQuizButton}</span>
        <span class="material-icons ps-2"> check </span>
      </button>
    </footer>`;

    this.appendChild(
      stringToStyleSheetNode(`

      .question {
        display: block;
        max-width: 50rem;
        width: 100%;
      }

      .content_container {
        position: relative;
        flex: 1 1 auto;
      }
      
      .container_item {
      overflow: auto;
      position: absolute;
      height: 100%;
      width: 100%;
    }

    ._form-check {
      margin-left: -1rem;
    }

    .flash_timer {
      animation: flash_timer_animation 0.5s linear;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }
    
    @keyframes flash_timer_animation {
      0% {
      }
      100% {
        color: red;
      }
    }`)
    );

    this.elements = {
      title: this.querySelector(".title"),
      progressBar: this.querySelector(".progress-bar"),
      timeRemaining: this.querySelector(".time_remaining"),
      languageSelect: this.querySelector('[name="language_select"]'),
      time: this.querySelector(".time"),
      container: this.querySelector(".container_item"),
      pagination: this.querySelector(".pagination"),
      finishQuizButton: this.querySelector(".finish_quiz"),
      cancelAndExitButton: this.querySelector(".cancel_and_exit"),
    };

    if (this.configuration.timer !== 0) {
      this.timer = new Timer(
        this.configuration.timer,
        this.configuration.notify_user,
        this.elements.time,
        this.confirmedFinishQuiz.bind(this)
      );
    }

    switch (this.configuration.show) {
      case "all":
        this.renderComponent = new RendererAll(
          this.quiz,
          this.elements.container
        );
        break;

      case "one":
        this.renderComponent = new RendererOne(
          this.quiz,
          this.elements.container,
          this.language
        );
        break;
      case "split":
        if (this.configuration.split_number >= this.questionNumber) {
          this.renderComponent = new RendererAll(
            this.quiz,
            this.elements.container
          );
        } else if (this.configuration.split_number === 1) {
          this.renderComponent = new RendererOne(
            this.quiz,
            this.elements.container
          );
        } else {
          this.renderComponent = new RendererSplit(
            this.quiz,
            this.elements.container,
            this.elements.pagination
          );
        }
        break;
    }
    this.renderComponent.render();

    this.answeredArray = new Array(this.questionNumber).fill(2);
    this.answeredNumber = 0;

    this.elements.languageSelect.addEventListener(
      "change",
      this.changeLanguage.bind(this)
    );

    this.elements.title.addEventListener(
      "click",
      this.openInfoModal.bind(this)
    );

    this._cancelAndExit = this.cancelAndExit.bind(this);
    this.elements.cancelAndExitButton.addEventListener(
      "click",
      this._cancelAndExit
    );

    this._finishQuiz = this.finishQuiz.bind(this);
    this.elements.finishQuizButton.addEventListener("click", this._finishQuiz);

    if (this.timer !== undefined) {
      this.elements.timeRemaining.classList.remove("d-none");
      this.timer.starTimer();
    }

    removeLoadingScreen(this);
  }

  changeLanguage() {
    let language = this.elements.languageSelect.value;
    this.language = language;
    this.elements.timeRemaining.firstElementChild.innerText =
      this.languageDefinitions[this.language].timeRemaining;
    this.elements.cancelAndExitButton.firstElementChild.innerText =
      this.languageDefinitions[this.language].cancelAndExitButton;
    this.elements.finishQuizButton.firstElementChild.innerText =
      this.languageDefinitions[this.language].finishQuizButton;
    if (this.timer !== undefined) {
      this.timer.changeLanguage(this.language);
    }
    Object.values(
      this.elements.container.querySelectorAll(".question")
    ).forEach((question) => question.changeLanguage(language));

    if (this.configuration.show === "one") {
      this.renderComponent.changeLanguage(this.language);
    }
  }

  openInfoModal() {
    showInfoModal(this.quizSelector, this.language);
  }

  updatePercentage(questionId, answer, intent) {
    this.answeredArray[questionId] = answer;

    switch (intent) {
      case "add":
        this.answeredNumber += 1;
        break;
      case "sub":
        this.answeredNumber -= 1;
        break;
    }

    this.currentCompletionPercent =
      (this.answeredNumber * 100) / this.questionNumber;

    this.elements.progressBar.innerText = `${roundToTwoDecimals(
      this.currentCompletionPercent
    )}%`;
    this.elements.progressBar.style.width = `${roundToTwoDecimals(
      this.currentCompletionPercent
    )}%`;
  }

  finishQuiz() {
    let message = "";

    if (this.language === "en") {
      message =
        getOccurrence(this.answeredArray, 2) !== 0
          ? `
    You seem to have some unanswered questions.
    <br>Are you sure you want to finish with the quiz ?`
          : `Are you sure you want finish this quiz ?
    <br>You wont be able to change the answers you have given.`;
    } else {
      message =
        getOccurrence(this.answeredArray, 2) !== 0
          ? `
    Έχετε κάποιες αναπάντητες ερωτήσεις.
    <br>Είστε σίγουρος ότι θέλετε να ολοκληρώσετε το κουίζ ?`
          : `Είστε σίγουρος ότι θέλετε να ολοκληρώσετε το κουίζ ?.
    <br>Δεν θα μπορείτε να κάνετε περαιτέρω αλλαγές στις απαντήσεις που δώσατε.`;
    }

    let tmpButton = stringToNode(`
    <button class="confirm_exit btn btn-primary d-flex align-content-center">
    ${this.languageDefinitions[this.language].yes}
    <span class="material-icons ps-2"> check </span>
  </button>`);
    tmpButton.addEventListener("click", this.confirmedFinishQuiz.bind(this), {
      once: true,
    });
    createModal(
      this.language === "en"
        ? "Do you want to finish the quiz ?"
        : "Θέλετε να ολοκληρώσετε το κουίζ ?",
      message,
      tmpButton,
      "chime"
    );
  }

  confirmedFinishQuiz() {
    try {
      document.querySelector(".modal-header .btn-close").click();
    } catch (error) {}

    if (this.timer !== undefined) {
      this.timer.clearTimer();
    }

    Object.values(
      this.elements.container.querySelectorAll(".question")
    ).forEach((question) => question.checkQuestion());

    this.unanswered = getOccurrence(this.answeredArray, 2);
    this.correct = getOccurrence(this.answeredArray, 1);
    this.wrong = getOccurrence(this.answeredArray, 0);

    let factorWrong = this.configuration.negative_scoring[0];
    let factorCorrect = this.configuration.negative_scoring[1];

    this.final =
      ((this.correct * factorCorrect - this.wrong * factorWrong) /
        (this.questionNumber * factorCorrect)) *
      100;

    if (this.final < 0) {
      this.final = 0;
    }

    this.passOrFail =
      this.final >= this.configuration.passing_score ? "Passed" : "Failed";

    if (this.passOrFail === "Passed") {
      unlockQuiz(`_${this.quizSelector}`, 1);
      updateQuizView();
      updatePassed(this.quizSelector, roundToTwoDecimals(this.final));
    } else {
      updateFailed(this.quizSelector, roundToTwoDecimals(this.final));
    }

    if (
      this.configuration.quiz_unlock !== undefined &&
      this.final >= this.configuration.quiz_unlock
    ) {
      unlockQuiz(`_${this.quizSelector}`, 2, true);
      updateQuizView();
    }

    createModal(
      this.language === "en" ? "Final Result" : "Τελικό Αποτέλεσμα",
      returnFinalResultsModalElement(
        {
          passOrFail: this.passOrFail,
          final: this.final,
          unanswered: this.unanswered,
          correct: this.correct,
          wrong: this.wrong,
        },
        this.language
      ),
      undefined,
      "success",
      "undefined",
      true
    );

    this.elements.finishQuizButton.removeEventListener(
      "click",
      this._finishQuiz
    );
    this.elements.finishQuizButton.classList.add("invisible");

    this.elements.cancelAndExitButton.removeEventListener(
      "click",
      this._cancelAndExit
    );

    this.elements.cancelAndExitButton.classList.add("invisible");
    enableViewManager();
  }

  cancelAndExit() {
    let tmpButton = stringToNode(`
    <button class="confirm_exit btn btn-primary d-flex align-content-center">
    ${this.languageDefinitions[this.language].yes}
    <span class="material-icons ps-2"> check </span>
  </button>`);
    tmpButton.addEventListener(
      "click",
      this.confirmedCancelAndExit.bind(this),
      {
        once: true,
      }
    );
    if (this.language === "en") {
      createModal(
        "Are you sure you want to Exit ?",
        `Any progress on the quiz will be lost.
        <br>You can not undo this action.`,
        tmpButton,
        "chime"
      );
    } else {
      createModal(
        "Είστε σίγουρος ότι θέλετε να ακυρώσετε το κουίζ ?",
        `Όλη η πρόοδος σας στο κουίζ θα χαθεί.
        <br>Δεν μπορείτε να αναιρέσετε την συγκεκριμενη πράξη.`,
        tmpButton,
        "chime"
      );
    }
  }

  confirmedCancelAndExit() {
    if (this.timer !== undefined) {
      this.timer.clearTimer();
    }

    updateCanceled(this.quizSelector);

    document.querySelector(".modal-header .btn-close").click();
    enableViewManager();
    closeView();
  }
}

customElements.define("quiz-viewer-component", QuizViewerComponent);

export { QuizViewerComponent };
