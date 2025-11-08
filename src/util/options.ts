import { getDefaultMapString, processMapString } from "./map";

export function getMapString(options: Options, numFactions: number) {
  const thundersEdge = options.expansions.includes("THUNDERS EDGE");
  const defaultMap = getDefaultMapString(
    numFactions,
    options["map-style"],
    thundersEdge
  );
  let processed = options["processed-map-string"];
  if (processed && processed !== "" && processed !== defaultMap) {
    return processed;
  }

  const raw = options["map-string"];
  if (!raw || raw === "") {
    return;
  }

  processed = processMapString(
    raw,
    options["map-style"],
    numFactions,
    thundersEdge
  );
  if (processed && processed !== "" && processed !== defaultMap) {
    return processed;
  }
  return;
}
