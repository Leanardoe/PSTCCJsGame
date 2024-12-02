import * as PIXI from "pixi.js";

export default class InputHandler{

    constructor(app) {
        this.app = app;
        // this.optionCount = 0;
        this.pressedKeys = [];
        this.inputEnabled = true;
        this.enterPressed = false;
        this.charLimit = 80;

        // If this is true, the game uses a custom way of displaying multi-line input.
        // I ended up just using word wrapping, but decided to leave this in because why not.
        // If this is to be used, word wrapping needs to be disabled for input in textrenderer.
        this.newlineSystemEnabled = false;
        this.charCount = 0;
        this.newlineIndex = 0;
        this.newlineJustPlaced = false;
    }

    // setOptionCount(count) {
    //     //Option count must be between 1 and 9
    //     if (count < 1 || count > 9) return;
    //     this.optionCount = count
    // }

    keyDown(e) {
        if(e.keyCode == 32 && e.target == document.body) {
            //Prevents spacebar from scrolling page
            e.preventDefault();
        }

        if(this.inputEnabled) {
            // String representation of which key was pressed
            const key = String(e.key);
        
            // Removes the last character from the text array if backspace is pressed
            if(key === "Backspace") {
                if(this.newlineSystemEnabled) if(this.pressedKeys.length > 0) this.charCount--;
                
                this.pressedKeys.pop();

                // This automatically removes the newline or newline dash character if it's at the end of the array
                if(this.newlineSystemEnabled) if(this.pressedKeys[this.pressedKeys.length - 1] == "\n" || this.pressedKeys[this.pressedKeys.length - 1] == "-\n") {
                    this.pressedKeys.pop();
                    this.newlineJustPlaced = false;
                }

                // console.log(this.charCount);
                // console.log(this.pressedKeys);
            }

            // Sets the flag that's checked in game.js to see if the user has entered their text
            if(key === "Enter") this.enterPressed = true;

            // This checks for keys like "Shift" and "Enter"
            if(key.length > 1) return;
            
            // Grabs the ascii code of the letter, ensures it's within the range
            // of acceptable characters, then adds it to the text array. This may
            // be unnecessary, but I don't want any sneaky keys getting in there
            const keyCode = key.charCodeAt(0);
            if(!this.newlineSystemEnabled) {
                if(keyCode >= 32 && keyCode <= 126 && this.pressedKeys.length < this.charLimit) {
                    this.pressedKeys.push(key);
                }
            } else {
                if(keyCode >= 32 && keyCode <= 126 && this.charCount.length < this.charLimit) {
                    // Automatically adds a newline character if the user has used half of the character limit
                    if(this.charCount == this.charLimit / 2) {
                        this.pressedKeys.push("\n");
                        this.newlineIndex = this.pressedKeys.length - 1;
                        this.newlineJustPlaced = true;
                    }

                    // If a newline character was just put into the array and the next character entered is not a
                    // space, it places a dash before the newline character to break the word up in a nicer way
                    if(this.newlineJustPlaced && this.pressedKeys[this.newlineIndex - 1] != " " && key != " ") this.pressedKeys[this.newlineIndex] = "-\n";
    
                    // charCount exists so that the newline character doesn't impact the charLimit
                    this.pressedKeys.push(key);
                    this.charCount++;
                    this.newlineJustPlaced = false;
                }
            }
        }
    }

    clearInput() {
        this.pressedKeys = [];
        if(this.newlineSystemEnabled) {
            this.charCount = 0;
            this.newlineIndex = 0;
        }
    }

    getInput() {
        let text = "";
        this.pressedKeys.forEach(character => {
            text = text + character;
        });
        //console.log(text.trim());
        return text.trim();
    }

    pollInput() {
        let text = "";
        this.pressedKeys.forEach(character => {
            // Skips the newline and newline dash characters
            if(character != "\n" && character != "-\n") {
                text = text + character;
            }
        });
        //console.log(text.trim());
        return text.trim();
    }

    enableInput() {
        this.inputEnabled = true;
    }

    disableInput() {
        this.inputEnabled = false;
    }
}