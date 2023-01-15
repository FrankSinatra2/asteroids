'use strict';

import { 
  combineRot,
  complexRot,
  identityRotation,
  vectorAdd,
  zeroVector,
  forwardVector,
  rotateVector
} from './util/vector.js';

export class Entity {

  constructor(tag) {
    this.tag = tag;
    this.components = {};
    this.children = [];
    this.parent = null;
    this.handlers = {};

    this.position = zeroVector();
    this.rotation = identityRotation();

    this.id = crypto.randomUUID(); 
  }

  getPosition() {
    if (this.parent === null) {
      return this.position;
    }

    return vectorAdd(this.position, this.parent.getPosition());
  }
  
  getRotation() {
    // return  this.rotation;
    if (this.parent === null) {
      return this.rotation;
    }

    return combineRot(this.rotation, this.parent.getRotation());
  }

  getForward() {
    return rotateVector(forwardVector(), complexRot(this.rotation)); 
  }

  addComponent(component) {
    component.parent = this;
    this.components[component.tag] = component;
  }

  getComponent(tag) {
    return this.components[tag];
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  setParent(parent) {
    this.parent = parent;
  }

  registerHandler(event, handler) {
    this.handlers[event] = handler;
  }

  broadcast(event, data) {
    if (this.parent !== null) {
      this.parent.broadcast(event, data);
    }

    if (this.handlers[event]) {
      this.handlers[event](data);
    }
  }

  init() {
    for (const child of this.children) {
      child.init();
    }

    for (const comp of Object.values(this.components)) {
      comp.init();
    }
  }

  update(ts) {
    for (const comp of Object.values(this.components)) {
      comp.update(ts);
    }

    for (const child of this.children) {
      child.update(ts);
    }
  }

  render(ctx) {
    for (const comp of Object.values(this.components)) {
      comp.render(ctx);
    }

    for (const child of this.children) {
      child.render(ctx);
    }
  }

  delete() {
    for (const comp of Object.values(this.components)) {
      comp.delete();
    }

    for (const child of this.children) {
      child.delete();
    }
  }
}
