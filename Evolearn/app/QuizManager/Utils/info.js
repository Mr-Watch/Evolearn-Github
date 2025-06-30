import { createModal } from "../../ModalManager/modal-manager.js";
import { stringToNode, stringToStyleSheetNode } from "../../AuxiliaryScripts/utils.js";
import { getQuizJson } from "../quiz-manager.js";

function showInfoModal(quizSelector) {
  try {
    if (quizSelector.startsWith("_")) {
      quizSelector = quizSelector.slice(1);
    }
  } catch (error) {}
  getQuizJson(quizSelector, prepareInfoModal);
}

function prepareInfoModal(data) {
  let questionNumber = data.questions.length;
  openInfoModal(data.info, questionNumber, data.configuration);
}

function openInfoModal(info, questionNumber, configuration) {
  function boolToYesNo(value) {
    return value ? "Yes" : "No";
  }

  let element = stringToNode(`
    <div class="quiz_info">
        <p>Description : ${info.description}</p>
        <hr />
        <p>Difficulty : ${info.difficulty}</p>
        <hr />
        <p>Number of questions : ${questionNumber}</p>
        <hr />
        <p>Quiz passing score is  ${configuration.passing_score}%</p>
        <hr />
        <p>Correct answers add  ${
          configuration.negative_scoring[1]
        }<br>Wrong answers subtract  -${configuration.negative_scoring[0]}</p>
        <hr />
        <p>Are user notifications enabled ?    ${boolToYesNo(
          configuration.allow_answer_checking
        )}</p>
        <hr />
        <p>Are questions randomized ?    ${boolToYesNo(
          configuration.random_order
        )}</p>
        <hr />
        <p>Is user allowed to check answers ?    ${boolToYesNo(
          configuration.allow_answer_checking
        )}</p>
        <hr />
        <p>Is user allowed to reset questions ?    ${boolToYesNo(
          configuration.allow_question_reset
        )}</p>
        <hr />
        <p>Are hints allowed ?    ${boolToYesNo(configuration.show_hints)}</p>
        <hr />
        </div>
        `);

  if (configuration.quiz_unlock !== undefined) {
    element.appendChild(
      stringToNode(
        `<p>Score needed to unlock next quiz is ${configuration.quiz_unlock}%</p>`
      )
    );
  }
  element.appendChild(
    stringToStyleSheetNode(`
      .quiz_info {
          text-align: center;
        }
      .quiz_info>p{
        white-space: pre;
        margin: 0;
      }
      .quiz_info>hr{
        margin: 0.3rem;
      }
      `)
  );
  createModal("Quiz Info", element, undefined, undefined, undefined, true);
}

export { showInfoModal };
