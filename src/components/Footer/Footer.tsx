"use client";

import dynamic from "next/dynamic";
import { CSSProperties, use, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { FactionSummary } from "../../FactionSummary";
import { Loader } from "../../Loader";
import { ModalContext, SettingsContext } from "../../context/contexts";
import {
  useAllPlanets,
  useGameId,
  useOptions,
  usePlanets,
  useStrategyCards,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { usePhase, useSpeaker } from "../../context/stateDataHooks";
import { setSpeakerAsync } from "../../dynamic/api";
import MapMenuSVG from "../../icons/ui/MapMenu";
import ObjectivesMenuSVG from "../../icons/ui/ObjectivesMenu";
import PlanetMenuSVG from "../../icons/ui/PlanetMenu";
import PromissoryMenuSVG from "../../icons/ui/PromissoryMenu";
import RelicMenuSVG from "../../icons/ui/RelicMenu";
import ThundersEdgeMenuSVG from "../../icons/ui/ThundersEdgeMenu";
import { getColorForFaction } from "../../util/factions";
import { getWormholeNexusSystemNumber } from "../../util/map";
import { getMapString } from "../../util/options";
import { fracturePlanetsOwned } from "../../util/planets";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import FactionName from "../FactionComponents/FactionName";
import FactionRow from "../FactionRow/FactionRow";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import GameMap from "../Map/GameMap";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import ThundersEdgePanel from "../ThundersEdgePanel";
import { Strings } from "../strings";
import styles from "./Footer.module.scss";

const ObjectivePanel = dynamic(
  () => import("../ObjectivePanel/ObjectivePanel"),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);
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
        fontSize: rem(16),
      }}
    >
      &#x24D8;
    </div>
  ),
  ssr: false,
});

function shouldBlockSpeakerUpdates(
  phase: Phase,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>
) {
  if (phase === "END") {
    return true;
  }
  if (phase !== "STRATEGY") {
    return false;
  }

  const selectedCards = Object.values(strategyCards).filter(
    (card) => !!card.faction
  );

  return selectedCards.length !== 0;
}

function getNumButtons(
  phase: Phase,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  options: Options
) {
  let buttons = 3;
  if (!shouldBlockSpeakerUpdates(phase, strategyCards)) {
    buttons++;
  }
  if (
    options.expansions.includes("POK") ||
    options.expansions.includes("THUNDERS EDGE")
  ) {
    buttons++;
  }
  return buttons;
}

export default function Footer() {
  const gameId = useGameId();
  const options = useOptions();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const phase = usePhase();
  const speaker = useSpeaker();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { openModal } = use(ModalContext);

  const [selectedFaction, setSelectedFaction] =
    useState<Optional<FactionId>>(undefined);

  useEffect(() => {
    setSelectedFaction((faction) => {
      if (!faction) {
        return speaker;
      }
      return faction;
    });
  }, [speaker]);

  function shouldBlockSpeakerUpdates() {
    if (phase === "END") {
      return true;
    }
    if (phase !== "STRATEGY") {
      return false;
    }

    const selectedCards = Object.values(strategyCards).filter(
      (card) => !!card.faction
    );

    return selectedCards.length !== 0;
  }

  let orderTitle = <></>;
  switch (phase) {
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

  const numButtons = getNumButtons(phase, strategyCards, options);
  return (
    <>
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
              borderColor={getColorForFaction(speaker)}
              selectedFaction={speaker}
              factions={orderedFactionIds}
              invalidFactions={[speaker]}
              size={30}
              onSelect={async (factionId, _) => {
                if (!factionId) {
                  return;
                }
                setSpeakerAsync(gameId, factionId);
              }}
              viewOnly={viewOnly}
            />
          </div>
        ) : null}
        <MapWrapper />
        <div
          className="flexRow"
          onClick={() => openModal(<TechModalContent viewOnly={viewOnly} />)}
        >
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
              }}
            >
              <TechSkipIcon size={24} outline />
            </div>
          </button>
          <FormattedMessage
            id="USnh0f"
            description="Text shown on a button that opens the update techs panel."
            defaultMessage="Update Techs"
          />
        </div>
        <div
          className="flexRow"
          onClick={() =>
            openModal(<ObjectiveModalContent viewOnly={viewOnly} />)
          }
        >
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <ObjectivesMenuSVG />
            </div>
          </button>
          <FormattedMessage
            id="Lrn2Da"
            description="Text shown on a button that opens the update objectives panel."
            defaultMessage="Update Objectives"
          />
        </div>
        <div
          className="flexRow"
          onClick={() => openModal(<PlanetModalContent />)}
        >
          <button>
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <PlanetMenuSVG />
            </div>
          </button>
          <FormattedMessage
            id="Dw1fzR"
            description="Text shown on a button that opens the update planets panel."
            defaultMessage="Update Planets"
          />
        </div>
        {options.expansions.includes("THUNDERS EDGE") ||
        options.expansions.includes("POK") ? (
          <div
            className="flexRow"
            onClick={() => openModal(<ThundersEdgeModalContent />)}
          >
            <button>
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: "60%",
                  height: "60%",
                }}
              >
                <ThundersEdgeMenuSVG />
              </div>
            </button>
            <span style={{ whiteSpace: "nowrap" }}>
              <FormattedMessage
                id="sgqLYB"
                defaultMessage="Other"
                description="Text on a button used to select a non-listed value"
              />
            </span>
          </div>
        ) : null}
      </div>
      <LabeledDiv
        className={styles.UpdateBox}
        innerClass={styles.UpdateBoxContent}
        label={
          <FormattedMessage
            id="VjlCY0"
            description="Text specifying a section that includes update operations."
            defaultMessage="Update"
          />
        }
        style={{ "--num-buttons": numButtons } as CSSProperties}
      >
        {!shouldBlockSpeakerUpdates() ? (
          <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
            <FactionSelectRadialMenu
              borderColor={getColorForFaction(speaker)}
              selectedFaction={speaker}
              factions={orderedFactionIds}
              invalidFactions={[speaker]}
              size={40}
              onSelect={async (factionId, _) => {
                if (!factionId) {
                  return;
                }
                setSpeakerAsync(gameId, factionId);
              }}
              viewOnly={viewOnly}
            />
            <span className={styles.ButtonLabel}>
              <Strings.Speaker />
            </span>
          </div>
        ) : null}
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            className="flexRow"
            onClick={() => openModal(<TechModalContent viewOnly={viewOnly} />)}
            style={{
              width: rem(34),
              padding: rem(2),
              aspectRatio: 1,
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <TechSkipIcon size={28} outline />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Techs</span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            onClick={() =>
              openModal(<ObjectiveModalContent viewOnly={viewOnly} />)
            }
            style={{
              position: "relative",
              width: rem(34),
              height: rem(34),
              padding: rem(2),
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <ObjectivesMenuSVG />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Objectives</span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            onClick={() => openModal(<PlanetModalContent />)}
            style={{
              position: "relative",
              width: rem(34),
              height: rem(34),
              padding: rem(2),
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <PlanetMenuSVG />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Planets</span>
        </div>
        {options.expansions.includes("THUNDERS EDGE") ||
        options.expansions.includes("POK") ? (
          <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
            <button
              onClick={() => openModal(<ThundersEdgeModalContent />)}
              style={{
                display: "flex",
                position: "relative",
                width: rem(34),
                height: rem(34),
                padding: rem(2),
                borderRadius: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="flexRow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gridAutoFlow: "row",
                  position: "relative",
                  width: rem(30),
                  height: rem(30),
                  gap: rem(1),
                }}
              >
                <div
                  style={{
                    width: "calc(1.875rem / 2)",
                    height: "100%",
                    gridColumn: "2 / 4",
                  }}
                >
                  <RelicMenuSVG />
                </div>
                <div
                  style={{
                    width: "calc(1.875rem / 2)",
                    height: "100%",
                    gridColumn: "3 / 4",
                  }}
                >
                  {options.expansions.includes("THUNDERS EDGE") ? (
                    <ThundersEdgeMenuSVG />
                  ) : (
                    <PromissoryMenuSVG />
                  )}
                </div>
              </div>
            </button>
            <span className={styles.ButtonLabel} style={{ whiteSpace: "wrap" }}>
              <FormattedMessage
                id="sgqLYB"
                defaultMessage="Other"
                description="Text on a button used to select a non-listed value"
              />
            </span>
          </div>
        ) : null}
      </LabeledDiv>
      <div className={styles.FactionBox}>
        <LabeledDiv
          label={orderTitle}
          innerStyle={{ alignItems: "center", paddingTop: rem(12) }}
        >
          <FactionRow onClick={(factionId) => setSelectedFaction(factionId)} />
          <LabeledDiv
            label={
              selectedFaction ? (
                <div className="flexRow" style={{ gap: 0 }}>
                  <FactionName factionId={selectedFaction} />
                  <FactionPanel factionId={selectedFaction} options={options} />
                </div>
              ) : (
                "Loading..."
              )
            }
            color={
              selectedFaction ? getColorForFaction(selectedFaction) : undefined
            }
            style={{ width: "fit-content" }}
          >
            {selectedFaction ? (
              <FactionSummary factionId={selectedFaction} />
            ) : null}
          </LabeledDiv>
        </LabeledDiv>
      </div>
    </>
  );
}

function ObjectiveModalContent({ viewOnly }: { viewOnly?: boolean }) {
  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "flex-start",
        height: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div
        className="centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          border: "1px solid var(--neutral-border)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
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
          width: `clamp(80vw, 75rem, calc(100vw - ${rem(24)}))`,
          justifyContent: "flex-start",
          overflow: "auto",
          height: "fit-content",
          paddingBottom: rem(28),
        }}
      >
        <ObjectivePanel asModal />
      </div>
    </div>
  );
}

function TechModalContent({ viewOnly }: { viewOnly?: boolean }) {
  const { settings, updateSetting } = useContext(SettingsContext);

  const groupTechsByFaction = settings["group-techs-by-faction"];

  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "flex-start",
        maxHeight: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div className="flexRow centered extraLargeFont">
        <div
          style={{
            backgroundColor: "var(--background-color)",
            border: "1px solid var(--neutral-border)",
            padding: `${rem(4)} ${rem(8)}`,
            borderRadius: rem(4),
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
          className="flexRow"
          style={{
            backgroundColor: "var(--background-color)",
            border: "1px solid var(--neutral-border)",
            padding: `${rem(4)} ${rem(8)}`,
            borderRadius: rem(4),
            width: "min-content",
            whiteSpace: "nowrap",
            fontSize: rem(12),
            gap: rem(4),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <FormattedMessage
            id="WvbM4Q"
            description="Label for a group of buttons for selecting which option to group by."
            defaultMessage="Group by"
          />
          :
          <Chip
            selected={!groupTechsByFaction}
            toggleFn={() => updateSetting("group-techs-by-faction", false)}
            fontSize={12}
          >
            <FormattedMessage
              id="ys7uwX"
              description="Shortened version of technologies."
              defaultMessage="Techs"
            />
          </Chip>
          <Chip
            selected={groupTechsByFaction}
            toggleFn={() => updateSetting("group-techs-by-faction", true)}
            fontSize={12}
          >
            <FormattedMessage
              id="r2htpd"
              description="Text on a button that will randomize factions."
              defaultMessage="Factions"
            />
          </Chip>
        </div>
      </div>
      <div
        className="flexColumn largeFont"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `clamp(80vw, 70rem, calc(100vw - 1.5rem))`,
          justifyContent: "flex-start",
        }}
      >
        <TechPanel byFaction={groupTechsByFaction} />
      </div>
    </div>
  );
}

function PlanetModalContent() {
  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "flex-start",
        maxHeight: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div
        className="centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          border: "1px solid var(--neutral-border)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
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
          width: `clamp(80vw, 75rem, calc(100vw - ${rem(24)}))`,
          justifyContent: "flex-start",
          overflow: "auto",
          height: "100%",
        }}
      >
        <PlanetPanel />
      </div>
    </div>
  );
}

function ThundersEdgeModalContent() {
  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "flex-start",
        maxHeight: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div
        className="centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          border: "1px solid var(--neutral-border)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
          width: "min-content",
        }}
      >
        <FormattedMessage
          id="sgqLYB"
          defaultMessage="Other"
          description="Text on a button used to select a non-listed value"
        />
      </div>
      <div
        className="flexColumn largeFont"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `clamp(80vw, 75rem, calc(100vw - ${rem(24)}))`,
          justifyContent: "flex-start",
          overflow: "auto",
          height: "100%",
        }}
      >
        <ThundersEdgePanel />
      </div>
    </div>
  );
}

function MapWrapper() {
  const allPlanets = useAllPlanets();
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();

  const { openModal } = use(ModalContext);

  const orderedFactions = Object.values(factions).sort((a, b) =>
    a.mapPosition > b.mapPosition ? 1 : -1
  );

  const mapString = getMapString(options, orderedFactions.length);

  if (!mapString) {
    return null;
  }

  return (
    <div
      className="flexRow"
      onClick={() =>
        openModal(
          <div
            className="flexRow"
            style={{ height: `calc(100dvh - ${rem(16)})` }}
          >
            <div
              style={{
                position: "relative",
                width: "min(100dvh, 100dvw)",
                height: "min(100dvh, 100dvw)",
              }}
            >
              <GameMap
                factions={orderedFactions}
                wormholeNexus={getWormholeNexusSystemNumber(
                  options,
                  planets,
                  factions
                )}
                mapString={mapString ?? ""}
                mapStyle={options["map-style"] ?? "standard"}
                planets={allPlanets}
                expansions={options.expansions}
                hideFracture={!fracturePlanetsOwned(allPlanets)}
              />
            </div>
          </div>
        )
      }
    >
      <button>
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <MapMenuSVG />
        </div>
      </button>
      <FormattedMessage
        id="xDzJ9/"
        description="Text shown on a button that opens the map."
        defaultMessage="View Map"
      />
    </div>
  );
}
