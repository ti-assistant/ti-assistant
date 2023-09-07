import { useEffect, useRef } from "react";

/**
 * Returns the next index in order between [min, max)
 */
export function getNextIndex(curr: number, max: number, min: number = 0) {
  return Math.max((curr + 1) % max, min);
}

const shouldNotPluralize = ["Infantry"];

export function pluralize(text: string, number: number) {
  if (number === 1 || shouldNotPluralize.includes(text)) {
    return `${text}`;
  } else {
    return `${text}s`;
  }
}

export function validateMapString(mapString: string) {
  const systemArray = mapString.split(" ");
  switch (systemArray.length) {
    // 3 rings or less
    case 36:
      break;
    // 4 rings
    case 60:
      break;
  }
  for (const system of systemArray) {
    if (isNaN(parseInt(system))) {
      return false;
    }
  }
  // TODO: Load systems and ensure that they are all found.
  return true;
}

export function getResponsiveFormula(minSize: number, maxSize: number) {
  return `calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - 1280px) / (2560 - 1280)))`;
}

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

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
