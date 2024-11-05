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
            return checknum < value;
        }

        if (op == "gt") {
            return checknum > value;
        }

        if (op == "lte") {
            return checknum <= value;
        }

        if (op == "gte") {
            return checknum >= value;
        }
    }
}