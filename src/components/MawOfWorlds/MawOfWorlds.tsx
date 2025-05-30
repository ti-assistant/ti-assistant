import { FormattedMessage, useIntl } from "react-intl";
import {
  useActionLog,
  useGameId,
  useRelics,
  useTechs,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { playRelicAsync, unplayRelicAsync } from "../../dynamic/api";
import { TechRow } from "../../TechRow";
import { getPlayedRelic } from "../../util/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionColor, getFactionName } from "../../util/factions";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { getCurrentPhaseLogEntries } from "../../util/api/actionLog";

export default function MawOfWorlds({}) {
  const intl = useIntl();
  const actionLog = useActionLog();
  const currentPhase = getCurrentPhaseLogEntries(actionLog);
  const factions = useFactions();
  const gameId = useGameId();
  const relics = useRelics();
  const techs = useTechs();

  const maw = relics["Maw of Worlds"];

  if (!maw || !maw.owner) {
    return null;
  }

  const owner = factions[maw.owner];

  if (!owner) {
    return null;
  }

  const mawEvent: Optional<MawOfWorldsEvent> = getPlayedRelic(
    currentPhase,
    "Maw of Worlds"
  ) as Optional<MawOfWorldsEvent>;

  if (mawEvent) {
    const tech = techs[mawEvent.tech];
    if (!tech) {
      return null;
    }

    return (
      <LabeledDiv
        label={
          <div className="flexRow">
            <FormattedMessage
              id="Relics.Maw of Worlds.Title"
              defaultMessage="Maw of Worlds"
              description="Title of Relic: Maw of Worlds"
            />

            <FactionIcon factionId={owner.id} size={16} />
          </div>
        }
        color={getFactionColor(owner)}
        style={{ fontSize: rem(14) }}
      >
        <TechRow
          tech={tech}
          removeTech={(techId) => {
            unplayRelicAsync(gameId, {
              relic: "Maw of Worlds",
              tech: techId,
            });
          }}
          researchAgreement={owner.id === "Universities of Jol-Nar"}
        />
      </LabeledDiv>
    );
  }

  const isPurged = maw.state === "purged";
  if (isPurged) {
    return null;
  }

  const availableTechs = Object.values(techs).filter((tech) => {
    const canResearch = !tech.faction || tech.faction === owner.id;
    return canResearch && !hasTech(owner, tech.id);
  });

  return (
    <LabeledDiv label={getFactionName(owner)} color={getFactionColor(owner)}>
      <TechSelectHoverMenu
        factionId={maw.owner}
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
