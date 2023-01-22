import { Component } from '../component.js';

export class OnDelete extends Component {
  constructor() {
    super('on-delete');

    this.onDeleteFunc = null;
  }

  delete() {
    if (this.onDeleteFunc) {
      this.onDeleteFunc();
    }
  }
}

