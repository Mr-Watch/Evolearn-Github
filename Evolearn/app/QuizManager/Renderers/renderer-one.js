import {
  CheckBoxSelectComponent,
  InputComponent,
  MultipleChoiceComponent,
  TrueFalseComponent,
} from "../quiz-question-components.js";
import {
  arrayShuffle,
  stringToNode,
  stringToStyleSheetNode,
} from "../../AuxiliaryScripts/utils.js";

class RendererOne {
  constructor(quiz, container, language = "en") {
    this.questions = quiz.questions;
    this.container = container;
    this.language = language;
    this.configuration = quiz.configuration;
    if (quiz.configuration.random_order) {
      this.questions = arrayShuffle(this.questions);
    }

    this.languageDefinitions = {
      en: { prev: "Previous", next: "Next" },
      el: { prev: "Προηγούμενη", next: "Επόμενη" },
    };
  }

  changeLanguage(language) {
    this.carouselButtons.querySelector(".prev").innerText =
      this.languageDefinitions[language].prev;
    this.carouselButtons.querySelector(".next").innerText =
      this.languageDefinitions[language].next;
  }

  render() {
    this.carouselButtons = stringToNode(`
    <div class="button_group d-flex justify-content-center">
            <button class="btn btn-primary m-2 d-flex align-content-center" type="button" data-bs-target="#questionsCarousel" data-bs-slide="prev">
              <span class="material-icons me-2"> arrow_back </span><span class="prev">${
                this.languageDefinitions[this.language].prev
              }</span>
            </button>
            <button class="btn btn-primary m-2 d-flex align-content-center" type="button" data-bs-target="#questionsCarousel" data-bs-slide="next"><span class="next">${
              this.languageDefinitions[this.language].next
            }</span><span class="material-icons ms-2"> arrow_forward </span>
            </button>
          </div>
    `);

    let carousel = stringToNode(`
    <div id="questionsCarousel" class="carousel slide w-100">
            <div class="carousel-inner">
            </div>
          </div>
    `);

    carousel.appendChild(
      stringToStyleSheetNode(`
      .carousel-item-next, .carousel-item-prev, .carousel-item.active {
        display: flex;
        justify-content: center;
    `)
    );

    let documentFragment = new DocumentFragment();

    for (let index = 0; index < this.questions.length; index++) {
      let carouselItem = stringToNode(`<div class="carousel-item"></div>`);
      switch (this.questions[index].type) {
        case "true_false":
          carouselItem.appendChild(
            new TrueFalseComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          documentFragment.appendChild(carouselItem);
          break;
        case "multiple_choice":
          carouselItem.appendChild(
            new MultipleChoiceComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          documentFragment.appendChild(carouselItem);
          break;
        case "check_box_select":
          carouselItem.appendChild(
            new CheckBoxSelectComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          documentFragment.appendChild(carouselItem);
          break;
        case "input":
          carouselItem.appendChild(
            new InputComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          documentFragment.appendChild(carouselItem);
          break;
      }
    }
    documentFragment.firstElementChild.classList.add("active");

    this.container.appendChild(this.carouselButtons);
    this.container.appendChild(carousel);
    this.container
      .querySelector(".carousel-inner")
      .appendChild(documentFragment);

    this.container.appendChild(documentFragment);
  }

  dispose() {
    this.questions = null;
    this.container = null;
    this.configuration = null;
  }
}

export { RendererOne };
