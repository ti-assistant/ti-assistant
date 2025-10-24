import { FormattedMessage, useIntl } from "react-intl";
import ClaimPlanetsSection from "../../../../../../../src/components/ClaimPlanetsSection/ClaimPlanetsSection";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { usePlanets } from "../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactions,
} from "../../../../../../../src/context/factionDataHooks";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../../src/util/factions";

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
      />
    </LabeledDiv>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);
  const intl = useIntl();
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
    <LabeledDiv
      label={`${getFactionName(faction)} - ${intl.formatMessage({
        id: "Xxcha Kingdom.Abilities.Peace Accords.Title",
        defaultMessage: "Peace Accords",
        description: "Title of Faction Ability: Peace Accords",
      })}`}
      color={getFactionColor(faction)}
      blur
    >
      <ClaimPlanetsSection
        availablePlanets={peaceAccordsPlanets}
        factionId="Xxcha Kingdom"
        numPlanets={1}
      />
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const factions = useFactions();

  if (!factions["Xxcha Kingdom"] || activeFactionId === "Xxcha Kingdom") {
    return null;
  }

  return <Secondary factionId="Xxcha Kingdom" />;
}
