import { returnPlainJson } from "../Fetcher/fetcher.js";
import { updateExerciseView } from "../AuxiliaryScripts/view-manager.js";
import { lsg, lss, returnIndexOfValue } from "../AuxiliaryScripts/utils.js";

let exerciseDefinitions = {};
let exercisesLockedState = JSON.parse(lsg("ExercisesLockedState"));
let userExercisesLockedState = JSON.parse(lsg("UserExercisesLockedState"));
let exerciseOverride = JSON.parse(lsg("ExerciseOverride"));

async function updateExerciseDefinitions() {
  try {
    exerciseDefinitions = await returnPlainJson(
      `/ContentFiles/ExerciseContentFiles/exercise_definitions.json`
    );
    generateExercisesLockedState();
    updateExerciseView();
  } catch (error) {
    console.log(error);
  }
}

await updateExerciseDefinitions();
generateExercisesLockedState();

if (exerciseOverride === null) {
  lss("ExerciseOverride", true);
  exerciseOverride = true;
} else {
  setExerciseOverride(true);
}

function getExerciseDefinitions() {
  return exerciseDefinitions;
}

function getExerciseOverride() {
  return JSON.parse(lsg("ExerciseOverride"));
}

function setExerciseOverride(value) {
  lss("ExerciseOverride", value);
  exerciseOverride = value;
}

function generateExercisesLockedState() {
  let exercisesLockedStateArray = [];

  if (exercisesLockedState === null) {
    for (let [exerciseId, exerciseDefinition] of Object.entries(
      exerciseDefinitions
    )) {
      if (
        exerciseDefinition.lockedState !== undefined &&
        (exerciseDefinition.lockedState === 0 ||
          exerciseDefinition.lockedState === 1)
      ) {
        exercisesLockedStateArray.push({
          id: exerciseId,
          lockedState: exerciseDefinition.lockedState,
        });
      } else {
        exercisesLockedStateArray.push({ id: exerciseId, lockedState: 0 });
      }
    }
  } else {
    for (let [exerciseId, exerciseDefinition] of Object.entries(
      exerciseDefinitions
    )) {
      let existingQuizEntry =
        exercisesLockedState[
          returnIndexOfValue(exercisesLockedState, "id", exerciseId)
        ];

      if (existingQuizEntry === undefined) {
        if (
          exerciseDefinition.lockedState !== undefined &&
          (exerciseDefinition.lockedState === 0 ||
            exerciseDefinition.lockedState === 1)
        ) {
          exercisesLockedStateArray.push({
            id: exerciseId,
            lockedState: exerciseDefinition.lockedState,
          });
        } else {
          exercisesLockedStateArray.push({ id: exerciseId, lockedState: 0 });
        }
      } else {
        let userExistingQuizEntry =
          userExercisesLockedState[
            returnIndexOfValue(userExercisesLockedState, "id", exerciseId)
          ];

        if (userExistingQuizEntry !== undefined) {
          if (
            exerciseDefinition.lockedState !== undefined &&
            userExistingQuizEntry.lockedState !== exerciseDefinition.lockedState
          ) {
            if (exerciseDefinition.lockedState === 0) {
              existingQuizEntry.lockedState = userExistingQuizEntry.lockedState;
            } else if (exerciseDefinition.lockedState === 1) {
              existingQuizEntry.lockedState = exerciseDefinition.lockedState;
            }
          }
        } else {
          if (
            exerciseDefinition.lockedState !== undefined &&
            existingQuizEntry.lockedState !== exerciseDefinition.lockedState
          ) {
            existingQuizEntry.lockedState = exerciseDefinition.lockedState;
          }
        }
        exercisesLockedStateArray.push(existingQuizEntry);
      }
    }
  }
  if (exercisesLockedStateArray[0].lockedState === 0) {
    exercisesLockedStateArray[0].lockedState = 1;
  }

  if (userExercisesLockedState === null) {
    lss("UserExercisesLockedState", JSON.stringify([]));
    userExercisesLockedState = [];
  }

  lss("ExercisesLockedState", JSON.stringify(exercisesLockedStateArray));
  exercisesLockedState = exercisesLockedStateArray;
}

function addUserExercisesLockedStateEntry(index, id, mode) {
  if (userExercisesLockedState[index] === undefined) {
    userExercisesLockedState[index] = {
      id: id,
      lockedState: mode,
    };
  } else {
    userExercisesLockedState[index].lockedState = mode;
  }
  lss("UserExercisesLockedState", JSON.stringify(userExercisesLockedState));
}

function getLockedState(exerciseId) {
  return exercisesLockedState[
    returnIndexOfValue(exercisesLockedState, "id", exerciseId)
  ].lockedState;
}

function unlockExercise(exerciseId) {
  try {
    if (quizSelector.startsWith("_")) {
    }
  } catch (error) {
    exerciseId = `_${exerciseId}`;
  }
  let currentExerciseIndex = returnIndexOfValue(
    exercisesLockedState,
    "id",
    exerciseId
  );

  if (exercisesLockedState[currentExerciseIndex + 1] !== undefined) {
    exercisesLockedState[currentExerciseIndex + 1].lockedState = 1;
    addUserExercisesLockedStateEntry(
      currentExerciseIndex + 1,
      exercisesLockedState[currentExerciseIndex + 1].id,
      1
    );
  } else {
    exercisesLockedState[exercisesLockedState.length - 1].lockedState = 1;
    addUserExercisesLockedStateEntry(
      currentExerciseIndex - 1,
      exercisesLockedState[currentExerciseIndex - 1].id,
      1
    );
  }

  lss("ExercisesLockedState", JSON.stringify(exercisesLockedState));
}

export {
  updateExerciseDefinitions,
  getExerciseDefinitions,
  getLockedState,
  unlockExercise,
  getExerciseOverride,
  setExerciseOverride,
};
