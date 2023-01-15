import { Component } from '../component.js';
import { vectorScale, vectorAdd, complexFromAngle, combineRot, vectorEqual, zeroVector } from '../util/vector.js';

export class RigidbodyComponent extends Component {
  constructor() {
    super('rigidbody');

    this.acceleration = [0, 0];
    this.velocity = [0, 0];

    this.linearDrag = 0;

    this.angularSpeed = 0;
    this.angularDrag = 0;

    this.mass = 1;
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }


    this.velocity = vectorAdd(this.velocity, vectorScale(this.acceleration, ts));

    if (this.linearDrag !== 0) {
      const drag = Math.pow(Math.E, -ts/(this.mass / this.linearDrag));
      this.velocity = vectorScale(this.velocity, drag);
    } 

    const oldPosition = this.parent.position;
    this.parent.position = vectorAdd(this.parent.position, vectorScale(this.velocity, ts));

    if (this.angularSpeed !== 0) {
      if (this.angularDrag !== 0) {
        const drag = Math.pow(Math.E, -ts/(this.mass / this.linearDrag));
        this.angularSpeed *= drag;
      }

      const rot = complexFromAngle(this.angularSpeed);
      this.parent.rotation = combineRot(this.parent.rotation, rot);

    }

    if (!vectorEqual(oldPosition, this.parent.position)) {
      this.broadcast('entity.move', { oldPosition: oldPosition, newPosition: this.parent.position });
    }
  }

  isMoving() {
    return !vectorEqual(this.velocity, zeroVector());
  }
}
