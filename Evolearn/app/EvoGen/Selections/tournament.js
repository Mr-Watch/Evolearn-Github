import { Population } from "../Population/population.js";

class TournamentSelection {
  constructor() {}
  select(population, tournamentSize) {
    let tournament;
    let tempPopulation = new Population();

    if (tournamentSize > population.size) {
      throw Error("The tournament size can not be larger than the population");
    }
    tournament = population.getRandomIndividuals(tournamentSize);
    tempPopulation.insertIndividuals(tournament);
    return tempPopulation.best;
  }
}

export { TournamentSelection };
