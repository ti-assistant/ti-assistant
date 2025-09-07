type ObjectWithOmegas<T extends Object> = {
  omegas?: Omega<T>[];
};

function mergeWithOmegas<T extends ObjectWithOmegas<T>>(
  object: T,
  expansions: Expansion[]
) {
  if (!object.omegas) {
    return object;
  }

  let updatedObject = { ...object };
  for (const omega of object.omegas) {
    if (expansions.includes(omega.expansion)) {
      updatedObject = { ...updatedObject, ...omega };
    }
  }

  return updatedObject;
}

export function buildMergeFunction(expansions: Expansion[]) {
  function mergeFunction<T extends ObjectWithOmegas<T>>(object: T) {
    return mergeWithOmegas(object, expansions);
  }
  return mergeFunction;
}
