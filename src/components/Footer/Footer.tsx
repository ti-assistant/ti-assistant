import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Loader } from "../../Loader";
import {
  FactionContext,
  StateContext,
  StrategyCardContext,
} from "../../context/Context";
import { setSpeakerAsync } from "../../dynamic/api";
import { getFactionColor } from "../../util/factions";
import { responsivePixels } from "../../util/util";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import GenericModal from "../GenericModal/GenericModal";
import LabeledDiv from "../LabeledDiv/LabeledDiv";

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

export default function Footer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  const [showTechModal, setShowTechModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showPlanetModal, setShowPlanetModal] = useState(false);

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

  const speakerButtonPosition =
    state?.phase === "STRATEGY" ||
    state?.phase === "STATUS" ||
    state?.phase === "SETUP"
      ? "top"
      : orderedFactions.length > 7
      ? "bottom"
      : "top";

  return (
    <div
      className="flex"
      style={{
        bottom: 0,
        width: "100vw",
        position: "fixed",
        justifyContent: "space-between",
      }}
    >
      {state ? (
        <div
          style={{
            position: "fixed",
            bottom: responsivePixels(16),
            left: responsivePixels(96),
          }}
        >
          <LabeledDiv label={state.phase === "END" ? "View" : "Update"}>
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              {speakerButtonPosition === "top" &&
              !shouldBlockSpeakerUpdates() ? (
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
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
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
                <button onClick={() => setShowTechModal(true)}>Techs</button>
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
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
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
                <button onClick={() => setShowObjectiveModal(true)}>
                  Objectives
                </button>
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
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
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
                <button onClick={() => setShowPlanetModal(true)}>
                  Planets
                </button>
                {speakerButtonPosition === "bottom" &&
                !shouldBlockSpeakerUpdates() ? (
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
              </div>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
    </div>
  );
}
