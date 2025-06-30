export function generateInitialPopulation(population_size, size_of_member) {
    // let population = generateBinaryStringPopulation(population_size, size_of_member);
    // calculatePopulationFitness(population);
    
    // let average_fitness = calculateAverageFitness(population);
    // let total_fitness = calculateTotalFitness(population);
    // let best_member = population.at(-1);
    // calculateChanceOfReproduction(population, total_fitness);

    // return {
    //     population: population,
    //     average_fitness: average_fitness,
    //     total_fitness: total_fitness,
    //     best_member: best_member,
    // };
    return 'nice'
}


export function generateBinaryStringPopulation(population_size, size_of_member) {
    let population = [];

    for (let i = 0; i < population_size; i++) {
        population[i] = { representation: "" };
        for (let j = 0; j < size_of_member; j++) {
            population[i].representation += `${getRandomInteger(0, 1)}`;
        }
    }

    return population;
}

function calculatePopulationFitness(population) {
    for (member of population) {
        let member_value = parseInt(member.representation, 2);
        member.fitness = member_value * member_value;
    }

    return population;
}

function calculateChanceOfReproduction(population, total_fitness) {
    for (member of population) {
        member.chance_of_reproduction = 100 * (member.fitness / total_fitness);
    }

    return population;
}

function calculateTotalFitness(population) {
    let total_fitness = 0;

    for (member of population) {
        total_fitness += member.fitness;
    }

    return total_fitness;
}

function calculateAverageFitness(population) {
    return calculateTotalFitness(population) / population.length;
}

function generateProbabilityArray(precision, array_length) {
    let number_of_ones = precision * array_length;
    let probability_array = new Array(array_length);
    probability_array.fill(1, 0, number_of_ones).fill(0, number_of_ones);
    arrayShuffle(probability_array)
    return probability_array;
}



function simpleStringCrossOver(first_string, second_string, cross_over_pivot) {
    first_string = first_string.split("");
    second_string = second_string.split("");

    let first_string_temp = first_string.splice(
        cross_over_pivot,
        first_string.length - cross_over_pivot
    );

    let second_string_temp = second_string.splice(
        cross_over_pivot,
        second_string.length - cross_over_pivot
    );

    first_string = first_string.concat(second_string_temp).join("");
    second_string = second_string.concat(first_string_temp).join("");

    return [first_string, second_string];
}


function getRouletteWheelFitness(random_numbers, fitness_range) {
    let original_fitness_range = fitness_range;
    let selected_fitness_numbers = [];

    while (random_numbers.length !== 0) {
        let random_number = random_numbers.shift();

        while (fitness_range.length !== 1) {
            let pivot_element = fitness_range[getArrayMiddleIndex(fitness_range)];
            let pivot_index = getArrayMiddleIndex(fitness_range);

            if (random_number >= pivot_element) {
                fitness_range = fitness_range.slice(pivot_index, fitness_range.length);
            } else {
                fitness_range = fitness_range.slice(0, pivot_index);
            }
        }

        selected_fitness_numbers.push(fitness_range[0]);
        fitness_range = original_fitness_range;
    }

    return selected_fitness_numbers;
}