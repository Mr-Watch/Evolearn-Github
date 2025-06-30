class BinaryEvaluations {
  constructor() {}

  simpleConversion(individual) {
    individual.fitness = parseInt(individual.genotype.join(""), 2);
    return individual;
  }
}

export { BinaryEvaluations };
