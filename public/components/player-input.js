'use strict';

import { Component } from '../component.js';
import { vectorScale, vectorSub } from '../util/vector.js';

export class PlayerInput extends Component {

  constructor() {
    super('player-input');

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

  
    this.mouseButtons = {
      left: true,
      right: true
    };
    this.mousePosition = [0, 0];

    this.canvas = $('#asteroids-app')[0];
  }

  init() {
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    this.canvas.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });
    
    this.canvas.addEventListener('mousedown', (e) => {
      this.onMouseDown(e); 
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.onMouseUp(e); 
    });

    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  isMouseButtonDown(bttn) {
    return !this.mouseButtons[bttn];
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
  }

  onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
  }

  onMouseMove(event) {
    const cRect = this.canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    const canvasX = Math.round(event.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    const canvasY = Math.round(event.clientY - cRect.top); 

    this.mousePosition = [canvasX, canvasY]; 
  }

  onMouseDown(event) {
    switch(event.buttons) {
      case 1:
        this.mouseButtons.left = false;
        break;
      case 2:
        this.mouseButtons.right =  false;
        break;
      default:
       break; 
    };
  }

  onMouseUp(event) {
    this.mouseButtons.left = true;
    this.mouseButtons.right = true;
    this.onMouseDown(event);
  }
}

