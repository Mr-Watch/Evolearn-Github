import { createToast } from "../ToastManager/toast-manager.js";

class QuestionTemplateComponent extends HTMLElement {
  constructor(
    questionId,
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed,
    language = "en"
  ) {
    super();
    this.questionId = questionId;
    this.questionTitle = "";
    this.hint = "";
    this.isHintAllowed = isHintAllowed;
    this.isCheckingAllowed = isCheckingAllowed;
    this.isQuestionResetAllowed = isQuestionResetAllowed;

    this.language = language;
    this.languageDefinitions = {
      el: {
        question: "Ερώτηση ",
        hint: "Θα θέλατε μια βοήθεια?",
        hintBody: "Δεν υπάρχει διαθέσιμη βοήθεια για αυτή την ερώτηση",
        explanationBody: "Δεν υπάρχει διαθέσιμη εξήγηση για αυτή την ερώτηση",
        clearButton: "Καθαρισμός Επιλογών",
        checkButton: "Έλεγχος Ερώτησης",
        emptySelection:
          "Πρέπει να επιλέξετε μια επιλογή για να γίνει ο έλεγχος",
        reference: "Παράρτημα Επεξήγησης",
      },
      en: {
        question: "Question ",
        hint: "Would you like a hint?",
        hintBody: "There is no available hint for this question",
        explanationBody: "There is no available explanation for this question",
        clearButton: "Clear Selections",
        checkButton: "Check Question",
        emptySelection:
          "You need to select an answer before you can check the question",
        reference: "Explanation Reference",
      },
    };
  }

  connectedCallback() {
    this.classList.add("question");
    this.innerHTML = `<div class="card m-3 shadow">
    <div class="card-header d-flex justify-content-between">
      <p class="question_title mb-0 bg-body align-self-center border border-0 border-start border-body p-1 ps-2 pe-2 rounded-end bg-body" style="margin-left: -17px;"><span>${
        this.languageDefinitions[this.language].question
      }</span><span>${this.questionId + 1}</span></p>
      <button id="hint_button_${this.questionId}" title="${
      this.languageDefinitions[this.language].hint
    }" class="btn pb-0 bg-primary" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse_hint_${this.questionId}">
        <span class="material-icons">
          support
        </span>
      </button>
    </div>
    <div class="card-body">
      <h5 class="card-title"></h5>
      <p class="card-text"></p>
      <div id="options_${this.questionId}">
      </div>
      <div class="collapse mt-3" id="collapse_hint_${this.questionId}">
        <div class="hint_body card card-body">
          ${this.languageDefinitions[this.language].hintBody}
        </div>
      </div>
      <div class="collapse mt-3" id="collapse_explanation_${this.questionId}">
        <div class="alert alert-info">
        <span>${this.languageDefinitions[this.language].explanationBody}</span>
        <span></span>
        </div>
      </div>
    </div>
    <div class="card-footer text-body-secondary d-flex justify-content-end">
      <button id="clear_selection_${
        this.questionId
      }" class="btn btn-primary d-flex d-none"><span>${
      this.languageDefinitions[this.language].clearButton
    }</span><span class="material-icons ps-2">
          backspace
        </span></button>
      <button id="check_question_${
        this.questionId
      }" class="btn btn-primary d-flex ms-3 d-none">
      <span>${this.languageDefinitions[this.language].checkButton}</span>
      <span class="material-icons ps-2">
          check
        </span></button>
    </div>
  </div>`;

    this.elements = {
      cardQuestionTitle: this.querySelector(".card-title"),
      options: this.querySelector(`#options_${this.questionId}`),
      text: this.querySelector(".card-text"),
      hint: this.querySelector(`#collapse_hint_${this.questionId}`)
        .firstElementChild,
      hintButton: this.querySelector(`#hint_button_${this.questionId}`),
      explanation: this.querySelector(
        `#collapse_explanation_${this.questionId}`
      ).firstElementChild,
      clearButton: this.querySelector(`#clear_selection_${this.questionId}`),
      checkButton: this.querySelector(`#check_question_${this.questionId}`),
    };

    this.elements.text.innerText = this.questionTitle[this.language];
    if (this.hint !== undefined && this.isHintAllowed) {
      this.elements.hint.innerText = this.hint[this.language];
    } else if (!this.isHintAllowed) {
      this.elements.hintButton.classList.add("disabled");
    }

    if (this.isCheckingAllowed) {
      this.elements.checkButton.classList.remove("d-none");
      this._checkQuestion = this.checkQuestion.bind(this);
      this.elements.checkButton.addEventListener("click", this._checkQuestion);
    }

    try {
      this.collapseExplanation = new bootstrap.Collapse(
        `#collapse_explanation_${this.questionId}`,
        {
          toggle: false,
        }
      );
    } catch (error) {}

    this._alertParent = this.alertParent.bind(this);
    this.elements.options.addEventListener("click", this._alertParent);

    if (this.isQuestionResetAllowed) {
      this.elements.clearButton.classList.remove("d-none");
      this._clearSelection = this.clearSelection.bind(this);
      this.elements.clearButton.addEventListener("click", this._clearSelection);
    }
  }

  changeLanguage(language) {
    this.language = language;
    this.elements.text.innerText = this.questionTitle[language];
    this.querySelector(".question_title").firstElementChild.innerText =
      this.languageDefinitions[language].question;
    this.elements.hint.title = this.languageDefinitions[language].hint;
    this.elements.checkButton.firstElementChild.innerText =
      this.languageDefinitions[language].checkButton;
    this.elements.clearButton.firstElementChild.innerText =
      this.languageDefinitions[language].clearButton;
  }

  addBorder(color) {
    this.firstElementChild.classList.add("border");
    this.firstElementChild.classList.add(`border-${color}`);
    this.firstElementChild.firstElementChild.classList.add(`bg-${color}`);
  }

  resetBoarder(color) {
    this.firstElementChild.classList.remove("border");
    this.firstElementChild.classList.remove(`border-${color}`);
    this.firstElementChild.firstElementChild.classList.remove(`bg-${color}`);
  }
}

class QuestionSingleSelectionComponent extends QuestionTemplateComponent {
  constructor(
    questionId,
    { title, hint, explanation, explanation_reference, answer },
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed
  ) {
    super(questionId, isHintAllowed, isCheckingAllowed, isQuestionResetAllowed);
    this.questionTitle = title;
    this.hint = hint;
    this.explanation = explanation;
    this.explanationReference = explanation_reference;
    this.answer = answer;
    this.questionInteracted = false;
  }

  changeLanguage(language) {
    super.changeLanguage(language);
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[language].cardQuestionTitle;
      try {
      this.querySelector(".hint_body").innerText = this.hint[language];
      this.querySelector(".reference").innerText =
        this.languageDefinitions[this.language].reference;
    } catch (error) {}
  }

  disableComponent() {
    this.elements.clearButton.classList.add("disabled");
    if (this.isQuestionResetAllowed) {
      this.elements.clearButton.removeEventListener(
        "click",
        this._clearSelection
      );
    }
    this.elements.checkButton.classList.add("disabled");
    this.elements.checkButton.removeEventListener("click", this._checkQuestion);
    this.elements.selections.forEach((element) => {
      element.setAttribute("disabled", true);
    });
  }

  checkQuestion(event) {
    if (event !== undefined && !this.hasSelection()) {
      createToast(
        "info",
        this.languageDefinitions[this.language].emptySelection,
        true
      );
      return;
    }

    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
      if (this.explanationReference !== undefined) {
        this.elements.explanation.children[1].innerHTML = `<br><p class="reference" role="button" class="m-0" onclick="changeView('pdf',${
          this.explanationReference[0]
        },'${this.explanationReference[1]}',${this.explanationReference[2]},${
          this.explanationReference[3]
        })">${this.languageDefinitions[this.language].reference}</p>`;
      }
    }

    if (!this.isCheckingAllowed) {
      this.elements.checkButton.click();
    }

    this.collapseExplanation.show();
    this.disableComponent();

    if (!this.hasSelection()) {
      this.addBorder("info");
      return;
    }

    if (this.elements.selections[Number(this.answer)].checked) {
      this.addBorder("success");
    } else {
      this.addBorder("danger");
    }
  }

  answerQuestion() {
    this.elements.selections[Number(this.answer)].checked = true;
  }

  alertParent() {
    if (this.hasSelection()) {
      if (!this.questionInteracted) {
        this.addBorder("primary");
        this.questionInteracted = true;
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.elements.selections[Number(this.answer)].checked ? 1 : 0,
          "add"
        );
      } else {
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.elements.selections[Number(this.answer)].checked ? 1 : 0,
          "noc"
        );
      }
    }
  }

  hasSelection() {
    for (const element of this.elements.selections) {
      if (element.checked) {
        return true;
      }
    }
    return false;
  }

  answerQuestion() {
    this.elements.selections[Number(this.answer)].checked = true;
  }

  clearSelection() {
    if (this.hasSelection()) {
      this.questionInteracted = false;
      this.elements.selections.forEach((element) => {
        element.checked = false;
      });
      this.resetBoarder("primary");
      this.closest(".quiz_viewer").updatePercentage(this.questionId, 2, "sub");
    }
  }
}

class TrueFalseComponent extends QuestionSingleSelectionComponent {
  constructor(
    questionId,
    { title, hint, explanation, explanation_reference, answer },
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed
  ) {
    super(
      questionId,
      { title, hint, explanation, explanation_reference, answer },
      isHintAllowed,
      isCheckingAllowed,
      isQuestionResetAllowed
    );
    this.languageDefinitions.el.cardQuestionTitle =
      "Είναι η ερώτηση Λάθος ή Σωστή ?";
    this.languageDefinitions.en.cardQuestionTitle =
      "Is this question False or True ?";
    this.languageDefinitions.el.true = "Σωστή";
    this.languageDefinitions.en.true = "True";
    this.languageDefinitions.el.false = "Λάθος";
    this.languageDefinitions.en.false = "False";
  }

  connectedCallback() {
    super.connectedCallback();
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[this.language].cardQuestionTitle;
    this.elements.options.innerHTML = `<div class="_form-check">
    <label class="form-check-label d-block ms-2 ps-2">
    <input class="form-check-input" type="radio" name="true_false_${
      this.questionId
    }" id="true_false_1_${this.questionId}">
    <span>${this.languageDefinitions[this.language].false}</span>
    </label>
    </div>
    <div class="_form-check">
    <label class="form-check-label d-block ms-2 ps-2">
    <input class="form-check-input" type="radio" name="true_false_${
      this.questionId
    }" id="true_false_2_${this.questionId}">
    <span>${this.languageDefinitions[this.language].true}</span>
    </label>
  </div>`;
    this.elements.selections = this.querySelectorAll(
      `[name="true_false_${this.questionId}"]`
    );
  }

  changeLanguage(language) {
    super.changeLanguage(language);
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[language].cardQuestionTitle;
    this.querySelector(
      `#true_false_1_${this.questionId}`
    ).nextElementSibling.innerText = this.languageDefinitions[language].false;
    this.querySelector(
      `#true_false_2_${this.questionId}`
    ).nextElementSibling.innerText = this.languageDefinitions[language].true;
    this.querySelector(".hint_body").innerText = this.hint[language];
    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
    }
    try {
      this.querySelector(".reference").innerText =
        this.languageDefinitions[this.language].reference;
    } catch (error) {}
  }
}

class MultipleChoiceComponent extends QuestionSingleSelectionComponent {
  constructor(
    questionId,
    { title, hint, explanation, explanation_reference, answer, options },
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed
  ) {
    super(
      questionId,
      { title, hint, explanation, explanation_reference, answer },
      isHintAllowed,
      isCheckingAllowed,
      isQuestionResetAllowed
    );
    this.options = options;
    this.languageDefinitions.el.cardQuestionTitle =
      "Ποία από τις επιλογές είναι σωστή ?";
    this.languageDefinitions.en.cardQuestionTitle =
      "Which one of these options is correct ?";
  }

  connectedCallback() {
    super.connectedCallback();
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[this.language].cardQuestionTitle;
    let optionsHtml = "";

    this.options[this.language].forEach((option, index) => {
      optionsHtml += `<div class="_form-check">
      <label class="form-check-label d-block ms-2 ps-2">
      <input class="form-check-input" type="radio" name="multiple_choice_${this.questionId}" id="multiple_choice_${this.questionId}_${index}">
      <span>${option}</span>
      </label>
      </div>
    </div>`;
    });
    this.elements.options.innerHTML = optionsHtml;
    this.elements.selections = this.querySelectorAll(
      `[name="multiple_choice_${this.questionId}"]`
    );
  }

  changeLanguage(language) {
    super.changeLanguage(language);
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[language].cardQuestionTitle;
    let optionsElements =
      this.elements.options.querySelectorAll("._form-check");
    optionsElements.forEach((element, index) => {
      element.firstElementChild.children[1].innerText =
        this.options[language][index];
    });
    this.querySelector(".hint_body").innerText = this.hint[language];
    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
    }
    try {
      this.querySelector(".reference").innerText =
        this.languageDefinitions[this.language].reference;
    } catch (error) {}
  }
}

class CheckBoxSelectComponent extends QuestionSingleSelectionComponent {
  constructor(
    questionId,
    { title, hint, explanation, explanation_reference, answer, options },
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed
  ) {
    super(
      questionId,
      { title, hint, explanation, explanation_reference, answer },
      isHintAllowed,
      isCheckingAllowed,
      isQuestionResetAllowed
    );
    this.options = options;
    this.languageDefinitions.el.cardQuestionTitle =
      "Τσεκάρετε την σωστή ή τις σωστές απαντήσεις";
    this.languageDefinitions.en.cardQuestionTitle =
      "Check the correct answer or answers?";
  }

  connectedCallback() {
    super.connectedCallback();
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[this.language].cardQuestionTitle;
    let checkBoxesHtml = "";

    this.options[this.language].forEach((option, index) => {
      checkBoxesHtml += `<div class="_form-check">
    <label class="form-check-label d-block ms-2 ps-2">
    <input class="form-check-input" type="checkbox" name="checkbox_select_${this.questionId}" id="checkbox_select_${this.questionId}_${index}">
    <span>${option}</span>
    </label>
    </div>
  </div>`;
    });
    this.elements.options.innerHTML = checkBoxesHtml;
    this.elements.selections = this.querySelectorAll(
      `[name="checkbox_select_${this.questionId}"]`
    );
  }

  changeLanguage(language) {
    super.changeLanguage(language);
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[language].cardQuestionTitle;
    let optionsElements =
      this.elements.options.querySelectorAll("._form-check");
    optionsElements.forEach((element, index) => {
      element.firstElementChild.children[1].innerText =
        this.options[language][index];
    });
    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
      this.explanation[this.language];
    }
    try {
      this.querySelector(".hint_body").innerText = this.hint[language];
      this.querySelector(".reference").innerText =
        this.languageDefinitions[this.language].reference;
    } catch (error) {}
  }

  checkQuestion(event) {
    if (event !== undefined && !this.hasSelection()) {
      createToast(
        "info",
        this.languageDefinitions[this.language].emptySelection,
        true
      );
      return;
    }

    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
      if (this.explanationReference !== undefined) {
        this.elements.explanation.children[1].innerHTML = `<br><p class="reference" role="button" class="m-0" onclick="changeView('pdf',${
          this.explanationReference[0]
        },'${this.explanationReference[1]}',${this.explanationReference[2]},${
          this.explanationReference[3]
        })">${this.languageDefinitions[this.language].reference}</p>`;
      }
    }

    if (!this.isCheckingAllowed) {
      this.elements.checkButton.click();
    }

    this.collapseExplanation.show();
    this.disableComponent();

    if (!this.hasSelection()) {
      this.addBorder("info");
      return;
    }

    if (this.determineCorrectness()) {
      this.addBorder("success");
    } else {
      this.addBorder("danger");
    }
  }

  determineCorrectness() {
    let selectedCount = 0;
    this.elements.selections.forEach((item) => {
      if (item.checked) {
        selectedCount += 1;
      }
    });

    this.answer.sort(function (a, b) {
      return a - b;
    });

    if (selectedCount !== this.answer.length) {
      return 0;
    }

    for (let index = 0; index < this.elements.selections.length; index++) {
      if (
        this.elements.selections[index].checked &&
        index === this.answer[index]
      ) {
        continue;
      } else if (
        this.elements.selections[index].checked &&
        index !== this.answer[index]
      ) {
        return 0;
      } else if (
        !this.elements.selections[index].checked &&
        index === this.answer[index]
      ) {
        return 0;
      }
    }

    return 1;
  }

  answerQuestion() {
    for (let index = 0; index < this.elements.selections.length; index++) {
      if (index === this.answer[index]) {
        this.elements.selections[index].checked = true;
      }
    }
  }

  alertParent() {
    if (this.hasSelection()) {
      if (!this.questionInteracted) {
        this.addBorder("primary");
        this.questionInteracted = true;
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.determineCorrectness(),
          "add"
        );
      } else {
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.determineCorrectness(),
          "noc"
        );
      }
    } else if (this.questionInteracted) {
      this.questionInteracted = false;
      this.resetBoarder("primary");
      this.closest(".quiz_viewer").updatePercentage(this.questionId, 2, "sub");
    }
  }
}

class InputComponent extends QuestionTemplateComponent {
  constructor(
    questionId,
    { title, hint, explanation, explanation_reference, answer, example },
    isHintAllowed,
    isCheckingAllowed,
    isQuestionResetAllowed
  ) {
    super(questionId, isHintAllowed, isCheckingAllowed, isQuestionResetAllowed);
    this.questionTitle = title;
    this.hint = hint;
    this.explanation = explanation;
    this.explanationReference = explanation_reference;
    this.answer = answer;
    this.questionInteracted = false;
    this.example = example;
    this.languageDefinitions.el.cardQuestionTitle =
      "Εισάγετε την σωστή από απάντηση στο πεδίο κειμένου";
    this.languageDefinitions.en.cardQuestionTitle =
      "Input the correct answer in the input field";
    this.languageDefinitions.el.inputField =
      "Πληκτρολογήστε την απάντηση σας εδώ";
    this.languageDefinitions.en.inputField = "Type your answer here";
    this.languageDefinitions.el.inputExample = "Παράδειγμα απάντησης : ";
    this.languageDefinitions.en.inputExample = "Example answer : ";
  }

  connectedCallback() {
    super.connectedCallback();
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[this.language].cardQuestionTitle;

    this.elements.options.innerHTML = `
    <div class="form-floating mb-3">
    <input id="input_${
      this.questionId
    }" type="text" class="form-control" placeholder="">
    <label class="input_field">${
      this.languageDefinitions[this.language].inputField
    }</label>
    <p class="mt-3"><span class="input_example">${
      this.languageDefinitions[this.language].inputExample
    }</span><span>${this.example[this.language]}</span></p>
  </div>
  `;
    this.elements.input = this.querySelector("input");

    this._alertParent = this.alertParent.bind(this);
    this.elements.input.addEventListener("change", this._alertParent);
  }

  changeLanguage(language) {
    super.changeLanguage(language);
    this.elements.cardQuestionTitle.innerText =
      this.languageDefinitions[language].cardQuestionTitle;
    this.elements.options.querySelector(".input_example").innerText =
      this.languageDefinitions[language].inputExample;
    this.elements.options.querySelector(
      ".input_example"
    ).nextElementSibling.innerText = this.example[language];
    this.elements.options.querySelector(".input_field").innerText =
      this.languageDefinitions[language].inputExample;
    this.querySelector(".hint_body").innerText = this.hint[language];
    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
    }
    try {
      this.querySelector(".reference").innerText =
        this.languageDefinitions[this.language].reference;
    } catch (error) {}
  }

  hasSelection() {
    return this.elements.input.value === "" ? false : true;
  }

  determineCorrectness() {
    const replacementCharacters = {
      ά: "α",
      έ: "ε",
      ή: "η",
      ί: "ι",
      ϊ: "ι",
      ύ: "υ",
      ϋ: "υ",
      ό: "ο",
      ώ: "ω",
      ς: "σ",
    };
    function simplifyString(string) {
      string = string.toLocaleLowerCase();
      string = string.replaceAll(" ", "");
      string = string.replaceAll(
        /[ά|έ|ή|ί|ύ|ό|ϊ|ϋ|ώ|ς]/g,
        (r) => replacementCharacters[r]
      );
      return string;
    }

    let testingString = this.elements.input.value;
    testingString = simplifyString(testingString);
    this.answer[this.language] = simplifyString(this.answer[this.language]);
    return testingString === this.answer[this.language] ? 1 : 0;
  }

  answerQuestion() {
    this.elements.input.focus();
    this.elements.input.value = this.answer[this.language];
  }

  disableComponent() {
    this.elements.clearButton.classList.add("disabled");
    if (this.isQuestionResetAllowed) {
      this.elements.clearButton.removeEventListener(
        "click",
        this._clearSelection
      );
    }
    this.elements.checkButton.classList.add("disabled");
    this.elements.checkButton.removeEventListener("click", this._checkQuestion);
    this.elements.input.disabled = true;
  }

  checkQuestion(event) {
    if (event !== undefined && !this.hasSelection()) {
      createToast(
        "info",
        this.languageDefinitions[this.language].emptySelection,
        true
      );
      return;
    }

    if (this.explanation !== undefined) {
      this.elements.explanation.children[0].innerText =
        this.explanation[this.language];
      if (this.explanationReference !== undefined) {
        this.elements.explanation.children[1].innerHTML = `<br><p class="reference" role="button" class="m-0" onclick="changeView('pdf',${
          this.explanationReference[0]
        },'${this.explanationReference[1]}',${this.explanationReference[2]},${
          this.explanationReference[3]
        })">${this.languageDefinitions[this.language].reference}</p>`;
      }
    }

    if (!this.isCheckingAllowed) {
      this.elements.checkButton.click();
    }

    this.collapseExplanation.show();
    this.disableComponent();

    if (!this.hasSelection()) {
      this.addBorder("info");
      return;
    }

    if (this.determineCorrectness()) {
      this.addBorder("success");
    } else {
      this.addBorder("danger");
    }
  }

  alertParent() {
    if (this.hasSelection()) {
      if (!this.questionInteracted) {
        this.addBorder("primary");
        this.questionInteracted = true;
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.determineCorrectness(),
          "add"
        );
        return;
      } else {
        this.closest(".quiz_viewer").updatePercentage(
          this.questionId,
          this.determineCorrectness(),
          "noc"
        );
        return;
      }
    } else if (this.questionInteracted) {
      this.questionInteracted = false;
      this.resetBoarder("primary");
      this.closest(".quiz_viewer").updatePercentage(this.questionId, 2, "sub");
    }
  }

  clearSelection() {
    if (this.hasSelection()) {
      this.questionInteracted = false;
      this.elements.input.value = "";
      this.resetBoarder("primary");
      this.closest(".quiz_viewer").updatePercentage(this.questionId, 2, "sub");
    }
  }
}

customElements.define("true-false-component", TrueFalseComponent);
customElements.define("multiple-choice-component", MultipleChoiceComponent);
customElements.define("checkbox-select-component", CheckBoxSelectComponent);
customElements.define("input-component", InputComponent);

export {
  TrueFalseComponent,
  MultipleChoiceComponent,
  CheckBoxSelectComponent,
  InputComponent,
};
