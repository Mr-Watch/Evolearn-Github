import { fetchText, returnPlainJson } from "../Fetcher/fetcher.js";
import { createModal } from "../ModalManager/modal-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";
import {
  stringToNode,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";

const helpIndexURLS = {
  views: "/ContentFiles/HelpContentFiles/ViewHelpFiles/",
  exercises: "/ContentFiles/HelpContentFiles/ExerciseHelpFiles/",
};

let helpIndex = {};

async function updateHelpIndex() {
  try {
    helpIndex = await returnPlainJson(
      `/ContentFiles/HelpContentFiles/help_definitions.json`
    );
  } catch (error) {
    console.log(error);
  }
}

updateHelpIndex();

function getHelpIndexes() {
  return helpIndex;
}

function createSelectHelpModal(
  firstTopic,
  secondTopic,
  isSplitHorizontal,
  isViewSwitched
) {
  let flexDirection = isSplitHorizontal ? "column" : "row";
  let order = isViewSwitched ? [1, 0] : [0, 1];
  let itemOneText = helpIndex[firstTopic.split("_")[0]].title;
  let itemTwoText = helpIndex[secondTopic.split("_")[0]].title;

  if (
    /^exercise_[0-9]*$/g.test(itemOneText) ||
    /^playground_[0-9]*$/g.test(itemOneText)
  ) {
    itemOneText += ` ${firstTopic.split("_")[1]}`;
  }

  if (
    /^exercise_[0-9]*$/g.test(itemTwoText) ||
    /^playground_[0-9]*$/g.test(itemTwoText)
  ) {
    itemTwoText += ` ${secondTopic.split("_")[1]}`;
  }

  let element = stringToNode(`
  <div class="d-flex flex-column align-items-center">
  <div
    class="help_selector d-flex flex-${flexDirection} align-items-center align-content-center"
  >
    <h2 role="button" class="help_item card m-3 p-3 d-inline order-${order[0]}">${itemOneText}</h2>
    <h2 role="button" class="help_item card m-3 p-3 d-inline order-${order[1]}">${itemTwoText}</h2>
  </div>
</div>`);

  element.appendChild(
    stringToStyleSheetNode(`
.help_item:hover {
  background-color: var(--bs-primary);
  color: var(--bs-white);
}

.help_item {
width: fit-content;
}`)
  );

  let firstButton = element.querySelectorAll(".help_item")[0];
  let secondButton = element.querySelectorAll(".help_item")[1];

  firstButton.addEventListener(
    "click",
    (e) => {
      createHelpModal(undefined, firstTopic);
      document.querySelector(".modal-header .btn-close").click();
    },
    { once: true }
  );
  secondButton.addEventListener(
    "click",
    (e) => {
      createHelpModal(undefined, secondTopic);
      document.querySelector(".modal-header .btn-close").click();
    },
    { once: true }
  );

  createModal(
    "Get Help for...",
    element,
    undefined,
    undefined,
    undefined,
    true
  );
}

function createHelpModal(selectorType = "views", selectorString) {
  let url = "";
  try {
    if (selectorString === undefined) {
      url = `${helpIndexURLS[selectorType]}view_manager.htm`;
      fetchText(url, (data) => {
        data = data.split("~~~~~~");
        createModal(data[0], data[1], data[2], undefined, undefined, true);
      });
      return;
    }
    if (selectorString.includes("_")) {
      if (selectorString.includes("exercise")) {
        selectorType = "exercises";
        url = `${helpIndexURLS[selectorType]}${selectorString}.htm`;
      } else {
        selectorString = selectorString.split("_")[0];
        url = `${helpIndexURLS[selectorType]}${helpIndex[selectorString].fileName}`;
      }
    } else {
      url = `${helpIndexURLS[selectorType]}${helpIndex[selectorString].fileName}`;
    }
    fetchText(url, (data) => {
      data = data.split("~~~~~~");

      if (data[0].includes("<!DOCTYPE html>")) {
        createToast("warning", "No help available for this topic", true);
        return;
      }
      createModal(data[0], data[1], data[2], undefined, undefined, true);
    });
  } catch (error) {
    createToast("warning", "No help available for this topic", true);
  }
}

export { createHelpModal, createSelectHelpModal, getHelpIndexes };
