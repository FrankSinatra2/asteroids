import { Component } from '../component.js';

export class StatsComponent extends Component {
  constructor(stats) {
    super('stats');
    this.stats = stats;
  }
}

