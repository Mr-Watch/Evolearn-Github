class ModalComponent extends HTMLElement {
  constructor() {
    super();
    this.isInFullScreen = false;
  }

  setModalParameters(
    title = "",
    body = "",
    footer = "",
    fullScreenEnabled = false
  ) {
    if (
      this.isStringOrElement(title) &&
      this.isStringOrElement(body) &&
      this.isStringOrElement(footer)
    ) {
      this.attachmentElements = {
        title: title,
        body: body,
        footer: footer,
      };
    } else {
      throw TypeError(
        "The title, body and footer need to be strings or html elements."
      );
    }
    this.fullScreenEnabled = fullScreenEnabled;
  }

  isStringOrElement(item) {
    if (typeof item === "string" || item instanceof HTMLElement) {
      return true;
    }
    return false;
  }

  isString(item) {
    if (typeof item === "string") {
      return true;
    }
    return false;
  }

  attachToElement(element, item) {
    if (this.isString(item)) {
      this.elements[element].innerHTML = item;
    } else {
      this.elements[element].appendChild(item);
    }
  }

  toggleFullScreen() {
    if (!this.isInFullScreen) {
      this.firstElementChild.classList.add("modal-fullscreen");
      this.elements.fullScreenButton.firstElementChild.textContent =
        "fullscreen_exit";
      this.isInFullScreen = true;
    } else {
      this.firstElementChild.classList.remove("modal-fullscreen");
      this.elements.fullScreenButton.firstElementChild.textContent =
        "fullscreen";
      this.isInFullScreen = false;
    }
    window.dispatchEvent(new Event("resize"));
  }

  connectedCallback() {
    this.classList.add("modal", "fade");
    this.tabIndex = -1;
    this.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"></h5>
              <button id="fullscreen_button_modal" type="button" class="btn ms-2 pb-0 float-end" title="Go into fullscreen"><span class="material-icons">
                fullscreen
              </span></button>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      `;

    this.elements = {
      title: this.querySelector(".modal-title"),
      fullScreenButton: this.querySelector("#fullscreen_button_modal"),
      body: this.querySelector(".modal-body"),
      footer: this.querySelector(".modal-footer"),
    };

    this.attachToElement("title", this.attachmentElements.title);
    this.attachToElement("body", this.attachmentElements.body);
    this.attachToElement("footer", this.attachmentElements.footer);

    if (this.fullScreenEnabled) {
      this._toggleFullScreen = this.toggleFullScreen.bind(this);
      this.elements.fullScreenButton.addEventListener(
        "click",
        this._toggleFullScreen
      );
    } else {
      this.elements.fullScreenButton.style.display = "none";
    }
  }

  disconnectedCallback() {
    if (this.fullScreenEnabled) {
      this.elements.fullScreenButton.removeEventListener(
        "click",
        this._toggleFullScreen
      );
    }
    for (const key of Object.keys(this.elements)) {
      this.elements[key].replaceChildren();
      this.elements[key] = null;
    }
  }
}

customElements.define("modal-component", ModalComponent);

export { ModalComponent };
