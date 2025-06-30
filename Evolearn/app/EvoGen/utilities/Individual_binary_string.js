class Individual_binary_string extends Individual {
    constructor(id, length) {
        super(id)
        if (isNaN(length))
            throw new TypeError('The length value must be an integer\nAny floating point number will be rounded down')
        let temp_representation = ''
        length = parseInt(length)
        for (let i = 0; i < length; i++) {
            temp_representation += `${getRandomInteger(0, 1)}`;
        }

        this.representation = temp_representation
        this.phenotype = parseInt(this.representation, 2)
        this.fitness =  this.phenotype * this.phenotype
    }
    
}