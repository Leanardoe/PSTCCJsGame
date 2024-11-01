import { create } from "handlebars";
import * as PIXI from "pixi.js";

import PassageController from "./passageController";
import InputHandler from "./inputhandler";

let canvasSize = 400;
const canvas = document.getElementById("test-container");

let passageController;
let inputHandler;
let inputEnabled = true;
let inputEnableTime = 20;
let timer = 0;

const pixis = async () => {
    const app = new PIXI.Application({
        view: canvas,
        width: canvasSize,
        height: canvasSize,
        autoResize: true,
        backgroundColor: 0x000000
    });

    inputHandler = new InputHandler(app);
    window.addEventListener("keydown", inputHandler.keyDown.bind(inputHandler));
    window.addEventListener("keyup", inputHandler.keyUp.bind(inputHandler));

    passageController = new PassageController(app, inputHandler);

    // Load all passages initially and start with the first one
    await passageController.loadPassages();

    app.ticker.add((delta) => {
        gameLoop();
    });
};

function gameLoop() {
    // Render text lines with typing animation
    passageController.textRenderer.renderTextLines();

    if (inputEnabled) {
        checkInput(inputHandler.pollInput());
    } else {
        if (timer === inputEnableTime) {
            inputEnabled = true;
            timer = 0;
        } else {
            timer++;
        }
    }
}

function checkInput(keys) {
    let choice;

    Object.keys(keys).forEach(item => {
        if (keys[item] === true) {
            choice = parseInt(item);

            if (choice === 0) {
                // Go back if '0' is pressed (or any specified key for backtracking)
                passageController.goBack();
            } else {
                inputEnabled = false;
                passageController.changeNode(choice);
            }
        }
    });
}

// Initialize the application
pixis();
