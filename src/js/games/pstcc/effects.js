import * as PIXI from "pixi.js";

import audioMgr from "./audioManager.js";
import FilterController from './filters.js';


export default class Effect {
    constructor({ time,action}) {
        this.time = time;
        this.action = action;
    }
}

export const effects = new Map([
    ['effect1', new Effect({
      time: 0,
      action: () => {
        gameContainer.filters = filterCon.filters;
      }
    })],
    ['effect2', new Effect({ // Assuming you want a different key for the second effect
      time: 5000,
      action: () => {
        this.audio.playSound('knob2');
      }
    })]
  ]);