import { Component } from '../component.js';
import { Entity } from '../entity.js';
import * as v from '../util/vector.js';
import { ExplosionComponent } from '../components/explosion.js';
import { createAsteroid, AsteroidSizes } from '../entities/asteroid.js';
import { randomRange } from '../util/math.js';


export class AsteroidsController extends Component {

  constructor(grid) {
    super('asteroids-controller');
    this.grid = grid;
  }

  init() {
    this.parent.registerHandler('entity.deleted', (entity) => {
      if (entity.tag === 'asteroid') {
        this.createExplosion(entity.position);
        this.fractureAsteroid(entity);
      }
    });
  }

  fractureAsteroid(asteroid) {
    const position = asteroid.position;
    const stats = asteroid.getComponent('stats');

    const life = stats.stats['life'];

    if (life <= 1) {
      return;
    }

    const size = AsteroidSizes[life-2];

    const step = v.complexFromAngle(2 * Math.PI / life);
    let radius = step; 
    

    for (let i = 0; i < life; i++) {
      const p = v.vectorAdd(position, v.vectorScale(radius, 10));
      const chunk = createAsteroid('asteroid', p, this.grid, size);
      chunk.getComponent('rigidbody').velocity = v.vectorScale(radius, randomRange(-0.06, 0.06));

      this.parent.addChild(chunk);
   
      radius = v.complexMul(radius, step);
    }
  } 

  createExplosion(position) {
    const entity = new Entity('explosion');
    entity.position = position;

    entity.addComponent(new ExplosionComponent());

    this.parent.addChild(entity);
  }

}

