import { create } from "handlebars";
import * as PIXI from "pixi.js";

import PassageController from "./passageController";
import InputHandler from "./inputhandler";
import audioMgr from "./audioManager.js";
// import FilterController from './filters.js';

let canvasSize = 400;
const canvas = document.getElementById("test-container");

let passageController;
let inputHandler;
// let filterController; 
let pointyTimer = 0;
const pointyTimerInterval = 30;
let pointyRendered = false;

const pixis = async () => {
    const app = new PIXI.Application({
        view: canvas,
        width: canvasSize,
        height: canvasSize,
        autoResize: true,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 2
    });

    // Initialize InputHandler and PassageController
    inputHandler = new InputHandler(app);
    window.addEventListener("keydown", inputHandler.keyDown.bind(inputHandler));

    passageController = new PassageController(app, inputHandler);

    // Initialize FilterController
    // filterController = new FilterController();

    // Game container
    const gameContainer = new PIXI.Container();

    // Load all passages initially and start with the first one
    await passageController.loadPassages();

    gameContainer.addChild(passageController.textRenderer.textContainer);

    // Apply filters to the game container
    // gameContainer.filters = filterController.filters;

    // Add the game container to the stage
    app.stage.addChild(gameContainer);

    //handleResize(app);
    window.addEventListener("resize", () => handleResize(app));

    app.ticker.add((delta) => {
        gameLoop(delta);
    });
};

// Handle canvas resizing and update text style when window resizes
function handleResize(app) {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    passageController.textRenderer.updateTextStyle();
    passageController.renderCurrentNode(); 
}

function gameLoop(delta) {
    // filterController.update(delta);

    // Render text lines with typing animation
    passageController.textRenderer.renderTextLines();

    // Render the user's input
    passageController.textRenderer.renderInput(inputHandler.pollInput());

    // Handle input and navigation
    if (inputHandler.inputEnabled) {
        pointyTimer++;
        if(pointyTimer % pointyTimerInterval == 0) {
            pointyRendered = passageController.textRenderer.renderPointy(pointyRendered);
            pointyTimer = 0;
        }

        if(inputHandler.enterPressed && inputHandler.pollInput() != ""){
            console.log(passageController.getOptions);
            checkInput(inputHandler.pollInput(), passageController.getOptions());
        }
        inputHandler.enterPressed = false;
    } else {
        passageController.textRenderer.renderPointy(true);
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
    let inputWord, optionWord, optionWordPunctless;
    let id, idIndex;
    let errorMessage;

    options.forEach(option => {
        const optionWords = option.text.split(' ');
        id = option.id;
        if(input.replaceAll(/[.,!?']/g, '') == id) {
            passedOptions.push(id);
            //console.log("ID matched. " + id);
        } else {
            for (let i = 0; i < option.textBroken.length; i++) {
                inputWord = inputBroken[i];
                optionWord = option.textBroken[i];
                
                idIndex = passedOptions.indexOf(id);

                if(inputWord != null && optionWord != null) {
                    inputWord = inputWord.toLowerCase();
                    optionWord = optionWord.toLowerCase();
                    optionWordPunctless = optionWord.replaceAll(/[.,!?']/g, '');

                    if(inputWord == optionWord || inputWord == optionWordPunctless) {
                        if(idIndex == -1) {
                            passedOptions.push(id);
                        }
                        //console.log(id + ") Word matched. " + optionWord);
                    } else {
                        if(idIndex > -1) {
                            passedOptions.splice(idIndex, 1);
                        }
                        return;
                    }
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
        passageController.changeNode(choice);
        //console.log("Passed.");
        inputHandler.clearInput();
    } else console.log(errorMessage);
}

pixis();
