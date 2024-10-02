import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Scrollbox } from "pixi-scrollbox";
import { FPS } from "yy-fps";
//import Matter from "matter-js";

import Player from './player.js';
import Zombie from './zombie.js';
import Spawner from './spawner.js';

let canvasSize = 400;

const canvas = document.getElementById("tutorial-container");


//prints properties defined by element obejct console.log(Object.keys(canvas));
//prints properties inherited by element obejct console.log(Object.getPrototypeOf(canvas));
//printes object type console.log(typeof(canvas));

const app = new PIXI.Application({
  view: canvas,
  width: canvas.offsetWidth,
  height: canvas.offsetHeight,
  autoResize: true,
  backgroundColor: 0x5c812f,
  eventMode: 'dynamic',
  interactive: true,
  eventFeatures: {
    move: true,
    /** disables the global move events which can be very expensive in large scenes */
    globalMove: false,
    click: true,
    wheel: true,
}
});

let player = new Player({app});
let zSpawner = new Spawner({app, create: () => new Zombie({app,player})});
let gameStartScene = createScene("Click to Start");
let gameOverScene = createScene("Game Over!");
app.gameStarted = false;
//console.log(Object.keys());



app.ticker.add((delta) => {
  gameOverScene.visible = player.dead;
  gameStartScene.visible = !app.gameStarted;
  if(app.gameStarted === false) return;
  player.update(delta); 
  zSpawner.spawns.forEach(zombie => zombie.update(delta));
  bulletHitTest({
    bullets:player.shooting.bullets,
    zombies:zSpawner.spawns,
    bulletRadius:8,
    zombieRadius:16
  })
  
});


function bulletHitTest({bullets,zombies,bulletRadius,zombieRadius}){
  bullets.forEach((bullet) => {
    zombies.forEach((zombie,index)=>{
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if(distance < bulletRadius + zombieRadius){
        zombies.splice(index, 1);
        zombie.kill();
      }
    });
  });
}

function createScene(sceneText){
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText);
  text.x = app.screen.width /2;
  text.y = 0;
  text.anchor.set(0.5,0);
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

function startGame(){
  app.gameStarted=true;  
}

function resize(){
  console.log(canvas.offsetWidth + " app " + app.screen.width);
  app.renderer.resize(canvas.offsetWidth, canvas.offsetHeight);
}
visualViewport.addEventListener('resize', resize);

app.renderer.view.addEventListener('pointerdown', startGame);