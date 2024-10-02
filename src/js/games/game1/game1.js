import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Scrollbox } from "pixi-scrollbox";
import { FPS } from "yy-fps";
const fps = new FPS();

class Line extends PIXI.Graphics {
  constructor(points, lineSize, lineColor) {
    super();

    var s = (this.lineWidth = lineSize || 5);
    var c = (this.lineColor = lineColor || "0x000000");

    this.points = points;

    this.lineStyle(s, c);

    this.moveTo(points[0], points[1]);
    this.lineTo(points[2], points[3]);
  }

  updatePoints(p) {
    var points = (this.points = p.map(
      (val, index) => val || this.points[index]
    ));

    var s = this.lineWidth,
      c = this.lineColor;

    this.clear();
    this.lineStyle(s, c);
    this.moveTo(points[0], points[1]);
    this.lineTo(points[2], points[3]);
  }
}

let canvasSize = 256;

const pixis = () => {
  const gameContainer = document.getElementById('game1-container');
  const app = new PIXI.Application({
    // const app = new PIXI.CanvasRenderer({
    view: gameContainer,
    width: canvasSize,
    height: canvasSize,
    // antialias: true,
    autoResize: true,  //v5
    // autoDensity: true, //v6+
    resolution: 4,
    useContextAlpha: false
    // roundPixels: true
  });

  app.view.style.position = "relative";
  app.view.style.border = "4px solid black";

  const c1 = new PIXI.Container();
  c1.backgroundColor = 0xff00ff;
  app.stage.addChild(c1);

  const rect1 = new PIXI.Graphics();
  rect1.lineStyle(1, 0xff00ff);
  rect1.beginFill(PIXI.utils.string2hex("#6CE37F"), 0.3);
  rect1.drawRoundedRect(0, 0, 200, 40, 1);
  rect1.endFill();

  c1.addChild(rect1);

  const c1mask = new PIXI.Graphics()
    .beginFill(0xffffff)
    .drawRect(10, 10, 360, 500)
    .endFill();
  const maxLines = 1;
  let text =
    "🌷🎁 💩😜🌷🎁";

  let newText = text;
  const style2 = new PIXI.TextStyle({
    fill: "#599662",
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "bold",
    breakWords: true,
    whiteSpace: "pre-line",
    wordWrap: true,
    wordWrapWidth: 200
  });
  let textMetrics = PIXI.TextMetrics.measureText(text, style2);
  const { lines } = textMetrics;
  if (lines.length > maxLines) {
    const truncatedLines = lines.slice(0, maxLines);
    const lastLine = truncatedLines[truncatedLines.length - 1];
    const words = lastLine.split(" ");
    const wordMetrics = PIXI.TextMetrics.measureText(
      `\u00A0\n...\n${words.join("\n")}`,
      style2
    );
    const [spaceLength, dotsLength, ...wordLengths] = wordMetrics.lineWidths;
    console.log(`####lastLine |${lastLine}|`);

    let newLastLine = lastLine;
    for (let i = 0; newLastLine.length - i > 0; i++) {
      const tmpLine = `${newLastLine.substring(0, newLastLine.length - i)}...`;
      const wordMetrics = PIXI.TextMetrics.measureText(tmpLine, style2);
      if (wordMetrics.lines.length === 1) {
        newLastLine = tmpLine;
        break;
      }
    }
    truncatedLines[truncatedLines.length - 1] = `${newLastLine}`;
    newText = truncatedLines.join("\n");
  }
  console.log("##", textMetrics);
  var reg2 = new PIXI.Text(newText, style2);
  app.stage.addChild(reg2);
  PIXI.Ticker.shared.add(() => {
    fps.frame();
  });
};
pixis();
