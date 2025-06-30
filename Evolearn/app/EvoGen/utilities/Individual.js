class Individual {
    #_id
    #_fitness
    #_chance_of_reproduction
    #_representation
    #_phenotype


    constructor(id) {
        if (id === undefined)
            throw new TypeError('You need to define an id for the individual')
        this.#_id = id;
        this.#_fitness = 0;
        this.#_chance_of_reproduction = 0
        this.#_representation = {}
        this.#_phenotype = {}
    }


    get id() {
        return this.#_id
    }

    get fitness() {
        return this.#_fitness
    }

    get chance_of_reproduction() {
        return this.#_chance_of_reproduction
    }

    get representation() {
        return this.#_representation
    }

    get phenotype() {
        return this.#_phenotype
    }


    set fitness(fitness) {
        if (isNaN(fitness)) throw new TypeError('The fitness value must be a real number')
        this.#_fitness = parseFloat(fitness)
    }

    set chance_of_reproduction(chance_of_reproduction) {
        if (isNaN(chance_of_reproduction))
            throw new TypeError('The chance_of_reproduction value must be a real number')
        if (parseFloat(chance_of_reproduction) > 100 || parseFloat(chance_of_reproduction) < 0)
            throw new TypeError('The chance_of_reproduction value must be between 0% - 100%')
        this.#_chance_of_reproduction = parseFloat(chance_of_reproduction)
    }

    set representation(representation) {
        this.#_representation = representation
    }

    set phenotype(phenotype) {
        this.#_phenotype = phenotype
    }
}