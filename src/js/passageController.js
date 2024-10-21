import * as PIXI from "pixi.js";

export default class PassageController{
    //Reads in passage files from a defined folder
    //Passes the loaded text and options to the textline

    constructor(){
        this.currentPassage = null;
        this.parser = new DOMParser();
        this.passageFolder = "../resource/passages";
        this.passageFile = "testpassages.xml";
    }

    async loadPassage(id){
        //Loads a passage with a given id into the current passage
        let passages = await Assets.load(this.passageFolder + "/" + this.passageFile);

        /*(passageFolder + "/" + this.passageFile)
            .then((response) => response.text())
            .then((xmlString) => {
                let passages = parser.parseFromString(xmlString, "text/xml");*/
        passages = passages.getElementsByTagName("passage");

        //passages should contain an array of each passage in the file
        //Find the given id
        passages.forEach(item => {
            if (id == item.getAttribute("id")) {
                this.currentPassage = item;
                return;
            }
        });
    }

    getCurrentPassage() {
        return this.currentPassage;
    }

    getOptions() {
        //Should return an array of the current passage's options
    }
}