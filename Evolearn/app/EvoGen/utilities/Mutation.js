class Mutation {
    static mutate(population, percent) {
        this.function_store[population.constructor.name](population, percent)
    }

    static binaryMutation(population, percent) {
        alert(population)
    }
    static function_store = {
        Population: this.binaryMutation
    }

}

