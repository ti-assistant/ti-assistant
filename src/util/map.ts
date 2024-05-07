export function isHomeSystem(systemNumber?: string) {
  if (!systemNumber) {
    return false;
  }
  return systemNumber.match(/^P[1-8]$/);
}

export function getDefaultMapString(numFactions: number, mapStyle: MapStyle) {
  switch (numFactions) {
    case 3:
      return (
        "0 0 0 0 0 0 " +
        "0 0 0 0 0 0 0 0 0 0 0 0 " +
        "-1 -1 0 P1 0 -1 -1 -1 0 P2 0 -1 -1 -1 0 P3 0 -1"
      );
    case 4:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 P1 0 0 0 P2 0 0 0 0 P3 0 0 0 P4"
          );
        case "skinny":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "-1 0 P1 -1 -1 -1 -1 P2 0 -1 0 P3 -1 -1 -1 -1 P4 0"
          );
        case "warp":
          return (
            "85A3 0 0 85A 0 0 " +
            "0 87A3 0 0 0 88A 0 87A 0 0 0 88A3 " +
            "86A3 84A3 0 P1 0 0 P2 0 83A 86A 84A 0 P3 0 0 P4 0 83A3"
          );
      }
      break;
    case 5:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 0 0 0 P2 0 0 P3 0 0 P4 0 0 0 P5 0"
          );
        case "skinny":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 P1 -1 0 P2 -1 -1 0 P3 0 -1 -1 P4 0 -1 P5 0"
          );
        case "warp":
          return (
            "0 0 0 85A 0 0 " +
            "0 0 0 0 0 88A 0 87A 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 83A 86A 84A 0 P4 0 0 P5 0 0"
          );
      }
      break;
    case 6:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
          );
        case "large":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 0 P2 0 0 0 P3 0 0 0 P4 0 0 0 P5 0 0 0 P6 0 0 0"
          );
      }
      break;
    case 7:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 85A 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 88A 0 87A 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 83A 86A 84A 0 P5 0 0 P6 0 0 P7 0 0"
          );
        case "warp":
          return (
            "85B 0 0 84B 90B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 88B3 0 P2 0 0 P3 0 86B 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 0 P4 0 0 P5 -1 -1 P6 0 -1 P7 0 0"
          );
      }
      break;
    case 8:
      switch (mapStyle) {
        case "standard":
          return (
            "0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " +
            "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0 P7 0 0 P8 0 0"
          );
        case "warp":
          return (
            "87A1 90B3 0 88A2 89B 0 " +
            "0 0 0 0 0 0 0 0 0 0 0 0 " +
            "0 0 0 0 0 85B2 0 0 0 0 0 0 0 0 83B2 0 0 0 " +
            "P1 0 0 P2 -1 -1 P3 0 -1 P4 0 0 P5 0 0 P6 -1 -1 P7 0 -1 P8 0 0"
          );
      }
      break;
  }
  return (
    "0 0 0 0 0 0 " +
    "0 0 0 0 0 0 0 0 0 0 0 0 " +
    "P1 0 0 P2 0 0 P3 0 0 P4 0 0 P5 0 0 P6 0 0"
  );
}

export function isValidMapString(mapString: string, numFactions: number) {
  let numFactionSystems = 0;
  const systems = mapString.split(" ");
  for (const system of systems) {
    if (!validSystemNumber(system)) {
      console.log(`${system} NOT VALID`);
      return false;
    }
    if (isHomeSystem(system)) {
      numFactionSystems++;
    }
  }
  if (numFactionSystems !== numFactions) {
    console.log(`${numFactionSystems} NOT VALID`);
    return false;
  }
  return true;
}

export function validSystemNumber(number: string) {
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return isHomeSystem(number);
  }
  if (intVal < -1) {
    return false;
  }
  if (intVal > 4260) {
    return false;
  }
  if (intVal > 4236) {
    return true;
  }
  if (intVal > 1060) {
    return false;
  }
  if (intVal > 1000) {
    return true;
  }
  if (intVal > 102) {
    return false;
  }

  return true;
}

export function updateMapString(
  mapString: string,
  mapStyle: MapStyle,
  numFactions: number
) {
  const defaultMapString = getDefaultMapString(numFactions, mapStyle);
  let updatedMapString =
    mapString !== ""
      ? mergeMapStrings(mapString, defaultMapString)
      : defaultMapString;

  if (!isValidMapString(updatedMapString, numFactions)) {
    let currentNum = 1;
    const tiles = updatedMapString.split(" ");
    for (let i = tiles.length - 1; i > 0; i--) {
      if (tiles[i] === "0") {
        tiles[i] = `P${currentNum}`;
        currentNum++;
        if (currentNum > numFactions) {
          break;
        }
      }
    }
    updatedMapString = tiles.join(" ");
    if (!isValidMapString(updatedMapString, numFactions)) {
      updatedMapString = mergeMapStrings(defaultMapString, mapString);
    }
  }
  return updatedMapString;
}

function mergeMapStrings(a: string, b: string) {
  let output = [];
  const aArray = a.split(" ");
  const bArray = b.split(" ");
  let totalLength = Math.max(aArray.length, bArray.length);
  for (let i = 0; i < aArray.length; i++) {
    const aValue = aArray[i];
    const bValue = bArray[i];
    output.push(mapValuePriority(aValue, bValue));
  }
  return output.join(" ");
}

function mapValuePriority(a?: string, b?: string) {
  if (!a) {
    if (!b) {
      throw new Error("Both values missing!");
    }
    return b;
  }
  if (!b) {
    return a;
  }
  if (a === "0") {
    return b;
  }
  if (b === "0") {
    return a;
  }
  return a;
}
