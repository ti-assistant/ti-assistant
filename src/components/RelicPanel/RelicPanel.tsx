import { useContext, useState } from "react";
import styles from "./RelicPanel.module.scss";
import GenericModal from "../GenericModal/GenericModal";
import { FactionContext, RelicContext } from "../../context/Context";
import { CollapsibleSection } from "../CollapsibleSection";
import { responsivePixels } from "../../util/util";
import { InfoRow } from "../../InfoRow";
import { FactionSelectHoverMenu } from "../FactionSelect";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import { gainRelicAsync, loseRelicAsync } from "../../dynamic/api";
import { useRouter } from "next/router";
import { getFactionColor } from "../../util/factions";

function RelicPanelContent({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
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
            gap: responsivePixels(4),
            padding: `0 ${responsivePixels(4)} ${responsivePixels(4)}`,
            fontSize: responsivePixels(14),
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
                    if (!gameid) {
                      return;
                    }
                    if (prevFaction) {
                      loseRelicAsync(gameid, prevFaction, relic.id);
                    }
                    if (factionId) {
                      gainRelicAsync(gameid, factionId, relic.id);
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
            width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(24)}))`,
            justifyContent: "flex-start",
            height: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="flexRow centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
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
