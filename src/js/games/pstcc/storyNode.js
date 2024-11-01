import * as PIXI from "pixi.js";
import TextRenderer from "./textrenderer";

//class definition for the story nodes
export default class StoryNode {
    constructor(id, title, text, options = [], previousNode = null) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.options = options;
        this.previousNode = previousNode;
    }
}
