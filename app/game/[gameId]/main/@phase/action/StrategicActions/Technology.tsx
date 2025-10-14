import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import TechResearchSection from "../../../../../../../src/components/TechResearchSection/TechResearchSection";
import { useCurrentTurn } from "../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactions,
} from "../../../../../../../src/context/factionDataHooks";
import { getResearchedTechs } from "../../../../../../../src/util/actionLog";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../../src/util/factions";
import { rem } from "../../../../../../../src/util/util";

const Technology = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Technology;

function Primary({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);

  return (
    <div style={{ width: "fit-content" }}>
      <LabeledDiv
        label={getFactionName(faction)}
        color={getFactionColor(faction)}
        blur
      >
        <TechResearchSection factionId={factionId} numTechs={2} hideWrapper />
      </LabeledDiv>
    </div>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  if (!faction) {
    return null;
  }
  let maxTechs = 1;
  if (factionId === "Universities of Jol-Nar") {
    maxTechs = 2;
  }
  const researchedTechs = getResearchedTechs(currentTurn, faction.id);
  const secondaryState = faction?.secondary ?? "PENDING";
  if (researchedTechs.length === 0 && secondaryState === "SKIPPED") {
    return null;
  }
  return (
    <LabeledDiv
      key={faction.id}
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
      opts={{ fixedWidth: true }}
      blur
    >
      <>
        <TechResearchSection
          factionId={faction.id}
          numTechs={maxTechs}
          hideWrapper
        />
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const factions = useFactions();

  const activeFaction = factions[activeFactionId];
  if (!activeFaction) {
    return null;
  }

  const orderedFactions = Object.values(factions).sort((a, b) => {
    if (a.order === activeFaction.order) {
      return -1;
    }
    if (b.order === activeFaction.order) {
      return 1;
    }
    if (a.order < activeFaction.order) {
      if (b.order < activeFaction.order) {
        return a.order - b.order;
      }
      return 1;
    }
    if (b.order > activeFaction.order) {
      return a.order - b.order;
    }
    return -1;
  });
  return (
    <div
      className="flexRow mediumFont"
      style={{
        paddingTop: rem(4),
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {orderedFactions.map((faction) => {
        if (faction.id === activeFactionId || faction.id === "Nekro Virus") {
          return null;
        }
        return (
          <div key={faction.id} style={{ width: "48%" }}>
            <Secondary factionId={faction.id} />
          </div>
        );
      })}
    </div>
  );
}
