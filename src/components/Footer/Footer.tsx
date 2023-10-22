import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Loader } from "../../Loader";
import {
  FactionContext,
  OptionContext,
  StateContext,
  StrategyCardContext,
} from "../../context/Context";
import { setSpeakerAsync } from "../../dynamic/api";
import { getFactionColor, getFactionName } from "../../util/factions";
import { responsivePixels } from "../../util/util";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import GenericModal from "../GenericModal/GenericModal";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./Footer.module.scss";
import FactionRow from "../FactionRow/FactionRow";
import { FactionSummary } from "../../FactionSummary";

const ObjectivePanel = dynamic(
  import("../ObjectivePanel").then((mod) => mod.ObjectivePanel),
  {
    loading: () => <Loader />,
  }
);
const PlanetPanel = dynamic(
  import("../PlanetPanel").then((mod) => mod.PlanetPanel),
  {
    loading: () => <Loader />,
  }
);
const TechPanel = dynamic(
  import("../TechPanel").then((mod) => mod.TechPanel),
  {
    loading: () => <Loader />,
  }
);
const FactionPanel = dynamic(
  import("../FactionPanel").then((mod) => mod.FactionPanel),
  {
    loading: () => (
      <div
        className="popupIcon"
        style={{
          fontSize: responsivePixels(16),
        }}
      >
        &#x24D8;
      </div>
    ),
  }
);

export default function Footer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);
  const options = useContext(OptionContext);

  const [showTechModal, setShowTechModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showPlanetModal, setShowPlanetModal] = useState(false);

  const [selectedFaction, setSelectedFaction] = useState<FactionId | undefined>(
    undefined
  );

  useEffect(() => {
    setSelectedFaction((faction) => {
      if (!faction) {
        return Object.values(factions)[0]?.id;
      }
      return faction;
    });
  }, [factions]);

  function shouldBlockSpeakerUpdates() {
    if (state?.phase === "END") {
      return true;
    }
    if (state?.phase !== "STRATEGY") {
      return false;
    }

    const selectedCards = Object.values(strategyCards).filter(
      (card) => !!card.faction
    );

    return selectedCards.length !== 0;
  }

  const orderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.order - b.order
  );

  let orderTitle = "";
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderTitle = "Speaker Order";
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = "Initiative Order";
      break;
    case "AGENDA":
      orderTitle = "Voting Order";
      break;
  }

  return (
    <>
      <GenericModal
        visible={showTechModal}
        closeMenu={() => setShowTechModal(false)}
      >
        <div
          className="flexColumn"
          style={{
            justifyContent: "flex-start",
            maxHeight: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
              width: "min-content",
            }}
          >
            Techs
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 960px, calc(100vw - ${responsivePixels(
                24
              )}))`,
              justifyContent: "flex-start",
              overflow: "auto",
            }}
          >
            <TechPanel />
          </div>
        </div>
      </GenericModal>
      <GenericModal
        visible={showObjectiveModal}
        closeMenu={() => setShowObjectiveModal(false)}
      >
        <div
          className="flexColumn"
          style={{
            justifyContent: "flex-start",
            height: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
              width: "min-content",
            }}
          >
            Objectives
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                24
              )}))`,
              justifyContent: "flex-start",
              overflow: "auto",
              height: "fit-content",
              paddingBottom: responsivePixels(24),
            }}
          >
            <ObjectivePanel />
          </div>
        </div>
      </GenericModal>
      <GenericModal
        visible={showPlanetModal}
        closeMenu={() => setShowPlanetModal(false)}
      >
        <div
          className="flexColumn"
          style={{
            justifyContent: "flex-start",
            maxHeight: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
              width: "min-content",
            }}
          >
            Planets
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                24
              )}))`,
              justifyContent: "flex-start",
              overflow: "auto",
              height: "100%",
            }}
          >
            <PlanetPanel />
          </div>
        </div>
      </GenericModal>
      <div className={styles.UpdateBox}>
        <LabeledDiv label={state.phase === "END" ? "View" : "Update"}>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            {!shouldBlockSpeakerUpdates() ? (
              <div className="flexRow">
                Speaker:
                <FactionSelectRadialMenu
                  borderColor={
                    state?.speaker
                      ? getFactionColor((factions ?? {})[state.speaker])
                      : undefined
                  }
                  selectedFaction={state?.speaker}
                  factions={orderedFactions
                    .filter((faction) => faction.id !== state?.speaker)
                    .map((faction) => faction.id)}
                  onSelect={async (factionId, _) => {
                    if (!gameid || !factionId) {
                      return;
                    }
                    setSpeakerAsync(gameid, factionId);
                  }}
                />
              </div>
            ) : null}
            <div
              className="flexRow"
              style={{ width: "100%", alignItems: "center" }}
            >
              <button onClick={() => setShowTechModal(true)}>Techs</button>

              <button onClick={() => setShowObjectiveModal(true)}>
                Objectives
              </button>
              <button onClick={() => setShowPlanetModal(true)}>Planets</button>
            </div>
          </div>
        </LabeledDiv>
      </div>
      <div className={styles.FactionBox}>
        <LabeledDiv
          label={orderTitle}
          style={{ alignItems: "center", paddingTop: responsivePixels(12) }}
        >
          <FactionRow onClick={(factionId) => setSelectedFaction(factionId)} />
          <LabeledDiv
            noBlur
            label={
              selectedFaction ? (
                <div className="flexRow" style={{ gap: 0 }}>
                  {getFactionName(factions[selectedFaction])}
                  <FactionPanel
                    faction={factions[selectedFaction] as Faction}
                    options={options}
                  />
                </div>
              ) : (
                "Loading..."
              )
            }
            color={
              selectedFaction
                ? getFactionColor(factions[selectedFaction])
                : undefined
            }
            style={{ width: "fit-content" }}
          >
            <FactionSummary
              factionId={selectedFaction}
              options={{ showIcon: true }}
            />
          </LabeledDiv>
        </LabeledDiv>
      </div>
    </>
  );
}
