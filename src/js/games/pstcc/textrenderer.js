import * as PIXI from "pixi.js";

export default class TextRenderer {
    constructor(app) {
        this.app = app;
        this.textContainer = new PIXI.Container();
        this.textLines = [];
        
        // Set margins and spacing to center text within the canvas
        this.leftMargin = 20;
        this.initialLineHeight = 30;
        this.currentLineHeight = this.initialLineHeight;

        this.app.stage.addChild(this.textContainer);

        // Input rendering stuff, I need to update it to work with the
        // new stuff Ryan did. -Bryce
        this.inputMargin = 50;
        this.inputContainer = new PIXI.Container();
        this.inputLineHeight = app.screen.height * .9;
        this.pointyContainer = new PIXI.Container();

        app.stage.addChild(this.inputContainer);
        app.stage.addChild(this.pointyContainer);

        this.inputStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Courier",
            fontSize: 14,
        })

        // Typing animation properties
        this.isTyping = false;
        this.typingSpeed = 1; // Characters per frame
        this.typingIndex = 0;
        this.typingLine = "";
        this.completeLines = [];

        this.updateTextStyle();
    }

    updateTextStyle() {
        // Dynamically set text style based on canvas size for clearer text
        const fontSize = Math.max(this.app.screen.width / 30, 20); // Scale font size dynamically
        this.textStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Arial",
            fontSize: fontSize,
            wordWrap: true,
            wordWrapWidth: this.app.screen.width - 2 * this.leftMargin,
            align: "center",
            resolution: window.devicePixelRatio || 2 
        });
    }

    clear() {
        this.textLines = [];
        this.completeLines = [];
        this.typingIndex = 0;
        this.isTyping = false;
        this.textContainer.removeChildren();
    }

    startTyping(text) {
        // Initialize typing animation for a new line of text
        this.typingLine = text;
        this.typingIndex = 0;
        this.isTyping = true;
        this.completeLines.push(""); // Add an empty line to start
    }

    renderTextLines() {
        //Called in ticker, draws text lines to the screen
        this.textLines.forEach(line => {
            line.destroy();
        })
        this.textLines = [];

        this.textContainer.removeChildren();
        this.currentLineHeight = this.initialLineHeight;

        // Center the text horizontally by adjusting x position
        const centerX = this.app.screen.width / 2;

        // Render each completed line
        this.completeLines.forEach(lineText => {
            const line = new PIXI.Text(lineText, this.textStyle);
            this.textLines.push(line);
            line.resolution = this.app.renderer.resolution; // Set text resolution for sharpness
            line.x = centerX - line.width / 2; // Center align each line
            line.y = this.currentLineHeight;
            this.currentLineHeight += line.height + 10; // Add spacing between lines

            this.textContainer.addChild(line);
        });

        // Typing animation for the current line
        if (this.isTyping) {
            const currentLine = this.completeLines[this.completeLines.length - 1];
            const updatedLine = currentLine + this.typingLine.charAt(this.typingIndex);
            this.completeLines[this.completeLines.length - 1] = updatedLine;

            // Increment typing index
            this.typingIndex += this.typingSpeed;
            if (this.typingIndex >= this.typingLine.length) {
                this.isTyping = false; // Finish typing current line
            }
        }
    }

    addTextLine(text) {
        // Starts typing a new line if not typing, otherwise adds it to completed lines
        if (!this.isTyping) {
            this.startTyping(text);
        } else {
            this.completeLines.push(text); // Add text immediately if already typing
        }
    }

    addLineBreak(count = 1) {
        for (let i = 0; i < count; i++) {
            this.completeLines.push(""); // Add an empty line for spacing
        }
    }

    renderInput(text) {
        this.inputContainer.removeChildren();
        const input = new PIXI.Text(text, this.inputStyle);
        input.x = this.inputMargin;
        input.y = this.inputLineHeight;
        this.inputContainer.addChild(input);
    }

    renderPointy(isRendered) {
        this.pointyContainer.removeChildren();
        if(isRendered) {
            return false;
        } else {
            const pointy = new PIXI.Text(">", this.inputStyle);
            pointy.x = this.inputMargin - 15;
            pointy.y = this.inputLineHeight;
            this.pointyContainer.addChild(pointy);
            return true;
        }
    }
}
