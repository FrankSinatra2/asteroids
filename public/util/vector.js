import { almostEqual } from "./math.js";

export const zeroVector = () => {
  return [0, 0];
};

export const forwardVector = () => {
  return rotateVector([0, 1], Math.PI / 2);
};

export const identityRotation = () => {
  return complexFromAngle(Math.PI / 2);
};

export const vectorAdd = (vec1, vec2) => {
  return [
    vec1[0] + vec2[0],
    vec1[1] + vec2[1]
  ]
};


export const vectorSub = (vec1, vec2) => {
  return [
    vec1[0] - vec2[0],
    vec1[1] - vec2[1]
  ]
};

export const vectorScale = (vec, scale) => {
  return [
    scale * vec[0],
    scale * vec[1]
  ]
};

export const vectorLength = (vec) => {
  return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
};

export const vectorNorm = (vec) => {
  return vectorScale(vec, 1.0 / vectorLength(vec));
};

export const vectorEqual = (vec1, vec2) => {
  return almostEqual(vec1[0], vec2[0]) && almostEqual(vec1[1], vec2[1]);
};

export const complexFromAngle = (theta) => {
  return [
    Math.cos(theta),
    Math.sin(theta)
  ];
};

export const complexRot  = (c) => {
  return Math.atan2(im(c), re(c));
};

export const im = (vec) => {
  return vec[1];
};

export const re = (vec) => {
  return vec[0];
};

export const complexMul = (c1, c2) => {
  return [
    re(c1)*re(c2) - im(c1)*im(c2),
    re(c1)*im(c2) + im(c1)*re(c2)
  ]
};

export const combineRot = (c1, c2) => {
  return vectorNorm(complexMul(vectorNorm(c1), vectorNorm(c2)));
};

export const rotateAround = (point, target, theta) => {
  const t = vectorSub(point, target);
  const r = rotateVector(t, theta);

  return vectorAdd(point, vectorSub(r, t));
};

export const rotateVector = (vec, theta) => {
  if (vectorEqual(vec, zeroVector)) {
    return vec;
  }


  const c1 = vectorNorm(vec);
  const c2 = complexFromAngle(theta);

  const rotated = vectorScale(complexMul(c1, c2), vectorLength(vec));

  return rotated;
};
