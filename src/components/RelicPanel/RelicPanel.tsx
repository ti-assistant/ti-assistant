import { use } from "react";
import { ModalContext } from "../../context/contexts";
import { useGameId, useRelics, useViewOnly } from "../../context/dataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { gainRelicAsync, loseRelicAsync } from "../../dynamic/api";
import { InfoRow } from "../../InfoRow";
import { getColorForFaction } from "../../util/factions";
import { CollapsibleSection } from "../CollapsibleSection";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import styles from "./RelicPanel.module.scss";

function RelicPanelContent({}) {
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const relics = useRelics();
  const viewOnly = useViewOnly();

  return (
    <div className={styles.factionInfoGrid}>
      <CollapsibleSection title="Relics" style={{ width: "100%" }}>
        <div
          className="flexColumn"
          style={{
            display: "grid",
            gridAutoFlow: "row",
            gridAutoColumns: "auto 1fr auto",
            width: "100%",
            gap: "4px",
            padding: `0 4px 4px`,
            fontSize: "14px",
            justifyContent: "stretch",
            alignItems: "stretch",
          }}
        >
          {Object.values(relics).map((relic) => {
            return (
              <div
                key={relic.id}
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  gridColumn: "span 3",
                  display: "grid",
                  gridTemplateColumns: "subgrid",
                  opacity: relic.state === "purged" ? 0.25 : undefined,
                }}
              >
                <FactionSelectRadialMenu
                  factions={mapOrderedFactionIds}
                  borderColor={
                    relic.owner ? getColorForFaction(relic.owner) : undefined
                  }
                  size={36}
                  selectedFaction={relic.owner}
                  onSelect={(factionId, prevFaction) => {
                    if (!gameId) {
                      return;
                    }
                    if (prevFaction) {
                      loseRelicAsync(gameId, prevFaction, relic.id);
                    }
                    if (factionId) {
                      gainRelicAsync(gameId, factionId, relic.id);
                    }
                  }}
                  viewOnly={viewOnly}
                />
                <InfoRow
                  infoTitle={relic.name}
                  infoContent={
                    <FormattedDescription description={relic.description} />
                  }
                >
                  {relic.name}
                </InfoRow>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function RelicPanel({}) {
  const { openModal } = use(ModalContext);

  return (
    <>
      <button onClick={() => openModal(<RelicModalContent />)}>Relics</button>
    </>
  );
}

function RelicModalContent() {
  return (
    <div
      className="flexColumn"
      style={{
        whiteSpace: "normal",
        textShadow: "none",
        width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
        justifyContent: "flex-start",
        height: `calc(100dvh - 24px)`,
      }}
    >
      <div
        className="flexRow centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          padding: "4px 8px",
          borderRadius: "4px",
          border: "1px solid var(--neutral-border)",
        }}
      >
        Relics
      </div>
      <div
        className="flexColumn largeFont"
        onClick={(e) => e.stopPropagation()}
        style={{
          justifyContent: "flex-start",
          height: "fit-content",
        }}
      >
        <RelicPanelContent />
      </div>
    </div>
  );
}
