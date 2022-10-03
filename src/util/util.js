/**
 * Returns the next index in order between [min, max)
 * 
 * @param {int} curr The current index
 * @param {int} max The max value for this, exclusive.
 * @param {int} [min=0] The min value for this, inclusive. Will use 0 if not provided
 * @returns int
 */
export function getNextIndex(curr, max, min = 0) {
  return Math.max((curr + 1) % max, min);
}

const shouldNotPluralize = [
  "Infantry",
];

export function pluralize(text, number) {
  if (number === 1 || shouldNotPluralize.includes(text)) {
    return `${text}`;
  } else {
    return `${text}s`;
  }
}