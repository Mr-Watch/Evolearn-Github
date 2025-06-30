import { returnPlainJson } from "../Fetcher/fetcher.js";
import { createToast } from "../ToastManager/toast-manager.js";
import { closeView, updateQuizView } from "../AuxiliaryScripts/view-manager.js";
import {
  arrayShuffle,
  getRandomInteger,
  lsg,
  lss,
  removeItemOnIndex,
  returnIndexOfValue,
} from "../AuxiliaryScripts/utils.js";

const quizFilesUrl = "/ContentFiles/QuizContentFiles/Quizzes/";

let quizDefinitions = {};

async function updateQuizDefinitions() {
  try {
    quizDefinitions = await returnPlainJson(
      "/ContentFiles/QuizContentFiles/quiz_definitions.json"
    );
    generateQuizzesLockedState();
    updateQuizView();
  } catch (error) {
    console.log(error);
  }
}

let quizzesLockedState = JSON.parse(lsg("QuizzesLockedState"));
let userQuizzesLockedState = JSON.parse(lsg("UserQuizzesLockedState"));
let quizOverride = JSON.parse(lsg("QuizOverride"));

if (quizOverride === null) {
  lss("QuizOverride", false);
  quizOverride = false;
} else {
  setQuizOverride(false);
}

await updateQuizDefinitions();

function getQuizDefinitions() {
  return quizDefinitions;
}

async function getQuizJson(selector, callback) {
  let masterQuiz = await returnPlainJson(
    `${quizFilesUrl}quiz_master_file.json`
  );

  let quiz = {};
  let selectedQuestions = [];

  try {
    quiz = await returnPlainJson(`${quizFilesUrl}quiz_${selector}.json`);
  } catch (error) {
    createToast("error", "This quiz does not exist", true);
    closeView();
    return;
  }

  let questionBlueprints = quiz.configuration.questions;

  if (Array.isArray(questionBlueprints)) {
    for (let index = 0; index < questionBlueprints.length; index++) {
      if (typeof questionBlueprints[index] === "string") {
        if (masterQuiz[questionBlueprints[index]] !== undefined) {
          let questions = masterQuiz[questionBlueprints[index]];
          selectedQuestions = selectedQuestions.concat(
            Object.values(questions)
          );
        } else {
          continue;
        }
      } else if (typeof questionBlueprints[index] === "object") {
        let questionGroupObject = questionBlueprints[index];
        let questionGroup = Object.keys(questionGroupObject)[0];
        let questionGroupQuestions = questionGroupObject[questionGroup];

        for (let index = 0; index < questionGroupQuestions.length; index++) {
          if (masterQuiz[questionGroup] !== undefined) {
            let tmpObj = masterQuiz[questionGroup];
            let question = tmpObj[questionGroupQuestions[index]];
            if (question !== undefined) {
              selectedQuestions.push(question);
            }
          } else {
            continue;
          }
        }
      } else {
        continue;
      }
    }
  } else if (typeof questionBlueprints === "number") {
    let questionPool = [];
    let randomIndexes = [];
    let questionGroups = Object.values(masterQuiz);
    for (let index = 0; index < questionGroups.length; index++) {
      questionPool = questionPool.concat(Object.values(questionGroups[index]));
    }
    if (questionBlueprints > questionPool.length) {
      questionBlueprints = questionPool.length;
    }

    for (let index = 0; index < questionBlueprints; index++) {
      randomIndexes.push(index);
    }

    randomIndexes = arrayShuffle(randomIndexes);

    for (let index = 0; index < questionBlueprints; index++) {
      selectedQuestions.push(questionPool[randomIndexes[index]]);
    }
  }

  if (selectedQuestions.length === 0) {
    createToast("warning", "The quiz is empty or invalid", true);
    closeView();
    return;
  }

  quiz.questions = selectedQuestions;
  callback(quiz);
}

function getQuizStats(quizId) {
  let quizStats = lsg(`q-${quizId}`);
  if (quizStats === null) {
    lss(
      `q-${quizId}`,
      JSON.stringify({ passed: 0, failed: 0, canceled: 0, scoreHistory: [] })
    );
    return { passed: 0, failed: 0, canceled: 0, scoreHistory: [] };
  } else {
    return JSON.parse(quizStats);
  }
}

function saveQuizStats(quizId, stats) {
  if (stats !== undefined) {
    lss(`q-${quizId}`, JSON.stringify(stats));
  } else {
    throw Error("The format of quizId is incorrect or no stats was provided.");
  }
}

function updatePassed(quizId, score) {
  let stats = getQuizStats(quizId);
  stats.passed += 1;
  stats.scoreHistory.push(score);
  saveQuizStats(quizId, stats);
}

function updateFailed(quizId, score) {
  let stats = getQuizStats(quizId);
  stats.failed += 1;
  stats.scoreHistory.push(score);
  saveQuizStats(quizId, stats);
}

function updateCanceled(quizId) {
  let stats = getQuizStats(quizId);
  stats.canceled += 1;
  saveQuizStats(quizId, stats);
}

function getQuizOverride() {
  return JSON.parse(lsg("QuizOverride"));
}

function setQuizOverride(value) {
  lss("QuizOverride", value);
  quizOverride = value;
}

function generateQuizzesLockedState() {
  let quizzesLockedStateArray = [];

  if (quizzesLockedState === null) {
    for (let [quizId, quizDefinition] of Object.entries(quizDefinitions)) {
      if (
        quizDefinition.lockedState !== undefined &&
        (quizDefinition.lockedState === 0 ||
          quizDefinition.lockedState === 1 ||
          quizDefinition.lockedState === 2)
      ) {
        quizzesLockedStateArray.push({
          id: quizId,
          lockedState: quizDefinition.lockedState,
        });
      } else {
        quizzesLockedStateArray.push({ id: quizId, lockedState: 0 });
      }
    }
  } else {
    for (let [quizId, quizDefinition] of Object.entries(quizDefinitions)) {
      let existingQuizEntry =
        quizzesLockedState[
          returnIndexOfValue(quizzesLockedState, "id", quizId)
        ];

      if (existingQuizEntry === undefined) {
        if (
          quizDefinition.lockedState !== undefined &&
          (quizDefinition.lockedState === 0 ||
            quizDefinition.lockedState === 1 ||
            quizDefinition.lockedState === 2)
        ) {
          quizzesLockedStateArray.push({
            id: quizId,
            lockedState: quizDefinition.lockedState,
          });
        } else {
          quizzesLockedStateArray.push({ id: quizId, lockedState: 0 });
        }
      } else {
        let userExistingQuizEntry =
          userQuizzesLockedState[
            returnIndexOfValue(userQuizzesLockedState, "id", quizId)
          ];

        if (userExistingQuizEntry !== undefined) {
          if (
            quizDefinition.lockedState !== undefined &&
            userExistingQuizEntry.lockedState !== quizDefinition.lockedState
          ) {
            if (
              quizDefinition.lockedState === 0 ||
              quizDefinition.lockedState === 2
            ) {
              existingQuizEntry.lockedState = userExistingQuizEntry.lockedState;
            } else if (quizDefinition.lockedState === 1) {
              existingQuizEntry.lockedState = quizDefinition.lockedState;
            }
          }
        } else {
          if (
            quizDefinition.lockedState !== undefined &&
            existingQuizEntry.lockedState !== quizDefinition.lockedState
          ) {
            existingQuizEntry.lockedState = quizDefinition.lockedState;
          }
        }
        quizzesLockedStateArray.push(existingQuizEntry);
      }
    }
  }
  if (quizzesLockedStateArray[0].lockedState === 0) {
    quizzesLockedStateArray[0].lockedState = 2;
  }

  if (userQuizzesLockedState === null) {
    lss("UserQuizzesLockedState", JSON.stringify([]));
    userQuizzesLockedState = [];
  }

  lss("QuizzesLockedState", JSON.stringify(quizzesLockedStateArray));
  quizzesLockedState = quizzesLockedStateArray;
}

function getLockedState(quizId) {
  return quizzesLockedState[
    returnIndexOfValue(quizzesLockedState, "id", quizId)
  ].lockedState;
}

function addUserQuizzesLockedStateEntry(index, id, mode) {
  if (userQuizzesLockedState[index] === undefined) {
    userQuizzesLockedState[index] = {
      id: id,
      lockedState: mode,
    };
  } else {
    userQuizzesLockedState[index].lockedState = mode;
  }
  lss("UserQuizzesLockedState", JSON.stringify(userQuizzesLockedState));
}

function unlockQuiz(quizId, mode, next = false) {
  let currentQuizIndex = returnIndexOfValue(quizzesLockedState, "id", quizId);

  if (next) {
    if (quizzesLockedState[currentQuizIndex + 1] !== undefined) {
      quizzesLockedState[currentQuizIndex + 1].lockedState = mode;
      addUserQuizzesLockedStateEntry(
        currentQuizIndex + 1,
        quizzesLockedState[currentQuizIndex + 1].id,
        mode
      );
    } else {
      quizzesLockedState[quizzesLockedState.length - 1].lockedState = 1;
      addUserQuizzesLockedStateEntry(
        currentQuizIndex - 1,
        quizzesLockedState[currentQuizIndex - 1].id,
        1
      );
    }
  } else {
    quizzesLockedState[currentQuizIndex].lockedState = mode;
    addUserQuizzesLockedStateEntry(
      currentQuizIndex,
      quizzesLockedState[currentQuizIndex].id,
      mode
    );
  }

  lss("QuizzesLockedState", JSON.stringify(quizzesLockedState));
}

export {
  updateQuizDefinitions,
  generateQuizzesLockedState,
  getQuizDefinitions,
  getQuizJson,
  getLockedState,
  unlockQuiz,
  getQuizStats,
  updatePassed,
  updateFailed,
  updateCanceled,
  getQuizOverride,
  setQuizOverride,
};
