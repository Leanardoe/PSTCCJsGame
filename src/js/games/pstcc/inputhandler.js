import * as PIXI from "pixi.js";

export default class InputHandler{

    constructor(app) {
        this.app = app;
        this.optionCount = 0;
        this.pressedKeys = [];
        this.inputEnabled = true;
        this.enterPressed = false;
        this.charLimit = 30;
    }

    setOptionCount(count) {
        //Option count must be between 1 and 9
        if (count < 1 || count > 9) return;
        this.optionCount = count
    }

    keyDown(e) {
        const key = String(e.key);
        
        // Removes the last character from the text array if backspace is pressed
        if(key === "Backspace") {
            this.pressedKeys.pop();
            console.log(this.pressedKeys);
        }
        if(key === "Enter") this.enterPressed = true;
        //This checks for keys like "Shift" and "Enter"
        if(key.length > 1) return;
        
        // Grabs the ascii code of the letter, ensures it's within the range
        // of acceptable characters, then adds it to the text array. This may
        // be unnecessary, but I don't want any sneaky keys getting in there
        const keyCode = key.charCodeAt(0);
        if(keyCode >= 32 && keyCode <= 126 && this.pressedKeys.length < this.charLimit) {
            this.pressedKeys.push(key);
        }
        console.log(this.pressedKeys);
    }

    clearInput() {
        this.pressedKeys = [];
    }

    keyUp(e) {
        if (parseInt(e.key) > 0 && parseInt(e.key) <= this.optionCount) {
            this.pressedKeys[e.key] = false;
        }
    }

    pollInput() {
        let text = "";
        this.pressedKeys.forEach(character => {
            text = text + character;
        });
        //console.log(text.trim());
        return text.trim();
    }
}