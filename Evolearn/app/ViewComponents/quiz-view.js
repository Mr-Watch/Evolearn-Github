import { showInfoModal } from "../QuizManager/Utils/info.js";
import { showStatsModal } from "../QuizManager/Utils/stats.js";
import {
  getLockedState,
  getQuizOverride,
  getQuizDefinitions,
} from "../QuizManager/quiz-manager.js";
import { stringToNode } from "../AuxiliaryScripts/utils.js";

class QuizView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Quizzes - Time to test what you learned...";
    this.urlString = "?view=quizView";
    this.quizzesMap = new Map();
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
      <h1 class="m-2">Quizzes</h1>
      <h3 class="m-2" style="text-align: center;">Here you can test all the knowledge that you gathered<br>by answering different types of questions</h3>
      <div class="item_container d-flex flex-row flex-wrap justify-content-center"></div>
      `;

    this.elements = {
      itemContainer: this.querySelector(".item_container"),
    };

    let quizDefinitions = getQuizDefinitions();
    let quizFragment = new DocumentFragment();

    for (let quiz of Object.entries(quizDefinitions)) {
      let lockedState = getLockedState(quiz[0]);

      let quizElement = stringToNode(`
      <div class="quiz card m-3 border" style="width: 20rem;">
      <img
        src="./Images/quiz-svgrepo-com.svg"
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
        <h5 class="card-title">${quiz[1].title}</h5>
        <p class="card-text">${quiz[1].description}</p>
        <p class="card-text">Difficulty : ${quiz[1].difficulty}</p>
        <div
          class="btn-group-vertical w-100"
          role="group"
        >
          <button class="open_quiz_button btn btn-primary"
          onclick="changeView('quiz',${quiz[0].replace(
            "_",
            ""
          )})">Attempt Quiz</button>
          <button class="quiz_info_button btn btn-primary">Quiz Info</button>
          <button class="quiz_stats_button btn btn-primary">Quiz Stats</button>
          <button class="review_quiz_button btn btn-primary"
          onclick="changeView('quizReview',${quiz[0].replace(
            "_",
            ""
          )})">Review Quiz</button>
        </div>
      </div>
    </div>`);

      quizElement.showInfo = () => showInfoModal(quiz[0]);
      quizElement
        .querySelector(".quiz_info_button")
        .addEventListener("click", quizElement.showInfo);

      quizElement.showStats = () => showStatsModal(quiz[0]);
      quizElement
        .querySelector(".quiz_stats_button")
        .addEventListener("click", quizElement.showStats);

      switch (lockedState) {
        case 0:
          quizElement.querySelector(".lock").classList.remove("d-none");
          quizElement.querySelector(".open_quiz_button").disabled = true;
          quizElement.querySelector(".quiz_info_button").disabled = true;
          quizElement.querySelector(".quiz_stats_button").disabled = true;
          quizElement.querySelector(".review_quiz_button").disabled = true;

          quizElement.querySelector(".icon").classList.add("gray_out");
          break;
        case 2:
          quizElement.querySelector(".review_quiz_button").disabled = true;
          break;
      }

      if (getQuizOverride()) {
        quizElement.querySelector(".open_quiz_button").disabled = false;
      }

      quizFragment.appendChild(quizElement);
      this.quizzesMap.set(quiz[0], quizElement);
    }
    this.elements.itemContainer.appendChild(quizFragment);
  }

  updateQuizzes() {
    this.connectedCallback();
  }
}

customElements.define("quiz-view", QuizView);

export { QuizView };
