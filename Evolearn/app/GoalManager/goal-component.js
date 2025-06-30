import { stringToStyleSheetNode } from "../AuxiliaryScripts/utils.js";

class GoalComponent extends HTMLElement {
  constructor(index = 0, title = "", text = "") {
    super();
    this.index = index;
    this.title = title;
    this.description = text;
  }

  connectedCallback() {
    this.classList.add("card", "m-3");
    this.innerHTML = `
            <div class="card-header d-flex align-items-center justify-content-between">
                Goal ${this.index.replace(
                  "_",
                  ""
                )} <span class="material-icons">radio_button_unchecked</span>
            </div>
            <div class="card-body">
                <h5 class="card-title">${this.title}</h5>
                <p class="card-text">${this.description}</p>
            </div>
        `;
    this.appendChild(
      stringToStyleSheetNode(`
    goal-component {
      max-width: 50rem;
      width: 100%;
    }`)
    );
  }

  activateGoal() {
    this.classList.add("border-2", "border-success");
    this.firstElementChild.classList.add("bg-success");
    this.firstElementChild.firstElementChild.classList.add("bg-success");
    this.firstElementChild.firstElementChild.innerText = "task_alt";
  }
}

customElements.define("goal-component", GoalComponent);

export { GoalComponent };
