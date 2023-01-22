import { Entity } from '../entity.js';
import { SpatialHashClient } from '../components/spatial-hash-client.js';
import { RigidbodyComponent } from '../components/rigidbody.js';
import { PolygonComponent } from '../components/polygon.js';
import { vectorScale } from '../util/vector.js';
import { BulletController } from '../controllers/bullet-controller.js'

let number = 0;
const tag = () => {
  return `bullet-${number++}`;
}; 

export function createBullet(position, rotation, grid) {
  const entity = new Entity('bullet');
  entity.position = position;
  entity.rotation = rotation;


  const polygonComponent = createBulletPolygon();
  entity.addComponent(polygonComponent);

  const spatialHashClient = new SpatialHashClient(grid, [10, 10]);
  entity.addComponent(spatialHashClient);

  const rigidbody = new RigidbodyComponent();
  rigidbody.velocity = vectorScale(entity.getForward(), 0.1);
  entity.addComponent(rigidbody);

  const bulletController = new BulletController();
  entity.addComponent(bulletController);

  entity.registerHandler('spatial-hash-client.exitted', () => {
    entity.delete();
  });

  return entity;
}

function createBulletPolygon() {
  
  const points = [
    [0, 0],
    [0, 15]
  ];

  const color = "#FFFF00";

  return new PolygonComponent(points, color);
}
