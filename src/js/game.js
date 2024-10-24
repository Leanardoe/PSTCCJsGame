import { create } from "handlebars";
import * as PIXI from "pixi.js";

import PassageController from "./passageController";

let windowSize = 400;
const window = document.getElementById("test-container");

const pixis = () => {
    const app = new PIXI.Application({
        view: window,
        width: windowSize,
        height: windowSize,
        autoResize: true,
        backgroundColor: 0x000000
    })

    const passageController = new PassageController(app);

    app.ticker.add((delta) => {
        passageController.textRenderer.renderTextLines();
    });

    passageController.loadPassage(1);



    /*const gameContainer = new PIXI.Container();
    gameContainer.backgroundColor = 0xFFFFFF;
    app.stage.addChild(gameContainer);*/

    //app.stage.addChild(createTextLine('Testing text writing'));
}

function createTextLine(textData) {
    const line = new PIXI.Text(textData, textStyle);

    line.x = 50;
    line.y = 50;

    app.stage.addChild(line);

    return line;
}

async function renderPassage(passageId) {
    await passageController.loadPassage(passageId);
    let passageText = passageController.getCurrentPassageText();
    //console.log(passageText);
    let passageTitle = passageController.getCurrentPassageTitle();
    //console.log(passageTitle);

    createTextLine(passageText);
}

pixis();