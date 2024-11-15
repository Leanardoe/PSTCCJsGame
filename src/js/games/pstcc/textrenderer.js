import * as PIXI from "pixi.js";

export default class TextRenderer {
    constructor(app) {
        this.app = app;

        // Containers
        this.textContainer = new PIXI.Container();
        this.inputContainer = new PIXI.Container();
        this.pointyContainer = new PIXI.Container();
        this.errorContainer = new PIXI.Container();

        // Input text objects
        this.input = new PIXI.Text("");
        this.pointy = new PIXI.Text(">");
        this.error = new PIXI.Text("");

        // Text and input text styles
        this.textStyle = new PIXI.TextStyle();
        this.inputStyle = new PIXI.TextStyle();

        // All text properties
        this.leftMargin;

        // Display text only properties
        this.textLines = [];
        this.initialLineHeight;
        this.currentLineHeight;

        // Input only properties
        this.inputY;
        this.pointyX;
        this.errorY;

        // Typing animation properties
        this.isTyping = false;
        this.typingSpeed = 1; // Characters per frame
        this.typingIndex = 0;
        this.typingLine = "";
        this.completeLines = [];

        // Adding various objects to stage and containers
        this.app.stage.addChild(this.textContainer);
        this.inputContainer.addChild(this.input);
        this.pointyContainer.addChild(this.pointy);
        this.errorContainer.addChild(this.error);
        this.app.stage.addChild(this.inputContainer);
        this.app.stage.addChild(this.pointyContainer);
        this.app.stage.addChild(this.errorContainer);

        // This is called to initialize the properties above and apply them to their respective objects
        this.updateTextStyle();
    }

    // Dynamically set text and input style and placement based on canvas size for clearer text
    updateTextStyle() {
        // All text properties
        this.leftMargin = this.app.screen.width * .1;

        // Display text only properties
        this.initialLineHeight = this.app.screen.height * .1;

        // Input only properties
        this.inputY = this.app.screen.height * .85;
        this.pointyX = this.leftMargin - this.app.screen.width * .03;
        this.errorY = this.inputY - this.app.screen.height * .05;

        // Dynamic font size
        const fontSize = Math.max(this.app.screen.width * .03, 20);
        const inputFontSize = Math.max(fontSize - fontSize * .05, 18);
        const errorFontSize = Math.max(fontSize - fontSize * .2, 15);

        // Dynamic bounds for word wrapping
        const wordWrapWidth = this.app.screen.width - 2 * this.leftMargin;

        // Styles for display text and input
        this.textStyle = {
            fill: 0xFFFFFF,
            fontFamily: "Arial",
            fontSize: fontSize,
            wordWrap: true,
            wordWrapWidth: wordWrapWidth,
            align: "center",
            resolution: window.devicePixelRatio || 2
        };
        this.inputStyle = {
            fill: 0xFFFFFF,
            fontFamily: "Courier",
            fontSize: inputFontSize,
            wordWrap: true,
            wordWrapWidth: wordWrapWidth,
            resolution: window.devicePixelRatio || 2
        };

        // Updating input positions
        this.input.x = this.leftMargin;
        this.input.y = this.inputY;

        this.pointy.x = this.pointyX;
        this.pointy.y = this.inputY;

        this.error.x = this.leftMargin;
        this.error.y = this.errorY;

        // Updating style of input
        this.input.style = this.inputStyle;
        this.pointy.style = this.inputStyle;
        this.pointy.style.fill = 0x999999;
        this.error.style = this.inputStyle;
        this.error.style.fill = 0xFF0000;
        this.error.style.fontSize = errorFontSize;
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

    renderInput(text) {
        this.input.text = text;
    }

    renderPointy(isRendered) {
        this.pointyContainer.visible = false;
        if(isRendered) {
            return false;
        } else {
            this.pointyContainer.visible = true;
            return true;
        }
    }

    renderError(errorMessage) {
        this.error.text = errorMessage;
    }
}
