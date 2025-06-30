class ToastComponent extends HTMLElement {
  constructor() {
    super();

    this.modes = {
      error: {
        icon: "error",
        header: "Error",
        color: "bg-danger",
        sound: "error",
      },
      warning: {
        icon: "warning",
        header: "Warning",
        color: "bg-warning",
        sound: "warning",
      },
      info: { icon: "info", header: "Info", color: "bg-info", sound: "info" },
      success: {
        icon: "task_alt",
        header: "Success",
        color: "bg-success",
        sound: "success",
      },
    };
  }

  setToastParameters(mode = "info", text = "") {
    if (typeof mode !== "string" || typeof text !== "string") {
      throw TypeError("The mode and text need to be strings.");
    }

    this.elements.icon.textContent = this.modes[mode].icon;
    this.elements.header.textContent = this.modes[mode].header;
    this.elements.time.textContent = new Date().toLocaleTimeString();
    this.elements.body.innerHTML = `${text}`;
    this.elements.header.parentElement.classList.add(this.modes[mode].color);
  }

  connectedCallback() {
    this.classList.add("toast", "m-2", "d-block");
    this.innerHTML = `
        <div class="toast-header text-black">
          <span id="icon" class="material-icons pe-2"></span>
          <strong id="header" class="me-auto"></strong>
          <small id="time"></small>
          <button type="button" data-bs-dismiss="toast" class="btn-close"></button>
        </div>
        <div class="toast-body"> 
        </div>`;

    this.elements = {
      icon: this.querySelector("#icon"),
      header: this.querySelector("#header"),
      time: this.querySelector("#time"),
      body: this.querySelector(".toast-body"),
    };
  }
}

customElements.define("toast-component", ToastComponent);

export { ToastComponent };
