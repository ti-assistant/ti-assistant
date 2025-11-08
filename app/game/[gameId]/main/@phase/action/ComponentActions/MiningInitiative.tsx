import {
  useAttachments,
  usePlanets,
} from "../../../../../../../src/context/dataHooks";
import { applyAllPlanetAttachments } from "../../../../../../../src/util/planets";
import { Optional } from "../../../../../../../src/util/types/types";
import { pluralize } from "../../../../../../../src/util/util";

export default function MiningInitiative({
  factionId,
}: {
  factionId: FactionId;
}) {
  const attachments = useAttachments();
  const planets = usePlanets();

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets),
    attachments
  );

  let maxValue = 0;
  let bestPlanet: Optional<PlanetId>;
  updatedPlanets
    .filter((planet) => planet.owner === factionId)
    .forEach((planet) => {
      if (planet.resources > maxValue) {
        bestPlanet = planet.id;
        maxValue = planet.resources;
      }
    });

  return (
    <>{`Best option: ${bestPlanet} to gain ${maxValue} ${pluralize(
      "trade good",
      maxValue
    )}`}</>
  );
}
