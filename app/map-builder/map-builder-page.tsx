"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import MapBuilder, {
  SystemImage,
} from "../../src/components/MapBuilder/MapBuilder";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import Toggle from "../../src/components/Toggle/Toggle";
import { buildBaseSystems } from "../../src/data/GameData";
import { getDefaultMapString } from "../../src/util/map";
import { mapStyleString } from "../../src/util/strings";

type Filter =
  | "BASE_GAME"
  | "PROPHECY_OF_KINGS"
  | "HYPERSPACE_TILES"
  | "DISCORDANT_STARS"
  | "NO_PLANETS"
  | "ONE_PLANET"
  | "TWO_PLANETS"
  | "THREE_PLANETS";

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
      return intl.formatMessage({
        id: "p9XVGB",
        description:
          "Text on a button that will enable/disable the Prophecy of Kings expansion.",
        defaultMessage: "Prophecy of Kings",
      });
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

function mapValuePriority(a?: string, b?: string) {
  if (!a) {
    if (!b) {
      throw new Error("Both values missing!");
    }
    return b;
  }
  if (!b) {
    return a;
  }
  if (a === "-1") {
    return b;
  }
  if (b === "-1") {
    return a;
  }
  if (a === "0") {
    return b;
  }
  if (b === "0") {
    return a;
  }
  return a;
}

export default function MapBuilderPage() {
  const intl = useIntl();
  const [mapString, setMapString] = useState(
    getDefaultMapString(6, "standard")
  );
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
    ])
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
    for (let i = 19; i < 51; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (filters.has("PROPHECY_OF_KINGS")) {
    for (let i = 59; i < 81; i++) {
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
  }
  if (filters.has("DISCORDANT_STARS")) {
    for (let i = 1037; i < 1061; i++) {
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
          height: "calc(100dvh - 52px)",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <LabeledDiv
            label="Tile Pool"
            style={{
              marginTop: "72px",
              height: "calc(100dvh - 140px)",
              justifyContent: "flex-start",
            }}
          >
            <div
              className="flexRow"
              style={{
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                fontSize: "12px",
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
                  filter="HYPERSPACE_TILES"
                  filters={filters}
                  setFilters={setFilters}
                />
                <FilterButton
                  filter="DISCORDANT_STARS"
                  filters={filters}
                  setFilters={setFilters}
                />
                <div className="flexRow" style={{ gap: "4px" }}>
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
                columnGap: "8px",
                width: "100%",
                justifyContent: "flex-start",
                overflowY: "auto",
                overflowX: "hidden",
                height: "100%",
              }}
            >
              <div style={{ width: "100%", aspectRatio: 1 }}>
                <SystemImage index={0} systemNumber={"-1"} />
              </div>
              <div style={{ width: "100%", aspectRatio: 1 }}>
                <SystemImage index={0} systemNumber={"0"} />
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
                    <SystemImage index={0} systemNumber={number} />
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
                left: "16px",
                top: "16px",
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
              <div className="flexRow">
                {[...Array(6)].map((e, index) => {
                  const number = index + 3;
                  return (
                    <button
                      key={number}
                      onClick={() => {
                        const prevDefault = getDefaultMapString(
                          numFactions,
                          mapStyle
                        );
                        if (
                          mapString !== prevDefault &&
                          !confirm(
                            "Changing the player count will reset the map."
                          )
                        ) {
                          return;
                        }
                        setNumFactions(number);
                        setMapStyle("standard");
                        setMapString(getDefaultMapString(number, "standard"));
                      }}
                      className={numFactions === number ? "selected" : ""}
                    >
                      {number}
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: "16px",
                top: "16px",
                zIndex: 2,
              }}
            >
              {mapStyles.length > 1 ? (
                <>
                  <div className="flexRow" style={{ paddingLeft: `${"16px"}` }}>
                    {mapStyles.map((style) => {
                      return (
                        <button
                          key={style}
                          className={mapStyle === style ? "selected" : ""}
                          onClick={() => {
                            const prevDefault = getDefaultMapString(
                              numFactions,
                              mapStyle
                            );
                            if (
                              mapString !== prevDefault &&
                              !confirm(
                                "Changing the map style will reset the map."
                              )
                            ) {
                              return;
                            }
                            setMapStyle(style);
                            setMapString(
                              getDefaultMapString(numFactions, style)
                            );
                          }}
                        >
                          {mapStyleString(style, intl)}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
            <div
              style={{
                position: "relative",
                height: "90%",
                aspectRatio: 1,
              }}
            >
              <MapBuilder
                mapString={mapString}
                updateMapString={(dragItem, dropItem) => {
                  setMapString((prevString) => {
                    const systems = prevString.split(" ");
                    while (systems.length < dropItem.index - 1) {
                      systems.push("-1");
                    }
                    systems[dragItem.index - 1] = dropItem.systemNumber;
                    if (dropItem.index !== 0) {
                      systems[dropItem.index - 1] = dragItem.systemNumber;
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
              style={{ position: "absolute", right: "16px", bottom: "16px" }}
            >
              <button
                onClick={() => {
                  setMapString(getDefaultMapString(numFactions, mapStyle));
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
        value={mapString}
        onChange={(element) => {
          setMapString(element.target.value);
        }}
      ></input>
    </>
  );
}
