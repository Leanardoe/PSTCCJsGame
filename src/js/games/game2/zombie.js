import * as PIXI from "pixi.js";
import Victor from "victor";
import Player from './player.js';

export default class Zombie{
    constructor({app,player}){
        this.app = app;
        this.player = player;
        const radius = 16;
        this.speed = 1;
        this.zombie = new PIXI.Graphics();
        let r = this.randomSpawnPoint();
        this.zombie.position.set(r.x, r.y);
        this.zombie.beginFill(0xFF0000, 1);
        this.zombie.drawCircle(0, 0, radius);
        this.zombie.endFill();
        app.stage.addChild(this.zombie);
    }
    attackPlayer(){
      if(this.attacking) return;
      this.attacking = true;
      this.interval = setInterval(()=>this.player.attack(),500);
    }

    update(delta){
        let e = new Victor(this.zombie.position.x, this.zombie.position.y);
        let s = new Victor(this.player.position.x, this.player.position.y);
        if(e.distance(s)< this.player.width / 2) {
            //let r = this.randomSpawnPoint();
            //this.zombie.position.set(r.x,r.y);
            this.attackPlayer();
            return;
        }

        let d = s.subtract(e);
        let v = d.normalize().multiplyScalar(this.speed * delta);
        this.zombie.position.set(this.zombie.position.x+v.x,this.zombie.position.y+v.y);
    }

    get position (){
      return this.zombie.position;
    }
    
    kill(){
      this.app.stage.removeChild(this.zombie);
      clearInterval(this.interval);
    }

    randomSpawnPoint() {
        let edge = Math.floor(Math.random() * 4);
        let spawnPoint = new Victor(0, 0);
        let canvasSize = this.app.screen.width;
        switch (edge) {
          case 0:
            spawnPoint.x = canvasSize * Math.random();
            spawnPoint.y = canvasSize;
            break;
          case 1:
            spawnPoint.x = canvasSize * Math.random();
            break;
          case 2:
            spawnPoint.y = canvasSize * Math.random();
            spawnPoint.x = canvasSize;
            break;
          case 3:
            spawnPoint.y = canvasSize * Math.random();
            break;
          default:
            break;
        }
        return spawnPoint;
      }
}