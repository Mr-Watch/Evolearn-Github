import { getPdfFileList } from "../PdfManager/pdf-state-manager.js";
import { lsg, stringToNode } from "../AuxiliaryScripts/utils.js";

class PdfView extends HTMLElement {
  constructor() {
    super();
    this.documentTitle = "Study Material - What would you like to learn?";
    this.urlString = "?view=pdfView";
  }

  connectedCallback() {
    this.classList.add(
      "d-flex",
      "position-relative",
      "flex-column",
      "h-100",
      "align-items-center",
      "align-content-center",
      "text-center"
    );

    this.innerHTML = `
    <h1 class="m-4">Study Material</h1>
    <h3 class="m-4">Here you can find all the relevant documents for you studying journey</h3>
    <div class="item_container d-flex flex-row flex-wrap justify-content-center"></div>
    `;

    this.elements = {
      itemContainer: this.querySelector(".item_container"),
    };

    let pdfFileList = getPdfFileList();
    let pdfViewItemsDocumentFragment = new DocumentFragment();

    Object.entries(pdfFileList).forEach((key, index) => {
      let pdfNode = stringToNode(`
      <div role="button" onclick="changeView('pdf',${key[0].replace(
        "_",
        ""
      )})" class="card m-3" style="max-width: 20rem;">
      <img src="./Images/PDF_icon.svg" width="200px" height="200px" class="card-img-top p-2" alt="pdf_svg">
      <div class="card-body">
        <hr>
        <h5 class="card-title">${key[1].selectorName}</h5>
        <p class="card-text" style="white-space: pre-line;">${
          key[1].description
        }</div>
    </div>`);
      pdfViewItemsDocumentFragment.appendChild(pdfNode);
    });

    this.elements.itemContainer.appendChild(pdfViewItemsDocumentFragment);

    let pdfFileIds = JSON.parse(lsg("PdfFileIds"));
    let difference = [];

    if (pdfFileIds !== null) {
      if (Object.keys(pdfFileIds).length !== 0) {
        difference = pdfFileIds.filter(
          (x) => !Object.keys(pdfFileList).includes(x)
        );
      }
    }

    if (difference.length !== 0) {
      let recoveryElement = stringToNode(`
      <div class="card m-3 border" style="width: 20rem;">
      <div class="card-body">
        <div
          class="btn-group-vertical w-100 note_recovery_btn_group"
          role="group"
        >
          
        </div>
      </div>
    </div>`);
      difference.forEach((id) => {
        recoveryElement.querySelector(".note_recovery_btn_group").appendChild(
          stringToNode(`
      <button class="open_quiz_button btn btn-primary"
      onclick="changeView('noteRecovery','p-${id
        .slice(1)
        .replace("_", "-")}')">Recover notes from pdf with id : ${id.slice(
            1
          )}</button>`)
        );
      });
      this.elements.itemContainer.appendChild(recoveryElement);
    }
  }

  updatePdfs() {
    this.connectedCallback();
  }
}

customElements.define("pdf-view", PdfView);

export { PdfView };
