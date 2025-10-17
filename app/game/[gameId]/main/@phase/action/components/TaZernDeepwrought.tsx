import { FormattedMessage, useIntl } from "react-intl";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import TechSelectHoverMenu from "../../../../../../../src/components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  useCurrentTurn,
  useGameId,
  useTechs,
} from "../../../../../../../src/context/dataHooks";
import {
  purgeTechAsync,
  unpurgeTechAsync,
} from "../../../../../../../src/dynamic/api";
import { TechRow } from "../../../../../../../src/TechRow";
import { getPurgedTechs } from "../../../../../../../src/util/actionLog";
import { objectEntries } from "../../../../../../../src/util/util";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import TechResearchSection from "../../../../../../../src/components/TechResearchSection/TechResearchSection";
import IconDiv from "../../../../../../../src/components/LabeledDiv/IconDiv";
import FactionIcon from "../../../../../../../src/components/FactionIcon/FactionIcon";
import { getFactionColor } from "../../../../../../../src/util/factions";
import { hasTech } from "../../../../../../../src/util/api/techs";

export default function TaZernDeepwrought({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const techs = useTechs();

  const activeFaction = factions[factionId];
  if (!activeFaction) {
    return null;
  }

  const canPurgeTechs = Object.values(techs).filter((tech) => {
    return (
      tech.type !== "UPGRADE" &&
      (!tech.faction || tech.faction === "Deepwrought Scholarate")
    );
  });

  const purgedTechs = getPurgedTechs(currentTurn);
  const researchFactions = Object.values(factions)
    .filter((faction) => {
      const purgedTech = purgedTechs[0];
      if (!purgedTech) {
        return false;
      }
      const purgedTechObj = techs[purgedTech];
      return hasTech(faction, purgedTechObj);
    })
    .sort((a, b) => {
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
    <div className="flexColumn" style={{ alignItems: "flex-start" }}>
      {purgedTechs.length > 0 ? (
        <>
          <LabeledDiv
            label={
              <FormattedMessage
                id="as4lhc"
                description="Label for a section listing purged techs."
                defaultMessage="Purged {count, plural, one {Tech} other {Techs}}"
                values={{ count: purgedTechs.length }}
              />
            }
          >
            {purgedTechs.map((tech) => {
              const techObj = techs[tech];
              if (!techObj) {
                return null;
              }
              return (
                <TechRow
                  key={tech}
                  tech={techObj}
                  removeTech={() => {
                    unpurgeTechAsync(gameId, tech);
                  }}
                  opts={{ hideSymbols: true }}
                />
              );
            })}
          </LabeledDiv>
          {researchFactions.map((faction) => {
            return (
              <IconDiv
                key={faction.id}
                iconSize={24}
                icon={<FactionIcon factionId={faction.id} size={24} />}
                color={getFactionColor(faction)}
              >
                <TechResearchSection factionId={faction.id} numTechs={1} />
              </IconDiv>
            );
          })}
        </>
      ) : (
        <TechSelectHoverMenu
          factionId={"Deepwrought Scholarate"}
          techs={canPurgeTechs}
          label={intl.formatMessage({
            id: "o+O/Bq",
            description: "Label on a hover menu used to purge a tech.",
            defaultMessage: "Purge Tech",
          })}
          selectTech={(tech) => purgeTechAsync(gameId, tech.id)}
        />
      )}
    </div>
  );
}
