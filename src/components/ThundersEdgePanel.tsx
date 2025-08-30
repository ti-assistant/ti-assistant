import { FormattedMessage } from "react-intl";
import { useExpedition, useGameId, useViewOnly } from "../context/dataHooks";
import { useOrderedFactionIds } from "../context/gameDataHooks";
import { commitToExpeditionAsync } from "../dynamic/api";
import { rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import ExpeditionIcon from "./Expedition/ExpeditionIcon";
import FactionSelectRadialMenu from "./FactionSelectRadialMenu/FactionSelectRadialMenu";
import styles from "./ThundersEdgePanel.module.scss";
import { getFactionColor } from "../util/factions";
import { useFactions } from "../context/factionDataHooks";

export default function ThundersEdgePanel() {
  return (
    <div className={styles.ThundersEdgeGrid}>
      <ExpeditionSection />
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
