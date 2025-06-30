import {
  getArrayMiddleIndex,
  getRandomInteger,
  removeItemOnIndex,
} from "../../AuxiliaryScripts/utils.js";

class Population {
  constructor() {
    this.individuals = [];
    this.size = 0;
    this.best = {};
    this.worst = {};
    this.average = {};
    this.totalFitness = 0;
    this.averageFitness = 0;
  }

  insertIndividuals(individuals) {
    for (let index = 0; index < individuals.length; index++) {
      this.individuals.push(individuals[index]);
    }
    this.updatePopulationStats();
  }

  removeIndividual(id) {
    let index = this.individuals.findIndex(
      (individual) => individual.id === id
    );
    this.individuals = removeItemOnIndex(this.individuals, index);
    this.updatePopulationStats();
  }

  getIndividual(id) {
    let index = this.individuals.findIndex(
      (individual) => individual.id === id
    );
    return this.individuals[index];
  }

  getRandomIndividuals(numberOfIndividuals) {
    let returnedIndividuals = [];

    for (let index = 0; index < numberOfIndividuals; index++) {
      returnedIndividuals.push(
        this.individuals[getRandomInteger(0, this.size - 1)]
      );
    }
    return returnedIndividuals;
  }

  findIndividualWithFitness(fitnessValue) {
    return this.individuals.find(
      (individual) => individual.fitness === fitnessValue
    );
  }

  updatePopulationStats() {
    this.individuals.forEach((individual) => {
      this.totalFitness += individual.fitness;
    });
    let tempPopulationSorted = this.sortAscendingFitness();
    this.best = tempPopulationSorted[tempPopulationSorted.length - 1];
    this.worst = tempPopulationSorted[0];
    this.average =
      this.sortDescendingFitness()[getArrayMiddleIndex(this.individuals)];
    this.size = this.individuals.length;
    this.averageFitness = this.totalFitness / this.size;
  }

  sortDescendingFitness(override = false) {
    if (override) {
      this.individuals.sort((a, b) => b.fitness - a.fitness);
    } else {
      return this.individuals.toSorted((a, b) => b.fitness - a.fitness);
    }
  }

  sortAscendingFitness(override = false) {
    if (override) {
      this.individuals.sort((a, b) => a.fitness - b.fitness);
    } else {
      return this.individuals.toSorted((a, b) => a.fitness - b.fitness);
    }
  }

  createPopulationSnapShot() {
    return structuredClone(this);
  }

  initializeWithSnapShot(snapShot) {
    this.individuals = snapShot.individuals;
    this.size = snapShot.size;
    this.best = snapShot.best;
    this.worst = snapShot.worst;
    this.average = snapShot.average;
    this.totalFitness = snapShot.totalFitness;
    this.averageFitness = snapShot.averageFitness;
  }
}

export { Population };
