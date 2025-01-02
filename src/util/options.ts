import { getDefaultMapString, processMapString } from "./map";

export function getMapString(options: Options, numFactions: number) {
  const defaultMap = getDefaultMapString(numFactions, options["map-style"]);
  let processed = options["processed-map-string"];
  if (processed && processed !== "" && processed !== defaultMap) {
    return processed;
  }

  const raw = options["map-string"];
  if (!raw || raw === "") {
    return;
  }

  processed = processMapString(raw, options["map-style"], numFactions);
  if (processed && processed !== "" && processed !== defaultMap) {
    return processed;
  }
  return;
}
