import { use } from "react";
import { FormattedMessage } from "react-intl";
import { AddTechList } from "../../../../../../src/AddTechList";
import { ModalContent } from "../../../../../../src/components/Modal/Modal";
import { ModalContext } from "../../../../../../src/context/contexts";
import {
  useGameId,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useFactions,
  useFactionTechs,
} from "../../../../../../src/context/factionDataHooks";
import {
  addTechAsync,
  removeTechAsync,
} from "../../../../../../src/dynamic/api";
import { TechRow } from "../../../../../../src/TechRow";
import { filterToUnownedTechs } from "../../../../../../src/util/techs";
import { rem } from "../../../../../../src/util/util";

export default function TechTab({ factionId }: { factionId: FactionId }) {
  const factions = useFactions();
  const factionTechs = useFactionTechs(factionId);
  const gameId = useGameId();
  const techs = useTechs();
  const viewOnly = useViewOnly();
  const { openModal } = use(ModalContext);

  const techsObj: Partial<Record<TechId, Tech>> = {};
  Object.values(techs).forEach((tech) => {
    if (tech.faction) {
      if (factionId === "Nekro Virus" && !factions[tech.faction]) {
        return;
      } else if (factionId !== "Nekro Virus" && tech.faction !== factionId) {
        return;
      }
    }
    techsObj[tech.id] = tech;
  });
  if (factionId !== "Nekro Virus") {
    Object.values(techsObj).forEach((tech) => {
      if (tech.type === "UPGRADE" && tech.replaces) {
        delete techsObj[tech.replaces];
      }
    });
  }

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }
  const remainingTechs = filterToUnownedTechs(techsObj, faction);

  return (
    <>
      <div className="flexRow" style={{ height: rem(32) }}>
        <button
          onClick={() =>
            openModal(
              <ModalContent
                title={
                  <FormattedMessage
                    id="3qIvsL"
                    description="Label on a hover menu used to research tech."
                    defaultMessage="Research Tech"
                  />
                }
              >
                <AddTechList
                  techs={remainingTechs}
                  addTech={(techId) => addTechAsync(gameId, factionId, techId)}
                />
              </ModalContent>
            )
          }
          disabled={viewOnly}
        >
          <FormattedMessage
            id="3qIvsL"
            description="Label on a hover menu used to research tech."
            defaultMessage="Research Tech"
          />
        </button>
      </div>
      <div
        className="flexColumn largeFont"
        style={{
          gap: rem(8),
          padding: rem(6),
          overflow: "auto",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        {Array.from(factionTechs).map((techId) => {
          return (
            <TechRow
              key={techId}
              techId={techId}
              removeTech={(techId) =>
                removeTechAsync(gameId, factionId, techId)
              }
            />
          );
        })}
      </div>
    </>
  );
}
