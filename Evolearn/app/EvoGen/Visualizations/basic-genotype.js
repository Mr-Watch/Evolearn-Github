import { stringToNode, stringToStyleSheetNode } from "../../AuxiliaryScripts/utils.js";
import { BinaryIndividual } from "../Individuals/binary.js";

class BasicGenotype extends HTMLElement {
  constructor(individual) {
    super();
    if (individual === undefined) {
      this.individual = new BinaryIndividual();
      this.individual.generateGenotype(5);
    } else {
      this.individual = individual;
    }

    this.animationFrames = {
      timing: {
        duration: 2000,
        iterations: 1,
        fill: "both",
      },
      mutate: [
        { transform: "scale(1)" },
        { transform: "scale(0.3) rotate(50deg)" },
        {
          transform: "scale(0.7) rotate(170deg)",
          background: "var(--bs-info)",
        },
        {
          transform: "scale(0.1) rotate(270deg)",
        },
        {
          transform: "scale(0.5) rotate(80deg)",
          background: "var(--bs-danger)",
        },
        { transform: "scale(0.9) rotate(70deg)" },
        { transform: "scale(1)" },
      ],
    };
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="genotypeVisual">
    <h3 class="genotype_size mb-3 d-none">
        Genotype size : <span class="size_span"></span>
      </h3>
  </div>`;

    let genes = new DocumentFragment();

    this.individual.genotype.forEach((gene) => {
      genes.appendChild(
        stringToNode(`<div class="genotypeElement">${gene}</div>`)
      );
    });
    this.querySelector(".genotypeVisual").appendChild(genes);

    this.elements = {
      genes: this.querySelectorAll(".genotypeElement"),
      genotypeVisual: this.querySelector(".genotypeVisual"),
    };

    this.appendChild(
      stringToStyleSheetNode(`
  .genotypeVisual {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row;
    flex-wrap: wrap;
    padding: 5px;
    width: fit-content;
    border-radius: 5px;
    max-width: 40rem;
  }
  .genotypeElement {
    background-color: white;
    color: black;
    padding: 5px;
    border-radius: 5px;
    border: 2px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 5px;
    width: 4rem;
    height: 4rem;
  }`)
    );
  }

  resetAnimationChanges() {
    this.style = null;
    this.elements.genes.forEach((element) => (element.style = null));
  }

  async performAnimation(
    animationFrames,
    animationTiming,
    callback = undefined,
    element = undefined
  ) {
    if (element !== undefined) {
      let animation = element.animate(animationFrames, animationTiming);
      await animation.finished;
      animation.commitStyles();
      animation.cancel();
    } else {
      let animation = this.animate(animationFrames, animationTiming);
      await animation.finished;
      animation.commitStyles();
      animation.cancel();
    }

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

  async mutateGene(genePosition, mutationValue = "?") {
    try {
      this.changeGene(genePosition, "?");
    } catch (error) {
      throw Error("Invalid genePosition argument (out-of-bounds)");
    }
    this.performAnimation(
      this.animationFrames.mutate,
      1000,
      () => this.changeGene(genePosition, mutationValue),
      this.elements.genes[genePosition]
    );
  }

  changeGene(genePosition, value) {
    this.elements.genes[genePosition].innerText = value;
  }

  getTranslationCoordinates(genePosition, x, y) {
    let gene = this.elements.genes[genePosition].getBoundingClientRect();

    let newX = gene.x - x;
    let newY = gene.y - y;

    if (newX === -0) newX = 0;
    if (newY === -0) newY = 0;

    return { x: newX, y: newY };
  }

  async swapGenes(firstGenePosition, secondGenePosition) {
    let firstElementDOMRect =
      this.elements.genes[firstGenePosition].getBoundingClientRect();
    let secondElementDOMRect =
      this.elements.genes[secondGenePosition].getBoundingClientRect();

    let firstElementCoordinates = this.getTranslationCoordinates(
      secondGenePosition,
      firstElementDOMRect.x,
      firstElementDOMRect.y
    );
    let secondElementCoordinates = this.getTranslationCoordinates(
      firstGenePosition,
      secondElementDOMRect.x,
      secondElementDOMRect.y
    );

    const firstElementAnimationsFrames = [
      { transform: "translate(0px,0px)" },
      { transform: "translate(0px,100px)" },
      {
        transform: `translate(${firstElementCoordinates.x}px,100px)`,
      },
      {
        transform: `translate(${firstElementCoordinates.x}px,${firstElementCoordinates.y}px)`,
      },
    ];

    const secondElementAnimationsFrames = [
      { transform: "translate(0px,0px)" },
      { transform: "translate(0px,-100px)" },
      {
        transform: `translate(${secondElementCoordinates.x}px,-100px)`,
      },
      {
        transform: `translate(${secondElementCoordinates.x}px,${secondElementCoordinates.y}px)`,
      },
    ];

    let first = this.elements.genes[firstGenePosition].animate(
      firstElementAnimationsFrames,
      this.animationFrames.timing
    );
    let second = this.elements.genes[secondGenePosition].animate(
      secondElementAnimationsFrames,
      this.animationFrames.timing
    );

    await first.finished;
    await second.finished;
    first.commitStyles();
    second.commitStyles();

    first.cancel();
    second.cancel();
  }

  assignFunctionToGene(genePosition, callback) {}

  createGeneFloatingCopy(genePosition) {
    let geneDomRect = this.elements.genes[genePosition].getBoundingClientRect();
    this.elements.genotypeVisual.appendChild(
      stringToNode(
        `<div class="genotypeElement" style="position:fixed; top:${
          geneDomRect.y - 5
        }px; left:${geneDomRect.x - 5}px">${
          this.elements.genes[genePosition].innerText
        }</div>`
      )
    );
  }
}

customElements.define("basic-genotype", BasicGenotype);

export { BasicGenotype };
