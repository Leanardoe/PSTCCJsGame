import * as PIXI from "pixi.js";

export default class PassageController{
    //Reads in passage files from a defined folder
    //Passes the loaded text and options to the textline

    constructor(){
        this.currentPassageText = null;
        this.currentPassageTitle = null;
        this.currentOptions = null;
        this.parser = new DOMParser();
        this.passageFolder = "../resource/passages";
        this.passageFile = "testpassages.xml";
    }

    async loadPassage(id){
        //Loads a passage with a given id into the current passage
        let passages = await PIXI.Assets.load(this.passageFolder + "/" + this.passageFile);

        let parsedPassages = this.parser.parseFromString(passages, "text/xml");      
        parsedPassages = Array.from(parsedPassages.getElementsByTagName("passage"));

        //passages should contain an array of each passage in the file
        //Find the given id
        parsedPassages.forEach(item => {
            if (id == item.getAttribute("id")) {
                this.currentPassageText = (item.getElementsByTagName("text")[0].innerHTML).trim();
                this.currentPassageTitle = (item.getElementsByTagName("title")[0].innerHTML).trim();
                this.currentOptions = this.parseOptions(Array.from(item.getElementsByTagName("option")));
                return;
            }
        });
    }

    parseOptions(options) {
        //Returns an array of objects containing option objects
        //option objects contain the text and linked passage

        let parsedOptions = [];

        options.forEach(item => {
            let optionObject = {
                text: item.innerHTML.trim(),
                link: item.getAttribute("link")
            }
            parsedOptions.push(optionObject);
        });

        return parsedOptions;
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