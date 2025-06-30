import { getRandomInteger } from "../../AuxiliaryScripts/utils.js";
import { BinaryIndividual } from "../Individuals/binary.js";

class BinaryRecombinations {
  constructor() {}

  uniformCrossOver(individual1, individual2) {
    if (individual1.genotype.length !== individual2.genotype.length) {
      throw Error("Individuals have deferent genotype length");
    }

    let newGenotype1 = [];
    let newGenotype2 = [];
    let inverseOrder;
    let order;

    for (let index = 0; index < individual1.genotype.length; index++) {
      order = getRandomInteger(0, 1);
      inverseOrder = order === 1 ? 0 : 1;

      newGenotype1 = this.#addGene(
        newGenotype1,
        individual1,
        individual2,
        index,
        order
      );
      newGenotype2 = this.#addGene(
        newGenotype2,
        individual1,
        individual2,
        index,
        inverseOrder
      );
    }

    let tempIndividual1 = new BinaryIndividual();
    let tempIndividual2 = new BinaryIndividual();

    tempIndividual1.overrideGenotype(newGenotype1.join(""));
    tempIndividual2.overrideGenotype(newGenotype2.join(""));

    return [tempIndividual1.genotype, tempIndividual2.genotype];
  }

  maskUniformCrossOver(individual1, individual2, mask) {
    if (individual1.genotype.length !== individual2.genotype.length) {
      throw Error("Individuals have deferent genotype length");
    }

    if (!/^[01]+$/g.test(mask)) {
      throw Error("Invalid mask entered");
    }

    if (mask.length !== individual1.genotype.length) {
      throw Error("Mask is not the same length as genotype");
    }

    mask = mask.split("");

    let newGenotype1 = [];
    let newGenotype2 = [];
    let inverseOrder;
    let order;

    for (let index = 0; index < individual1.genotype.length; index++) {
      order = parseInt(mask[index]) === 1 ? 0 : 1;
      inverseOrder = parseInt(mask[index]);

      newGenotype1 = this.#addGene(
        newGenotype1,
        individual1,
        individual2,
        index,
        order
      );
      newGenotype2 = this.#addGene(
        newGenotype2,
        individual1,
        individual2,
        index,
        inverseOrder
      );
    }

    let tempIndividual1 = new BinaryIndividual();
    let tempIndividual2 = new BinaryIndividual();

    tempIndividual1.overrideGenotype(newGenotype1.join(""));
    tempIndividual2.overrideGenotype(newGenotype2.join(""));

    return [tempIndividual1.genotype, tempIndividual2.genotype];
  }

  nPointCrossOver(individual1, individual2, pointsArray = [0], order = 0) {
    if (individual1.genotype.length !== individual2.genotype.length) {
      throw Error("Individuals have deferent genotype length");
    }

    pointsArray = pointsArray.sort((a, b) => a - b);

    if (
      individual1.genotype[pointsArray[0]] === undefined ||
      individual1.genotype[pointsArray[pointsArray.length - 1]] === undefined
    ) {
      throw Error("The point array goes out of bounds");
    }

    let newGenotype1 = [];
    let newGenotype2 = [];
    let inverseOrder;
    let pointIndex = 0;

    for (let index = 0; index < individual1.genotype.length; index++) {
      if (index === pointsArray[pointIndex]) {
        order = order === 0 ? 1 : 0;
        inverseOrder = order === 1 ? 0 : 1;
        pointIndex += 1;
      }
      newGenotype1 = this.#addGene(
        newGenotype1,
        individual1,
        individual2,
        index,
        order
      );
      newGenotype2 = this.#addGene(
        newGenotype2,
        individual1,
        individual2,
        index,
        inverseOrder
      );
    }

    let tempIndividual1 = new BinaryIndividual();
    let tempIndividual2 = new BinaryIndividual();

    tempIndividual1.overrideGenotype(newGenotype1.join(""));
    tempIndividual2.overrideGenotype(newGenotype2.join(""));

    return [tempIndividual1.genotype, tempIndividual2.genotype];
  }

  #addGene(newGenotype, individual1, individual2, index, order = 0) {
    let temp1 = individual1.genotype[index];
    let temp2 = individual2.genotype[index];

    if (order === 0) {
      newGenotype[index] = temp1;
    } else {
      newGenotype[index] = temp2;
    }
    return newGenotype;
  }
}

export { BinaryRecombinations };
