import { Component } from '../component.js';
import { vectorScale } from '../util/vector.js';

export class BulletController extends Component {

  constructor() {
    super('bullet-controller');

  }


  update(ts) {
    if (this.parent === null) {
      return;
    }

    const spatialHashClient = this.parent.getComponent('spatial-hash-client');
    const position = this.parent.getPosition();   

    const dimensions = vectorScale(spatialHashClient.dimensions, 10);
    const nearby = spatialHashClient.grid.findNearby(position, dimensions);

    if (nearby.length) {
       
      const asteroids = nearby.filter(n => n.data.tag === 'asteroid');

      if (asteroids.length) {
        console.log('HIT');

        this.broadcast('bullet.hit', {
          incident: this.parent,
          targets: asteroids.map(c => c.data)
        });
      }

      // console.log(nearby);
    }

  }

}
