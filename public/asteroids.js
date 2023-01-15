import { config } from './config.js';
import { Entity } from './entity.js';

import { createSpaceship } from './entities/spaceship.js';
import { createAsteroid } from './entities/asteroid.js';
import { randomRange } from './util/math.js';
import { vectorScale } from './util/vector.js';

import { SpatialHashGrid } from './space-hash-grid.js';

window.addEventListener('load', () => {
  const canvas = $("#asteroids-app")[0];
  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;

  const ctx = canvas.getContext('2d');

  const bounds = [
    vectorScale([-canvas.width, -canvas.height], 0.55),
    vectorScale([canvas.width, canvas.height], 0.55)
  ];
  const dimensions = [ 50, 50 ];
  const grid = new SpatialHashGrid(bounds, dimensions);

  const root = new Entity('root');
  root.position = [canvas.width / 2, canvas.height / 2];

  const spaceship = createSpaceship('player', [0, 0], grid);
  root.addChild(spaceship);

  const asteroids = new Entity('asteroids');
  
  for (let i = 0; i < 20; i++) {
    const asteroid = createAsteroid('asteroid', [randomRange(-300, 300), randomRange(-300, 300)], grid);
    asteroids.addChild(asteroid);
  }

  root.addChild(asteroids);

  let previousLoop = null;
  const loop = () => {
    requestAnimationFrame((timestamp) => {
      if (previousLoop === null) {
        previousLoop = timestamp;
      }
  
      const elapsed = timestamp - previousLoop;
      
      loop();
      
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      root.update(elapsed);
      root.render(ctx);
  
      previousLoop = timestamp;
    });
  };

  root.init();

  loop();
});


