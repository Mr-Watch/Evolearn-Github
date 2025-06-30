class Probability {
    #percentage_pattern = new RegExp('/(^0.[\d]{1,4}$)|(^[0]{1}$)|(^[1]{1}$)/g')
    #probability_array = []
    #probability_array_pointer = 0

    constructor(percentage) {
        if (!this.#percentage_pattern.test(percentage)) throw TypeError('The percentage needs to be a number ranging from 0 to 1 with a maximum precision of 4 decimal places (ex: 0.0420)')
        let decimals = percentage.toString().split('.')[1].length
        let array_length = Math.pow(10, decimals)
        let number_of_ones = percentage * array_length
        this.#probability_array = new Array(array_length)
        this.#probability_array.fill(0).fill(1, 0, number_of_ones)
        arrayShuffle(this.#probability_array)
    }

    getValue() {
        let return_value = this.#probability_array[this.#probability_array_pointer]
        if (return_value === undefined) {
            arrayShuffle(this.#probability_array)
            this.#probability_array_pointer = 1
            return this.#probability_array[this.#probability_array_pointer - 1]
        }
        this.#probability_array_pointer += 1
        return return_value
    }
}