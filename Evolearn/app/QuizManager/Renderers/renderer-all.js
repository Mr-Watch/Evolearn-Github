import {
  CheckBoxSelectComponent,
  InputComponent,
  MultipleChoiceComponent,
  TrueFalseComponent,
} from "../quiz-question-components.js";
import { arrayShuffle } from "../../AuxiliaryScripts/utils.js";

class RendererAll {
  constructor(quiz, container) {
    this.questions = quiz.questions;
    this.container = container;
    this.configuration = quiz.configuration;
    if (quiz.configuration.random_order) {
      this.questions = arrayShuffle(this.questions);
    }
  }

  render() {
    let documentFragment = new DocumentFragment();

    for (let index = 0; index < this.questions.length; index++) {
      switch (this.questions[index].type) {
        case "true_false":
          documentFragment.appendChild(
            new TrueFalseComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          break;
        case "multiple_choice":
          documentFragment.appendChild(
            new MultipleChoiceComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          break;
        case "check_box_select":
          documentFragment.appendChild(
            new CheckBoxSelectComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          break;
        case "input":
          documentFragment.appendChild(
            new InputComponent(
              index,
              this.questions[index],
              this.configuration.show_hints,
              this.configuration.allow_answer_checking,
              this.configuration.allow_question_reset
            )
          );
          break;
      }
    }

    this.container.appendChild(documentFragment);
  }

  dispose() {
    this.questions = null;
    this.container = null;
    this.configuration = null;
  }
}

export { RendererAll };
