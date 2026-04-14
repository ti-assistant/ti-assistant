import { FactionCard } from "../../../../../../../../src/components/Card/Card";
import Conditional from "../../../../../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import TechResearchSection from "../../../../../../../../src/components/TechResearchSection/TechResearchSection";
import { useCurrentTurn } from "../../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColors,
} from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { getResearchedTechs } from "../../../../../../../../src/util/actionLog";
import { rem } from "../../../../../../../../src/util/util";

const Technology = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Technology;

function Primary({ factionId }: { factionId: FactionId }) {
  const colors = useFactionColors(factionId);

  return (
    <Conditional appSection="TECHS">
      <div style={{ minWidth: rem(300) }}>
        <FactionCard
          factionId={factionId}
          label={<FactionComponents.Name factionId={factionId} />}
        >
          <TechResearchSection factionId={factionId} numTechs={2} hideWrapper />
        </FactionCard>
      </div>
    </Conditional>
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
  const researchedTechs = getResearchedTechs(currentTurn, factionId);
  const secondaryState = faction?.secondary ?? "PENDING";
  if (researchedTechs.length === 0 && secondaryState === "SKIPPED") {
    return null;
  }
  return (
    <Conditional appSection="TECHS">
      <FactionCard
        factionId={factionId}
        label={<FactionComponents.Name factionId={factionId} />}
      >
        <TechResearchSection
          factionId={factionId}
          numTechs={maxTechs}
          hideWrapper
        />
      </FactionCard>
    </Conditional>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );

  return (
    <Conditional appSection="TECHS">
      <div
        className="flexRow mediumFont"
        style={{
          paddingTop: rem(4),
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {orderedFactionIds.map((factionId) => {
          if (factionId === activeFactionId || factionId === "Nekro Virus") {
            return null;
          }
          return (
            <div key={factionId} style={{ width: "48%" }}>
              <Secondary factionId={factionId} />
            </div>
          );
        })}
      </div>
    </Conditional>
  );
}
