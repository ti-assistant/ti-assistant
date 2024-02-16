import { useContext, useState } from "react";
import styles from "./RelicPanel.module.scss";
import GenericModal from "../GenericModal/GenericModal";
import {
  FactionContext,
  GameIdContext,
  RelicContext,
} from "../../context/Context";
import { CollapsibleSection } from "../CollapsibleSection";
import { InfoRow } from "../../InfoRow";
import { FactionSelectHoverMenu } from "../FactionSelect";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import { gainRelicAsync, loseRelicAsync } from "../../dynamic/api";
import { getFactionColor } from "../../util/factions";

function RelicPanelContent({}) {
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const relics = useContext(RelicContext);

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
                  factions={Object.values(factions).map(
                    (faction) => faction.id
                  )}
                  borderColor={
                    relic.owner
                      ? getFactionColor(factions[relic.owner])
                      : undefined
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
                />
                <InfoRow infoTitle={relic.name} infoContent={relic.description}>
                  {relic.name}
                </InfoRow>
                {/* {relic.owner ? (
                  <button onClick={() => {}}>
                    {relic.state === "purged" ? "Unpurge" : "Purge"}
                  </button>
                ) : (
                  <div></div>
                )} */}
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function RelicPanel({}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <GenericModal visible={showPanel} closeMenu={() => setShowPanel(false)}>
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
              backgroundColor: "#222",
              padding: "4px 8px",
              borderRadius: "4px",
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
      </GenericModal>
      <button onClick={() => setShowPanel(true)}>Relics</button>
    </>
  );
}
