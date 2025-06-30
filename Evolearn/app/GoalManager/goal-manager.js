import { unlockExercise } from "../ExerciseManager/exercise-manager.js";
import { fetchJson } from "../Fetcher/fetcher.js";
import { updateExerciseView } from "../AuxiliaryScripts/view-manager.js";
import {
  getOccurrence,
  lsg,
  lss,
} from "../AuxiliaryScripts/utils.js";

const goalFilesRoot = "/ContentFiles/ExerciseContentFiles/Goals/";

function getGoalsJson(exerciseSelector, callback) {
  if (!exerciseGoalsExist(exerciseSelector)) {
    lss(`eg-${exerciseSelector}`, JSON.stringify({}));
    fetchJson(`${goalFilesRoot}exercise_${exerciseSelector}.json`, (data) =>
      setGoalsInLocalStorage(data, exerciseSelector)
    );
  } else {
    fetchJson(`${goalFilesRoot}exercise_${exerciseSelector}.json`, (data) =>
      mergePotentialChanges(data, exerciseSelector)
    );
  }

  fetchJson(`${goalFilesRoot}exercise_${exerciseSelector}.json`, callback);
}

function setGoalsInLocalStorage(data, exerciseSelector) {
  let goals ={}
  let goalIds = Object.keys(data);
  for (let index = 0; index < goalIds.length; index++) {
    goals[goalIds[index]] = false;
  }

  lss(`eg-${exerciseSelector}`, JSON.stringify(goals));
}

function mergePotentialChanges(data, exerciseSelector) {
  let goals = JSON.parse(lsg(`eg-${exerciseSelector}`));
  let goalIds = Object.keys(goals);
  let newGoalIds = Object.keys(data);
  let newGoals = {};

  for (let index = 0; index < newGoalIds.length; index++) {
    if (newGoalIds.includes(goalIds[index])) {
      newGoals[newGoalIds[index]] = Object.entries(goals)[index][1]
    } else {
      newGoals[newGoalIds[index]] = false;
    }
  }
  lss(`eg-${exerciseSelector}`, JSON.stringify(newGoals));
}

function activateGoalInLocalStorage(exerciseSelector, goalSelector) {
  let goals = JSON.parse(lsg(`eg-${exerciseSelector}`));

  if (goals[goalSelector] !== undefined) {
    goals[goalSelector] = true;
    lss(`eg-${exerciseSelector}`, JSON.stringify(goals));
  } else {
    throw Error("Tried to activate non existent goal.");
  }

  goals = JSON.parse(lsg(`eg-${exerciseSelector}`));
  let activatedGoals = getOccurrence(Array(Object.entries(goals)).flat().flat(), true);

  if (Object.keys(goals).length === activatedGoals) {
    unlockExercise(exerciseSelector);
    updateExerciseView();
    return;
  }
}

function returnGoalsFromLocalStorage(exerciseSelector) {
  return JSON.parse(lsg(`eg-${exerciseSelector}`));
}

function exerciseGoalsExist(selector) {
  if (lsg(`eg-${selector}`) === null) {
    return false;
  }
  return true;
}

export {
  getGoalsJson,
  activateGoalInLocalStorage,
  returnGoalsFromLocalStorage,
};
