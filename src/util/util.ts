/**
 * Returns the next index in order between [min, max)
 */
export function getNextIndex(curr: number, max: number, min: number = 0) {
  return Math.max((curr + 1) % max, min);
}

/**
 * Converts pixel units to rem units and and appends rem.
 */
export function rem(pixels: number): `${number}rem` {
  return `${pixels / 16}rem`;
}

/**
 * Converts pixel units to em units and and appends rem.
 */
export function em(pixels: number): `${number}em` {
  return `${pixels / 16}em`;
}

export function lerp(min: number, max: number, value: number) {
  return (value - min) / (max - min);
}

export function objectKeys<T extends string | number>(
  obj: Partial<Record<T, any>>,
): T[] {
  return Object.keys(obj) as T[];
}

export function objectEntries<T extends string | number, U>(
  obj: Partial<Record<T, U>>,
): [T, U][] {
  return Object.entries(obj) as [T, U][];
}

export function getRadialPosition(
  index: number,
  numOptions: number,
  offset: number,
  circleSize: number,
  size: number,
) {
  const radians = ((Math.PI * 2) / numOptions) * index + offset;

  const center = circleSize / 2;
  const pos = {
    top: rem(
      Math.round(100 * (center - center * Math.cos(radians) - size / 2)) / 100,
    ),
    left: rem(
      Math.round(100 * (center - center * -Math.sin(radians) - size / 2)) / 100,
    ),
  };
  return pos;
}

export function intlErrorFn(err: any) {
  if (err.code === "MISSING_TRANSLATION") {
    return;
  }
  console.error(err);
}
