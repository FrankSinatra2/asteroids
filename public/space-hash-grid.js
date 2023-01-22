import { clamp } from './util/math.js';

export class SpatialHashGrid {

  constructor(bounds, dimensions, ctx) {
    this.cells = new Map();
    this.bounds = bounds;
    this.dimensions = dimensions;
    this.clientIds = 0;


    this.ctx = ctx;
  }

  getWidth() {
    return this.bounds[1][0] - this.bounds[0][0];
  }

  getHeight() {
    return this.bounds[1][1] - this.bounds[0][1];
  }

  getCellSize() {
    return [
      this.getWidth() / this.dimensions[0],
      this.getHeight() / this.dimensions[1]
    ];
  }

  getCellIndex(position) {
    const x = clamp((position[0] - this.bounds[0][0]) / (this.bounds[1][0] - this.bounds[0][0]), 0.0, 1.0);
    const y = clamp((position[1] - this.bounds[0][1]) / (this.bounds[1][1] - this.bounds[0][1]), 0.0, 1.0);

    // const x = clamp((position[0]) / (this.bounds[1][0] - this.bounds[0][0]), 0.0, 1.0);
    // const y = clamp((position[1]) / (this.bounds[1][1] - this.bounds[0][1]), 0.0, 1.0);
    
    const xIndex = Math.floor(x * (this.dimensions[0] - 1));
    const yIndex = Math.floor(y * (this.dimensions[1] - 1));
    return [xIndex, yIndex];
  }

  createKey(cellIndex) {
    return `${cellIndex[0]}.${cellIndex[1]}`;
  }

  createClient(position, dimensions, data) {
    const client = {
      position: position,
      dimensions: dimensions,
      indices: null,
      data: data
    };

    this.insertClient(client);

    console.log(`client position: ${client.position[0]}:${client.position[1]}`);
    console.log(`client index: ${client.indices[0]}:${client.indices[1]}`);

    return client;
  }

  updateClient(client) {
    this.removeClient(client);
    this.insertClient(client);
  }

  removeClient(client) {
    const [i1, i2] = client.indices;

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this.createKey([x, y]);
        
        if (this.cells.has(k)) {
          this.cells.get(k).delete(client);
        }
      }
    }
  }

  insertClient(client) {
    const [x, y] = client.position;
    const [w, h] = client.dimensions;

    const i1 = this.getCellIndex([x - w / 2, y - h / 2]);
    const i2 = this.getCellIndex([x + w / 2, y + h / 2]);

    client.indices = [i1, i2];

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this.createKey([x, y]);
        if (!this.cells.has(k)) {
          this.cells.set(k, new Set());
        }
        this.cells.get(k).add(client);
      }
    }
  }
  
  render() {
    if (!this.hasRendered) {
      this.hasRendered = false;
    }

    if (this.hasRendered) {
      return;
    }
    
    const cellSize = this.getCellSize();

    this.ctx.fillStyle = '#00FF00';
    for (let x = 0; x < this.dimensions[0]; x++) {
      for (let y = 0; y <  this.dimensions[1]; y++) {
        this.ctx.fillRect(x * cellSize[0], y * cellSize[1], 5, 5);
      }
    }

    // console.log([...this.cells.keys()]);
    // for (const cell of this.cells.keys()) {
    //   // console.log(cell);
    //   for (const item of this.cells.get(cell).values()) {
    //     // console.log(item);
    //     this.ctx.fillStyle = "#00FF00";
    //     this.ctx.fillRect(item.indices[0][0] * (this.dimensions[0]-1), item.indices[1][0] * (this.dimensions[1]-1), 5, 5);
    //     // const p = item.data.getPosition();
    //     // console.log(p[0], p[1]);
    //   }
    // }

    this.hasRendered = false; //  true; 
  } 

  findNearby(position, dimensions) {
    const [x, y] = position;
    const [w, h] = dimensions;

    const p1 = [x - w / 2, y - h / 2];
    const p2 = [x + w / 2, y + h / 2];

    const i1 = this.getCellIndex(p1);
    const i2 = this.getCellIndex(p2);

    const clients = new Set();
    this.ctx.fillStyle = "#0000FF";
    const xMax = i2[0];
    const yMax = i2[1];

    const cellSize = this.getCellSize();
 
    for (let xi = i1[0]; xi <= xMax; xi++) {
      for (let yi = i1[1]; yi <= yMax; yi++) {
        const k = this.createKey([xi, yi]);

        this.ctx.fillRect(xi * cellSize[0], yi * cellSize[1], 5, 5);
      
        if (this.cells.has(k)) {
          for (const v of this.cells.get(k)) {
            clients.add(v);
          }
        }
      }
    }

    // for (let _x = i1[0], xn = i2[0]; _x <= xn; ++_x) {
    //   for (let _y = i1[1], yn = i2[1]; _y <= yn; ++_y) {
    //     const k = this.createKey([_x, _y]);

    //     this.ctx.fillRect(_x * (this.dimensions[0]-1), _y * (this.dimensions[1]-1), 5, 5);


    //     if (this.cells.has(k)) {
    //       for (const v of this.cells.get(k)) {
    //         clients.add(v);
    //       }
    //     }
    //   }
    // }
    return [...clients];
  }

  rect(client) {
    let [x, y] = client.position;
    let [w, h] = client.dimensions;

    return {
      left: x - w / 2.0,
      top: y + h / 2.0,
      right: x + w / 2.0,
      bottom: y - h / 2.0
    }
  }

  intersects(a, b) {
    const r1 = this.rect(a);
    const r2 = this.rect(b);

    return !(r2.left > r1.right || 
      r2.right < r1.left || 
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
  }

  pointInBounds(point) {
    const [x, y] = point;
    return (this.bounds[0][0] < x && x < this.bounds[1][0])
      && (this.bounds[0][1] < y && y < this.bounds[1][1]);
  }
}
