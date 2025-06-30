class Population_binary_string extends Population {
    constructor(id,size){
        super(id,size)
        for (let i = 0; i < size; i++) {
            this.individuals.push(new Individual_binary_string(i,5))
            this.total_fitness += this.individuals[i].fitness
        }
        this.average_fitness = this.total_fitness/this.size
        this.best_individual = this.individuals.sort((individual_a, individual_b) => {
            return individual_b.fitness - individual_a.fitness;
        })[0];

    }
}