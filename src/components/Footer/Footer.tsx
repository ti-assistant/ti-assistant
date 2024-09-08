"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Map from "../../../src/components/Map/Map";
import { FactionSummary } from "../../FactionSummary";
import { Loader } from "../../Loader";
import { GameIdContext } from "../../context/Context";
import { setSpeakerAsync } from "../../dynamic/api";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionRow from "../FactionRow/FactionRow";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import GenericModal from "../GenericModal/GenericModal";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import { Strings } from "../strings";
import styles from "./Footer.module.scss";
import {
  useFactions,
  useGameState,
  useOptions,
  usePlanet,
  usePlanets,
  useStrategyCards,
} from "../../context/dataHooks";
import { Optional } from "../../util/types/types";

const ObjectivePanel = dynamic(() => import("../ObjectivePanel"), {
  loading: () => <Loader />,
  ssr: false,
});
const TechPanel = dynamic(() => import("../TechPanel"), {
  loading: () => <Loader />,
  ssr: false,
});
const PlanetPanel = dynamic(() => import("../PlanetPanel"), {
  loading: () => <Loader />,
  ssr: false,
});
const FactionPanel = dynamic(() => import("../FactionPanel"), {
  loading: () => (
    <div
      className="popupIcon"
      style={{
        fontSize: "16px",
      }}
    >
      &#x24D8;
    </div>
  ),
  ssr: false,
});

export default function Footer({}) {
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const options = useOptions();
  const mallice = usePlanet("Mallice");
  const state = useGameState();
  const strategyCards = useStrategyCards();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showPlanetModal, setShowPlanetModal] = useState(false);

  const [selectedFaction, setSelectedFaction] =
    useState<Optional<FactionId>>(undefined);

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

  let orderTitle = <></>;
  switch (state?.phase) {
    case "SETUP":
    case "STRATEGY":
      orderTitle = (
        <FormattedMessage
          id="L4UH+0"
          description="An ordering of factions based on the speaker."
          defaultMessage="Speaker Order"
        />
      );
      break;
    case "ACTION":
    case "STATUS":
      orderTitle = (
        <FormattedMessage
          id="09baik"
          description="An ordering of factions based on initiative."
          defaultMessage="Initiative Order"
        />
      );
      break;
    case "AGENDA":
      orderTitle = (
        <FormattedMessage
          id="rbtRWF"
          description="An ordering of factions based on voting."
          defaultMessage="Voting Order"
        />
      );
      break;
  }
  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let malliceSide;
  if (options && (options["expansions"] ?? []).includes("POK")) {
    malliceSide = "A";
    if (mallice?.owner) {
      malliceSide = "B";
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
              mallice={malliceSide}
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
            maxHeight: `calc(100dvh - 24px)`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `4px 8px`,
              borderRadius: "4px",
              width: "min-content",
            }}
          >
            <FormattedMessage
              id="ys7uwX"
              description="Shortened version of technologies."
              defaultMessage="Techs"
            />
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 960px, calc(100vw - 24px))`,
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
            height: `calc(100dvh - 24px)`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `4px 8px`,
              borderRadius: "4px",
              width: "min-content",
            }}
          >
            <FormattedMessage
              id="5Bl4Ek"
              description="Cards that define how to score victory points."
              defaultMessage="Objectives"
            />
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
              justifyContent: "flex-start",
              overflow: "auto",
              height: "fit-content",
              paddingBottom: "24px",
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
            maxHeight: `calc(100dvh - 24px)`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `4px 8px`,
              borderRadius: "4px",
              width: "min-content",
            }}
          >
            <FormattedMessage
              id="1fNqTf"
              description="Planets."
              defaultMessage="Planets"
            />
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
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
            <Strings.Speaker />:
            <FactionSelectRadialMenu
              borderColor={
                state?.speaker
                  ? getFactionColor((factions ?? {})[state.speaker])
                  : undefined
              }
              selectedFaction={state.speaker}
              factions={orderedFactions.map((faction) => faction.id)}
              invalidFactions={[state.speaker]}
              size={30}
              onSelect={async (factionId, _) => {
                if (!gameId || !factionId) {
                  return;
                }
                setSpeakerAsync(gameId, factionId);
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
            <FormattedMessage
              id="xDzJ9/"
              description="Text shown on a button that opens the map."
              defaultMessage="View Map"
            />
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
          <FormattedMessage
            id="USnh0f"
            description="Text shown on a button that opens the update techs panel."
            defaultMessage="Update Techs"
          />
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
          <FormattedMessage
            id="Lrn2Da"
            description="Text shown on a button that opens the update objectives panel."
            defaultMessage="Update Objectives"
          />
        </div>
        <div className="flexRow" onClick={() => setShowPlanetModal(true)}>
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
                paddingTop: "2px",
                paddingLeft: "2px",
              }}
            >
              <ResourcesIcon resources={2} influence={3} height={24} />
            </div>
          </button>
          <FormattedMessage
            id="Dw1fzR"
            description="Text shown on a button that opens the update planets panel."
            defaultMessage="Update Planets"
          />
        </div>
      </div>
      <div className={styles.UpdateBox}>
        <LabeledDiv
          noBlur
          label={
            <FormattedMessage
              id="VjlCY0"
              description="Text specifying a section that includes update operations."
              defaultMessage="Update"
            />
          }
        >
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            {!shouldBlockSpeakerUpdates() ? (
              <div className="flexRow">
                <Strings.Speaker />:
                <FactionSelectRadialMenu
                  borderColor={
                    state?.speaker
                      ? getFactionColor((factions ?? {})[state.speaker])
                      : undefined
                  }
                  selectedFaction={state.speaker}
                  factions={orderedFactions.map((faction) => faction.id)}
                  invalidFactions={[state.speaker]}
                  size={40}
                  onSelect={async (factionId, _) => {
                    if (!gameId || !factionId) {
                      return;
                    }
                    setSpeakerAsync(gameId, factionId);
                  }}
                />
              </div>
            ) : null}
            <div
              className="flexRow"
              style={{ width: "100%", alignItems: "center" }}
            >
              <button onClick={() => setShowTechModal(true)}>
                <FormattedMessage
                  id="ys7uwX"
                  description="Shortened version of technologies."
                  defaultMessage="Techs"
                />
              </button>

              <button onClick={() => setShowObjectiveModal(true)}>
                <FormattedMessage
                  id="5Bl4Ek"
                  description="Cards that define how to score victory points."
                  defaultMessage="Objectives"
                />
              </button>
              <button onClick={() => setShowPlanetModal(true)}>
                <FormattedMessage
                  id="1fNqTf"
                  description="Planets."
                  defaultMessage="Planets"
                />
              </button>
              {/* <RelicPanel /> */}
            </div>
          </div>
        </LabeledDiv>
      </div>
      <div className={styles.FactionBox}>
        <LabeledDiv
          label={orderTitle}
          style={{ alignItems: "center", paddingTop: "12px" }}
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
            {selectedFaction ? (
              <FactionSummary
                factionId={selectedFaction}
                options={{ showIcon: true }}
              />
            ) : null}
          </LabeledDiv>
        </LabeledDiv>
      </div>
    </>
  );
}
