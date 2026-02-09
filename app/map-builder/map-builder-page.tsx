"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import Chip from "../../src/components/Chip/Chip";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import MapBuilder, {
  SystemImage,
} from "../../src/components/MapBuilder/MapBuilder";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import Toggle from "../../src/components/Toggle/Toggle";
import { buildBaseSystems } from "../../src/data/GameData";
import { getDefaultMapString, processMapString } from "../../src/util/map";
import { mapStyleString } from "../../src/util/strings";
import { rem } from "../../src/util/util";
import ThundersEdgeMenuSVG from "../../src/icons/ui/ThundersEdgeMenu";
import ProphecyofKingsSVG from "../../src/icons/ui/ProphecyOfKings";

type Filter =
  | "BASE_GAME"
  | "PROPHECY_OF_KINGS"
  | "HYPERSPACE_TILES"
  | "DISCORDANT_STARS"
  | "THUNDERS_EDGE"
  | "NO_PLANETS"
  | "ONE_PLANET"
  | "TWO_PLANETS"
  | "THREE_PLANETS"
  | "HOME_SYSTEMS";

function getFilterButtonText(filter: Filter, intl: IntlShape) {
  switch (filter) {
    case "BASE_GAME":
      return intl.formatMessage({
        id: "2fB0Ox",
        description:
          "Text on a button that will show/hide features related to the base game.",
        defaultMessage: "Base Game",
      });
    case "PROPHECY_OF_KINGS":
      return (
        <div className="flexRow" style={{ gap: 0 }}>
          {intl.formatMessage({
            id: "p9XVGB",
            description:
              "Text on a button that will enable/disable the Prophecy of Kings expansion.",
            defaultMessage: "Prophecy of Kings",
          })}
          <span style={{ width: rem(12), marginLeft: rem(4) }}>
            <ProphecyofKingsSVG />
          </span>
        </div>
      );
    case "HYPERSPACE_TILES":
      return intl.formatMessage({
        id: "i4Uu4m",
        description: "Text on a button that will show/hide hyperspace tiles.",
        defaultMessage: "Hyperspace",
      });
    case "DISCORDANT_STARS":
      return intl.formatMessage({
        id: "ZlvDZB",
        description:
          "Text on a button that will enable/disable the Discordant Stars expansion.",
        defaultMessage: "Discordant Stars",
      });
    case "THUNDERS_EDGE":
      return (
        <div className="flexRow" style={{ gap: 0 }}>
          {intl.formatMessage({
            id: "SpNTY7",
            defaultMessage: "Thunder's Edge",
            description:
              "Text on a button that will enable/disable the Thunder's Edge expansion.",
          })}
          <span style={{ width: rem(14), marginLeft: rem(4) }}>
            <ThundersEdgeMenuSVG />
          </span>
        </div>
      );
    case "HOME_SYSTEMS":
      return intl.formatMessage({
        id: "22b12K",
        description: "Home system planets.",
        defaultMessage: "Home",
      });
    case "NO_PLANETS":
      return 0;
    case "ONE_PLANET":
      return 1;
    case "TWO_PLANETS":
      return 2;
    case "THREE_PLANETS":
      return 3;
  }
}

function FilterButton({
  filter,
  filters,
  setFilters,
}: {
  filter: Filter;
  filters: Set<Filter>;
  setFilters: Dispatch<SetStateAction<Set<Filter>>>;
}) {
  const intl = useIntl();
  return (
    <Toggle
      selected={filters.has(filter)}
      toggleFn={(prevValue) => {
        setFilters((filters) => {
          const newSet = new Set(filters);
          if (prevValue) {
            newSet.delete(filter);
          } else {
            newSet.add(filter);
          }
          return newSet;
        });
      }}
    >
      {getFilterButtonText(filter, intl)}
    </Toggle>
  );
}

export default function MapBuilderPage() {
  const intl = useIntl();
  const [mapString, setMapString] = useState(
    getDefaultMapString(6, "standard", true),
  );
  const [rawMapInput, setRawMapInput] = useState(mapString);
  useEffect(() => setRawMapInput(mapString), [mapString]);

  const [mapStyle, setMapStyle] = useState<MapStyle>("standard");
  const [numFactions, setNumFactions] = useState(6);
  const [filters, setFilters] = useState<Set<Filter>>(
    new Set([
      "BASE_GAME",
      "PROPHECY_OF_KINGS",
      "HYPERSPACE_TILES",
      "NO_PLANETS",
      "ONE_PLANET",
      "TWO_PLANETS",
      "THREE_PLANETS",
    ]),
  );
  const [rotation, setRotation] = useState(0);

  const systems = buildBaseSystems();

  let tileNumbers: string[] = [];
  const factions = [];
  for (let i = 0; i < numFactions; i++) {
    factions.push({});
    tileNumbers.push(`P${i + 1}`);
  }
  if (filters.has("BASE_GAME")) {
    for (let i = 18; i < 51; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (filters.has("PROPHECY_OF_KINGS")) {
    for (let i = 59; i < 81; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (filters.has("THUNDERS_EDGE")) {
    for (let i = 97; i < 118; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (filters.has("HYPERSPACE_TILES")) {
    for (let i = 83; i < 92; i++) {
      const inMapString = mapString.split(" ").reduce((found, systemNumber) => {
        return found || systemNumber.startsWith(i.toString());
      }, false);
      if (inMapString) {
        continue;
      }
      tileNumbers.push(`${i}A${rotation !== 0 ? rotation : ""}`);
      tileNumbers.push(`${i}B${rotation !== 0 ? rotation : ""}`);
    }

    for (let i = 119; i < 125; i++) {
      const inMapString = mapString.split(" ").reduce((found, systemNumber) => {
        return found || systemNumber.startsWith(i.toString());
      }, false);
      if (inMapString) {
        continue;
      }
      tileNumbers.push(`${i}A${rotation !== 0 ? rotation : ""}`);
      tileNumbers.push(`${i}B${rotation !== 0 ? rotation : ""}`);
    }
  }
  if (filters.has("HOME_SYSTEMS")) {
    if (filters.has("BASE_GAME")) {
      for (let i = 1; i < 18; i++) {
        tileNumbers.push(i.toString());
      }
    }
    if (filters.has("PROPHECY_OF_KINGS")) {
      for (let i = 52; i < 59; i++) {
        tileNumbers.push(i.toString());
      }
    }
    if (filters.has("THUNDERS_EDGE")) {
      for (let i = 92; i < 96; i++) {
        tileNumbers.push(i.toString());
      }
      tileNumbers.push("96A");
    }
    if (filters.has("DISCORDANT_STARS")) {
      for (let i = 1001; i < 1035; i++) {
        tileNumbers.push(i.toString());
      }
    }
  }
  if (filters.has("DISCORDANT_STARS")) {
    for (let i = 4253; i < 4277; i++) {
      tileNumbers.push(i.toString());
    }
  }

  tileNumbers = tileNumbers.filter((number) => {
    const system = systems[number as SystemId];
    if (!system) {
      return true;
    }
    const numPlanets = system.planets.length;
    switch (numPlanets) {
      case 0:
        return filters.has("NO_PLANETS");
      case 1:
        return filters.has("ONE_PLANET");
      case 2:
        return filters.has("TWO_PLANETS");
      case 3:
        return filters.has("THREE_PLANETS");
    }
  });

  let mapStyles: MapStyle[] = [];
  switch (numFactions) {
    case 3:
      mapStyles = ["standard"];
      break;
    case 4:
      mapStyles = ["standard", "warp", "skinny"];
      break;
    case 5:
      mapStyles = ["standard", "warp", "skinny"];
      break;
    case 6:
      mapStyles = ["standard", "large"];
      break;
    case 7:
      mapStyles = ["standard", "warp"];
      break;
    case 8:
      mapStyles = ["standard", "warp"];
      break;
  }

  return (
    <>
      <NonGameHeader
        leftSidebar="TI ASSISTANT"
        rightSidebar={intl
          .formatMessage({
            id: "OAXWRP",
            defaultMessage: "Map Builder",
            description: "A button that will open the map builder.",
          })
          .toUpperCase()}
      />

      <div
        className="flexRow"
        style={{
          width: "100%",
          height: `calc(100dvh - 6.5rem)`,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <LabeledDiv
            label="Tile Pool"
            style={{
              marginTop: "0.5rem",
            }}
            innerStyle={{
              height: `calc(100dvh - 7.5rem)`,
              justifyContent: "flex-start",
            }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                fontSize: rem(12),
              }}
            >
              <div
                className="flexRow"
                style={{ justifyContent: "flex-start", flexWrap: "wrap" }}
              >
                <FilterButton
                  filter="BASE_GAME"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="PROPHECY_OF_KINGS"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="THUNDERS_EDGE"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="HYPERSPACE_TILES"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="DISCORDANT_STARS"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="HOME_SYSTEMS"
                  filters={filters}
                  setFilters={setFilters}
                />
                <div className="flexRow" style={{ gap: rem(4) }}>
                  <FormattedMessage
                    id="1fNqTf"
                    defaultMessage="Planets"
                    description="Planets."
                  />
                  :
                  <FilterButton
                    filter="NO_PLANETS"
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <FilterButton
                    filter="ONE_PLANET"
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <FilterButton
                    filter="TWO_PLANETS"
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <FilterButton
                    filter="THREE_PLANETS"
                    filters={filters}
                    setFilters={setFilters}
                  />
                </div>
              </div>
              <div className="flexRow">
                <button
                  className="flexRow"
                  onClick={() =>
                    setRotation((rotation) => {
                      if (rotation - 1 < 0) {
                        return 5;
                      }
                      return rotation - 1;
                    })
                  }
                >
                  <Image
                    src={`/images/rotate-clockwise.png`}
                    alt="Rotate clockwise"
                    width={18}
                    height={18}
                  />
                </button>
                <button
                  className="flexRow"
                  onClick={() =>
                    setRotation((rotation) => {
                      if (rotation + 1 > 5) {
                        return 0;
                      }
                      return rotation + 1;
                    })
                  }
                >
                  <Image
                    src={`/images/rotate-counter-clockwise.png`}
                    alt="Rotate counter-clockwise"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                columnGap: rem(8),
                width: "100%",
                justifyContent: "flex-start",
                overflowY: "auto",
                overflowX: "hidden",
                height: "100%",
              }}
            >
              <div style={{ width: "100%", aspectRatio: 1 }}>
                <SystemImage index={-1} systemNumber={"-1"} />
              </div>
              <div style={{ width: "100%", aspectRatio: 1 }}>
                <SystemImage index={-1} systemNumber={"0"} />
              </div>
              {tileNumbers.map((number) => {
                const inMapString = mapString
                  .split(" ")
                  .reduce((found, systemNumber) => {
                    return found || number == systemNumber;
                  }, false);
                if (inMapString) {
                  return null;
                }
                return (
                  <div key={number} style={{ width: "100%", aspectRatio: 1 }}>
                    <SystemImage index={-1} systemNumber={number} />
                  </div>
                );
              })}
            </div>
          </LabeledDiv>
          <div
            className="flexColumn"
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "absolute",
                left: rem(8),
                top: rem(16),
                zIndex: 2,
              }}
            >
              <label>
                <FormattedMessage
                  id="Jh0WRk"
                  defaultMessage="Player Count"
                  description="Label for a selector to change the number of players"
                />
              </label>
              <div
                className="flexRow"
                style={{ fontFamily: "Myriad Pro", gap: rem(4) }}
              >
                {[...Array(6)].map((e, index) => {
                  const number = index + 3;
                  return (
                    <Chip
                      key={number}
                      toggleFn={() => {
                        const prevDefault = getDefaultMapString(
                          numFactions,
                          mapStyle,
                          true,
                        );
                        if (
                          mapString !== prevDefault &&
                          !confirm(
                            "Changing the player count will reset the map.",
                          )
                        ) {
                          return;
                        }
                        setNumFactions(number);
                        setMapStyle("standard");
                        setMapString(
                          getDefaultMapString(number, "standard", true),
                        );
                      }}
                      selected={numFactions === number}
                      fontSize={16}
                    >
                      {number}
                    </Chip>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: rem(8),
                top: rem(16),
                zIndex: 2,
              }}
            >
              {mapStyles.length > 1 ? (
                <div className="flexColumn">
                  <label>
                    <FormattedMessage
                      id="ZZ/Lhe"
                      defaultMessage="Map Type"
                      description="A label for a selector for selecting which map style to use."
                    />
                  </label>
                  <div
                    className="flexRow"
                    style={{
                      gap: rem(4),
                      fontFamily: "Myriad Pro",
                    }}
                  >
                    {mapStyles.map((style) => {
                      return (
                        <Chip
                          key={style}
                          selected={mapStyle === style}
                          toggleFn={() => {
                            const prevDefault = getDefaultMapString(
                              numFactions,
                              mapStyle,
                              true,
                            );
                            if (
                              mapString !== prevDefault &&
                              !confirm(
                                "Changing the map style will reset the map.",
                              )
                            ) {
                              return;
                            }
                            setMapStyle(style);
                            setMapString(
                              getDefaultMapString(numFactions, style, true),
                            );
                          }}
                          fontSize={16}
                        >
                          {mapStyleString(style, intl)}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <div
              style={{
                position: "relative",
                height: "92%",
                aspectRatio: 1,
              }}
            >
              <MapBuilder
                mapString={mapString}
                updateMapString={(dragItem, dropItem) => {
                  setMapString((prevString) => {
                    const systems = prevString.split(" ");
                    while (systems.length < dropItem.index) {
                      systems.push("-1");
                    }
                    systems[dragItem.index] = dropItem.systemNumber;
                    if (dropItem.index !== -1) {
                      systems[dropItem.index] = dragItem.systemNumber;
                    }
                    while (
                      systems.length > 0 &&
                      systems[systems.length - 1] === "-1"
                    ) {
                      systems.pop();
                    }
                    return systems.join(" ");
                  });
                }}
              />
            </div>
            <div
              className="flexRow"
              style={{ position: "absolute", right: rem(16), bottom: rem(16) }}
            >
              <button
                onClick={() => {
                  setMapString(
                    getDefaultMapString(numFactions, mapStyle, true),
                  );
                }}
              >
                Reset Map
              </button>
            </div>
          </div>
        </DndProvider>
      </div>
      <label>Map String</label>
      <input
        className="flexColumn"
        type="textbox"
        style={{
          width: "100%",
        }}
        value={rawMapInput}
        onChange={(element) => setRawMapInput(element.target.value)}
        onBlur={() => {
          setMapString(
            processMapString(rawMapInput.trim(), mapStyle, numFactions, false),
          );
        }}
      ></input>
    </>
  );
}
