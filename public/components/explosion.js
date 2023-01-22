import { Component } from '../component.js';
import * as v from '../util/vector.js'

export class ExplosionComponent extends Component {
  static EXPLOSION_DURATION = 1250;

  constructor() {
    super('Explosion');
  
    this.distance = 1;
    this.timer = ExplosionComponent.EXPLOSION_DURATION; 
  }

  update(ts) {
    this.timer -= ts;

    if (this.timer < 0) {
      this.parent.delete(); 
    }
  }

  render(ctx) {
    let radius = v.identityRotation();;
    const step = v.complexFromAngle(Math.PI / 8);

    const position = this.parent.getPosition();
    
    ctx.strokeStyle = '#ffa500'
    ctx.translate(position[0], position[1]);
    for (let i = 0; i < 16; i++) {
      const p1 = v.vectorScale(radius, this.distance);
      const p2 = v.vectorScale(radius, this.distance + 5);

      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1])

      radius = v.complexMul(radius, step);
    }

    ctx.stroke();
    ctx.translate(-position[0], -position[1]);

    this.distance += 0.9;
  } 
}

