import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import { TacticalAction } from "../../../../../../../../src/components/TacticalAction";
import {
  useCurrentTurn,
  usePlanets,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useFactionColors } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../../../src/context/objectiveDataHooks";
import {
  getClaimedPlanets,
  getScoredObjectives,
  getSelectedFaction,
} from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { rem } from "../../../../../../../../src/util/util";

const Zeu = {
  Label,
  RightLabel,
  Content,
};

export default Zeu;

function Label() {
  const currentTurn = useCurrentTurn();
  const factionPicked = getSelectedFaction(currentTurn);

  if (factionPicked === "None") {
    return (
      <FormattedMessage
        id="c6uq+j"
        description="Instruction telling the user to select their faction."
        defaultMessage="Select Faction"
      />
    );
  }

  return (
    <FormattedMessage
      id="e01Ge2"
      description="Type of action involving activating a system."
      defaultMessage="Tactical Action"
    />
  );
}

function RightLabel() {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const factionPicked = getSelectedFaction(currentTurn);
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
  const viewOnly = useViewOnly();

  const selectedFaction = factionPicked === "None" ? undefined : factionPicked;

  return (
    <FactionSelectRadialMenu
      selectedFaction={selectedFaction}
      factions={mapOrderedFactionIds}
      onSelect={(factionId, _) => {
        dataUpdate(Events.SelectFactionEvent(factionId ?? "None"));
      }}
      size={44}
      borderColor={selectedFaction ? factionColors[selectedFaction] : undefined}
      viewOnly={viewOnly}
    />
  );
}

function Content() {
  const currentTurn = useCurrentTurn();
  const objectives = useObjectives();
  const planets = usePlanets();
  const selectedFaction = getSelectedFaction(currentTurn);

  if (selectedFaction === "None") {
    return <div style={{ width: "100%", minHeight: rem(12) }}></div>;
  }

  const claimedPlanets = selectedFaction
    ? getClaimedPlanets(currentTurn, selectedFaction)
    : [];
  const claimablePlanets = Object.values(planets).filter((planet) => {
    if (planet.owner === selectedFaction) {
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
      return selectedFaction === "Deepwrought Scholarate";
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
        if (claimedPlanet?.system) {
          return planet.system === claimedPlanet.system;
        }
        if (claimedPlanet?.faction) {
          return planet.faction === claimedPlanet.faction;
        }
        return false;
      }
    }
    return true;
  });
  const scoredObjectives = selectedFaction
    ? getScoredObjectives(currentTurn, selectedFaction)
    : [];
  const scoredActionPhaseObjectives = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return objectiveObj.phase === "ACTION";
  });
  const scorableObjectives = Object.values(objectives).filter((objective) => {
    const scorers = objective.scorers ?? [];
    if (selectedFaction && scorers.includes(selectedFaction)) {
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

  return (
    <div style={{ width: "100%", minHeight: rem(12) }}>
      {selectedFaction ? (
        <div style={{ paddingTop: rem(12) }}>
          <TacticalAction
            activeFactionId={selectedFaction}
            claimablePlanets={claimablePlanets}
            conqueredPlanets={claimedPlanets}
            scorableObjectives={scorableObjectives}
            scoredObjectives={scoredActionPhaseObjectives}
            style={{ width: "100%" }}
          />
        </div>
      ) : null}
    </div>
  );
}
