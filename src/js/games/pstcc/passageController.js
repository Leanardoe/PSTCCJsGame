import * as PIXI from "pixi.js";
import TextRenderer from "./textrenderer";

export default class PassageController{
    //Reads in passage files from a defined folder
    //Passes the loaded text and options to the textline

    constructor(app, input) {
        this.textRenderer = new TextRenderer(app)

        this.app = app;
        this.input = input;
        this.currentPassageText = null;
        this.currentPassageTitle = null;
        this.currentOptions = null;
        this.parser = new DOMParser();
        this.allPassages = null;
        this.passageFolder = "../resource/passages";
        this.passageFile = "testpassages.xml";
    }

    async loadPassage(id) {
        //Loads a passage with a given id into the current passage
        let passages = await PIXI.Assets.load(this.passageFolder + "/" + this.passageFile);

        this.allPassages = this.parser.parseFromString(passages, "text/xml");      
        let parsedPassages = Array.from(this.allPassages.getElementsByTagName("passage"));

        //passages should contain an array of each passage in the file
        //Find the given id
        parsedPassages.forEach(item => {
            if (id == item.getAttribute("id")) {
                this.currentPassageText = (item.getElementsByTagName("text")[0].innerHTML).trim();
                this.currentPassageTitle = (item.getElementsByTagName("title")[0].innerHTML).trim();
                this.currentOptions = this.parseOptions(Array.from(item.getElementsByTagName("option")));
                this.input.setOptionCount(this.currentOptions.length);

                this.renderPassage();
                return;
            }
        });
    }

    changePassage(optionId) {
        let linkedPassage = 1;
        this.currentOptions.forEach(item => {
            if (item.id == optionId) {
                linkedPassage = item.link;
            }
        });

        let parsedPassages = Array.from(this.allPassages.getElementsByTagName("passage"));
        parsedPassages.forEach(item => {
            if (linkedPassage == item.getAttribute("id")) {
                this.currentPassageText = (item.getElementsByTagName("text")[0].innerHTML).trim();
                this.currentPassageTitle = (item.getElementsByTagName("title")[0].innerHTML).trim();
                this.currentOptions = this.parseOptions(Array.from(item.getElementsByTagName("option")));
                this.input.setOptionCount(this.currentOptions.length);

                this.renderPassage();
                return;
            }
        })
    }

    parseOptions(options) {
        //Returns an array of objects containing option objects
        //option objects contain the text and linked passage

        let parsedOptions = [];

        let i = 1;
        options.forEach(item => {
            let optionObject = {
                id: i,
                text: item.innerHTML.trim(),
                link: item.getAttribute("link")
            }
            i++;
            parsedOptions.push(optionObject);
        });


        return parsedOptions;
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

    renderPassage() {
        this.textRenderer.clear();
        this.textRenderer.addTextLine(this.currentPassageText);
        this.textRenderer.addLineBreak();
        this.currentOptions.forEach(option => {
            this.textRenderer.addTextLine(option.id + ") " + option.text);
        });
    }
}