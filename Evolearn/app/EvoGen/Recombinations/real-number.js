import { RealNumberIndividual } from "../Individuals/real-number.js";

class RealNumberRecombinations {
  constructor() {}

  arithmeticCrossover(individual1, individual2) {
    let newIndividual = new RealNumberIndividual();
    let newIndividualGenotype = [];

    if (individual1.genotype.length !== individual2.genotype.length) {
      throw Error("Individuals have deferent genotype length");
    }

    for (let index = 0; index < individual1.length; index++) {
      newIndividualGenotype[index] =
        (individual1.genotype[index] + individual2.genotype[index]) / 2;
    }

    newIndividual.overrideGenotype(newIndividualGenotype);
    return newIndividual;
  }
}

export { RealNumberRecombinations };
