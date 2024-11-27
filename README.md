# Surviving a Day at Pellissippi

This is a text-based adventure game built in JavaScript, using the PixiJS graphics library.  The game comes pre-packaged with a story, but more content can be added with XML files.

## Installation Instructions

### Prerequisites

[Node.js](https://nodejs.org/en) <br />
[PixiJS](https://pixijs.com/) <br />
[Vite](https://vite.dev/) <br />
[Handlebars](https://handlebarsjs.com)

### Building

Clone the repository to a local folder:
```
git clone https://github.com/Leanardoe/PSTCCJsGame.git
```

Open a terminal in that folder and run the following command to install dependencies (this will also install Pixi, Vite, and Handlebars if they are not already installed):
```
npm install
```

To run the game, use the following command:
```
npm run dev
```

## Playing the Game

The game presents the player with a scenario, and several choices of how to proceed.  
To select an option, you can type the number corresponding to the choice, or the first word of a choice.  
If multiple choices begin with the same word, you must enter enough words so that the input matches only one option.

## Adding Content

The game reads in the story data at runtime from XML files.  These files are located in:
```
./resource/passages
```

### Example Passage XML

```
<passages>
<passage id="1">
    <title>Test Passage 1</title>
    <text>
        This is a test passage.
    </text>
    <option link="2">Continue</option>
</passage>
</passages>
```

The `<passages>` tag is the root tag, and all passages must be inside of it.
Each passage is identified by a tag with an id, as in `<passage id="1">`.
The `<text>` tag is used to mark the main body of the passage.
Each option or choice is enclosed in an `<option>` tag, which must have a link attribute.  the number in the link must match the id of a passage.

### Loading the XML File In-Game

Inside of `passageController.js`, the connection string at the top of the class definition can be changed to load a different passage file.

```
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
        this.passageFile = "GamePassages.xml";  <-- Change this string
        this.endText = "The End"; // Default end text
    }
```
