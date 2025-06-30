import {
  arrayShuffle,
  stringToNode,
  stringToStyleSheetNode,
} from "../../AuxiliaryScripts/utils.js";
import { RendererAll } from "./renderer-all.js";

class RendererSplit {
  constructor(quiz, container, paginationElement) {
    this.quiz = quiz;
    this.container = container;
    this.paginationElement = paginationElement;
    this.splitNumber = quiz.configuration.split_number;
    this.buttonFunctionsMap = new Map();
    if (quiz.configuration.random_order) {
      this.questions = arrayShuffle(this.quiz.questions);
    }
  }

  render() {
    let tmpStyleSheet = stringToStyleSheetNode(`.question {display : none}`);
    tmpStyleSheet.classList.add("tmp");
    this.container.appendChild(tmpStyleSheet);

    let renderAll = new RendererAll(this.quiz, this.container);
    renderAll.render();

    let styleSheetSelectors = this.getStyleSheetSelectorRulesArray(
      this.getPaginationSplitArray(this.quiz.questions.length, this.splitNumber)
    );

    let splitButtonsDocumentFragment = new DocumentFragment();

    for (let index = 0; index < styleSheetSelectors.length; index++) {
      let buttonStyleSheets = this.returnButtonStyleSheets(
        index,
        styleSheetSelectors[index]
      );

      let button = stringToNode(`
        <li class="page-item" aria-current="page">
            <button class="page-link">${index + 1}</button>
          </li>
          `);
      let tmpFunction = () => {
        this.changeQuestions(index, buttonStyleSheets);
      };
      this.buttonFunctionsMap.set(index, tmpFunction);
      button.addEventListener("click", this.buttonFunctionsMap.get(index));
      splitButtonsDocumentFragment.appendChild(button);
    }
    splitButtonsDocumentFragment.firstElementChild.classList.add("active");

    this.paginationElement.appendChild(splitButtonsDocumentFragment);
    this.paginationElement.firstElementChild.click();
  }

  returnButtonStyleSheets(buttonId, selectors) {
    let styleSheets = [];

    if (!Array.isArray(selectors)) {
      selectors = [selectors];
    }

    selectors.forEach((selector) => {
      let tmpStyleSheet = stringToStyleSheetNode(
        `.question:nth-child(${selector}){display:none}`
      );
      tmpStyleSheet.classList.add(`_${buttonId}`);
      styleSheets.push(tmpStyleSheet);
    });

    return styleSheets;
  }

  changeQuestions(buttonId, styleSheets) {
    this.container
      .querySelectorAll(`style:not(._${buttonId})`)
      .forEach((item) => {
        item.remove();
      });
    styleSheets.forEach((item) => {
      this.container.appendChild(item);
    });
    this.paginationElement
      .querySelector("li.active")
      .classList.remove("active");
    this.paginationElement.children[buttonId].classList.add("active");
  }

  getPaginationSplitArray(questionsNumber, splitNumber) {
    if (questionsNumber === 0 || splitNumber === 0) {
      throw TypeError("The questionsNumber or splitNumber cannot be zero.");
    }

    let remainder = questionsNumber % splitNumber;
    let repetitionsNumber = 0;
    let paginationSplitArray = [];

    if (remainder === 0) {
      repetitionsNumber = questionsNumber / splitNumber;
    } else {
      repetitionsNumber = (questionsNumber - remainder) / splitNumber;
    }

    for (let index = 0; index < repetitionsNumber; index++) {
      paginationSplitArray.push(splitNumber);
    }

    if (remainder !== 0) {
      paginationSplitArray.push(remainder);
    }

    return paginationSplitArray;
  }

  getStyleSheetSelectorRulesArray(paginationSplitArray) {
    let styleSheetArray = [];
    styleSheetArray.push(`n+${paginationSplitArray[0] + 1}`);
    for (let index = 1; index < paginationSplitArray.length - 1; index++) {
      styleSheetArray.push([
        [`-n+${paginationSplitArray.slice(0, index).reduce((a, b) => a + b)}`],
        [
          `n+${
            paginationSplitArray.reduce((a, b) => a + b) -
            paginationSplitArray.slice(index + 1).reduce((a, b) => a + b) +
            1
          }`,
        ],
      ]);
    }
    styleSheetArray.push(
      `-n+${
        paginationSplitArray.reduce((a, b) => a + b) -
        paginationSplitArray.at(-1)
      }`
    );
    return styleSheetArray;
  }

  dispose() {
    this.quiz = null;
    this.container = null;
    this.paginationElement = null;
  }
}

export { RendererSplit };
