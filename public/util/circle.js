import { vectorLength, vectorScale, vectorSub, vectorAdd, zeroVector } from './vector.js';

export class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }


  contains(point) {
    return this.radius > vectorLength(vectorSub(this.center, point));
  }
}

export const renderCircle = (circle, ctx) => {
  ctx.beginPath();
  ctx.arc(circle.center[0], circle.center[1], circle.radius, 0, 2 * Math.PI);
  ctx.stroke();
};

export const circleFromThreePoints = (a, b, c) => {

  const chord1 = vectorSub(b, a);
  const chord2 = vectorSub(c, b);

  const center = [0, 0];

  const slope1 = chord1[1] / chord1[0];
  const slope2 = chord2[1] / chord2[0];

  center[0] = (slope1*slope2*(a[1] - c[1]) + slope2*(a[0] + b[0]) - slope1*(b[0]+c[0])) / (2 * (slope2 - slope1));
  center[1] = -1*(center[0] - (a[0]+b[0])/2)/slope1 + (a[1]+b[1])/2;

  const radius = vectorLength(vectorSub(center, a));

  return new Circle(center, radius);
};

export const circleFromTwoPoints = (a, b) => {
  const diff = vectorSub(b, a);
  const halfDiff = vectorScale(diff, 0.5);
  const midPoint = vectorAdd(a, halfDiff);

  const radius = vectorLength(halfDiff);

  return new Circle(midPoint, radius);
};

export const circleFromOnePoint = (a) => {
  return new Circle(a, 0);
};

const trivialCircle = (r) => {
  const length = r.length;

  if (length === 3) {
    return circleFromThreePoints(r[0], r[1], r[2]);
  } else if (length === 2) {
    return circleFromTwoPoints(r[0], r[1]);
  } else {
    return circleFromOnePoint(r[0] || zeroVector());
  }
};

export const boundingCircle = (points) => {
  const welzl = (P, R) => {
    if (!P || P.length === 0 || R.length === 3) {
      return trivialCircle(R);
    }

    const p = P[0];
    const d = welzl([...P.slice(1)], [...R]);

    if (d.contains(p)) {
      return d;
    }

    return welzl([...P.slice(1)], [p, ...R]);
  };

  return welzl([...points], []);
};

