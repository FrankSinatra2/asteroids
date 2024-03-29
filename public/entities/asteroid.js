
import { Entity } from '../entity.js';
import { randomRange, pickRandom } from '../util/math.js';
import { combineRot, complexFromAngle, vectorAdd, vectorScale } from '../util/vector.js';
import { PolygonComponent } from '../components/polygon.js';
import { RigidbodyComponent } from '../components/rigidbody.js';
import { StatsComponent } from '../components/stats.js';
import { SpatialHashClient } from '../components/spatial-hash-client.js';
import { boundingCircle } from '../util/circle.js';

export const LargeAsteroid = {
  life: 3,
  pointsDistrbution: [17, 17, 17, 13, 13, 7],
  maxRadius: 35,
  minRadius: 15
};

export const MediumAsteroid = {
  life: 2,
  pointsDistrbution: [17, 17, 17, 13, 13, 7],
  maxRadius: 15,
  minRadius: 8
};

export const SmallAsteroid = {
  life: 1,
  pointsDistrbution: [17, 17, 17, 13, 13, 7],
  maxRadius: 8,
  minRadius: 2
};

export const AsteroidSizes = [
  SmallAsteroid,
  MediumAsteroid,
  LargeAsteroid
];


export function createAsteroid(tag, position, grid, size=LargeAsteroid) {

  const entity = new Entity(tag);
  entity.position = position;

  const polygonComponent = createAsteroidPolygon(size.maxRadius, size.minRadius, pickRandom(size.pointsDistrbution));
  entity.addComponent(polygonComponent);

  const bc = boundingCircle(polygonComponent.points);

  const rigidbody = createAsteroidRigidbody();
  entity.addComponent(rigidbody);

  const spatialHashClient = new SpatialHashClient(grid, vectorScale([1, 1], 2*bc.radius));
  entity.addComponent(spatialHashClient);

  const statsComponent = new StatsComponent({life: size.life});
  entity.addComponent(statsComponent);

  return entity;
}

function createAsteroidPolygon(maxRadius, minRadius, steps) {
  const points = [];

  let radius = [1, 0];
  const radianStep = (2 * Math.PI ) / steps;
  const rotation = complexFromAngle(radianStep);

  for (let i = 0; i < steps; i++) {
    const scale = randomRange(minRadius, maxRadius); 
    const point = vectorScale(radius, scale);

    points.push(point);

    radius = combineRot(radius, rotation);
  }

  return new PolygonComponent(points, '#00FF00');
}

function createAsteroidRigidbody() {
  const rigidbody = new RigidbodyComponent();
  // rigidbody.linearDrag = 0.0001; 
  rigidbody.velocity = [
    randomRange(-0.04, 0.04),
    randomRange(-0.04, 0.04)
  ];

  rigidbody.angularSpeed = randomRange(-0.03, 0.03);

  return rigidbody;
};



