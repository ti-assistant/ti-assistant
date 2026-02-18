import TechResearchSection from "../../../../../../../../src/components/TechResearchSection/TechResearchSection";
import {
  useCurrentTurn,
  useTechs,
} from "../../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../../src/context/factionDataHooks";
import { getResearchedTechs } from "../../../../../../../../src/util/actionLog";
import { hasTech } from "../../../../../../../../src/util/api/techs";
import { objectKeys } from "../../../../../../../../src/util/util";

export default function Plagiarize({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const techs = useTechs();

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const researchedTech = getResearchedTechs(currentTurn, factionId);
  const possibleTechs = new Set<TechId>();
  Object.values(factions).forEach((otherFaction) => {
    objectKeys(otherFaction.techs).forEach((techId) => {
      const tech = techs[techId];
      if (!tech || tech.faction) {
        return;
      }
      if (
        hasTech(otherFaction, tech) &&
        !hasTech(faction, tech) &&
        !researchedTech.includes(techId)
      ) {
        possibleTechs.add(techId);
      }
    });
  });

  return (
    <TechResearchSection
      factionId={factionId}
      filter={(tech) => possibleTechs.has(tech.id)}
      gain
    />
  );
}
