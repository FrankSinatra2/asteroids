
export const clamp = (x, min, max) => {
  return Math.max(min, Math.min(x, max));
};

export const almostEqual = (x, y) => {
  return Math.abs(x - y) < 0.00001;
};

export const randomRange = (min, max) => {
  return min + Math.random() * (max - min);
};

export const pickRandom = (values) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};
