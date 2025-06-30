class RouletteWheelSelection {
  constructor() {}
  getRouletteWheel(population) {
    let sectorTracker = 0;
    population.individuals.forEach((individual) => {
      individual.reproductiveChance =
        (individual.fitness / population.totalFitness) * 100;
      individual.expectedReproductiveChance =
        individual.fitness / population.averageFitness;
      individual.sector = [sectorTracker, sectorTracker + individual.fitness];
      sectorTracker += individual.fitness;
    });
  }
}

export { RouletteWheelSelection };
