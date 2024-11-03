import { create } from "handlebars";
import * as PIXI from "pixi.js";

import PassageController from "./passageController";
import InputHandler from "./inputhandler";

let canvasSize = 400;
const canvas = document.getElementById("test-container");

let passageController;
let inputHandler;
let input;
let inputEnabled = true;
let inputEnableTime = 20;
let timer = 0;

const pixis = () => {
    const app = new PIXI.Application({
        view: canvas,
        width: canvasSize,
        height: canvasSize,
        autoResize: true,
        resolution: 4,
        backgroundColor: 0x000000
    })

    inputHandler = new InputHandler(app);
    window.addEventListener("keydown", inputHandler.keyDown.bind(inputHandler));
    //window.addEventListener("keyup", inputHandler.keyUp.bind(inputHandler));

    passageController = new PassageController(app, inputHandler);

    app.ticker.add((delta) => {
        gameLoop();
    });

    passageController.loadPassage(1);



    /*const gameContainer = new PIXI.Container();
    gameContainer.backgroundColor = 0xFFFFFF;
    app.stage.addChild(gameContainer);*/

    //app.stage.addChild(createTextLine('Testing text writing'));
}

function gameLoop() {
    passageController.textRenderer.renderTextLines();
    if (inputEnabled) {
        if(inputHandler.enterPressed && inputHandler.pollInput() != ""){
            checkInput(inputHandler.pollInput(), passageController.getOptions());
        }
        inputHandler.enterPressed = false;
    }
    else {
        if (timer == inputEnableTime) {
            inputEnabled = true;
            timer = 0;
        }
        else {
            timer++;
        }
    }
}

/* If something other than the option number is entered, this loops through each
   option, then each word in the option's text. It compares each word to each word
   in the player's input, allowing for punctuation matching or not. As long as all
   of the words the player enters match with the option text, the id of the option
   is added to passedOptions. If passedOptions contains no ids, the game does not
   continue and creates an error message. If it contains more than one id, the
   player matched multiple and they need to enter more words. If it contains only
   one, that id is passed to changePassage. */
function checkInput(input, options) {
    let passed = true;
    const inputBroken = input.split(' ');
    let choice;
    let passedOptions = [];
    let inputWord;
    let optionWord;
    let id;
    let idIndex;
    let errorMessage;

    options.forEach(option => {
        id = option.id;
        if(input.replaceAll(/[.,!?']/g, '') == id) {
            passedOptions.push(id);
        } else {
            for (let i = 0; i < option.textBroken.length; i++) {
                inputWord = inputBroken[i];
                optionWord = option.textBroken[i];
                idIndex = passedOptions.indexOf(id);
                if(inputWord != null && optionWord != null) {
                    inputWord = inputWord.replaceAll(/[.,!?']/g, '');
                    optionWord = optionWord.replaceAll(/[.,!?']/g, '');
                    if(inputWord.toLowerCase() != optionWord.toLowerCase()) {
                        if(idIndex > -1) {
                            passedOptions.splice(idIndex, 1);
                        }
                        break;
                    } else if(idIndex == -1) {
                        passedOptions.push(id);
                    }
                    //console.log(id + ") Word matched. " + optionWord);
                }
            }
        }
    });

    if(passedOptions.length == 0) {
        errorMessage = "Input doesn't match any options. Try again.";
        passed = false;
    } else if(passedOptions.length > 1) {
        errorMessage = "Input matches multiple options. Be more specific.";
        passed = false;
    }

    if(passed) {
        choice = passedOptions[0];
        passageController.changePassage(choice);
        //console.log("Passed.");
        inputHandler.clearInput();
    } else console.log(errorMessage);
}

async function renderPassage(passageId) {
    await passageController.loadPassage(passageId);
    let passageText = passageController.getCurrentPassageText();
    let passageTitle = passageController.getCurrentPassageTitle();

    createTextLine(passageText);
}

pixis();