'use strict';

import { Component } from '../component.js';
import { complexRot } from '../util/vector.js';
import { boundingCircle, renderCircle } from '../util/circle.js';

export class PolygonComponent extends Component {
  
  constructor(points, color) {
    super('polygon');

    this.points = points;
    this.color = color;
  }

  update(ts) {
  }
   
  render(ctx) {
      
    const position = this.parent.getPosition()
    const rotation = complexRot(this.parent.getRotation());


    ctx.strokeStyle = this.color;

    ctx.translate(position[0], position[1]);
    ctx.rotate(rotation);

    // renderCircle(this.bc, ctx);

    ctx.beginPath();
   

    const start = this.points[0];
    ctx.moveTo(start[0], start[1]);

    for (const point of this.points.slice(1)) {
      ctx.lineTo(point[0], point[1]);  
    }
   
    ctx.lineTo(start[0], start[1]);

    ctx.stroke();
    
    ctx.rotate(-rotation);
    ctx.translate(-position[0], -position[1]);
  }
}






