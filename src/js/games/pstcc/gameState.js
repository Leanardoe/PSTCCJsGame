export default class GameState {
    constructor() {
        this.stateDictionary = {};
    }

    setValue(key, value) {
        this.stateDictionary[key.trim()] = value.trim();
    }

    checkValue(key, op, check) {
        if (op == "eq") {
            return this.stateDictionary[key] == check;
        }

        let checknum = parseInt(check);
        let value = parseInt(this.stateDictionary[key]);

        if (op == "lt") {
            return value < checknum;
        }

        if (op == "gt") {
            console.log(checknum, value);
            return value > checknum;
        }

        if (op == "lte") {
            return value <= checknum;
        }

        if (op == "gte") {
            return value >= checknum;
        }
    }
}