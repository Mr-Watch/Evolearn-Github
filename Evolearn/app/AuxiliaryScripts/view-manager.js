import {
  createHelpModal,
  createSelectHelpModal,
  getHelpIndexes,
} from "../HelpManager/help-manager.js";
import { createModal } from "../ModalManager/modal-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";

import {
  removeItemOnIndex,
  stringToNode,
  stringToStyleSheetNode,
} from "./utils.js";

class ViewManager {
  constructor() {
    this.isViewManagerEnabled = true;
    this.isFirstView = true;
    this.isViewSplit = false;
    this.isViewSwitched = false;
    this.isSplitHorizontal = true;
    this.view1 = document.querySelector("#view_1");
    this.view2 = document.querySelector("#view_2");

    this.viewComponentsLookupTable = {
      pdf: {
        url: "../PdfManager/pdf-component.js",
        elementClassName: "PdfComponent",
      },
      exercise: {
        url: "../ExerciseManager/exercise-viewer-component.js",
        elementClassName: "ExerciseViewerComponent",
      },
      quiz: {
        url: "../QuizManager/quiz-viewer-component.js",
        elementClassName: "QuizViewerComponent",
      },
      quizReview: {
        url: "../QuizManager/quiz-review-component.js",
        elementClassName: "QuizReviewComponent",
      },
      pdfView: {
        url: "../ViewComponents/pdf-view.js",
        elementClassName: "PdfView",
      },
      exerciseView: {
        url: "../ViewComponents/exercise-view.js",
        elementClassName: "ExerciseView",
      },
      playgroundView: {
        url: "../ViewComponents/playground-view.js",
        elementClassName: "PlaygroundView",
      },
      quizView: {
        url: "../ViewComponents/quiz-view.js",
        elementClassName: "QuizView",
      },
      askTeacher: {
        url: "../ViewComponents/ask-teacher.js",
        elementClassName: "AskTeacherView",
      },
      notifications: {
        url: "../ViewComponents/notifications.js",
        elementClassName: "NotificationsView",
      },
      noteRecovery: {
        url: "../NoteManager/note-recovery-container-component.js",
        elementClassName: "NoteRecoveryContainerComponent",
      },
      settings: {
        url: "../ViewComponents/settings.js",
        elementClassName: "SettingsView",
      },
      about: {
        url: "../ViewComponents/about.js",
        elementClassName: "AboutView",
      },
    };

    this.loadedViewComponentsMap = new Map();
    this.loadedViewComponentsArray = [];
    this.secondViewLoadedComponent = new Map();
    this.viewIndex = -1;

    this.elements = {
      splitScreen: document.querySelector("#split_screen"),
      splitViewControls: document.querySelector("#split_view_controls"),
      viewContainer: document.querySelector("#view_container"),
      showNextViewButton: document.querySelector("#forward_button"),
      selectViewButton: document.querySelector("#view_select_button"),
      showPreviousViewButton: document.querySelector("#back_button"),
      closeViewButton: document.querySelector("#close_button"),
      waitingForView: document.querySelector(".waiting_for_view"),
      helpButton: document.querySelector("#help_button"),
      menuButton: document.querySelector("#menu_button"),
    };

    this.elements.splitScreen.addEventListener(
      "click",
      this.selectSplitViewOperation.bind(this)
    );

    this.elements.splitViewControls.children[3].addEventListener(
      "click",
      this.closeSplitView.bind(this)
    );

    this.elements.splitViewControls.children[2].addEventListener(
      "click",
      this.hideSplitView.bind(this)
    );
    this.elements.splitViewControls.children[1].addEventListener(
      "click",
      this.resetDimensionsToDefault.bind(this)
    );
    this.elements.splitViewControls.children[0].addEventListener(
      "click",
      this.alternateView.bind(this)
    );

    this.elements.showNextViewButton.addEventListener(
      "click",
      this.showNextView.bind(this)
    );

    this.elements.selectViewButton.addEventListener(
      "click",
      this.openViewSelect.bind(this)
    );

    this.elements.showPreviousViewButton.addEventListener(
      "click",
      this.showPreviousView.bind(this)
    );
    this.elements.closeViewButton.addEventListener(
      "click",
      this.closeView.bind(this)
    );

    this.elements.helpButton.addEventListener(
      "click",
      this.showHelpModal.bind(this)
    );

    this.hideViewControls();
  }

  resetDimensionsToDefault() {
    this.view1.style.width = "";
    this.view2.style.width = "";
    this.view1.style.height = "";
    this.view2.style.height = "";
  }

  showOrHideView(view, intent) {
    switch (intent) {
      case "show":
        view.classList.remove("d-none");
        break;
      case "hide":
        view.classList.add("d-none");
        break;
    }
  }

  returnMainOrSecondaryView(selector) {
    switch (selector) {
      case "main":
        return this.view1;
      case "secondary":
        return this.view2;
    }
  }

  alternateViews_HV(
    orderOfFirst,
    orderOfSecond,
    resizeOfFirst,
    resizeOfSecond
  ) {
    this.view1.style.order = orderOfFirst;
    this.view2.style.order = orderOfSecond;
    this.view1.style.resize = resizeOfFirst;
    this.view2.style.resize = resizeOfSecond;
  }

  alternateViews(resizeDirection) {
    if (this.isViewSwitched) {
      this.elements.splitViewControls.children[0].classList.remove(
        "bg-warning"
      );
      this.alternateViews_HV(1, 2, resizeDirection, "none");
      this.addBorder(resizeDirection, this.view1, this.view2);
      this.isViewSwitched = false;
    } else {
      this.elements.splitViewControls.children[0].classList.add("bg-warning");
      this.alternateViews_HV(2, 1, "none", resizeDirection);
      this.addBorder(resizeDirection, this.view2, this.view1);
      this.isViewSwitched = true;
    }
  }

  alternateView() {
    if (this.isSplitHorizontal) {
      this.alternateViews("vertical");
    } else {
      this.alternateViews("horizontal");
    }
  }

  splitView_HV(
    splitDirection,
    orientation,
    splitScreenIcon,
    splitViewIcon,
    resizeDirection
  ) {
    this.isSplitHorizontal = splitDirection;
    this.elements.viewContainer.style.flexDirection = orientation;
    this.elements.splitScreen.firstElementChild.textContent = splitScreenIcon;
    this.elements.splitViewControls.children[0].firstElementChild.textContent =
      splitViewIcon;

    if (!this.isViewSwitched) {
      this.view1.style.resize = resizeDirection;
      this.addBorder(resizeDirection, this.view1, this.view2);
    } else {
      this.view2.style.resize = resizeDirection;
      this.addBorder(resizeDirection, this.view2, this.view1);
    }
  }

  selectSplitViewOperation() {
    if (!this.isViewSplit) {
      this.openSplitView();
    } else if (this.isSplitHorizontal) {
      this.resetDimensionsToDefault();
      this.splitView_HV(
        false,
        "row",
        "splitscreen",
        "swap_horiz",
        "horizontal"
      );
    } else {
      this.resetDimensionsToDefault();
      this.splitView_HV(
        true,
        "column",
        "vertical_split",
        "swap_vert",
        "vertical"
      );
    }
  }

  openSplitView() {
    this.isViewSplit = true;
    this.showOrHideView(this.returnMainOrSecondaryView("secondary"), "show");

    if (!this.isViewSwitched && this.isSplitHorizontal) {
      this.addBorder("vertical", this.view1, this.view2);
    } else if (!this.isViewSwitched && !this.isSplitHorizontal) {
      this.addBorder("horizontal", this.view1, this.view2);
    } else if (this.isViewSwitched && this.isSplitHorizontal) {
      this.addBorder("vertical", this.view2, this.view1);
    } else if (this.isViewSwitched && !this.isSplitHorizontal) {
      this.addBorder("horizontal", this.view2, this.view1);
    }

    if (this.isSplitHorizontal) {
      this.elements.splitScreen.firstElementChild.textContent =
        "vertical_split";
    } else {
      this.elements.splitScreen.firstElementChild.textContent = "splitscreen";
    }
    this.elements.splitViewControls.classList.remove("d-none");
  }

  hideSplitView() {
    this.isViewSplit = false;
    this.showOrHideView(this.returnMainOrSecondaryView("secondary"), "hide");
    this.changeBorder(this.returnMainOrSecondaryView("main"), "");
    if (this.isSplitHorizontal) {
      this.elements.splitScreen.firstElementChild.textContent = "splitscreen";
    } else {
      this.elements.splitScreen.firstElementChild.textContent =
        "vertical_split";
    }
    this.elements.splitViewControls.classList.add("d-none");
    this.resetDimensionsToDefault();
  }

  closeSplitView() {
    try {
      this.secondViewLoadedComponent.entries().next().value[1].remove();
      this.secondViewLoadedComponent.clear();
      this.view2.appendChild(
        stringToNode(`
      <div
      class="position-relative p-3 text-center text-muted bg-body border border-dashed rounded-5"
    >
      <h1 class="text-body-emphasis">
        Waiting for you to select an activity
      </h1>
      <p class="col-lg-6 mx-auto mb-4">
        You can click on the menu <br />
        and chose an activity to display.
      </p>
      <button
        class="btn btn-primary px-5 mb-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#navbar"
      >
        Open menu
      </button>
    </div>`)
      );
    } catch (error) {
      createToast("info", "You have to select an activity", "warning");
    }
  }

  addBorder(direction, viewToAddBorder, viewToRemoveBorder) {
    this.changeBorder(viewToAddBorder, "");
    this.changeBorder(viewToRemoveBorder, "");
    switch (direction) {
      case "horizontal":
        this.changeBorder(viewToAddBorder, "right");
        break;
      case "vertical":
        this.changeBorder(viewToAddBorder, "bottom");
        break;
    }
  }

  changeBorder(element, intent) {
    switch (intent) {
      case "right":
        element.style.borderRight = "2px solid black";
        break;
      case "bottom":
        element.style.borderBottom = "2px solid black";
        break;
      default:
        element.style.borderRight = "";
        element.style.borderBottom = "";
        break;
    }
  }

  showHelpModal() {
    if (
      !this.isViewSplit ||
      this.secondViewLoadedComponent.keys().next().value === undefined
    ) {
      createHelpModal(
        undefined,
        this.loadedViewComponentsArray[this.viewIndex]
      );
    } else {
      createSelectHelpModal(
        this.loadedViewComponentsArray[this.viewIndex],
        this.secondViewLoadedComponent.keys().next().value,
        this.isSplitHorizontal,
        this.isViewSwitched
      );
    }
  }

  showViewComponent(index) {
    let previousView = this.view1.querySelector(".view.item._visible");

    if (previousView !== null) {
      previousView.classList.remove("_visible");
      previousView.classList.add("invisible");
    }

    let currentView = this.loadedViewComponentsMap.get(
      this.loadedViewComponentsArray[index]
    );

    if (currentView.nodeName === "EXERCISE-VIEWER-COMPONENT") {
      window.history.replaceState(
        {},
        currentView.documentTitle,
        `?view=exercise&item=${currentView.exerciseId}`
      );
    } else {
      window.history.replaceState(
        {},
        currentView.documentTitle,
        currentView.urlString
      );
    }
    document.title = currentView.documentTitle;

    currentView.classList.remove("invisible");
    currentView.classList.add("_visible");
    this.viewIndex = index;
  }

  showNextView() {
    this.viewIndex += 1;
    if (this.viewIndex === this.loadedViewComponentsArray.length) {
      this.viewIndex = 0;
    }
    this.showViewComponent(this.viewIndex);
  }

  showPreviousView() {
    this.viewIndex -= 1;
    if (this.viewIndex === -1) {
      this.viewIndex = this.loadedViewComponentsArray.length - 1;
    }
    this.showViewComponent(this.viewIndex);
  }

  closeView() {
    try {
      this.loadedViewComponentsMap
        .get(this.loadedViewComponentsArray[this.viewIndex])
        .remove();
      this.loadedViewComponentsMap.delete(
        this.loadedViewComponentsArray[this.viewIndex]
      );
      this.loadedViewComponentsArray = removeItemOnIndex(
        this.loadedViewComponentsArray,
        this.viewIndex
      );

      this.showPreviousView();
    } catch (error) {
      this.isFirstView = true;
      this.elements.waitingForView.classList.remove("d-none");
      document.title = "Evolearn - Let's 'Evolve' our learning!";
      window.history.replaceState({}, document.title, ".");
      this.hideViewControls();
    }
  }

  hideViewControls() {
    this.elements.showPreviousViewButton.disabled = true;
    this.elements.selectViewButton.disabled = true;
    this.elements.showNextViewButton.disabled = true;
    this.elements.closeViewButton.disabled = true;
    this.elements.splitScreen.disabled = true;
    if (this.isViewSplit) {
      this.hideSplitView();
    }

    this.elements.showPreviousViewButton.classList.add("d-none");
    this.elements.selectViewButton.classList.add("d-none");
    this.elements.showNextViewButton.classList.add("d-none");
    this.elements.closeViewButton.classList.add("d-none");
  }

  showViewControls() {
    this.elements.showPreviousViewButton.disabled = false;
    this.elements.selectViewButton.disabled = false;
    this.elements.showNextViewButton.disabled = false;
    this.elements.closeViewButton.disabled = false;
    this.elements.splitScreen.disabled = false;

    this.elements.showPreviousViewButton.classList.remove("d-none");
    this.elements.selectViewButton.classList.remove("d-none");
    this.elements.showNextViewButton.classList.remove("d-none");
    this.elements.closeViewButton.classList.remove("d-none");
  }

  disableViewManager() {
    this.elements.menuButton.disabled = true;
    this.hideViewControls();
    this.isViewManagerEnabled = false;
  }
  enableViewManager() {
    this.elements.menuButton.disabled = false;
    this.showViewControls();
    this.isViewManagerEnabled = true;
  }

  changeView(viewComponentName, ...args) {
    if (!this.isViewManagerEnabled) {
      createToast(
        "warning",
        "You are not allowed to change view at this time",
        true
      );
      return;
    }

    try {
      document.querySelector(".modal-header .btn-close").click();
    } catch (error) {}

    if (this.isFirstView) {
      this.isFirstView = false;
      this.elements.waitingForView.classList.add("d-none");
      this.showViewControls();
    }

    let computedViewComponentName = viewComponentName;
    let isNormalView = true;
    if (
      [
        "about",
        "settings",
        "askTeacher",
        "exerciseView",
        "notifications",
        "pdfView",
        "quizView",
        "playgroundView",
      ].includes(viewComponentName)
    ) {
    } else if (
      [
        "pdf",
        "exercise",
        "quiz",
        "quizReview",
        "playground",
        "noteRecovery",
      ].includes(viewComponentName)
    ) {
      computedViewComponentName += `_${args[0]}`;
      isNormalView = false;
    } else {
      createToast("error", "This view does not exist.", true);
      closeView();
      return;
    }

    if (!this.isViewSplit || viewComponentName === "quiz") {
      if (this.loadedViewComponentsArray.includes(computedViewComponentName)) {
        let computedIndex = this.loadedViewComponentsArray.indexOf(
          computedViewComponentName
        );
        if (computedViewComponentName.includes("pdf_") && args.length === 4) {
          this.loadedViewComponentsMap
            .get(computedViewComponentName)
            .highLightText(args[1], args[2], args[3]);
        }
        this.showViewComponent(computedIndex);
        this.viewIndex = computedIndex;
      } else {
        if (isNormalView) {
          this.finalChangeView(viewComponentName, 1, true);
        } else {
          this.finalChangeView(viewComponentName, 1, false, args);
        }
      }
    } else {
      if (!this.secondViewLoadedComponent.has(computedViewComponentName)) {
        if (isNormalView) {
          this.finalChangeView(viewComponentName, 2, true);
        } else {
          this.finalChangeView(viewComponentName, 2, false, args);
        }
      }
    }
  }

  async finalChangeView(viewComponentName, viewSelector, isNormal, args) {
    let viewComponentClass = await this.loadViewComponentClass(
      viewComponentName
    );
    let viewComponent = {};

    if (!isNormal) {
      switch (viewComponentName) {
        case "pdf":
          if (args.length === 4) {
            viewComponent = new viewComponentClass(args[0], {
              text: args[1],
              page: args[2],
              occurrence: args[3],
            });
          } else {
            viewComponent = new viewComponentClass(args[0]);
          }
          break;
        case "exercise":
          viewComponent = new viewComponentClass(args[0]);
          break;
        case "quiz":
          viewComponent = new viewComponentClass(args[0]);
          break;
        case "quizReview":
          viewComponent = new viewComponentClass(args[0]);
          break;
        case "noteRecovery":
          viewComponent = new viewComponentClass(args[0]);
          break;
      }
      viewComponentName = `${viewComponentName}_${args[0]}`;
    } else {
      viewComponent = new viewComponentClass();
    }

    viewComponent.classList.add("item");

    if (viewSelector === 1) {
      viewComponent.classList.add("invisible");
      viewComponent.classList.add("view");

      this.loadedViewComponentsArray.push(viewComponentName);
      this.viewIndex = this.loadedViewComponentsArray.length - 1;
      this.loadedViewComponentsMap.set(viewComponentName, viewComponent);
      this.view1.appendChild(viewComponent);
      this.showViewComponent(this.viewIndex);
    } else {
      this.secondViewLoadedComponent.clear();
      this.secondViewLoadedComponent.set(viewComponentName, viewComponent);
      this.view2.replaceChildren();
      this.view2.appendChild(viewComponent);
    }
  }

  openViewSelect() {
    let names = getHelpIndexes();
    this.viewSelectFunction = {};
    let element = stringToNode(`
    <div class="d-flex flex-column align-items-center">
    <div
      class="view_selector d-flex flex-column align-items-center align-content-center"
    >
    </div>
  </div>`);

    element.appendChild(
      stringToStyleSheetNode(`
        .view_item:hover {
          background-color: var(--bs-primary);
          color: var(--bs-white);
        }

        .view_item {
        width: fit-content;
        }`)
    );

    this.loadedViewComponentsArray.forEach((viewName, index) => {
      let title;
      try {
        title = names[viewName.split("_")[0]].title;
      } catch (error) {
        throw Error("No other view is loaded");
      }

      if (
        /^exercise_[0-9]*$/g.test(viewName) ||
        /^playground_[0-9]*$/g.test(viewName)
      ) {
        title += ` ${viewName.split("_")[1]}`;
      }
      let button = stringToNode(`
      <h2 role="button" class="view_item card m-3 p-3 d-inline" data-index="${index}">${title}</h2>`);
      this.viewSelectFunction = () => this.showViewComponent(index);
      button.addEventListener("click", this.viewSelectFunction.bind(this));
      element.querySelector(".view_selector").appendChild(button);
    });

    createModal("Select View", element, undefined, undefined, undefined, true);
  }

  async loadViewComponentClass(viewComponentName) {
    if (this.viewComponentsLookupTable[viewComponentName] === undefined) {
      createToast("error", "This view does not exist.", true);
      closeView();
      throw TypeError("This viewComponent does not exist.");
    }

    let selectedViewComponentProperties =
      this.viewComponentsLookupTable[viewComponentName];
    let importString = `${selectedViewComponentProperties.url}`;

    let module = {};
    try {
      module = await import(importString);
    } catch (error) {
      closeView();
      createToast("error", "This view was not cached", true);
      return;
    }

    let viewComponentClass =
      module[selectedViewComponentProperties.elementClassName];
    return viewComponentClass;
  }

  updatePdfView() {
    if (this.loadedViewComponentsMap.get("pdfView") !== undefined) {
      this.loadedViewComponentsMap.get("pdfView").updatePdfs();
    }
  }

  updateExerciseView() {
    if (this.loadedViewComponentsMap.get("exerciseView") !== undefined) {
      this.loadedViewComponentsMap.get("exerciseView").updateExercises();
    }
  }

  updateQuizView() {
    if (this.loadedViewComponentsMap.get("quizView") !== undefined) {
      this.loadedViewComponentsMap.get("quizView").updateQuizzes();
    }
  }

  updateNotifications() {
    if (this.loadedViewComponentsMap.get("notifications") !== undefined) {
      this.loadedViewComponentsMap.get("notifications").updateNotifications();
    }
  }
}

window.viewManager = new ViewManager();
window.changeView = window.viewManager.changeView.bind(window.viewManager);

const enableViewManager = window.viewManager.enableViewManager.bind(
  window.viewManager
);
const disableViewManager = window.viewManager.disableViewManager.bind(
  window.viewManager
);
const closeView = window.viewManager.closeView.bind(window.viewManager);

const updatePdfView = window.viewManager.updatePdfView.bind(window.viewManager);
const updateExerciseView = window.viewManager.updateExerciseView.bind(
  window.viewManager
);
const updateQuizView = window.viewManager.updateQuizView.bind(
  window.viewManager
);

const updateNotifications = window.viewManager.updateNotifications.bind(
  window.viewManager
);

export {
  enableViewManager,
  disableViewManager,
  closeView,
  updatePdfView,
  updateExerciseView,
  updateQuizView,
  updateNotifications,
};
