export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
}
