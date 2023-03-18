import { Component } from '../component.js';
import { complexFromAngle, complexRot, forwardVector, vectorNorm, vectorScale, vectorSub } from '../util/vector.js';
import { Entity } from '../entity.js';
import { ExplosionComponent } from '../components/explosion.js';

export class PlayerController extends Component {
  static RELOAD_SPEED = 500;


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
    
    const spatialHashClient = this.parent.getComponent('spatial-hash-client');

    const dimensions = vectorScale(spatialHashClient.dimensions, 1);

    const playerPosition = this.parent.getPosition();
    const mousePosition = input.mousePosition;

    const diff = vectorSub(playerPosition, mousePosition);
    const rotation = complexFromAngle(complexRot(diff));

    this.parent.rotation = rotation;
    
    if (input.isMouseButtonDown('left')){ 
      const forward = this.parent.getForward();
      rigidbody.velocity = vectorScale(forward, this.speed);
    }

    this.reloadTimer -= ts;
    if (this.reloadTimer <= 0) {
      if (input.isMouseButtonDown('right') && this.canShoot) {
        this.broadcast('player.fire');
        this.canShoot= false;
        this.reloadTimer = PlayerController.RELOAD_SPEED;
      } else if (!input.isMouseButtonDown('right')) {
        this.canShoot= true;
      }
    }

    const nearby = spatialHashClient.grid.findNearby(playerPosition, vectorScale(dimensions, 0.88));
    if (nearby.length) { 
      const asteroids = nearby.filter(n => n.data.tag === 'asteroid');

      if (asteroids.length) {
        this.createExplosion(parent.position);
        this.broadcast('player.hit');
      }
    }
    

  }

  createExplosion(position) {
    const entity = new Entity('explosion');
    entity.position = position;

    entity.addComponent(new ExplosionComponent());

    this.parent.addChild(entity);
  }
  // render(ctx) {
  //   const input = this.parent.getComponent('player-input');
  //   const position = this.parent.getPosition();
  //   const diff = vectorSub(input.mousePosition, position);

  //   ctx.translate(position[0], position[1]);
  //   ctx.beginPath();
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(diff[0], diff[1]);
  //   ctx.stroke();
  //   ctx.translate(-position[0], -position[1]);
  // }

}

