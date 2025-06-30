import { enableViewManager } from "../AuxiliaryScripts/view-manager.js";
import { elementIsVisibleInViewport } from "../AuxiliaryScripts/utils.js";
import { QuizViewerComponent } from "./quiz-viewer-component.js";

class QuizReviewComponent extends QuizViewerComponent {
  constructor(quizSelector) {
    super(quizSelector, {
      show: "all",
      passing_score: 0,
      negative_scoring: [1, 1],
      show_hints: true,
      allow_answer_checking: false,
      allow_question_reset: false,
      random_order: false,
      timer: 0,
      notify_user: false,
    });

    this.confirmationInterval = setInterval(
      this.attemptToConfirm.bind(this),
      500
    );
  }

  attemptToConfirm() {
    try {
      this.confirmedFinishQuiz();
      clearInterval(this.confirmationInterval);
    } catch (error) {}
  }

  confirmedFinishQuiz() {
    if (this.timer !== undefined) {
      this.timer.clearTimer();
    }

    Object.values(
      this.elements.container.querySelectorAll(".question")
    ).forEach((question) => {
      question.answerQuestion();
      question.elements.hintButton.click();
    });

    Object.values(
      this.elements.container.querySelectorAll(".question")
    ).forEach((question) => question.checkQuestion());

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
    this.elements.container.children[0].scrollIntoView(false);
    if (
      !elementIsVisibleInViewport(this.elements.container.children[0], true)
    ) {
      setTimeout(
        () => this.elements.container.children[0].scrollIntoView(false),
        500
      );
    }
  }

  updatePercentage() {}
}

customElements.define("quiz-review-component", QuizReviewComponent);

export { QuizReviewComponent };
