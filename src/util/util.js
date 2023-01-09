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

export function validateMapString(mapString) {
  const systemArray = mapString.split(" ");
  switch (systemArray.length) {
    // 3 rings or less
    case 36:
      break;
    // 4 rings
    case 60:
      break;
    default:
      return false;
  }
  for (const system of systemArray) {
    if (isNaN(parseInt(system))) {
      return false;
    }
  }
  // TODO: Load systems and ensure that they are all found.
  return true;
}

export function getResponsiveFormula(minSize, maxSize) {
  return `calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - 1280px) / (2560 - 1280)))`;
}

export function responsivePixels(number) {
  return `max( calc( ${number}px + ( ${number * 2} - ${number} ) * ( ( 100vw - 1280px ) / ( 2560 - 1280 ) ) ), ${number}px )`;
}

export function responsiveNegativePixels(number) {
  return `min( calc( ${number}px + ( ${number * 2} - ${number} ) * ( ( 100vw - 1280px ) / ( 2560 - 1280 ) ) ), ${number}px )`;
}