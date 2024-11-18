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

/**
 * Converts pixel units to rem units and and appends rem.
 */
export function rem(pixels: number): `${number}rem` {
  return `${pixels / 16}rem`;
}

export function lerp(min: number, max: number, value: number) {
  return (value - min) / (max - min);
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

export function objectKeys<T extends string | number>(
  obj: Partial<Record<T, any>>
): T[] {
  return Object.keys(obj) as T[];
}

export function objectEntries<T extends string | number, U>(
  obj: Partial<Record<T, U>>
): [T, U][] {
  return Object.entries(obj) as [T, U][];
}
