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
let inputEnabled = true;
let inputEnableTime = 20;
let timer = 0;

const pixis = async () => {
    const app = new PIXI.Application({
        view: canvas,
        width: canvasSize,
        height: canvasSize,
        autoResize: true,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 4
    });

    // Initialize InputHandler and PassageController
    inputHandler = new InputHandler(app);
    window.addEventListener("keydown", inputHandler.keyDown.bind(inputHandler));
    window.addEventListener("keyup", inputHandler.keyUp.bind(inputHandler));

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

    // Handle input and navigation
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
                passageController.goBack();
            } else {
                inputEnabled = false;
                passageController.changeNode(choice);
            }
        }
    });
}

pixis();
