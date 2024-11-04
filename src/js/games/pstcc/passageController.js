import * as PIXI from "pixi.js";
import TextRenderer from "./textrenderer";
import StoryNode from "./storyNode";

export default class PassageController {
    constructor(app, input) {
        this.textRenderer = new TextRenderer(app);
        this.app = app;
        this.input = input;
        this.storyNodes = {};
        this.currentNode = null;
        this.previousNodes = []; // Stack for tracking previous nodes
        this.parser = new DOMParser();
        this.passageFolder = "../resource/passages";
        this.passageFile = "testpassages2.xml";
        this.endText = "The End"; // Default end text
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
    
        // Display the current passage text and title
        if (this.currentNode) {
            this.textRenderer.addTextLine(this.currentNode.title);
            this.textRenderer.addLineBreak();
            this.textRenderer.addTextLine(this.currentNode.text);
            this.textRenderer.addLineBreak();
    
            // Display options or end text
            if (this.currentNode.options.length > 0) {
                this.currentNode.options.forEach(option => {
                    this.textRenderer.addTextLine(`${option.id}) ${option.text}`);
                });
            } else {
                // Display end text if no options are available
                this.textRenderer.addTextLine(this.endText);
                this.input.setOptionCount(0); // No more options
            }
    
            // Set input option count based on available options
            this.input.setOptionCount(this.currentNode.options.length);
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
            textBroken: item.innerHTML.trim().split(' '),
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
        return this.currentOptions;
    }
}
