import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Map from "../../../src/components/Map/Map";
import { Loader } from "../../Loader";
import Image from "next/image";
import {
  FactionContext,
  OptionContext,
  PlanetContext,
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
import RelicPanel from "../RelicPanel/RelicPanel";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import { CustomSizeResources } from "../../Resources";

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
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);
  const options = useContext(OptionContext);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMap, setShowMap] = useState(false);
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
    (a, b) => a.mapPosition - b.mapPosition
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
  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let mallice;
  if (options && (options["expansions"] ?? []).includes("POK")) {
    mallice = "A";
    if (planets && (planets["Mallice"] ?? {}).owner) {
      mallice = "B";
    }
  }

  return (
    <>
      <GenericModal closeMenu={() => setShowMap(false)} visible={showMap}>
        <div className="flexRow" style={{ height: "calc(100dvh - 16px)" }}>
          <div
            style={{
              position: "relative",
              width: "min(100dvh, 100dvw)",
              height: "min(100dvh, 100dvw)",
            }}
          >
            <Map
              factions={mapOrderedFactions}
              mapString={options ? options["map-string"] ?? "" : ""}
              mapStyle={
                options ? options["map-style"] ?? "standard" : "standard"
              }
              mallice={mallice}
            />
          </div>
        </div>
      </GenericModal>
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
      <button
        className={`${styles.MobileMenuButton} ${
          showMobileMenu ? "selected" : ""
        }`}
        style={{
          backgroundColor: showMobileMenu ? "#444" : "#333",
        }}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <div className={styles.MenuBar}></div>
        <div className={styles.MenuBar}></div>
        <div className={styles.MenuBar}></div>
      </button>
      <div
        className={`${styles.MobileMenu} ${showMobileMenu ? styles.shown : ""}`}
      >
        {!shouldBlockSpeakerUpdates() ? (
          <div className="flexRow">
            Speaker:
            <FactionSelectRadialMenu
              borderColor={
                state?.speaker
                  ? getFactionColor((factions ?? {})[state.speaker])
                  : undefined
              }
              selectedFaction={state.speaker}
              factions={orderedFactions.map((faction) => faction.id)}
              invalidFactions={[state.speaker]}
              size={36}
              onSelect={async (factionId, _) => {
                if (!gameid || !factionId) {
                  return;
                }
                setSpeakerAsync(gameid, factionId);
              }}
            />
          </div>
        ) : null}
        {options["map-string"] !== "" ? (
          <div className="flexRow" onClick={() => setShowMap(true)}>
            <button>
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Image
                  src={`/images/map_icon_outline.svg`}
                  alt={`Map Icon`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </button>
            View Map
          </div>
        ) : null}
        <div className="flexRow" onClick={() => setShowTechModal(true)}>
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
              }}
            >
              <TechSkipIcon size={24} outline />
              {/* <div
              className="flexRow"
              style={{
                position: "relative",
                width: "80%",
                height: "80%",
                border: "1px solid #eee",
                borderRadius: "100%",
              }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: "80%",
                  height: "80%",
                }}
              >
                <Image
                  src={`/images/tech_icon.svg`}
                  alt={`Tech Icon`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div> */}
            </div>
          </button>
          Update Techs
        </div>
        <div className="flexRow" onClick={() => setShowObjectiveModal(true)}>
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* <Image
                src={`/images/objectives_icon.svg`}
                alt={`Objectives Icon`}
                fill
                style={{ objectFit: "contain" }}
              /> */}
              <Image
                src={`/images/objectives_icon_two.svg`}
                alt={`Objectives Icon`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </button>
          Update Objectives
        </div>
        <div className="flexRow" onClick={() => setShowPlanetModal(true)}>
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
                paddingTop: responsivePixels(2),
                paddingLeft: responsivePixels(2),
              }}
            >
              <CustomSizeResources resources={2} influence={3} height={24} />
            </div>
          </button>
          Update Planets
        </div>
      </div>
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
                  selectedFaction={state.speaker}
                  factions={orderedFactions.map((faction) => faction.id)}
                  invalidFactions={[state.speaker]}
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
              {/* <RelicPanel /> */}
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
