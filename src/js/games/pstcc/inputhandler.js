import * as PIXI from "pixi.js";

export default class InputHandler{
    
    constructor(app) {
        this.app = app;
        this.optionCount = 0
        this.pressedKeys = {}
        this.inputEnabled = true;
    }
1
    setOptionCount(count) {
        //Option count must be between 1 and 9
        if (count < 1 || count > 9) return;
        this.optionCount = count
    }

    keyDown(e) {
        let key = parseInt(e.key);
        if (key > 0 && key <= this.optionCount) {
            //The key is a number between 1 and option count
            this.pressedKeys[e.key] = true;
        }
    }

    keyUp(e) {
        if (parseInt(e.key) > 0 && parseInt(e.key) <= this.optionCount) {
            this.pressedKeys[e.key] = false;
        }
    }

    pollInput() {
        return this.pressedKeys;
    }
}