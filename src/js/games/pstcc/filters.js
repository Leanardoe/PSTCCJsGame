import * as PIXI from "pixi.js";
import {OldFilmFilter} from '@pixi/filter-old-film';
import {RGBSplitFilter} from '@pixi/filter-rgb-split';
import {CRTFilter} from '@pixi/filter-crt';

export default class FilterController {
    constructor({}) {
        this.toggle = true;
        this.crtFilter = new CRTFilter({
            curvature: 1.0,
            lineWidth: 2.0,
            lineContrast: 0.25,
            verticalLine: false,
            noise: 0.0,
            noiseSize: 1.0,
            seed: 0.0,
            vignetting: 0.3,
            vignettingAlpha: 0.6,
            vignettingBlur: 0.3,
            time: 0.0,
        });

        this.filmFilter = new OldFilmFilter({
            sepia: 0.0,
            noise: 0.3,
            noiseSize: 2.0,
            scratch: 2,
            scratchDensity: 0.3,
            scratchWidth: 1.0,
            vignetting: 0.2,
            vignettingAlpha: 0.5,
            vignettingBlur: 0.3,
        });

        this.rgbFilter = new RGBSplitFilter();
        this.rgbFilter.red[0]=0;
        this.rgbFilter.green[1]=0;

    }
    update(delta){
        this.filmFilter.seed = Math.random();
        this.crtFilter.time+=.2;
        if (this.toggle == true){
            this.rgbFilter.red[0] +=.75;
            this.rgbFilter.green[1] +=0.25;
            if(this.rgbFilter.red[0] >3){
                this.toggle = false;
            }
        }else{
            this.rgbFilter.red[0] -=.75;
            this.rgbFilter.green[1] -=0.25;
            if(this.rgbFilter.red[0] <1){
                this.toggle = true;
            }
        }
    }
    get filters(){
        return [this.rgbFilter,this.filmFilter, this.crtFilter];
    }
}
