'use strict';

import { Component } from '../component.js';
import { vectorScale } from '../util/vector.js';

export class SpatialHashClient extends Component {

  constructor(spatialHashGrid, dimensions) {
    super('spatial-hash-client');

    this.grid = spatialHashGrid;
    this.dimensions = dimensions;
    this.client = null;
  }

  init() {
    this.client = this.grid.createClient(this.parent.getPosition(), this.dimensions, this.parent);
    this.parent.registerHandler('entity.move', (data) => this.onParentMove(data));
  }

  render(ctx) {
    // const position = this.parent.getPosition();

    // ctx.translate(position[0], position[1]);

    // ctx.strokeStyle = 'purple';
    // ctx.beginPath();
    // ctx.rect(
    //   -this.client.dimensions[0] / 2,
    //   -this.client.dimensions[1] / 2,
    //   this.client.dimensions[0],
    //   this.client.dimensions[1]
    // );
    // ctx.stroke();
    // 
    // ctx.translate(-position[0], -position[1]);
  }

  delete() {
    this.grid.removeClient(this.client);
  }

  onParentMove(data) {
    // console.log(data); 
    if (!this.grid.pointInBounds(data.newPosition)) {
      this.parent.position = vectorScale(data.newPosition, -0.98); 
    }

    this.client.position = this.parent.getPosition();
    this.grid.updateClient(this.client);
  }
}
