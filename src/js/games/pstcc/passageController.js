import * as PIXI from "pixi.js";
import TextRenderer from "./textrenderer";
import StoryNode from "./storyNode";
import GameState from "./gameState";

export default class PassageController {
    constructor(app, input) {
        this.textRenderer = new TextRenderer(app);
        this.app = app;
        this.input = input;
        this.state = new GameState();
        this.storyNodes = {};
        this.currentNode = null;
        this.previousNodes = []; // Stack for tracking previous nodes
        this.parser = new DOMParser();
        this.passageFolder = "../resource/passages";
        this.passageFile = "testpassages.xml";
        this.endText = "The End"; // Default end text
        this.currentPassageText = null;
        this.currentPassageOptions = null;
    }

    async loadPassages() {
        // Load and parse the XML file, create StoryNode instances
        const passagesXML = await PIXI.Assets.load(this.passageFolder + "/" + this.passageFile);
        const parsedXML = this.parser.parseFromString(passagesXML, "text/xml");
        const passages = Array.from(parsedXML.getElementsByTagName("passage"));

        //passages should contain an array of each passage in the file
        //Find the given id
        passages.forEach(passageElement => {
            const id = passageElement.getAttribute("id");
            const title = passageElement.getElementsByTagName("title")[0]?.textContent.trim();
            const text = passageElement.getElementsByTagName("text")[0]?.textContent.trim();
            const options = Array.from(passageElement.getElementsByTagName("option")).map((option, index) => ({
                id: index + 1,
                text: option.textContent.trim(),
                textBroken: option.textContent.trim().split(' '),
                link: option.getAttribute("link")
            }));

            const storyNode = new StoryNode(id, title, text, options);
            this.storyNodes[id] = storyNode;
        });

        // Set the starting node
        this.currentNode = this.storyNodes[1];
        this.renderCurrentNode();
    }

    renderCurrentNode() {
        this.textRenderer.clear();
        
        //Read any tags out of the text
        let passageText = this.parseTags(this.currentNode.text);
        this.currentPassageText = passageText.trim();

        //Read check tags out of the options
        let parsedOptions = [];
        this.currentNode.options.forEach(item => {
            let optionText = this.parseTags(item.text);
            //If the option is empty after parsing tags, ignore it
            if (optionText.length > 0) {
                const newOption = {
                    text: optionText,
                    id: item.id
                }
                parsedOptions.push(newOption);
            }
        });
        this.currentPassageOptions = parsedOptions;

        // Display the current passage text and title
        if (this.currentNode) {
            this.textRenderer.addTextLine(this.currentNode.title);
            this.textRenderer.addLineBreak();
            this.textRenderer.addTextLine(this.currentPassageText);
            this.textRenderer.addLineBreak();
    
            // Display options or end text
            if (this.currentPassageOptions.length > 0) {
                this.currentPassageOptions.forEach(option => {
                    console.log(option.text);
                    this.textRenderer.addTextLine(`${option.id}) ${option.text}`);
                });
            } else {
                // Display end text if no options are available
                this.textRenderer.addTextLine(this.endText);
                this.input.disableInput(); // No more options
            }
        }
    }
    

    changeNode(optionId) {
        // Find the selected option and navigate to its linked passage
        const selectedOption = this.currentNode.options.find(option => option.id === optionId);
        
        if (selectedOption) {
            // Push the current node to previousNodes stack for "return" functionality
            this.previousNodes.push(this.currentNode);

            // Transition to the next node
            this.currentNode = this.storyNodes[selectedOption.link];
            this.renderCurrentNode();
        }
    }

    parseTags(text) {
        //Parses and removes 'set' tags from the text
        let parsedText = text;
        let removedText = [];

        for (let i = 0; i < text.length; i++) {
            if (text[i] == '[') {
                if (i < 0 && text[i - 1] == '\\') 
                    {
                        //Escape character
                        continue;
                    }

                if (text.slice(i, i + 6) == "[check") {
                    let begin = i;
                    let startIndex = i + 7;
                    let endIndex = 0;
                    let words = [];
                    for (endIndex = startIndex; text[endIndex] != "]"; endIndex++) {
                        //Pull out the options for the check tag
                        if (text[endIndex] == ' ') {
                            words.push(text.slice(startIndex, endIndex));
                            startIndex = endIndex + 1;
                        }
                    }
                    words.push(text.slice(startIndex, endIndex));
                    //Words now contains the options for the check

                    removedText.push(text.slice(begin, endIndex + 1));

                    //Find the end tag
                    removedText.push("[/check]")
                    for (let j = endIndex + 1; j < text.length; j++) {
                        if (text[j] == '[' && text.slice(j, j + 8) == "[/check]") {
                            //j marks the start of the end tag
                            //If the check fails, remove everything between tags
                            if (!this.state.checkValue(words[0].trim(), words[1].trim(), words[2].trim())) {
                                removedText.push(text.slice(endIndex + 1, j));
                            }
                            break;
                        }
                    }
                }

                if (text.slice(i, i + 4) == "[set") {
                    let begin = i;
                    let startIndex = i + 5;
                    let endIndex = 0;
                    let words = [];

                    for (endIndex = startIndex; text[endIndex] != "]"; endIndex++) {
                        //Pull out the options for the check tag
                        if (text[endIndex] == ' ') {
                            words.push(text.slice(startIndex, endIndex));
                            startIndex = endIndex;
                        }
                    }
                    words.push(text.slice(startIndex, endIndex));
                    //words now contains the options for the set

                    removedText.push(text.slice(begin, endIndex + 1));
                    //There is no end tag for set

                    this.state.setValue(words[0], words[1]);
                }
            }
        }
        
        //Remove all tags from the output
        for (let i = 0; i < removedText.length; i++) {
            parsedText = parsedText.replace(removedText[i], "")
        }

        return parsedText.trim();
    }

    goBack() {
        // Pop the previous node from the stack and set it as the current node
        if (this.previousNodes.length > 0) {
            this.currentNode = this.previousNodes.pop();
            this.renderCurrentNode();
        }
    }

    parseOptions(options) {
        //Returns an array of objects containing option objects
        //option objects contain the text and linked passage
        return options.map((item, index) => ({
            id: index + 1,
            text: item.textContent.trim(),
            textBroken: item.textContent.trim().split(' '),
            link: item.getAttribute("link")
        }));
    }
    selectOption(id) {
        //id is an int corresponding to the stored option's id
    }

    getCurrentPassageText() {
        return this.currentPassageText;
    }

    getCurrentPassageTitle() {
        return this.currentPassageTitle;
    }

    getOptions() {
        return this.currentNode.options;
    }
}
