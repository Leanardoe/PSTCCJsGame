/*
Unimplemented audio controller



*/
import * as PIXI from "pixi.js";
import { sound } from '@pixi/sound';

export default class audioMgr {
    constructor({ app,}) {
        this.sounds = {};
        this.musicTracks = {};
        // const soundManifest = {
        //     click: 'sounds/click.mp3',
        //   };

    }
    loadSound(name, url) {
        sound.add(name, url);
        this.sounds[name] = sound.find(name);
    }
    playSound(name){
        if (this.sounds[name]) {
            this.sounds[name].play();
        }
    }
    loadSounds(manifest) {
    for (const [key, url] of Object.entries(manifest)) {
        sound.add(key, {
        url: url,
        preload: true,
        loaded: (err, snd) => {
            if (err) {
            console.error(`Error loading sound [${key}]:`, err);
            } else {
            this.sounds[key] = snd;
            }
        }
        });
    }
    }
      
}