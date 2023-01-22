import { Component } from '../component.js';
import { complexFromAngle, complexRot, forwardVector, vectorNorm, vectorScale, vectorSub } from '../util/vector.js';


export class PlayerController extends Component {

  constructor() {
    super('player-controller');

    this.speed = 0.1;
    
    this.canShoot = true;
    this.reloadTimer = 0;
  }

  init() {
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }

    const rigidbody = this.parent.getComponent('rigidbody');
    const input = this.parent.getComponent('player-input');

    const playerPosition = this.parent.getPosition();
    const mousePosition = input.mousePosition;

    const diff = vectorSub(playerPosition, mousePosition);
    const rotation = complexFromAngle(complexRot(diff));

    this.parent.rotation = rotation;
    
    if (input.isMouseButtonDown('left')){ 
      const forward = this.parent.getForward();
      rigidbody.velocity = vectorScale(forward, this.speed);
    }

    if (input.isMouseButtonDown('right') && this.canShoot) {
      this.broadcast('player.fire');
      this.canShoot= false;
    } else if (!input.isMouseButtonDown('right')) {
      this.canShoot= true;
    }

  }

  render(ctx) {
    const input = this.parent.getComponent('player-input');
    const position = this.parent.getPosition();
    const diff = vectorSub(input.mousePosition, position);

    ctx.translate(position[0], position[1]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(diff[0], diff[1]);
    ctx.stroke();
    ctx.translate(-position[0], -position[1]);
  }

}

