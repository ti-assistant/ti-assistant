import { useContext } from "react";
import {
  ActionLogContext,
  FactionContext,
  GameIdContext,
  RelicContext,
  TechContext,
} from "../../context/Context";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { getFactionColor, getFactionName } from "../../util/factions";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { FormattedMessage, useIntl } from "react-intl";
import { playRelicAsync, unplayRelicAsync } from "../../dynamic/api";
import { hasTech } from "../../util/api/techs";
import { getPlayedRelic } from "../../util/actionLog";
import { TechRow } from "../../TechRow";
import FactionIcon from "../FactionIcon/FactionIcon";

export default function MawOfWorlds({}) {
  const intl = useIntl();
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const relics = useContext(RelicContext);
  const techs = useContext(TechContext);

  const maw = relics["Maw of Worlds"];

  if (!maw || !maw.owner) {
    return null;
  }

  const owner = factions[maw.owner];

  if (!owner) {
    return null;
  }

  const mawEvent: MawOfWorldsEvent | undefined = getPlayedRelic(
    actionLog,
    "Maw of Worlds"
  ) as MawOfWorldsEvent | undefined;

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
        noBlur
        style={{ fontSize: "14px" }}
      >
        <TechRow
          tech={tech}
          removeTech={(techId) => {
            unplayRelicAsync(gameId, {
              relic: "Maw of Worlds",
              tech: techId,
            });
          }}
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
    <LabeledDiv
      label={getFactionName(owner)}
      color={getFactionColor(owner)}
      noBlur
    >
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
