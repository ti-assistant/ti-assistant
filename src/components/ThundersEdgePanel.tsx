import { FormattedMessage } from "react-intl";
import {
  useExpedition,
  useGameId,
  useOptions,
  useRelics,
  useViewOnly,
} from "../context/dataHooks";
import { useFactions } from "../context/factionDataHooks";
import { useOrderedFactionIds } from "../context/gameDataHooks";
import {
  commitToExpeditionAsync,
  gainRelicAsync,
  loseRelicAsync,
  scoreObjectiveAsync,
  unplayComponentAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { InfoRow } from "../InfoRow";
import { SelectableRow } from "../SelectableRow";
import { getFactionColor, getFactionName } from "../util/factions";
import { rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import ExpeditionIcon from "./Expedition/ExpeditionIcon";
import FactionCircle from "./FactionCircle/FactionCircle";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "./FormattedDescription/FormattedDescription";
import LabeledLine from "./LabeledLine/LabeledLine";
import styles from "./ThundersEdgePanel.module.scss";
import { useObjective } from "../context/objectiveDataHooks";

function getSupportScorer(factionId: FactionId, support: Objective) {
  if (!support.keyedScorers) {
    return;
  }
  const scorers = support.keyedScorers[factionId];
  if (!scorers) {
    return;
  }
  return scorers[0];
}

export default function ThundersEdgePanel() {
  const options = useOptions();
  return (
    <div className={styles.ThundersEdgeGrid}>
      {options.expansions.includes("THUNDERS EDGE") ? (
        <ExpeditionSection />
      ) : null}
      <RelicsSection />
      <PromissoriesSection />
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
  const factions = useFactions();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const relics = useRelics();

  const ownedRelics = Object.values(relics)
    .filter((relic) => relic.owner && relic.state !== "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const unownedRelics = Object.values(relics)
    .filter((relic) => !relic.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  // TODO: Fix purged relics.
  const purgedRelics = Object.values(relics)
    .filter((relic) => relic.state === "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));

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
        paddingTop: 0,
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
        <LabeledLine leftLabel="Purged Relics" />
        {purgedRelics.length > 0 ? (
          <>
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
                      // TODO: Replace with just updating the state.
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
        ) : null}
      </div>
    </CollapsibleSection>
  );
}

function PromissoriesSection() {
  const factions = useFactions();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const relics = useRelics();

  const supportForTheThrone = useObjective("Support for the Throne");
  if (!supportForTheThrone) {
    return null;
  }

  const ownedRelics = Object.values(relics)
    .filter((relic) => relic.owner && relic.state !== "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const unownedRelics = Object.values(relics)
    .filter((relic) => !relic.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  // TODO: Fix purged relics.
  const purgedRelics = Object.values(relics)
    .filter((relic) => relic.state === "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <CollapsibleSection
      title={
        <div className={styles.planetTitle}>
          <FormattedMessage
            id="CH11Yw"
            description="The title of promissory notes."
            defaultMessage="Promissories"
          />
        </div>
      }
      style={{
        height: "fit-content",
        gridArea: "right",
        padding: `${rem(8)}`,
        paddingTop: 0,
      }}
    >
      <div className="flexColumn">
        <LabeledLine leftLabel="Support for the Throne" />
        {mapOrderedFactionIds.map((factionId) => {
          const supportHolder = getSupportScorer(
            factionId,
            supportForTheThrone
          );
          return (
            <div
              key={factionId}
              className="flexRow"
              style={{
                width: "100%",
                padding: `0 ${rem(8)}`,
              }}
            >
              {getFactionName(factions[factionId])}
              <FactionSelectRadialMenu
                factions={mapOrderedFactionIds}
                invalidFactions={[factionId]}
                onSelect={(newFaction, prevFaction) => {
                  if (newFaction) {
                    scoreObjectiveAsync(
                      gameId,
                      newFaction,
                      "Support for the Throne",
                      factionId
                    );
                  }
                  if (prevFaction) {
                    unscoreObjectiveAsync(
                      gameId,
                      prevFaction,
                      "Support for the Throne",
                      factionId
                    );
                  }
                }}
                selectedFaction={supportHolder}
                borderColor={getFactionColor(
                  supportHolder ? factions[supportHolder] : undefined
                )}
                size={24}
              />
            </div>
          );
        })}
        <LabeledLine leftLabel="Alliance" />
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
        <LabeledLine leftLabel="Purged Relics" />
        {purgedRelics.length > 0 ? (
          <>
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
                      // TODO: Replace with just updating the state.
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
        ) : null}
      </div>
    </CollapsibleSection>
  );
}
