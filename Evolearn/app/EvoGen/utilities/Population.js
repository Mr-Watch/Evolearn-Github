class Population {
    #_id
    #_size
    #_individuals
    #_best_individual
    #_average_fitness
    #_total_fitness


    constructor(id, size) {
        if (id === undefined)
            throw new TypeError('You need to define an id for the population')
        this.#_id = id
        if (isNaN(size))
            throw new TypeError('The size value must be an integer\nAny floating point number will be rounded down')
        if (parseInt(size) <= 0)
            throw new TypeError('The population needs at least one member')
        this.#_size = parseInt(size)
        this.#_individuals = []
        this.#_best_individual = {}
        this.#_average_fitness = 0
        this.#_total_fitness = 0
    }


    get id() {
        return this.#_id
    }

    get size() {
        return this.#_size
    }

    get individuals() {
        return this.#_individuals
    }

    get best_individual() {
        return this.#_best_individual
    }

    get average_fitness() {
        return this.#_average_fitness
    }

    get total_fitness() {
        return this.#_total_fitness
    }


    set best_individual(best_individual) {
        this.#_best_individual = best_individual
    }

    set average_fitness(average_fitness) {
        this.#_average_fitness = average_fitness;
    }

    set total_fitness(total_fitness) {
        this.#_total_fitness = total_fitness
    }


    getRandomIndividual() {
        return this.#_individuals[getRandomInteger(0, this.#_size - 1)]
    }

    findIndividualWithFitness(fitness_value) {
        return this.#_individuals.find(individual => individual.fitness === fitness_value)
    }
}