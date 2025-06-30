import { getRandomInteger } from "../../AuxiliaryScripts/utils.js";

class BinaryMutations {
  constructor() {}

  singleGeneMutation(individual) {
    individual.flipBit(getRandomInteger(0, individual.genotype.length - 1));
    return individual.genotype;
  }

  maskGeneMutation(individual, mask) {
    if (!/^[01]+$/g.test(mask)) {
      throw Error("Invalid mask entered");
    }

    if (mask.length !== individual.genotype.length) {
      throw Error("Mask is not the same length as genotype");
    }

    mask = mask.split("");

    individual.genotype.forEach((gene, index) => {
      if (mask[index] === "1") {
        individual.flipBit(index);
      }
    });
    return individual.genotype;
  }

  swapGeneMutation(individual, firstPosition, secondPosition) {
    if (
      individual.genotype[firstPosition] === undefined ||
      individual.genotype[secondPosition] === undefined
    ) {
      throw Error("Positional arguments are invalid");
    }

    let temp1 = individual.genotype[firstPosition];
    let temp2 = individual.genotype[secondPosition];

    individual.genotype[firstPosition] = temp2;
    individual.genotype[secondPosition] = temp1;

    return individual.genotype;
  }
}

export { BinaryMutations };
