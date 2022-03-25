// linear interpolation
export const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t;
};

// clamp value n between min and max
export const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max);
};

// map to new range
export const map = (n, start1, stop1, start2, stop2) => {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

// random between range
export const rr = (min, max) => {
  return Math.random() * (max - min) + min;
};
