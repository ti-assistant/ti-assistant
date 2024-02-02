export function responsivePixels(number: number) {
  if (number < 0) {
    return responsiveNegativePixels(number);
  }
  return `max( calc( ${number}px + ( ${
    number * 2
  } - ${number} ) * ( ( 100vw - 1280px ) / ( 2560 - 1280 ) ) ), ${number}px )`;
}

export function responsiveNegativePixels(number: number) {
  return `min( calc( ${number}px + ( ${
    number * 2
  } - ${number} ) * ( ( 100vw - 1280px ) / ( 2560 - 1280 ) ) ), ${number}px )`;
}
