import { TacticalAction } from "../../../../../../../src/components/TacticalAction";
import {
  useCurrentTurn,
  usePlanets,
} from "../../../../../../../src/context/dataHooks";
import { useObjectives } from "../../../../../../../src/context/objectiveDataHooks";
import {
  getClaimedPlanets,
  getScoredObjectives,
} from "../../../../../../../src/util/actionLog";

export default function DannelOfTheTenth({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const objectives = useObjectives();
  const planets = usePlanets();

  const conqueredPlanets = getClaimedPlanets(currentTurn, factionId);
  const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
    if (planet.home || planet.locked || planet.owner === factionId) {
      return false;
    }
    if (planet.owner === factionId) {
      return false;
    }
    if (planet.attributes.includes("ocean")) {
      return false;
    }
    return true;
  });
  const scoredObjectives = getScoredObjectives(currentTurn, factionId);
  const scoredActionPhaseObjectives = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return objectiveObj.phase === "ACTION";
  });
  const scorableObjectives = Object.values(objectives ?? {}).filter(
    (objective) => {
      const scorers = objective.scorers ?? [];
      if (scorers.includes(factionId)) {
        return false;
      }
      if (
        objective.id === "Betray a Friend" ||
        objective.id === "Become a Martyr" ||
        objective.id === "Prove Endurance" ||
        objective.id === "Darken the Skies" ||
        objective.id === "Demonstrate Your Power" ||
        objective.id === "Destroy Their Greatest Ship" ||
        objective.id === "Fight With Precision" ||
        objective.id === "Make an Example of Their World" ||
        objective.id === "Turn Their Fleets to Dust" ||
        objective.id === "Unveil Flagship"
      ) {
        return false;
      }
      if (objective.type === "OTHER") {
        return false;
      }
      if (objective.type === "SECRET" && scorers.length > 0) {
        return false;
      }
      return objective.phase === "ACTION";
    }
  );

  return (
    <TacticalAction
      activeFactionId={factionId}
      claimablePlanets={conqueredPlanets.length < 3 ? claimablePlanets : []}
      conqueredPlanets={conqueredPlanets}
      frontier={false}
      scoredObjectives={scoredActionPhaseObjectives}
      scorableObjectives={scorableObjectives}
      style={{ width: "100%" }}
    />
  );
}
