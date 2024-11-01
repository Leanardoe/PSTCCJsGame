import * as PIXI from "pixi.js";

export default class TextRenderer {
    constructor(app) {
        this.app = app;
        this.textContainer = new PIXI.Container();
        this.textLines = [];
        this.leftMargin = 50;
        this.initialLineHeight = 50;
        this.currentLineHeight = this.initialLineHeight;
        
        // Typing animation settings
        this.isTyping = false;
        this.typingSpeed = 1; // Characters per frame
        this.typingIndex = 0;
        this.typingLine = "";
        this.completeLines = [];

        app.stage.addChild(this.textContainer);

        this.textStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontFamily: "Arial",
            fontSize: 14,
            wordWrap: true,
            wordWrapWidth: 180,
            resolution: 2 // Increase resolution for sharper text
        });
    }

    clear() {
        this.textLines.length = 0;
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
        // Called in ticker, renders text lines with typing effect
        this.textContainer.removeChildren();
        this.currentLineHeight = this.initialLineHeight;

        // Render each completed line
        this.completeLines.forEach(lineText => {
            const line = new PIXI.Text(lineText, this.textStyle);
            line.x = this.leftMargin;
            line.y = this.currentLineHeight;
            this.currentLineHeight += 20; // Increase line height slightly for readability
            this.textContainer.addChild(line);
        });

        // Render the current typing line if still typing
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
}
