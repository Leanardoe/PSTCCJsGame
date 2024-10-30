import * as PIXI from "pixi.js";

export default class TextRenderer{

    constructor(app) {
        this.app = app;
        this.textContainer = new PIXI.Container();
        this.textLines = [];
        this.leftMargin = 50;
        this.initialLineHeight = 50;
        this.currentLineHeight = this.initialLineHeight;

        app.stage.addChild(this.textContainer);

        this.textStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Arial",
            fontSize: 12,
            wordWrap: true,
            wordWrapWidth: 180
        })
    }

    clear() {
        this.textLines.length = 0;
    }

    renderTextLines() {
        //Called in ticker, draws text lines to the screen
        this.textContainer.removeChildren();
        this.currentLineHeight = this.initialLineHeight;

        this.textLines.forEach(line => {
            line.x = this.leftMargin;
            line.y = this.currentLineHeight;
            this.currentLineHeight += 16;

            this.textContainer.addChild(line);
        });
    }

    addTextLine(text) {
        //text is a string
        const line = new PIXI.Text(text, this.textStyle);
        this.textLines.push(line);
    }

    addLineBreak(count = 1) {
        for (let i = 0; i < count; i++) {
            this.addTextLine("");
        }
    }
}