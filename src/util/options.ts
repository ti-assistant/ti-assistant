import { processMapString } from "./map";

export function getMapString(options: Options, numFactions: number) {
  const processed = options["processed-map-string"];
  if (processed && processed !== "") {
    return processed;
  }

  const raw = options["map-string"];
  if (!raw || raw === "") {
    return;
  }

  return processMapString(raw, options["map-style"], numFactions);
}
