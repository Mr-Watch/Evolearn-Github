class Selection {
    static tournamentSelection(population, tournament_size) {
        let tournament = []

        for (let i = 0; i < tournament_size; i++) {
            tournament.push(population.getRandomIndividual())
        }
        tournament.sort((a, b) => {
            return a.fitness - b.fitness;
        });
        return tournament.at(-1)
    }
}