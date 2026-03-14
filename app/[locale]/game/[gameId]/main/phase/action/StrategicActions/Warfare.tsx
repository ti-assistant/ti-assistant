import { TacticalAction } from "../../../../../../../../src/components/TacticalAction";
import {
  useCurrentTurn,
  useOptions,
  usePlanets,
} from "../../../../../../../../src/context/dataHooks";
import { useObjectives } from "../../../../../../../../src/context/objectiveDataHooks";
import {
  getClaimedPlanets,
  getScoredObjectives,
} from "../../../../../../../../src/util/actionLog";

const Warfare = {
  Primary,
};

export default Warfare;

function Primary({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();

  if (!options.expansions.includes("THUNDERS EDGE")) {
    return null;
  }

  const scoredObjectives = getScoredObjectives(currentTurn, factionId);
  const claimedPlanets = getClaimedPlanets(currentTurn, factionId);

  const scoredActionPhaseObjectives = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return objectiveObj.phase === "ACTION";
  });
  const scorableObjectives = Object.values(objectives).filter((objective) => {
    const scorers = objective.scorers ?? [];
    if (scorers.includes(factionId)) {
      return false;
    }
    if (scoredObjectives.includes(objective.id)) {
      return false;
    }
    if (
      objective.id === "Become a Martyr" ||
      objective.id === "Prove Endurance"
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
  });
  const claimablePlanets = Object.values(planets).filter((planet) => {
    if (planet.owner === factionId) {
      return false;
    }
    if (planet.locked) {
      return false;
    }
    for (const claimedPlanet of claimedPlanets) {
      if (claimedPlanet.planet === planet.id) {
        return false;
      }
    }
    if (planet.attributes.includes("ocean")) {
      return factionId === "Deepwrought Scholarate";
    }
    // Avernus could be in any system.
    if (planet.id === "Avernus" && planet.owner) {
      return true;
    }
    if (claimedPlanets.length > 0) {
      for (const claimedPlanetEvent of claimedPlanets) {
        if (claimedPlanetEvent.planet === "Avernus") {
          continue;
        }
        const claimedPlanet = planets[claimedPlanetEvent.planet];
        if (claimedPlanet?.attributes.includes("ocean")) {
          continue;
        }
        if (claimedPlanet?.faction) {
          return planet.faction === claimedPlanet.faction;
        }
        if (claimedPlanet?.system) {
          return planet.system === claimedPlanet.system;
        }
        return false;
      }
    }
    return true;
  });
  return (
    <TacticalAction
      activeFactionId={factionId}
      claimablePlanets={claimablePlanets}
      conqueredPlanets={claimedPlanets}
      scorableObjectives={scorableObjectives}
      scoredObjectives={scoredActionPhaseObjectives}
      style={{ width: "100%" }}
    />
  );
}
