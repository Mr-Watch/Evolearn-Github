import { stringToNode } from "../../AuxiliaryScripts/utils.js";

class IndividualComponent extends HTMLElement {
  constructor(individualId, individualFitness) {
    super();
    this.individualId = individualId;
    this.individualFitness = individualFitness;

    this.animationFrames = {
      timing: {
        duration: 3000,
        iterations: 1,
        fill: "both",
      },
      shrink: [{ transform: "scale(1)" }, { transform: "scale(0.1)" }],
      selectionFlash: [
        { opacity: 1, background: "var(--bs-info)" },
        { opacity: 0.5 },
        { opacity: 1 },
      ],
      zoomOutDown: [
        {
          transform: "none",
          opacity: "1",
          transformOrigin: "center bottom",
          offset: 0,
        },
        {
          transform: "scale3d(.475, .475, .475) translate3d(0, -60px, 0)",
          opacity: "1",
          transformOrigin: "center bottom",
          offset: 0.4,
        },
        {
          transform: "scale3d(.1, .1, .1) translate3d(0, 2000px, 0)",
          opacity: "0",
          transformOrigin: "center bottom",
          offset: 1,
        },
      ],
      flipOut: [
        { transform: "perspective(400px)", opacity: "1", offset: 0 },
        {
          transform: "perspective(400px) rotate3d(1, 0, 0, -20deg)",
          opacity: "1",
          offset: 0.3,
        },
        {
          transform: "perspective(400px) rotate3d(1, 0, 0, 90deg)",
          opacity: "0",
          offset: 1,
        },
      ],
    };

    this.animations = {
      shrink: this.shrink.bind(this),
      selectionFlash: this.selectionFlash.bind(this),
      zoomOutDown: this.zoomOutDown.bind(this),
      flipOut: this.flipOut.bind(this),
    };
  }

  connectedCallback() {
    this.classList.add("individual", "card", "m-3");
    if (this.isCopy !== undefined) {
      this.innerHTML = this.innerHTMLCopy;
      this.elements = {
        id: this.querySelector(".id"),
        fitness: this.querySelector(".fitness"),
        header: this.querySelector(".card-header").firstElementChild,
        entries: {}
      };
      
      let tmpEntries = this.querySelectorAll("li");
      for (let index = 2; index < tmpEntries.length; index++) {
        this.elements.entries[tmpEntries[index].classList[0]] =
          tmpEntries[index];
      }
      return;
    }

    this.innerHTML = `
      <div class="card-header"></div>
    <div class="card-body">
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item d-flex justify-content-between align-items-center flex-wrap"
        >
          Individual Id
          <span class="id badge bg-primary rounded-pill ms-3">${this.individualId}</span>
        </li>
        <li
          class="list-group-item d-flex justify-content-between align-items-center flex-wrap"
        >
          Fitness Value
          <span class="fitness badge bg-primary rounded-pill ms-3">${this.individualFitness}</span>
        </li>
      </ul>
    </div>
      `;

    this.elements = {
      id: this.querySelector(".id"),
      fitness: this.querySelector(".fitness"),
      entries: {},
      header: {},
    };
  }

  setFitness(fitness) {
    this.individualFitness = fitness;
    this.elements.fitness.innerText = fitness;
  }

  setId(id) {
    this.individualId = id;
    this.elements.id.innerText = id;
  }

  setEntry(identifier, value) {
    this.elements.entries[identifier].firstElementChild.innerText = value;
  }

  getFitness() {
    return this.individualFitness;
  }

  getId() {
    return this.individualId;
  }

  getEntry(identifier) {
    return this.elements.entries[identifier].firstElementChild.innerText;
  }

  addNewEntry(entryName, entryValue = "", identifier = "") {
    let entry = stringToNode(`
    <li
    class=" ${identifier} list-group-item d-flex justify-content-between align-items-center flex-wrap"
  >
    ${entryName}
    <span class="badge bg-primary rounded-pill ms-3">${entryValue}</span>
  </li>`);

    this.querySelector(".list-group").lastElementChild.insertAdjacentElement(
      "afterend",
      entry
    );
    this.elements.entries[identifier] = entry;
  }

  addToHeader(element) {
    if (typeof element === "string") {
      this.querySelector(".card-header").innerHTML = element;
    } else {
      this.querySelector(".card-header").appendChild(element);
    }
    this.elements.header = element;
  }

  resetAnimationChanges() {
    this.style = null;
  }

  async performAnimation(
    animationFrames,
    animationTiming,
    callback = undefined
  ) {
    let animation = this.animate(animationFrames, animationTiming);
    await animation.finished;
    animation.commitStyles();
    animation.cancel();

    if (callback !== undefined) {
      callback();
    }
  }

  async animationSetup(
    animation,
    iterations = 1,
    duration = 1000,
    callback = undefined
  ) {
    this.animationFrames.timing.duration = duration;
    this.animationFrames.timing.iterations = iterations;
    this.performAnimation(
      this.animationFrames[animation],
      this.animationFrames.timing,
      callback
    );
  }

  async flipOut(iterations = 1, duration = 1000, callback = undefined) {
    this.animationSetup("flipOut", iterations, duration, callback);
  }

  async shrink(factor = 0.5, duration = 1000, callback = undefined) {
    this.animationFrames.shrink[1].transform = `scale(${factor})`;
    this.animationSetup("shrink", undefined, duration, callback);
  }

  async selectionFlash(iterations = 1, duration = 1000, callback = undefined) {
    this.animationSetup("selectionFlash", iterations, duration, callback);
  }

  async zoomOutDown(iterations = 1, duration = 1000, callback = undefined) {
    this.animationSetup("zoomOutDown", iterations, duration, callback);
  }

  createShallowCopy() {
    let element = new IndividualComponent(
      this.individualId,
      this.individualFitness
    );
    element.isCopy = true;
    element.innerHTMLCopy = this.innerHTML;
    return element;
  }
}

customElements.define("individual-visualization", IndividualComponent);
export { IndividualComponent };
