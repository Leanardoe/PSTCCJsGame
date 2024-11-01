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
        this.textContainer.removeChildren();
        this.currentLineHeight = this.initialLineHeight;

        // Center the text horizontally by adjusting x position
        const centerX = this.app.screen.width / 2;

        // Render each completed line
        this.completeLines.forEach(lineText => {
            const line = new PIXI.Text(lineText, this.textStyle);
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
}
