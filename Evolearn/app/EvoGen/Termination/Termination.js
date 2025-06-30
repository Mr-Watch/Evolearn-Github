class Termination {
  static generationCounter = 0;
  static generationBestMemberFitness = 0;
  
  static generationLimit(experiment, limitValue) {
    if (experiment.generation > limitValue) {
      return false;
    }
    return true;
  }

  static optimumFitness(population, fitnessValue) {
    if (population.findIndividualWithFitness(fitnessValue)) {
      return true;
    }
    return false;
  }

  static generationImprovement(population, limitValue) {
    if (this.generationBestMemberFitness >= population.best.fitness) {
      this.generationCounter += 1;
    }

    this.generationBestMemberFitness = population.best.fitness;

    if (this.generationCounter >= limitValue) {
      this.generationCounter = 0;
      this.generationBestMemberFitness = 0;
      return true;
    } else return false;
  }
}
