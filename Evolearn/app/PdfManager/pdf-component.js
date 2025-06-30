import {
  getLinksFromFileSelector,
  getPdfFileList,
  getPdfFileNameFromFileSelector,
  getSrcFromFileSelector,
} from "./pdf-state-manager.js";
import { createToast } from "../ToastManager/toast-manager.js";
import {
  elementIsVisibleInViewport,
  insertAtIndex,
  stringToNode,
  stringToStyleSheetNode,
} from "../AuxiliaryScripts/utils.js";
import { NoteContainerComponent } from "../NoteManager/note-container-component.js";
import { BookmarkContainerComponent } from "../BookmarkManager/bookmark-container-component.js";

class PdfComponent extends HTMLElement {
  constructor(pdfSelector = 1, highLightTextOverride = undefined) {
    super();
    this.inFullScreen = false;
    this.pdfSelector = pdfSelector;
    this.pdfSrc = "";
    this.links = {};
    this.activePage = {};
    this.preparedPages = new Map();
    this.highLightTextAttempts = 0;
    this.additionalPageChangeAttemptCount = 0;
    this.documentTitle = getPdfFileNameFromFileSelector(pdfSelector);
    this.urlString = `?view=pdf&item=${pdfSelector}`;
    this.loadPdf(pdfSelector);
    this.requestPdfLinks(pdfSelector);

    if (highLightTextOverride !== undefined) {
      this.highLightTextOverride = highLightTextOverride;
    }
  }

  loadPdf(pdfSelector) {
    try {
      this.pdfSrc = getSrcFromFileSelector(pdfSelector);
      this.pdfSelector = pdfSelector;
    } catch (error) {
      console.error("Pdf file not found.");
      this.pdfSrc = undefined;
      createToast("error", "Pdf file not found", true);
    }
  }

  requestPdfLinks(pdfSelector) {
    getLinksFromFileSelector(pdfSelector, this.loadPdfLinks.bind(this));
  }

  loadPdfLinks(data) {
    if (data.hasOwnProperty("error")) {
      console.log("No link file found");
    } else {
      this.links = data;
    }
  }

  changePage(page) {
    this.elements.iframe.contentWindow.PDFViewerApplication.page = page;
    this.elements.pageNumber.value = page;
    this.pageNumber = this.elements.pageNumber.value;
    this.activePage = this.elements.iframe.contentDocument.querySelector(
      `.page[data-page-number='${this.pageNumber}']`
    );
    this.checkPageForLinks();
    this.closeOffCanvas();
  }

  connectedCallback() {
    if (this.pdfSrc === undefined) {
      return;
    }

    this.style.display = "block";
    this.style.position = "relative";
    this.style.width = "100%";
    this.style.height = "100%";
    this.style.overflow = "hidden";
    try {
      this.innerHTML = `<iframe
        src="./CdnFiles/pdfjs-dist/web/viewer.html?file=${this.pdfSrc}"
        frameborder="0" width="100%" height="100%"></iframe>`;
      this.elements = {
        iframe: this.querySelector("iframe"),
      };
    } catch (error) {
      console.log(error);
    }

    this.createPdfSelectionScreen();

    this.elements.buttonGroup = stringToNode(`
    <div class="button_group btn-group-vertical dropdown-center dropup">
      <ul class="dropdown-menu">
        <li>
          <button
            class="change_pdf_button dropdown-item btn btn-primary d-flex justify-content-between align-content-center"
          >
            Change Pdf<span class="material-icons ps-2">picture_as_pdf</span>
          </button>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
            <button
              class="reset_links dropdown-item btn btn-primary d-flex justify-content-between align-content-center"
            >
              Reset Links<span class="material-icons ps-2">restart_alt</span>
            </button>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
        <li>
          <button
            class="open_notes_button dropdown-item btn btn-primary d-flex justify-content-between align-content-center"
          >
            Open Notes<span class="material-icons ps-2">description</span>
          </button>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <button
            class="open_bookmarks_button dropdown-item btn btn-primary d-flex justify-content-between align-content-center"
          >
            Open Bookmarks<span class="material-icons ps-2">bookmark</span>
          </button>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <button
            class="fullscreen_button dropdown-item btn btn-primary d-flex justify-content-between align-content-center"
          >
            Fullscreen<span class="material-icons ps-2">fullscreen</span>
          </button>
        </li>
      </ul>
      <button
        class="actions rounded btn btn-secondary d-flex justify-content-between align-content-center"
        data-bs-toggle="dropdown"
      >
        Actions<span class="material-icons ps-2">more_vert</span>
      </button>
    </div>`);

    this.elements.buttonGroup.appendChild(
      stringToStyleSheetNode(`
    .button_group {
      position: absolute;
      right: 30px;
      bottom: 30px;
      opacity: 0.1;
      transition: opacity 0.3s;
    }

    .button_group:hover {
      opacity: 1;
    }`)
    );

    this.elements.overlay = stringToNode(`<div class="overlay"></div>`);
    this.elements.overlay.appendChild(
      stringToStyleSheetNode(`
    .overlay {
      position: absolute; 
      width: 100%; 
      height: 100%; 
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 0; 
      cursor: pointer;
    }
`)
    );

    this.elements.overlay.classList.add("d-none");

    this.elements.pdfOffCanvas = stringToNode(`
    <div class="pdf_offcanvas_container position-absolute">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title"></h5>
      <button
        type="button"
        class="close_offcanvas_button btn-close"
      ></button>
    </div>
    <div
    class="outer_body position-relative overflow-auto"
      tabindex="-1"
    >
      <div class="offcanvas-body"><div></div></div>
    </div>
  </div>`);

    this.elements.pdfOffCanvas.classList.add("d-none");

    this.elements.pdfOffCanvas.appendChild(
      stringToStyleSheetNode(`
      .outer_body{
        height: 90%;
      }

      .pdf_offcanvas_container {
        background-color: var(--bs-body-bg);
        bottom: 0px;
        width: 100%;
        height: 65%;
        z-index: 2;
      }
      .pdf_offcanvas_container::backdrop {
        background-color: salmon;
      }
      .offcanvas-header{
        padding: 0.5rem;
      }
      .offcanvas-header .btn-close{
        padding: inherit;
      }
      .offcanvasBottom {
        transform: none !important;
      }`)
    );

    this.elements.exitFullScreenButton = stringToNode(`
    <button class="btn-close bg-warning exit_fullscreen_button"
    title="Exit FullScreen">Exit FullScreen</button>
    `);

    this.elements.exitFullScreenButton.appendChild(
      stringToStyleSheetNode(`
    .exit_fullscreen_button{
      aspect-ration: 1;
      border: none;
      background-color: #6c757d;
      padding: 15px;
      border-radius: 5px;
      font-size : 1rem;
      color: white;
      position: fixed;
      right: 30px;
      bottom: 30px;
      z-index: 1000;
      opacity: 0.2;
      transition: opacity 0.2s;
    }

    .exit_fullscreen_button:hover{
      opacity: 1;
    }`)
    );

    this.appendChild(this.elements.overlay);
    this.appendChild(this.elements.pdfOffCanvas);
    this.appendChild(this.elements.buttonGroup);

    this.elements.fullScreenButton =
      this.elements.buttonGroup.querySelector(".fullscreen_button");
    this.elements.resetLinksButton =
      this.elements.buttonGroup.querySelector(".reset_links");
    this.elements.openNotesButton =
      this.elements.buttonGroup.querySelector(".open_notes_button");
    this.elements.openBookmarksButton = this.elements.buttonGroup.querySelector(
      ".open_bookmarks_button"
    );
    this.elements.changePdfButton =
      this.elements.buttonGroup.querySelector(".change_pdf_button");
    this.elements.closeOffCanvasButton =
      this.elements.pdfOffCanvas.querySelector(".close_offcanvas_button");

    this._closeOffCanvas = this.closeOffCanvas.bind(this);
    this.elements.closeOffCanvasButton.addEventListener(
      "click",
      this._closeOffCanvas
    );

    this._toggleFullScreenMode = this.toggleFullScreenMode.bind(this);
    this.elements.fullScreenButton.addEventListener(
      "click",
      this._toggleFullScreenMode
    );
    this.elements.iframe.addEventListener(
      "fullscreenchange",
      this.toggleFullScreenModeState.bind(this)
    );

    this._resetLinks = this.resetLinks.bind(this);
    this.elements.resetLinksButton.addEventListener("click", this._resetLinks);

    this._openNotes = this.openNotes.bind(this);
    this.elements.openNotesButton.addEventListener("click", this._openNotes);

    this._openPdfSelectionScreen = this.openPdfSelectionScreen.bind(this);
    this.elements.changePdfButton.addEventListener(
      "click",
      this._openPdfSelectionScreen
    );

    this._openBookmarks = this.openBookmarks.bind(this);
    this.elements.openBookmarksButton.addEventListener(
      "click",
      this._openBookmarks
    );

    this.elements.iframe.addEventListener("load", () => {
      this.initialInterval = setInterval(() => {
        if (
          this.elements.iframe.contentWindow.PDFViewerApplication
            .documentInfo !== null
        ) {
          this.pageCount = parseInt(
            this.elements.iframe.contentDocument
              .querySelector("#numPages")
              .innerText.replace("of", "")
          );
          this.removeIframeButtons();

          let script = document.createElement("script");
          script.src = "/PdfManager/span-links-component.js";
          script.type = "module";
          this.elements.iframe.contentDocument.head.appendChild(script);

          clearInterval(this.initialInterval);
          this.elements.pageNumber =
            this.elements.iframe.contentDocument.querySelector("#pageNumber");
          this.pageNumber = this.elements.pageNumber.value;
          this.activePage = this.elements.iframe.contentDocument.querySelector(
            `.page[data-page-number='${this.pageNumber}']`
          );
          window.history.replaceState(
            {},
            this.documentTitle,
            this.urlString + `&page=${this.pageNumber}`
          );

          this.checkPageForLinks();
          if (this.highLightTextOverride !== undefined) {
            let { text, page, occurrence } = this.highLightTextOverride;
            this.highLightText(text, page, occurrence);
          }
          this.pageNumberInterval = setInterval(
            this.pageChange.bind(this),
            250
          );
        }
      }, 500);
    });
  }

  pageChange() {
    let tmpActivePage = this.elements.iframe.contentDocument.querySelector(
      `.page[data-page-number='${this.elements.pageNumber.value}']`
    );
    if (
      this.pageNumber !== this.elements.pageNumber.value &&
      this.elements.pageNumber.value !== "" &&
      parseInt(this.elements.pageNumber.value) <= this.pageCount &&
      parseInt(this.elements.pageNumber.value) !== 0 &&
      elementIsVisibleInViewport(tmpActivePage, true)
    ) {
      this.pageNumber = this.elements.pageNumber.value;
      this.activePage = this.elements.iframe.contentDocument.querySelector(
        `.page[data-page-number='${this.pageNumber}']`
      );

      window.history.replaceState(
        {},
        this.documentTitle,
        this.urlString + `&page=${this.pageNumber}`
      );
      console.log("Page Changed.");
      this.checkPageForLinks();
    }
  }

  checkPageForLinks() {
    if (
      this.links[this.pageNumber] !== undefined &&
      this.preparedPages.get(this.pageNumber) === undefined
    ) {
      if (this.activePage.classList.contains("loading") === true) {
        this.waitForPageLoadInterval = setInterval(
          this.waitForPageLoad.bind(this),
          200
        );
      } else {
        this.additionalPageChange();
      }
    } else if (
      this.preparedPages.get(this.pageNumber) !== undefined &&
      this.preparedPages.get(this.pageNumber).querySelector(".prepared") ===
        null
    ) {
      this.preparedPages.delete(this.pageNumber);
      this.additionalPageChange();
    }
  }

  waitForPageLoad() {
    if (
      this.activePage.classList.contains("loading") !== true &&
      this.activePage.querySelectorAll("span").length !== 0
    ) {
      clearInterval(this.waitForPageLoadInterval);
      this.additionalPageChange();
    }
  }

  resetLinks(alert) {
    this.preparedPages.clear();
    this.requestPdfLinks(this.pdfSelector);
    this.checkPageForLinks();
    if (alert) createToast("info", "Links are reset",true);
  }

  additionalPageChange() {
    if (this.activePage.querySelector(".prepared") === null) {
      this.pageSpanElementsPreparation();
    }

    this.preparedPages.set(this.pageNumber, this.activePage);

    this.links[this.pageNumber].forEach((item) => {
      let spanElementsArray = this.returnSpanElements(item.text);
      let setLength = spanElementsArray.length;

      if (item.occurrences !== "all") {
        setLength = item.occurrences;
      }

      try {
        for (let index = 0; index < setLength; index++) {
          spanElementsArray[index].forEach((span) => {
            let spanOuterHtml = span.outerHTML;
            let replacementSpan = stringToNode(
              insertAtIndex(
                spanOuterHtml,
                ' is="span-links-component" style="cursor : pointer; background-color : #7777ff" ',
                5
              )
            );

            let spanLinkActions = Object.entries(item.span_links);

            for (
              let outIndex = 0;
              outIndex < spanLinkActions.length;
              outIndex++
            ) {
              spanLinkActions[outIndex][1].forEach((item, index) => {
                replacementSpan.dataset[
                  `${spanLinkActions[outIndex][0] + index}`
                ] = item;
              });
            }
            span.parentElement.replaceChild(replacementSpan, span);
          });
        }
      } catch (error) {
        this.additionalPageChangeAttemptCount += 1;
        console.log("Page not fully loaded.\nRetrying...");
        this.preparedPages.delete(this.pageNumber);
        if (this.additionalPageChangeAttemptCount !== 5) {
          this.additionalPageChangeAttemptCount = 0;
          return;
        }else{
          setTimeout(this.checkPageForLinks.bind(this), 500);
        }
      }
    });
  }

  removeIframeButtons() {
    this.elements.iframe.contentDocument
      .querySelector("#editorFreeText")
      .remove();
    this.elements.iframe.contentDocument.querySelector("#editorInk").remove();
    this.elements.iframe.contentDocument.querySelector("#editorStamp").remove();
    this.elements.iframe.contentDocument.querySelector("#openFile").remove();
    this.elements.iframe.contentDocument
      .querySelector("#secondaryOpenFile")
      .remove();
  }

  changePdf(selector) {
    this.loadPdf(selector);
    document.title = getPdfFileNameFromFileSelector(selector);
    this.documentTitle = document.title;
    this.urlString = `?view=pdf&item=${selector}`;
    window.history.replaceState({}, this.documentTitle, this.urlString);
    let tmpSrc = this.elements.iframe.src;
    let startingIndex = tmpSrc.lastIndexOf("=");
    tmpSrc = tmpSrc.slice(0, startingIndex + 1);
    tmpSrc = tmpSrc.concat(this.pdfSrc);
    this.elements.iframe.src = tmpSrc;
    clearInterval(this.pageNumberInterval);
    clearInterval(this.initialInterval);
    clearInterval(this.waitForPageLoadInterval);
    this.closeOffCanvas();
    this.activePage = undefined;
    this.resetLinks(false);
  }

  createPdfSelectionScreen() {
    this.pdfButtonFunctions = new Map();
    let pdfFileDefinitions = getPdfFileList();

    this.pdfSelectionScreen = stringToNode(`
    <div class="pdf_file_selector d-flex flex-row flex-wrap justify-content-evenly">
    </div>`);

    Object.entries(pdfFileDefinitions).forEach((key, value) => {
      let pdfNode = stringToNode(`
      <div class="card text-center m-3" role="button" style="width: max-content;" title="${key[1].fileName}">
      <img src="./Images/PDF_icon.svg" width="100px" height="100px" class="card-img-top p-2" alt="pdf_svg">
      <div class="card-body">
        <p class="card-text">${key[1].selectorName}</p>
      </div>
    </div>`);

      let tmpFunction = () => this.changePdf(value + 1);
      this.pdfButtonFunctions.set(value, tmpFunction);
      pdfNode.addEventListener("click", tmpFunction.bind(this));
      this.pdfSelectionScreen.appendChild(pdfNode);
    });
  }

  openPdfSelectionScreen() {
    this.openOffCanvas("Pdf File Select", this.pdfSelectionScreen);
  }

  openBookmarks() {
    this.bookmarkContainerComponent = new BookmarkContainerComponent(
      `b-${this.pdfSelector}`,
      this.pageCount
    );
    this.openOffCanvas("Pdf Bookmarks", this.bookmarkContainerComponent);
  }

  openNotes() {
    this.noteContainerComponent = new NoteContainerComponent(
      `p-${this.pdfSelector}`
    );
    this.openOffCanvas("Pdf Notes", this.noteContainerComponent);
  }

  openOffCanvas(title, body) {
    this.elements.overlay.classList.remove("d-none");
    this.elements.pdfOffCanvas.classList.remove("d-none");
    this.elements.pdfOffCanvas.querySelector(".offcanvas-title").innerText =
      title;
    this.elements.pdfOffCanvas
      .querySelector(".offcanvas-body")
      .firstElementChild.replaceWith(body);
  }

  closeOffCanvas() {
    this.elements.overlay.classList.add("d-none");
    this.elements.pdfOffCanvas.classList.add("d-none");
    this.elements.pdfOffCanvas.querySelector(".offcanvas-title").innerText = "";
  }

  toggleFullScreenModeState(event) {
    event.preventDefault();
    if (!this.inFullScreen) {
      this.inFullScreen = true;
    } else {
      this.inFullScreen = false;
      if (
        elementIsVisibleInViewport(this.elements.exitFullScreenButton, true)
      ) {
        this.elements.exitFullScreenButton.click();
      }
    }
  }

  toggleFullScreenMode() {
    if (!this.inFullScreen) {
      this.elements.iframe.requestFullscreen();
      this.elements.exitFullScreenButton.addEventListener(
        "click",
        (event) => {
          document
            .exitFullscreen()
            .catch(() => console.log("FullScreen exited using ESC key."));
          event.target.remove();
        },
        { once: true }
      );
      this.elements.iframe.contentDocument.body.appendChild(
        this.elements.exitFullScreenButton
      );
    } else {
      this.elements.exitFullScreenButton.click();
    }
  }

  pageSpanElementsPreparation() {
    let spanElements = this.activePage.querySelectorAll("span");

    spanElements.forEach((element) => this.prepareSpanElement(element));
    this.activePage
      .querySelectorAll('[text=""]')
      .forEach((item) => item.remove());
  }

  prepareSpanElement(spanElement) {
    let spanTextArray = spanElement.innerText.split(/(\s+)/);
    let textSpanArray = [];
    spanElement.style.display = "flex";
    spanElement.style.flexFlow = "row";

    for (let index = 0; index < spanTextArray.length; index++) {
      let textSpan = document.createElement("span");
      textSpan.innerText = spanTextArray[index];
      textSpan.setAttribute("text", spanTextArray[index]);
      textSpan.style.position = "relative";
      textSpan.classList.add("prepared");
      textSpanArray.push(textSpan);
    }

    textSpanArray.forEach((element) => spanElement.appendChild(element));
    spanElement.firstChild.remove();
  }

  highLightText(text, page, occurrence) {
    this.changePage(page);
    if (text === "") {
      return;
    }
    if (this.activePage.querySelector(".prepared") === null) {
      this.pageSpanElementsPreparation();
    }
    try {
      this.highLightTextOverride = { text, page, occurrence };
      let spanElements = this.returnSpanElements(text);
      spanElements[occurrence - 1].forEach(
        (element) => (element.style.backgroundColor = "yellow")
      );
      this.highLightTextAttempts = 0;
      this.highLightTextOverride = undefined;
    } catch (error) {
      this.highLightTextAttempts += 1;

      if (this.highLightTextAttempts === 5) {
        createToast(
          "warning",
          "The provided text could not be found on the page"
        );
        this.highLightTextAttempts = 0;
        this.highLightTextOverride = undefined;
        return;
      }
      let { text, page, occurrence } = this.highLightTextOverride;
      setTimeout(() => this.highLightText(text, page, occurrence), 500);
    }
  }

  returnSpanElements(text) {
    let textArray = text.trim().split(/(\s+)/);
    let spanElementsArray = [];
    let firstWordOccurrenceArray = this.activePage.querySelectorAll(
      `[text="${textArray[0]}"]`
    );

    for (
      let firstWordIndex = 0;
      firstWordIndex < firstWordOccurrenceArray.length;
      firstWordIndex++
    ) {
      let currentSpanElement = firstWordOccurrenceArray[firstWordIndex];
      let tmpSpanElementsArray = [];
      for (let index = 0; index < textArray.length; index++) {
        if (currentSpanElement.textContent === textArray[index]) {
          tmpSpanElementsArray.push(currentSpanElement);
          if (currentSpanElement.nextElementSibling === null) {
            let tmpSpanElement =
              currentSpanElement.parentElement.nextElementSibling
                .firstElementChild;
            if (tmpSpanElement === null) {
              currentSpanElement =
                currentSpanElement.parentElement.nextElementSibling
                  .nextElementSibling.firstElementChild;
              index += 1;
            } else {
              currentSpanElement = tmpSpanElement;
            }
          } else {
            currentSpanElement = currentSpanElement.nextElementSibling;
          }
        } else if (
          this.checkForPartialMatch(
            currentSpanElement.textContent,
            textArray[index]
          )
        ) {
          tmpSpanElementsArray.push(currentSpanElement);
          if (
            currentSpanElement.nextElementSibling === null &&
            index !== textArray.length - 1
          ) {
            tmpSpanElementsArray.push(
              currentSpanElement.parentElement.nextElementSibling
            );
            currentSpanElement =
              currentSpanElement.parentElement.nextElementSibling
                .nextElementSibling.firstElementChild;
          } else if (index !== textArray.length - 1) {
            tmpSpanElementsArray.push(currentSpanElement.nextElementSibling);
            currentSpanElement =
              currentSpanElement.nextElementSibling.nextElementSibling;
          }
        } else {
          break;
        }
      }

      try {
        if (
          tmpSpanElementsArray.at(-1).innerText === textArray.at(-1) ||
          this.checkForPartialMatch(
            tmpSpanElementsArray.at(-1).innerText,
            textArray.at(-1)
          )
        ) {
          spanElementsArray.push(tmpSpanElementsArray);
        }
      } catch (error) {
        console.warn("Strict equality failed.\nContinuing...");
      }
    }
    return spanElementsArray;
  }

  checkForPartialMatch(currentSpanElementText, text) {
    if (
      currentSpanElementText.replace(/^(_|\W)/, "") === text ||
      text.replace(/^(_|\W)/, "") === currentSpanElementText ||
      currentSpanElementText.replace(/(_|\W)$/, "") === text ||
      text.replace(/(_|\W)$/, "") === currentSpanElementText
    ) {
      return true;
    }
    return false;
  }

  disconnectedCallback() {
    clearInterval(this.pageNumberInterval);
    clearInterval(this.initialInterval);
    clearInterval(this.waitForPageLoadInterval);
    this.remove();
  }
}

customElements.define("pdf-component", PdfComponent);

export { PdfComponent };
