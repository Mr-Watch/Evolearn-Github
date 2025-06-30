import { getRandomInteger, removeItemOnIndex } from "../../AuxiliaryScripts/utils.js";

class BinaryIndividual {
  constructor() {
    this.id;
    this.genotype = [];
    this.phenotype;
    this.fitness;
    this.reproductiveChance;
    this.expectedReproductiveChance;
  }

  generateGenotype(length) {
    if (isNaN(length)) {
      throw Error("The length argument is not a number");
    }
    this.genotype = [];
    for (let index = 0; index < length; index++) {
      this.genotype.push(getRandomInteger(0, 1));
    }
    return this.genotype;
  }

  overrideGenotype(newGenotype) {
    if (!/^[01]+$/g.test(newGenotype)) {
      throw Error("Invalid genotype entered");
    }
    let preprocessedGenotype = newGenotype.split("");
    preprocessedGenotype.forEach((element, index) => {
      preprocessedGenotype[index] = parseInt(element);
    });
    this.genotype = preprocessedGenotype;
    return this.genotype;
  }

  flipBit(position) {
    let bit = this.genotype[position];
    if (bit === undefined) {
      throw Error("Invalid position argument");
    }
    this.genotype[position] = bit === 0 ? 1 : 0;
    return this.genotype;
  }

  removeBit(position) {
    let bit = this.genotype[position];
    if (bit === undefined) {
      throw Error("Invalid position argument");
    }

    this.genotype = removeItemOnIndex(this.genotype, position);
    return this.genotype;
  }
}

export { BinaryIndividual };
