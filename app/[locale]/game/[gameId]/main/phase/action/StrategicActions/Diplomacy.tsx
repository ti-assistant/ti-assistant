import { FormattedMessage } from "react-intl";
import ClaimPlanetsSection from "../../../../../../../../src/components/ClaimPlanetsSection/ClaimPlanetsSection";
import Conditional from "../../../../../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { usePlanets } from "../../../../../../../../src/context/dataHooks";
import { useFactionColor } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";

const Diplomacy = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Diplomacy;

function Primary({ factionId }: { factionId: FactionId }) {
  const planets = usePlanets();

  if (factionId !== "Xxcha Kingdom") {
    return null;
  }

  const peaceAccordsPlanets = Object.values(planets)
    .filter((planet) => {
      if (planet.locked) {
        return false;
      }
      if (planet.id === "Mecatol Rex") {
        return false;
      }
      if (planet.attributes.includes("ocean")) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <Conditional appSection="PLANETS">
      <LabeledDiv
        label={
          <FormattedMessage
            id="Xxcha Kingdom.Abilities.Peace Accords.Title"
            defaultMessage="Peace Accords"
            description="Title of Faction Ability: Peace Accords"
          />
        }
        blur
      >
        <ClaimPlanetsSection
          availablePlanets={peaceAccordsPlanets}
          factionId="Xxcha Kingdom"
          numPlanets={1}
          hideWrapper
        />
      </LabeledDiv>
    </Conditional>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const planets = usePlanets();
  const factionColor = useFactionColor(factionId);

  if (factionId !== "Xxcha Kingdom") {
    return null;
  }

  const peaceAccordsPlanets = Object.values(planets)
    .filter((planet) => {
      if (planet.locked) {
        return false;
      }
      if (planet.id === "Mecatol Rex") {
        return false;
      }
      if (planet.attributes.includes("ocean")) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <Conditional appSection="PLANETS">
      <LabeledDiv
        label={`${(<FactionComponents.Name factionId={factionId} />)} - ${(
          <FormattedMessage
            id="Xxcha Kingdom.Abilities.Peace Accords.Title"
            defaultMessage="Peace Accords"
            description="Title of Faction Ability: Peace Accords"
          />
        )}
      )}`}
        color={factionColor}
        blur
      >
        <ClaimPlanetsSection
          availablePlanets={peaceAccordsPlanets}
          factionId="Xxcha Kingdom"
          numPlanets={1}
        />
      </LabeledDiv>
    </Conditional>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const factionIds = useOrderedFactionIds("MAP");

  if (
    !factionIds.includes("Xxcha Kingdom") ||
    activeFactionId === "Xxcha Kingdom"
  ) {
    return null;
  }

  return <Secondary factionId="Xxcha Kingdom" />;
}
