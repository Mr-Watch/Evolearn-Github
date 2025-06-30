import {
  getRandomReal,
  removeItemOnIndex,
  roundToNDecimals,
} from "../../AuxiliaryScripts/utils.js";

class RealNumberIndividual {
  constructor() {
    this.id;
    this.genotype = [];
    this.phenotype;
    this.fitness;
    this.reproductiveChance;
    this.expectedReproductiveChance;
  }

  generateGenotype(length, min, max, n = 2) {
    if (isNaN(length) || isNaN(min) || isNaN(max) || isNaN(n)) {
      throw Error("One or more of the provided arguments is not a number");
    }
    this.genotype = [];
    for (let index = 0; index < length; index++) {
      this.genotype.push(roundToNDecimals(getRandomReal(min, max), n));
    }
    return this.genotype;
  }

  overrideGenotype(newGenotype) {
    if (!Array.isArray(newGenotype)) {
      throw Error("Genotype entered is not an array");
    }

    newGenotype.forEach((number, index) => {
      if (
        !/(^[0-9]+.[0-9]+$)|^[-][0-9]+$|^[0-9]+$|(^[-][0-9]+.[0-9]+$)/gm.test(
          `${number}`
        )
      ) {
        throw Error("Genotype value is not a real number");
      }
      newGenotype[index] = parseFloat(number);
    });

    this.genotype = newGenotype;
    return this.genotype;
  }

  removeNumber(position) {
    let number = this.genotype[position];
    if (number === undefined) {
      throw Error("Invalid position argument");
    }

    this.genotype = removeItemOnIndex(this.genotype, position);
    return this.genotype;
  }
}

export { RealNumberIndividual };
