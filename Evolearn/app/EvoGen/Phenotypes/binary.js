class BinaryPhenotypes {
  constructor() {}

  integer(individual) {
    individual.phenotype = parseInt(individual.genotype.join(""), 2);
  }

  realNumber(individual, formula = "2.5+(x/256)*(20.5-2.5)") {
    try {
      formula = formula.replaceAll("x", parseInt(individual.genotype.join(""), 2));
      individual.phenotype = eval(formula);
    } catch (error) {
      throw Error('Invalid formula argument');
    }
  }

  schedule(individual) {
    let schedule = new Map();
    individual.genotype.forEach((element, index) => {
      schedule.set(index + 1, element === 0 ? 1 : 2);
    });
    individual.phenotype = schedule;
  }
}

export { BinaryPhenotypes };
