import { FormattedMessage, useIntl } from "react-intl";
import GainRelic from "../../../../../../../src/components/Actions/GainRelic";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import TechSelectHoverMenu from "../../../../../../../src/components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  useCurrentTurn,
  useGameId,
  useOptions,
  useTechs,
} from "../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../src/context/factionDataHooks";
import {
  purgeTechAsync,
  unpurgeTechAsync,
} from "../../../../../../../src/dynamic/api";
import { TechRow } from "../../../../../../../src/TechRow";
import { getPurgedTechs } from "../../../../../../../src/util/actionLog";
import { hasTech } from "../../../../../../../src/util/api/techs";
import { objectKeys } from "../../../../../../../src/util/util";

export default function VaultsOfTheHeir({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const options = useOptions();
  const intl = useIntl();
  const techs = useTechs();

  if (!faction) {
    return null;
  }

  if (options.hide?.includes("TECHS")) {
    return <GainRelic factionId={factionId} />;
  }

  const canPurgeTechs = objectKeys(faction.techs)
    .filter((techId) => hasTech(faction, techs[techId]))
    .map((techId) => techs[techId] as Tech);

  const purgedTechs = getPurgedTechs(currentTurn);
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
            {purgedTechs.map((techId) => {
              return (
                <TechRow
                  key={techId}
                  techId={techId}
                  removeTech={() => {
                    unpurgeTechAsync(gameId, techId, factionId);
                  }}
                  opts={{ hideSymbols: true }}
                />
              );
            })}
          </LabeledDiv>
          <GainRelic factionId={factionId} />
        </>
      ) : (
        <TechSelectHoverMenu
          factionId={factionId}
          techs={canPurgeTechs}
          label={intl.formatMessage({
            id: "o+O/Bq",
            description: "Label on a hover menu used to purge a tech.",
            defaultMessage: "Purge Tech",
          })}
          selectTech={(tech) => purgeTechAsync(gameId, tech.id, factionId)}
        />
      )}
    </div>
  );
}
