class RankBasedSelection {
  constructor() {}

  generateSelectionProportions(population) {
    let sortedPopulation = population.sortDescendingFitness();
    let h = 0;

    h =
      population.worst +
      ((population.best.fitness - population.worst.fitness) * (r - 1)) /
        (population.size - 1);
  }
}

export {RankBasedSelection}
