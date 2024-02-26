/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
// import * as screenfull from 'screenfull';

@Component({
  selector: 'cdk-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {
	isFullscreen = false;
	constructor() { }

	ngOnInit() {
		// console.log();
	}

  	toggleFullscreen() {
	    // if (screenfull && screenfull['enabled']) {
	      	// screenfull.toggle();
	      	this.isFullscreen = !this.isFullscreen;
	    // }
  	}

}
