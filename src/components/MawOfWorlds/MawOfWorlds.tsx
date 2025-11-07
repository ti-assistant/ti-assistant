import { FormattedMessage, useIntl } from "react-intl";
import {
  useCurrentTurn,
  useGameId,
  useRelic,
  useTechs,
} from "../../context/dataHooks";
import { useFactionTechs } from "../../context/factionDataHooks";
import { playRelicAsync, unplayRelicAsync } from "../../dynamic/api";
import { TechRow } from "../../TechRow";
import { getPlayedRelic } from "../../util/actionLog";
import { getColorForFaction } from "../../util/factions";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import FactionComponents from "../FactionComponents/FactionComponents";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";

export default function MawOfWorlds({}) {
  const intl = useIntl();
  const currentPhase = useCurrentTurn();
  const gameId = useGameId();
  const mawOfWorlds = useRelic("Maw of Worlds");
  const techs = useTechs();

  const factionTechs = useFactionTechs(
    mawOfWorlds?.owner ?? "Vuil'raith Cabal"
  );

  if (!mawOfWorlds || !mawOfWorlds.owner) {
    return null;
  }

  const mawEvent: Optional<MawOfWorldsEvent> = getPlayedRelic(
    currentPhase,
    "Maw of Worlds"
  ) as Optional<MawOfWorldsEvent>;

  if (mawEvent) {
    return (
      <LabeledDiv
        label={
          <div className="flexRow">
            <FormattedMessage
              id="Relics.Maw of Worlds.Title"
              defaultMessage="Maw of Worlds"
              description="Title of Relic: Maw of Worlds"
            />

            <FactionIcon factionId={mawOfWorlds.owner} size={16} />
          </div>
        }
        color={getColorForFaction(mawOfWorlds.owner)}
        style={{ fontSize: rem(14) }}
      >
        <TechRow
          techId={mawEvent.tech}
          removeTech={(techId) => {
            unplayRelicAsync(gameId, {
              relic: "Maw of Worlds",
              tech: techId,
            });
          }}
          researchAgreement={mawOfWorlds.owner === "Universities of Jol-Nar"}
        />
      </LabeledDiv>
    );
  }

  const isPurged = mawOfWorlds.state === "purged";
  if (isPurged) {
    return null;
  }

  const availableTechs = Object.values(techs).filter((tech) => {
    const canResearch = !tech.faction || tech.faction === mawOfWorlds.owner;
    return canResearch && !factionTechs.has(tech.id);
  });

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={mawOfWorlds.owner} />}
      color={getColorForFaction(mawOfWorlds.owner)}
    >
      <TechSelectHoverMenu
        factionId={mawOfWorlds.owner}
        ignorePrereqs
        label={intl.formatMessage({
          id: "Relics.Maw of Worlds.Title",
          defaultMessage: "Maw of Worlds",
          description: "Title of Relic: Maw of Worlds",
        })}
        selectTech={(tech) => {
          playRelicAsync(gameId, {
            relic: "Maw of Worlds",
            tech: tech.id,
          });
        }}
        techs={availableTechs}
      />
    </LabeledDiv>
  );
}
