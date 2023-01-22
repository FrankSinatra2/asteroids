import { Component } from '../component.js';

export class TimeToLive extends Component {
  constructor(time) {
    super('time-to-live');
    
    this.timer = time;
  }


  update(ts) {
    if (!this.parent) {
      return;
    }

    this.timer -= ts;

    if (this.timer <= 0) {
      this.parent.broadcast('time-to-live.expired');
    }
  }
}

