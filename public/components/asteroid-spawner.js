import { Component } from '../component.js';
import { createAsteroid } from '../entities/asteroid.js';
import { randomRange } from '../util/math.js';

export class AsteroidSpawner extends Component {
  static TIME_TO_SPAWN = 10000;

  constructor(grid) {
    super('asteroid-spawner');
    this.timer = AsteroidSpawner.TIME_TO_SPAWN;
    this.grid = grid;
  }

  update(ts) {
    if (!this.parent) {
      return 0;
    }

    this.timer -= ts;

    if (this.timer < 0) {
      this.spawnAsteroid();
      this.timer = randomRange(AsteroidSpawner.TIME_TO_SPAWN-500, AsteroidSpawner.TIME_TO_SPAWN+500);
    }
  }

  spawnAsteroid() {
    const position = [...this.parent.position];
    position[0] = randomRange(position[0]-300, position[0]+300);
    position[1] = randomRange(position[1]-300, position[1]+300);
   

    const asteroid = createAsteroid('asteroid', position, this.grid);
    this.parent.addChild(asteroid);
    // asteroid.init();
  }
}


