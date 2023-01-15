import { PlayerController } from '../controllers/player-controller.js';
import { Entity } from '../entity.js';
import { PolygonComponent } from '../components/polygon.js';
import { SpatialHashClient } from '../components/spatial-hash-client.js';
import { PlayerInput } from '../components/player-input.js';
import { vectorSub, rotateVector, rotateAround } from '../util/vector.js';
import { RigidbodyComponent } from '../components/rigidbody.js';
import { boundingCircle } from '../util/circle.js';

export function createSpaceship(tag, position, grid) {
  const entity = new Entity(tag);
  entity.position = position;

  const polygonComponent = createSpaceshipPolygon();
  entity.addComponent(polygonComponent);

  const spatialHashClient = new SpatialHashClient(grid, [25, 35]);
  entity.addComponent(spatialHashClient);

  const rigidbody = new RigidbodyComponent();
  rigidbody.linearDrag = 0.0002;
  entity.addComponent(rigidbody);

  const playerInput = new PlayerInput();
  entity.addComponent(playerInput);
  
  const playerController = new PlayerController();
  entity.addComponent(playerController);

  return entity;
}


function createSpaceshipPolygon() {
  const offset = [12, 7];

  const points = [
    vectorSub([0, 0], offset),
    vectorSub([12, 25], offset),
    vectorSub([25, 0], offset),
    vectorSub([12, 7], offset),
  ];
  

  const color = "#FF00FF";
  return new PolygonComponent(points, color); // newPoints, color);
}

