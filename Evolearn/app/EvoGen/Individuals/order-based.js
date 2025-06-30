import { arrayShuffle, removeItemOnIndex } from "../../AuxiliaryScripts/utils.js";

class OrderBasedIndividual {
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
      this.genotype.push(index);
    }
    this.genotype = arrayShuffle(this.genotype);
    return this.genotype;
  }

  overrideGenotype(newGenotype) {
    let preprocessedGenotype;
    if (Array.isArray(newGenotype)) {
      preprocessedGenotype = newGenotype;
      newGenotype.forEach((element, index) => {
        if (typeof element === "string") {
          preprocessedGenotype[index] = parseInt(element);
        } else {
          preprocessedGenotype[index] = element;
        }
      });
      if (preprocessedGenotype.includes(NaN)) {
        throw Error("Invalid genotype entered");
      }
    } else {
      if (!/^([0-9]+[,])+([0-9]+)$|^([0-9]+)$/g.test(newGenotype)) {
        throw Error("Invalid genotype entered");
      }
      preprocessedGenotype = newGenotype.split(",");
      preprocessedGenotype.forEach((element, index) => {
        preprocessedGenotype[index] = parseInt(element);
      });
    }
    this.genotype = preprocessedGenotype;
    return this.genotype;
  }
}

export { OrderBasedIndividual };
