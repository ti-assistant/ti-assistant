import { FormattedMessage } from "react-intl";
import {
  useExpedition,
  useGameId,
  useRelics,
  useViewOnly
} from "../context/dataHooks";
import { useFactions } from "../context/factionDataHooks";
import { useOrderedFactionIds } from "../context/gameDataHooks";
import {
  commitToExpeditionAsync,
  gainRelicAsync,
  loseRelicAsync
} from "../dynamic/api";
import { InfoRow } from "../InfoRow";
import { SelectableRow } from "../SelectableRow";
import { getFactionColor } from "../util/factions";
import { rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import ExpeditionIcon from "./Expedition/ExpeditionIcon";
import FactionCircle from "./FactionCircle/FactionCircle";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "./FormattedDescription/FormattedDescription";
import LabeledLine from "./LabeledLine/LabeledLine";
import styles from "./ThundersEdgePanel.module.scss";

export default function ThundersEdgePanel() {
  return (
    <div className={styles.ThundersEdgeGrid}>
      <ExpeditionSection />
      <RelicsSection />
    </div>
  );
}

function ExpeditionSection() {
  return (
    <CollapsibleSection
      title={
        <div className={styles.planetTitle}>
          <FormattedMessage
            id="1bUwOq"
            description="Text shown on a menu for selecting an expedition."
            defaultMessage="Thunder's Edge Expedition"
          />
        </div>
      }
      style={{ height: "fit-content", gridArea: "expedition" }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(3, 1fr)",
          rowGap: rem(16),
          padding: rem(8),
        }}
      >
        <ExpeditionRadialSelector expeditionId="tradeGoods" />
        <ExpeditionRadialSelector expeditionId="resources" />
        <ExpeditionRadialSelector expeditionId="actionCards" />
        <ExpeditionRadialSelector expeditionId="techSkip" />
        <ExpeditionRadialSelector expeditionId="secrets" />
        <ExpeditionRadialSelector expeditionId="influence" />
      </div>
    </CollapsibleSection>
  );
}

function ExpeditionRadialSelector({
  expeditionId,
}: {
  expeditionId: ExpeditionId;
}) {
  const expedition = useExpedition();
  const factions = useFactions();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const viewOnly = useViewOnly();

  const selectedFactionId = expedition[expeditionId];
  const selectedFaction = selectedFactionId
    ? factions[selectedFactionId]
    : undefined;

  return (
    <div className="flexColumn">
      <div
        className="flexRow"
        style={{
          position: "relative",
          height: rem(28),
          fontFamily: "Slider",
          gap: rem(4),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExpeditionIcon expedition={expeditionId} />
      </div>
      <FactionSelectRadialMenu
        borderColor={getFactionColor(selectedFaction)}
        factions={mapOrderedFactionIds}
        onSelect={(factionId) => {
          commitToExpeditionAsync(gameId, expeditionId, factionId);
        }}
        selectedFaction={expedition[expeditionId]}
        viewOnly={viewOnly}
      />
    </div>
  );
}

function RelicsSection() {
  // const components = useComponents();
  const gameId = useGameId();
  const factions = useFactions();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const relics = useRelics();

  const ownedRelics = Object.values(relics)
    .filter((relic) => relic.owner && relic.state !== "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const unownedRelics = Object.values(relics)
    .filter((relic) => !relic.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  // TODO: Fix purged relics.
  // const purgedRelics = Object.values(relics)
  //   .filter((relic) => {
  //     const component = components[relic.id];
  //     return !component || component.state === "purged";
  // })
  // .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <CollapsibleSection
      title={
        <div className={styles.planetTitle}>
          <FormattedMessage
            id="pPpzkR"
            description="The title of relic cards."
            defaultMessage="Relics"
          />
        </div>
      }
      style={{
        height: "fit-content",
        gridArea: "left",
        padding: `${rem(8)}`,
        paddingBottom: rem(28),
      }}
    >
      <div className="flexColumn">
        <LabeledLine leftLabel="Owned Relics" />
        {ownedRelics.map((relic) => {
          const owner = relic.owner;
          if (!owner) {
            return null;
          }
          const factionOwner = factions[owner];
          return (
            <div
              key={relic.id}
              className="flexRow"
              style={{
                width: "100%",
                padding: `0 ${rem(8)}`,
              }}
            >
              <SelectableRow
                itemId={relic.id}
                removeItem={() => loseRelicAsync(gameId, owner, relic.id)}
                style={{ width: "100%" }}
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
              <FactionCircle
                borderColor={getFactionColor(factionOwner)}
                factionId={owner}
                size={24}
              />
            </div>
          );
        })}
        <LabeledLine leftLabel="Unowned Relics" />
        {unownedRelics.map((relic) => {
          return (
            <div
              key={relic.id}
              className="flexRow"
              style={{
                width: "100%",
                padding: `0 ${rem(8)}`,
              }}
            >
              <InfoRow
                infoTitle={relic.name}
                infoContent={
                  <FormattedDescription description={relic.description} />
                }
              >
                {relic.name}
              </InfoRow>
              <FactionSelectRadialMenu
                factions={mapOrderedFactionIds}
                onSelect={(factionId, prevFaction) => {
                  if (factionId) {
                    gainRelicAsync(gameId, factionId, relic.id);
                  }
                  if (prevFaction) {
                    loseRelicAsync(gameId, prevFaction, relic.id);
                  }
                }}
                selectedFaction={relic.owner}
                size={24}
              />
            </div>
          );
        })}
        {/* {purgedRelics.length > 0 ? (
          <>
            <LabeledLine leftLabel="Purged Relics" />
            {purgedRelics.map((relic) => {
              const owner = relic.owner as FactionId;
              return (
                <div
                  key={relic.id}
                  className="flexRow"
                  style={{
                    width: "100%",
                    padding: `0 ${rem(8)}`,
                  }}
                >
                  <SelectableRow
                    itemId={relic.id}
                    removeItem={() =>
                      unplayComponentAsync(gameId, relic.id, owner)
                    }
                    style={{ width: "100%" }}
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
                </div>
              );
            })}
          </>
        ) : null} */}
      </div>
    </CollapsibleSection>
  );
}
