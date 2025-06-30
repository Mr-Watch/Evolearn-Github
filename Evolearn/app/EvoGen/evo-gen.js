import { getRandomInteger, getRandomReal } from "../AuxiliaryScripts/utils.js";
import { BinaryIndividual } from "./Individuals/binary.js";
import { OrderBasedIndividual } from "./Individuals/order-based.js";
import { RealNumberIndividual } from "./Individuals/real-number.js";
import { BinaryMutations } from "./Mutations/binary.js";
import { BinaryPhenotypes } from "./Phenotypes/binary.js";
import { Population } from "./Population/population.js";
import { BinaryRecombinations } from "./Recombinations/binary.js";
import { RouletteWheelSelection } from "./Selections/roulette-wheel.js";
import { TournamentSelection } from "./Selections/tournament.js";

const evoGenWorker = new Worker("./EvoGen/evo-gen-worker.js");

const _functionMap = new Map();

evoGenWorker.onmessage = (event) => {
  console.log("Message received " + event.data[0]);
};

function loadPopulation(populationTypeSelector) {
  evoGenWorker.postMessage(["loadPopulation", populationTypeSelector, 10, 5]);
}

window.l = loadPopulation;

let individual = {
  id: 0,
  genotype: {},
  fitness: 0,
  chanceOfReproduction: 0,
};

class Individual {
  constructor() {
    this.id;
    this.genotype = {};
    this.fitness;
    this.chanceOfReproduction;
  }
}

class Evaluations {
  static evaluationMethodNames = ["first", "second"];
  static evaluationMethodSelector = "first";
  constructor() {}
  static evaluateFitness(individual) {
    this[this.evaluationMethodSelector](individual);
  }

  static changeEvaluationMethod(value) {
    if (!evaluationMethodNames.includes(value)) {
      console.error("You entered an invalid evaluation method name");
      console.info("Available Options:");
      let namesString = "";
      evaluationMethodNames.forEach((name) => (namesString += `${name}\n`));
      console.log(namesString);
      return;
    }
    evaluationMethodSelector = value;
  }

  static first(individual) {
    console.log(1);
  }

  static second(individual) {
    console.log(2 + individual);
    console.log(evaluationMethodNames);
  }
}



window.aa = new BinaryIndividual();
window.aa.overrideGenotype("1010001110");
aa.fitness = 10;

window.bb = new BinaryIndividual();
window.bb.overrideGenotype("0011010010");
bb.fitness = 100;

window.oo = new OrderBasedIndividual();
oo.generateGenotype(10)
window.b = new BinaryPhenotypes();
window.c = new RealNumberIndividual();
window.d = new BinaryMutations();
window.e = new BinaryRecombinations();
window.t = new TournamentSelection();

let individuals = [];

for (let index = 0; index < 10; index++) {
  let individual = new BinaryIndividual();
  individual.id = index;
  individual.generateGenotype(10);
  individual.fitness = getRandomInteger(0, 1000);
  individuals.push(individual);
}

console.log("done");
window.p = new Population();
p.insertIndividuals(individuals);
window.r = new RouletteWheelSelection();
r.getRouletteWheel(window.p)
let snapShot = window.p.createPopulationSnapShot();

// window.n = new Population();
// window.n.initializeWithSnapShot(snapShot);
