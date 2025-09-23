import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useGameId,
  useRelics,
  useViewOnly,
} from "../../context/dataHooks";
import { gainRelicAsync, loseRelicAsync } from "../../dynamic/api";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { getGainedRelic } from "../../util/actionLog";
import { rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import IconDiv from "../LabeledDiv/IconDiv";
import RelicPlanetIcon from "../LegendaryPlanetIcon/RelicPlanetIcon";
import { Selector } from "../Selector/Selector";
import TechResearchSection from "../TechResearchSection/TechResearchSection";

export default function GainRelic({
  factionId,
  planetId,
  style,
  blur,
}: {
  factionId: FactionId;
  planetId?: PlanetId;
  style?: CSSProperties;
  blur?: boolean;
}) {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const relics = useRelics();
  const viewOnly = useViewOnly();

  const gainedRelic = getGainedRelic(currentTurn, planetId);
  const unownedRelics = Object.values(relics)
    .filter((relic) => !relic.owner || gainedRelic === relic.id)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (unownedRelics.length === 0) {
    return "No Relics Remaining";
  }

  const innerContent = (
    <>
      <Selector
        hoverMenuLabel={
          <FormattedMessage
            id="Components.Gain Relic.Title"
            description="Title of Component: Gain Relic"
            defaultMessage="Gain Relic"
          />
        }
        icon={<RelicPlanetIcon />}
        hoverMenuStyle={{ fontSize: rem(14) }}
        options={unownedRelics}
        renderItem={(itemId, _) => {
          const relic = relics[itemId];
          if (!relic) {
            return null;
          }
          return (
            <div
              className="flexColumn"
              style={{
                gap: 0,
                width: "fit-content",
              }}
            >
              <SelectableRow
                itemId={relic.id}
                removeItem={() => loseRelicAsync(gameId, factionId, relic.id)}
                viewOnly={viewOnly}
              >
                <InfoRow
                  infoTitle={relic.name}
                  infoContent={
                    <FormattedDescription description={relic.description} />
                  }
                >
                  {relic.name}
                </InfoRow>
              </SelectableRow>
              {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
            </div>
          );
        }}
        selectedItem={gainedRelic}
        toggleItem={(relicId, add) => {
          if (add) {
            gainRelicAsync(gameId, factionId, relicId, planetId);
          } else {
            loseRelicAsync(gameId, factionId, relicId);
          }
        }}
        viewOnly={viewOnly}
        style={style}
      />
      {gainedRelic === "Book of Latvinia" ? (
        <TechResearchSection
          factionId={factionId}
          filter={(tech) => tech.prereqs.length === 0}
          numTechs={2}
          style={{ paddingLeft: rem(4) }}
        />
      ) : null}
    </>
  );

  if (gainedRelic) {
    return (
      <IconDiv
        blur={blur}
        icon={<RelicPlanetIcon />}
        style={{ width: "fit-content" }}
        innerStyle={{
          width: "fit-content",
          fontSize: rem(14),
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {innerContent}
      </IconDiv>
    );
  }

  return <div style={{ width: "fit-content" }}>{innerContent}</div>;
}
