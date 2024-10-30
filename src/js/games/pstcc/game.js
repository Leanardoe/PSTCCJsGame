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
        backgroundColor: 0x000000
    })

    inputHandler = new InputHandler(app);
    window.addEventListener("keydown", inputHandler.keyDown.bind(inputHandler));
    window.addEventListener("keyup", inputHandler.keyUp.bind(inputHandler));

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
        checkInput(inputHandler.pollInput());
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

function checkInput(keys) {
    let choice;
    Object.keys(keys).forEach(item => {
        if (keys[item] == true) {
            inputEnabled = false;
            choice = parseInt(item);
            passageController.changePassage(choice);
        }
    });
}

async function renderPassage(passageId) {
    await passageController.loadPassage(passageId);
    let passageText = passageController.getCurrentPassageText();
    let passageTitle = passageController.getCurrentPassageTitle();

    createTextLine(passageText);
}

pixis();