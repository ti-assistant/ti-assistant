"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Chip from "../../../src/components/Chip/Chip";
import FactionRow from "../../../src/components/FactionRow/FactionRow";
import styles from "../../../src/components/Footer/Footer.module.scss";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import Map from "../../../src/components/Map/Map";
import ResourcesIcon from "../../../src/components/ResourcesIcon/ResourcesIcon";
import TechSkipIcon from "../../../src/components/TechSkipIcon/TechSkipIcon";
import {
  useFactions,
  useGameState,
  useOptions,
  usePlanets,
} from "../../../src/context/dataHooks";
import { FactionSummary } from "../../../src/FactionSummary";
import { Loader } from "../../../src/Loader";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { getMalliceSystemNumber } from "../../../src/util/map";
import { getMapString } from "../../../src/util/options";
import { Optional } from "../../../src/util/types/types";
import { rem } from "../../../src/util/util";

const ObjectivePanel = dynamic(
  () => import("../../../src/components/ObjectivePanel"),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);
const TechPanel = dynamic(() => import("../../../src/components/TechPanel"), {
  loading: () => <Loader />,
  ssr: false,
});
const PlanetPanel = dynamic(
  () => import("../../../src/components/PlanetPanel"),
  {
    loading: () => <Loader />,
    ssr: false,
  }
);
const FactionPanel = dynamic(
  () => import("../../../src/components/FactionPanel"),
  {
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
  }
);

export default function ArchiveFooter({}) {
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();
  const state = useGameState();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [groupTechsByFaction, setGroupTechsByFaction] = useState(false);
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

  let orderTitle = "Final Score";
  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const mapString = getMapString(options, mapOrderedFactions.length);

  return (
    <>
      <GenericModal closeMenu={() => setShowMap(false)} visible={showMap}>
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
            <Map
              factions={mapOrderedFactions}
              mapString={mapString ?? ""}
              mapStyle={options["map-style"] ?? "standard"}
              mallice={getMalliceSystemNumber(options, planets, factions)}
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
            maxHeight: `calc(100dvh - ${rem(24)})`,
          }}
        >
          <div className="flexRow centered extraLargeFont">
            <div
              style={{
                backgroundColor: "#222",
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
                backgroundColor: "#222",
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
                toggleFn={() => setGroupTechsByFaction(false)}
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
                toggleFn={() => setGroupTechsByFaction(true)}
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
              width: `clamp(80vw, 60rem, calc(100vw - 1.5rem))`,
              justifyContent: "flex-start",
            }}
          >
            <TechPanel byFaction={groupTechsByFaction} />
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
            height: `calc(100dvh - ${rem(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
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
              paddingBottom: rem(24),
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
            maxHeight: `calc(100dvh - ${rem(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
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
        {mapString ? (
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
                paddingTop: rem(2),
                paddingLeft: rem(2),
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
        <LabeledDiv noBlur label="View">
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
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
          style={{ alignItems: "center", paddingTop: rem(12) }}
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
