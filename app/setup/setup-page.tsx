"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getFactions } from "../../server/data/factions";
import { ClientOnlyHoverMenu } from "../../src/HoverMenu";
import { InfoRow } from "../../src/InfoRow";
import { SelectableRow } from "../../src/SelectableRow";
import Chip from "../../src/components/Chip/Chip";
import ExpansionIcon from "../../src/components/ExpansionIcon/ExpansionIcon";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import GameMap from "../../src/components/Map/GameMap";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import NumberInput from "../../src/components/NumberInput/NumberInput";
import SiteLogo from "../../src/components/SiteLogo/SiteLogo";
import Toggle from "../../src/components/Toggle/Toggle";
import { Strings } from "../../src/components/strings";
import { ModalContext } from "../../src/context/contexts";
import CodexSVG from "../../src/icons/ui/Codex";
import ProphecyofKingsSVG from "../../src/icons/ui/ProphecyOfKings";
import ThundersEdgeMenuSVG from "../../src/icons/ui/ThundersEdgeMenu";
import { buildMergeFunction } from "../../src/util/expansions";
import { convertToFactionColor } from "../../src/util/factions";
import { extractFactionIds, processMapString } from "../../src/util/map";
import { mapStyleString } from "../../src/util/strings";
import { Optional } from "../../src/util/types/types";
import { objectEntries, rem } from "../../src/util/util";
import ColorPicker from "./components/ColorPicker";
import PlayerNameInput from "./components/PlayerNameInput";
import styles from "./setup.module.scss";

const SetupFactionPanel = dynamic(
  () => import("../../src/components/SetupFactionPanel"),
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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface OptionsProps {
  updatePlayerCount: (count: number) => void;
  toggleOption: (value: any, name: string) => void;
  toggleExpansion: (enable: boolean, expansion: Expansion) => void;
  toggleEvent: (enable: boolean, event: EventId) => void;
  options: SetupOptions;
  numFactions: number;
  maxFactions: number;
  events: Record<EventId, TIEvent>;
}

function createOptions(setupOptions: SetupOptions) {
  const expansions = Array.from(setupOptions.expansions);
  const events = Array.from(setupOptions.events);
  const optionsToSend: Options = {
    ...setupOptions,
    expansions,
    events,
  };
  return optionsToSend;
}

function getMapStyles(numFactions: number) {
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
  return mapStyles;
}

function MobileOptions({
  updatePlayerCount,
  toggleOption,
  toggleExpansion,
  toggleEvent,
  options,
  numFactions,
  maxFactions,
  reset,
  events,
}: OptionsProps & { reset: () => void }) {
  const mapStringRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();

  const mapString = options["map-string"];

  useEffect(() => {
    if (!mapStringRef.current) {
      return;
    }
    if (mapString === "") {
      mapStringRef.current.value = "";
    }
  }, [mapString]);

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

  const filteredEvents = objectEntries(events)
    .filter(([_, event]) => {
      return options.expansions.has(event.expansion);
    })
    .sort(([_, a], [__, b]) => {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    });

  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      <label>
        <FormattedMessage
          id="Jh0WRk"
          defaultMessage="Player Count"
          description="Label for a selector to change the number of players"
        />
      </label>
      <div
        className="flexRow"
        style={{ gap: rem(4), fontFamily: "Myriad Pro" }}
      >
        {[...Array(maxFactions - 2)].map((e, index) => {
          const number = index + 3;
          return (
            <Chip
              key={number}
              selected={numFactions === number}
              toggleFn={() => updatePlayerCount(number)}
              fontSize={16}
            >
              {number}
            </Chip>
          );
        })}
      </div>
      <div className="flexRow">
        <FormattedMessage
          id="R06tnh"
          description="A label for a selector specifying the number of victory points required."
          defaultMessage="Victory Points"
        />
        :
        <NumberInput
          value={options["victory-points"]}
          onChange={(newVal) => toggleOption(newVal, "victory-points")}
          minValue={0}
        />
        {options["game-variant"] === "alliance-separate" ? (
          <>
            <FormattedMessage
              id="+WkrHz"
              description="Text between two fields linking them together."
              defaultMessage="AND"
            />
            <NumberInput
              value={options["secondary-victory-points"]}
              onChange={(newVal) =>
                toggleOption(newVal, "secondary-victory-points")
              }
              minValue={0}
            />
          </>
        ) : null}
      </div>
      <LabeledDiv
        label={
          <FormattedMessage
            id="2jNcVD"
            description="A label for a selector specifying which expansions should be enabled."
            defaultMessage="Expansions:"
          />
        }
      >
        <div className="flexColumn" style={{ alignItems: "center" }}>
          <Toggle
            selected={options.expansions.has("POK")}
            toggleFn={(prevValue) => {
              toggleExpansion(!prevValue, "POK");
            }}
          >
            <FormattedMessage
              id="p9XVGB"
              description="Text on a button that will enable/disable the Prophecy of Kings expansion."
              defaultMessage="Prophecy of Kings"
            />
            <ProphecyofKingsSVG />
          </Toggle>
          <Toggle
            selected={options.expansions.has("THUNDERS EDGE")}
            toggleFn={(prevValue) => {
              toggleExpansion(!prevValue, "THUNDERS EDGE");
            }}
          >
            <FormattedMessage
              id="SpNTY7"
              description="Text on a button that will enable/disable the Thunder's Edge expansion."
              defaultMessage="Thunder's Edge"
            />
          </Toggle>
          {!options.expansions.has("THUNDERS EDGE") ? (
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-start",
                fontFamily: "Myriad Pro",
                gap: rem(4),
              }}
            >
              Codices:
              <Toggle
                selected={options.expansions.has("CODEX ONE")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX ONE");
                }}
              >
                I
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX TWO")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX TWO");
                }}
              >
                II
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX THREE")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX THREE");
                }}
              >
                III
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX FOUR")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX FOUR");
                }}
              >
                IV
              </Toggle>
            </div>
          ) : (
            <Toggle
              selected={options.expansions.has("TWILIGHTS FALL")}
              toggleFn={(prevValue) => {
                toggleExpansion(!prevValue, "TWILIGHTS FALL");
              }}
            >
              <FormattedMessage
                id="X+daca"
                description="Text on a button that will enable/disable the Twilight's Fall gamemode."
                defaultMessage="Twilight's Fall"
              />
            </Toggle>
          )}
        </div>
      </LabeledDiv>
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="d0uSBF"
              defaultMessage="Options"
              description="Label on a menu for changing game options"
            />
          }
        >
          <div style={{ width: "90vw", overflowX: "auto" }}>
            <div
              className="flexColumn"
              style={{
                alignItems: "flex-start",
                padding: `${rem(8)} ${rem(16)} 0 ${rem(16)}`,
              }}
            >
              <div className="flexColumn" style={{ alignItems: "flex-start" }}>
                <FormattedMessage
                  id="weIxIg"
                  description="A label for a selector specifying expansions that are homemade."
                  defaultMessage="Homebrew:"
                />
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "flex-start",
                    padding: `0 ${rem(16)}`,
                    fontFamily: "Myriad Pro",
                  }}
                >
                  <Toggle
                    selected={options.expansions.has("DISCORDANT STARS")}
                    toggleFn={(prevValue) => {
                      toggleExpansion(!prevValue, "DISCORDANT STARS");
                    }}
                  >
                    <Strings.Expansion expansion="DISCORDANT STARS" />
                  </Toggle>
                </div>
              </div>

              {filteredEvents.length > 0 ? (
                <div
                  className="flexColumn"
                  style={{ alignItems: "flex-start", maxWidth: "86vw" }}
                >
                  <FormattedMessage
                    id="WVs5Hr"
                    description="Event actions."
                    defaultMessage="Events"
                  />
                  :
                  <div
                    style={{
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(5, 1fr)",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      justifyContent: "flex-start",
                      alignContent: "flex-start",
                      fontFamily: "Myriad Pro",
                      gap: rem(4),
                      overflowX: "scroll",
                      width: "100%",
                    }}
                  >
                    {filteredEvents.map(([eventId, event]) => {
                      return (
                        <Toggle
                          key={eventId}
                          selected={options.events.has(eventId)}
                          toggleFn={(prevValue) =>
                            toggleEvent(!prevValue, eventId)
                          }
                          style={{ justifyContent: "space-between" }}
                          info={{
                            title: event.name,
                            description: (
                              <FormattedDescription
                                description={event.description}
                              />
                            ),
                          }}
                        >
                          {event.name}
                        </Toggle>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div>
                <FormattedMessage
                  id="46dzNs"
                  description="A label for a section of options related to the map."
                  defaultMessage="Map:"
                />
                <div
                  className="flexColumn"
                  style={{
                    fontFamily: "Myriad Pro",
                    padding: `${rem(8)} ${rem(16)}`,
                    alignItems: "flex-start",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {mapStyles.length > 1 ? (
                    <React.Fragment>
                      <FormattedMessage
                        id="ZZ/Lhe"
                        description="A label for a selector for selecting which map style to use."
                        defaultMessage="Map Type"
                      />
                      :
                      <div
                        className="flexRow"
                        style={{ paddingLeft: `${rem(16)}`, gap: rem(4) }}
                      >
                        {mapStyles.map((style) => {
                          return (
                            <Chip
                              key={style}
                              selected={options["map-style"] === style}
                              toggleFn={() => {
                                toggleOption(style, "map-style");
                                toggleOption(
                                  processMapString(
                                    options["map-string"],
                                    style,
                                    numFactions,
                                    options.expansions.has("THUNDERS EDGE")
                                  ),
                                  "processed-map-string"
                                );
                              }}
                            >
                              {mapStyleString(style, intl)}
                            </Chip>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ) : null}
                  <FormattedMessage
                    id="UJSVtn"
                    description="Label for a textbox used to specify the map string."
                    defaultMessage="Map String"
                  />
                  :
                  <span className="smallFont" style={{ paddingLeft: rem(4) }}>
                    <FormattedMessage
                      id="zjv9Gr"
                      description="Part of a label explaining what the map string does."
                      defaultMessage="(filters out non-claimable planets)"
                    />
                  </span>
                  <input
                    ref={mapStringRef}
                    type="textbox"
                    pattern={
                      "((([0-9]{1,4}((A|B)[0-5]?)?)|(P[1-8])|(-1))($|\\s))+"
                    }
                    className="mediumFont"
                    style={{ width: "75vw" }}
                    onChange={(event) => {
                      toggleOption(event.currentTarget.value, "map-string");
                      toggleOption(
                        processMapString(
                          event.currentTarget.value,
                          options["map-style"],
                          numFactions,
                          options.expansions.has("THUNDERS EDGE")
                        ),
                        "processed-map-string"
                      );
                    }}
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </ClientOnlyHoverMenu>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

function Options({
  updatePlayerCount,
  toggleOption,
  toggleExpansion,
  toggleEvent,
  options,
  numFactions,
  maxFactions,
  events,
}: OptionsProps) {
  const { openModal } = use(ModalContext);

  let variants: GameVariant[] = [];
  switch (numFactions) {
    case 3:
      variants = ["normal"];
      break;
    case 4:
      variants = ["normal", "alliance-separate", "alliance-combined"];
      break;
    case 5:
      variants = ["normal"];
      break;
    case 6:
      variants = ["normal", "alliance-separate", "alliance-combined"];
      break;
    case 7:
      variants = ["normal"];
      break;
    case 8:
      variants = ["normal", "alliance-separate", "alliance-combined"];
      break;
  }

  const filteredEvents = objectEntries(events)
    .filter(([_, event]) => {
      return options.expansions.has(event.expansion);
    })
    .sort(([_, a], [__, b]) => {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    });

  return (
    <div className="flexColumn" style={{ justifyContent: "flex-start" }}>
      <label>
        <FormattedMessage
          id="Jh0WRk"
          defaultMessage="Player Count"
          description="Label for a selector to change the number of players"
        />
      </label>
      <div
        className="flexRow"
        style={{ gap: rem(4), fontFamily: "Myriad Pro" }}
      >
        {[...Array(maxFactions - 2)].map((e, index) => {
          const number = index + 3;
          return (
            <Chip
              key={number}
              selected={numFactions === number}
              toggleFn={() => updatePlayerCount(number)}
              fontSize={16}
            >
              {number}
            </Chip>
          );
        })}
      </div>
      <div className="flexRow">
        <FormattedMessage
          id="R06tnh"
          description="A label for a selector specifying the number of victory points required."
          defaultMessage="Victory Points"
        />
        :
        <NumberInput
          value={options["victory-points"]}
          onChange={(newVal) => toggleOption(newVal, "victory-points")}
          minValue={0}
        />
        {options["game-variant"] === "alliance-separate" ? (
          <>
            <FormattedMessage
              id="+WkrHz"
              description="Text between two fields linking them together."
              defaultMessage="AND"
            />
            <NumberInput
              value={options["secondary-victory-points"]}
              onChange={(newVal) =>
                toggleOption(newVal, "secondary-victory-points")
              }
              minValue={0}
            />
          </>
        ) : null}
      </div>
      <LabeledDiv
        label={
          <FormattedMessage
            id="2jNcVD"
            description="A label for a selector specifying which expansions should be enabled."
            defaultMessage="Expansions:"
          />
        }
      >
        <div className="flexColumn" style={{ alignItems: "center" }}>
          <div className="flexRow">
            <Toggle
              selected={options.expansions.has("POK")}
              toggleFn={(prevValue) => {
                toggleExpansion(!prevValue, "POK");
              }}
            >
              <FormattedMessage
                id="p9XVGB"
                description="Text on a button that will enable/disable the Prophecy of Kings expansion."
                defaultMessage="Prophecy of Kings"
              />
              <div style={{ width: rem(12), marginLeft: rem(4) }}>
                <ProphecyofKingsSVG />
              </div>
            </Toggle>
            <Toggle
              selected={options.expansions.has("THUNDERS EDGE")}
              toggleFn={(prevValue) => {
                toggleExpansion(!prevValue, "THUNDERS EDGE");
              }}
            >
              <FormattedMessage
                id="SpNTY7"
                description="Text on a button that will enable/disable the Thunder's Edge expansion."
                defaultMessage="Thunder's Edge"
              />
              <div style={{ width: rem(14), marginLeft: rem(4) }}>
                <ThundersEdgeMenuSVG />
              </div>
            </Toggle>
          </div>
          {!options.expansions.has("THUNDERS EDGE") ? (
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-start",
                fontFamily: "Myriad Pro",
                gap: rem(4),
              }}
            >
              Codices{" "}
              <div style={{ width: rem(12) }}>
                <CodexSVG />
              </div>
              :
              <Toggle
                selected={options.expansions.has("CODEX ONE")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX ONE");
                }}
              >
                I
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX TWO")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX TWO");
                }}
              >
                II
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX THREE")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX THREE");
                }}
              >
                III
              </Toggle>
              <Toggle
                selected={options.expansions.has("CODEX FOUR")}
                toggleFn={(prevValue) => {
                  toggleExpansion(!prevValue, "CODEX FOUR");
                }}
              >
                IV
              </Toggle>
            </div>
          ) : (
            <Toggle
              selected={options.expansions.has("TWILIGHTS FALL")}
              toggleFn={(prevValue) => {
                toggleExpansion(!prevValue, "TWILIGHTS FALL");
              }}
            >
              <FormattedMessage
                id="X+daca"
                description="Text on a button that will enable/disable the Twilight's Fall gamemode."
                defaultMessage="Twilight's Fall"
              />
            </Toggle>
          )}
        </div>
      </LabeledDiv>
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="d0uSBF"
            defaultMessage="Options"
            description="Label on a menu for changing game options"
          />
        }
      >
        <div>
          <div
            className="flexColumn"
            style={{
              alignItems: "flex-start",
              padding: `${rem(8)} ${rem(16)} 0 ${rem(16)}`,
            }}
          >
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              <FormattedMessage
                id="weIxIg"
                description="A label for a selector specifying expansions that are homemade."
                defaultMessage="Homebrew:"
              />
              <div
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  padding: `0 ${rem(20)}`,
                  fontFamily: "Myriad Pro",
                }}
              >
                <Toggle
                  selected={options.expansions.has("DISCORDANT STARS")}
                  toggleFn={(prevValue) => {
                    toggleExpansion(!prevValue, "DISCORDANT STARS");
                  }}
                >
                  <FormattedMessage
                    id="ZlvDZB"
                    description="Text on a button that will enable/disable the Discordant Stars expansion."
                    defaultMessage="Discordant Stars"
                  />
                </Toggle>
              </div>
            </div>
            {filteredEvents.length > 0 ? (
              <div className="flexColumn" style={{ alignItems: "flex-start" }}>
                <FormattedMessage
                  id="WVs5Hr"
                  description="Event actions."
                  defaultMessage="Events"
                />
                :
                <div
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(5, 1fr)",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    justifyContent: "flex-start",
                    alignContent: "flex-start",
                    padding: `0 ${rem(20)}`,
                    fontFamily: "Myriad Pro",
                    gap: rem(4),
                  }}
                >
                  {filteredEvents.map(([eventId, event]) => {
                    return (
                      <Toggle
                        key={eventId}
                        selected={options.events.has(eventId)}
                        toggleFn={(prevValue) =>
                          toggleEvent(!prevValue, eventId)
                        }
                        style={{ justifyContent: "space-between" }}
                        info={{
                          title: event.name,
                          description: (
                            <FormattedDescription
                              description={event.description}
                            />
                          ),
                        }}
                      >
                        {event.name}
                      </Toggle>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {variants.length > 1 ? (
              <div
                className="flexColumn"
                style={{ alignItems: "flex-start", paddingBottom: rem(8) }}
              >
                Variants (WIP):
                <div
                  className="flexRow"
                  style={{
                    alignItems: "flex-start",
                    padding: `0 ${rem(20)}`,
                    gap: rem(4),
                    fontFamily: "Myriad Pro",
                  }}
                >
                  {variants.map((variant) => {
                    let variantText = capitalizeFirstLetter(variant);
                    let baseVPs = 10;
                    switch (variant) {
                      case "alliance-combined":
                        variantText = "Alliance (combined VPs)";
                        baseVPs = 22;
                        break;
                      case "alliance-separate":
                        variantText = "Alliance (separate VPs)";
                        baseVPs = 14;
                        break;
                    }
                    return (
                      <Chip
                        key={variant}
                        selected={options["game-variant"] === variant}
                        toggleFn={() => {
                          toggleOption(baseVPs, "victory-points");
                          toggleOption(10, "secondary-victory-points");
                          toggleOption(variant, "game-variant");
                        }}
                      >
                        {variantText}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </div>
  );
}

function getFactionIndex(
  numFactions: number,
  position: number,
  options: SetupOptions
) {
  switch (numFactions) {
    case 3:
      switch (position) {
        case 7:
          return 2;
        case 1:
          return 0;
        case 4:
          return 1;
      }
    case 4:
      const standard = options["map-style"] === "standard";
      switch (position) {
        case 7:
          return standard ? 2 : 3;
        case 6:
          return 2;
        case 0:
          return standard ? 3 : 0;
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return standard ? 1 : 2;
      }
    case 5:
      const warp = options["map-style"] === "warp";
      switch (position) {
        case 0:
          return 0;
        case 1:
          return warp ? 1 : 0;
        case 2:
          return warp ? 2 : 1;
        case 4:
          return 2;
        case 6:
          return 3;
        case 7:
          return 4;
      }
    case 6:
      switch (position) {
        case 0:
          return 0;
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 3;
        case 6:
          return 4;
        case 7:
          return 5;
      }
    case 7:
      switch (position) {
        case 0:
          return 0;
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 3;
        case 5:
          return 4;
        case 6:
          return 5;
        case 7:
          return 6;
      }
    case 8:
      return position;
  }
  return 0;
}

interface FactionSelectProps {
  colors: string[];
  factions: SetupFaction[];
  position: number;
  mobile?: boolean;
  numFactions: number;
  speaker: number;
  setFaction: (index: number, factionId: Optional<FactionId>) => void;
  setColor: (index: number, colorName: Optional<string>) => void;
  setSpeaker: (index: number) => void;
  setPlayerName: (index: number, playerName: string) => void;
  setAlliancePartner: (
    index: number,
    alliancePartner: Optional<number>
  ) => void;
  options: SetupOptions;
}

function FactionSelect({
  colors,
  factions,
  position,
  mobile = false,
  numFactions,
  speaker,
  setFaction,
  setColor,
  setSpeaker,
  setPlayerName,
  setAlliancePartner,
  options,
}: FactionSelectProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();
  const availableFactions = getFactions(intl);

  const factionIndex = mobile
    ? position
    : getFactionIndex(numFactions, position, options);
  const faction = factions[factionIndex] ?? {};
  const playerName = faction.playerName;
  const currentNameRef = nameRef?.current;
  useEffect(() => {
    if (currentNameRef && !playerName) {
      currentNameRef.value = "";
    }
  }, [playerName, currentNameRef]);

  const isSpeaker = speaker === factionIndex;

  const omegaMergeFn = buildMergeFunction(Array.from(options.expansions));

  const updatedFactions: Record<FactionId, BaseFaction> = {} as Record<
    FactionId,
    BaseFaction
  >;
  for (const [factionId, faction] of objectEntries(availableFactions)) {
    const updatedFaction = omegaMergeFn(faction);

    if (updatedFaction.abilities) {
      updatedFaction.abilities = updatedFaction.abilities.map(omegaMergeFn);
    }
    if (updatedFaction.promissories) {
      updatedFaction.promissories =
        updatedFaction.promissories.map(omegaMergeFn);
    }
    updatedFaction.units = updatedFaction.units.map(omegaMergeFn);

    updatedFactions[factionId] = updatedFaction;
  }

  const filteredFactions = Object.values(updatedFactions).filter((faction) => {
    if (faction.locked) {
      return false;
    }
    if (faction.removedIn && options.expansions.has(faction.removedIn)) {
      return false;
    }
    if (faction.expansion === "BASE") {
      return true;
    }
    if (!options.expansions.has(faction.expansion)) {
      return false;
    }
    return true;
  });
  filteredFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const selectedFactions = factions
    .filter((faction, index) => !!faction.id && index < numFactions)
    .map((faction) => faction.id as FactionId);

  function selectFaction(factionId: Optional<FactionId>) {
    setFaction(factionIndex, factionId);
  }

  function selectColor(color: Optional<string>) {
    setColor(factionIndex, color);
  }

  function savePlayerName(name: string) {
    setPlayerName(factionIndex, name);
  }

  function selectAlliancePartner(factionId: Optional<FactionId>) {
    if (factionIndex == undefined) {
      return;
    }
    const index = factions.reduce(
      (alliance: Optional<number>, faction, index) => {
        if (faction.id === factionId) {
          return index;
        }
        return alliance;
      },
      undefined
    );
    setAlliancePartner(factionIndex, index);
  }

  const factionColor = convertToFactionColor(faction.color);

  const selectedColors = factions
    .map((faction) => faction.color)
    .filter((color) => !!color) as string[];

  return (
    <LabeledDiv
      label={
        <PlayerNameInput
          color={factionColor === "#555" ? undefined : factionColor}
          playerName={faction.playerName}
          tabIndex={position + 1}
          updatePlayerName={savePlayerName}
        />
      }
      rightLabel={isSpeaker ? <Strings.Speaker /> : undefined}
      color={factionColor}
      style={{ width: mobile ? "100%" : "28vw", minWidth: rem(260) }}
    >
      {faction.id ? (
        <div
          className="flexColumn"
          style={{
            position: "absolute",
            opacity: 0.5,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        >
          <FactionIcon factionId={faction.id} size={mobile ? 52 : 48} />
        </div>
      ) : null}
      <div
        className="flexColumn"
        style={{
          width: "100%",
          alignItems: "flex-start",
          whiteSpace: "nowrap",
          gap: rem(4),
          padding: rem(4),
          boxSizing: "border-box",
        }}
      >
        <div
          className={mobile ? "flexRow largeFont" : "flexColumn largeFont"}
          style={{
            whiteSpace: "pre-line",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            className="flexRow"
            style={{
              width: "100%",
              justifyContent:
                !faction.id && !mobile ? "center" : "space-between",
              alignItems: "center",
            }}
          >
            {faction.id ? (
              <>
                <SelectableRow
                  itemId={updatedFactions[faction.id].name}
                  removeItem={() => selectFaction(undefined)}
                  style={{ height: rem(32.67) }}
                >
                  {updatedFactions[faction.id].name}
                  <SetupFactionPanel
                    faction={updatedFactions[faction.id]}
                    options={createOptions(options)}
                    altFaction={
                      faction.id === "Firmament"
                        ? updatedFactions["Obsidian"]
                        : undefined
                    }
                  />
                </SelectableRow>
                <ColorPicker
                  pickedColor={faction.color}
                  selectedColors={selectedColors}
                  updateColor={selectColor}
                />
              </>
            ) : (
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="Cw3noi"
                    description="Text on a hover menu for selecting a player's faction"
                    defaultMessage="Pick Faction"
                  />
                }
              >
                <div
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: `repeat(${Math.min(
                      filteredFactions.length,
                      10
                    )}, minmax(0, 1fr))`,
                    gap: rem(4),
                    padding: rem(8),
                    maxWidth: `min(80vw, ${rem(700)})`,
                    overflowX: "auto",
                  }}
                >
                  {filteredFactions.map((faction) => {
                    const faded = selectedFactions.includes(faction.id);
                    return (
                      <button
                        key={faction.id}
                        className={`flexRow ${faded ? "faded" : ""}`}
                        style={{
                          position: "relative",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          fontSize: rem(16),
                        }}
                        onClick={() => selectFaction(faction.id)}
                      >
                        <FactionIcon factionId={faction.id} size={20} />
                        {faction.name}
                        {faction.expansion !== "BASE" ? (
                          <>
                            <div style={{ width: rem(4) }}></div>
                            <div
                              style={{
                                position: "absolute",
                                bottom: rem(4),
                                right: rem(4),
                              }}
                            >
                              <ExpansionIcon
                                expansion={faction.expansion}
                                size={8}
                                color={faded ? "#555" : undefined}
                              />
                            </div>
                          </>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </ClientOnlyHoverMenu>
            )}
            {options["game-variant"].startsWith("alliance") ? (
              <div className="flexRow">
                Partner:
                <FactionSelectRadialMenu
                  selectedFaction={
                    faction.alliancePartner != undefined
                      ? (factions[faction.alliancePartner]?.id as FactionId)
                      : undefined
                  }
                  fadedFactions={factions
                    .filter((faction) => faction.alliancePartner != undefined)
                    .map((faction) => faction.id as FactionId)}
                  factions={
                    selectedFactions.filter(
                      (factionName) => factionName !== faction.id
                    ) as FactionId[]
                  }
                  onSelect={(factionName) => {
                    selectAlliancePartner(factionName);
                  }}
                  borderColor={
                    faction.alliancePartner != undefined
                      ? convertToFactionColor(
                          factions[faction.alliancePartner]?.color
                        )
                      : undefined
                  }
                  size={32}
                />
              </div>
            ) : null}
          </div>
        </div>
        {/* </ClientOnlyHoverMenu> */}
      </div>
    </LabeledDiv>
  );
}

const INITIAL_FACTIONS: SetupFaction[] = [{}, {}, {}, {}, {}, {}, {}, {}];

const INITIAL_OPTIONS: SetupOptions = {
  expansions: new Set<Expansion>([
    "POK",
    "CODEX ONE",
    "CODEX TWO",
    "CODEX THREE",
    "CODEX FOUR",
    "THUNDERS EDGE",
  ]),
  events: new Set<EventId>(),
  "game-variant": "normal",
  "map-style": "standard",
  "map-string": "",
  "hide-objectives": false,
  "hide-planets": false,
  "hide-techs": false,
  "victory-points": 10,
  "secondary-victory-points": 10,
};

export default function SetupPage({
  factions,
  colors,
  events,
}: {
  factions: Record<FactionId, BaseFaction>;
  colors: string[];
  events: Record<EventId, TIEvent>;
}) {
  const [speaker, setSpeaker] = useState(0);
  const [setupFactions, setFactions] = useState([...INITIAL_FACTIONS]);
  const [options, setOptions] = useState<SetupOptions>({
    ...INITIAL_OPTIONS,
    expansions: new Set(INITIAL_OPTIONS.expansions),
    events: new Set(),
  });
  const [numFactions, setNumFactions] = useState(6);
  const [creatingGame, setCreatingGame] = useState(false);
  const [password, setPassword] = useState("");

  const router = useRouter();

  const intl = useIntl();
  const availableFactions = factions;

  function reset() {
    setFactions([...INITIAL_FACTIONS]);
    setOptions({
      ...INITIAL_OPTIONS,
      expansions: new Set(INITIAL_OPTIONS.expansions),
    });
    setSpeaker(0);
    setNumFactions(6);
  }

  function updatePlayerCount(count: number) {
    if (count === numFactions) {
      return;
    }

    setNumFactions(count);
    toggleOption("standard", "map-style");
    if (count % 2 !== 0) {
      toggleOption("normal", "game-variant");
    }
    toggleOption(
      processMapString(
        options["map-string"],
        "standard",
        count,
        options.expansions.has("THUNDERS EDGE")
      ),
      "processed-map-string"
    );

    if (speaker > count) {
      setSpeaker(0);
    }
  }

  function getBestRemainingColor(
    factionId: FactionId,
    usedColors: Set<string>
  ) {
    const color = factions[factionId].color;
    if (color) {
      if (!usedColors.has(color)) {
        return color;
      }
    }
    const colorList = factions[factionId].colorList;
    if (!colorList) {
      return;
    }
    for (const color of colorList) {
      if (
        !options.expansions.has("POK") &&
        (color === "Magenta" || color === "Orange")
      ) {
        continue;
      }
      if (!usedColors.has(color)) {
        return color;
      }
    }
    return;
  }

  function updatePlayerFaction(index: number, factionId: Optional<FactionId>) {
    const usedColors = setupFactions.reduce((set, faction) => {
      if (faction.id === factionId) {
        return set;
      }
      if (faction.color) {
        set.add(faction.color);
      }
      return set;
    }, new Set<string>());
    setFactions(
      setupFactions.map((faction, i) => {
        if (index === i) {
          const color = factionId
            ? getBestRemainingColor(factionId, usedColors)
            : undefined;
          return {
            ...faction,
            name: factionId,
            id: factionId,
            color: !factionId ? undefined : faction.color ?? color,
          };
        }
        if (factionId && faction.id === factionId) {
          return {
            ...faction,
            name: undefined,
            id: undefined,
            color: undefined,
          };
        }
        return faction;
      })
    );
  }

  function updateAllPlayerFactions(factions: Record<number, FactionId>) {
    setFactions((prevFactions) => {
      const usedColors = new Set<string>();
      return prevFactions.map((faction, i) => {
        const newFaction = factions[i];
        if (!newFaction) {
          return faction;
        }
        const color = getBestRemainingColor(newFaction, usedColors);
        if (color) {
          usedColors.add(color);
        }
        return {
          ...faction,
          name: newFaction,
          id: newFaction,
          color: faction.color ?? color,
        };
      });
    });
  }

  function updatePlayerColor(index: number, color: Optional<string>) {
    const faction = setupFactions[index];
    if (!faction) {
      return;
    }
    const prevValue = faction.color;
    setFactions(
      setupFactions.map((faction, i) => {
        if (index === i) {
          return { ...faction, color: color };
        }
        if (color && faction.color === color) {
          return { ...faction, color: prevValue };
        }
        return faction;
      })
    );
  }

  function updatePlayerName(index: number, playerName: string) {
    setFactions(
      setupFactions.map((faction, i) => {
        if (index === i) {
          return { ...faction, playerName: playerName };
        }
        return faction;
      })
    );
  }

  function updateAlliancePartner(
    index: number,
    alliancePartner: Optional<number>
  ) {
    setFactions(
      setupFactions.map((faction, i) => {
        if (index === i) {
          return { ...faction, alliancePartner };
        }
        if (alliancePartner === i) {
          return { ...faction, alliancePartner: index };
        }
        if (
          faction.alliancePartner === index ||
          faction.alliancePartner === alliancePartner
        ) {
          return { ...faction, alliancePartner: undefined };
        }
        return faction;
      })
    );
  }

  function randomSpeaker() {
    setSpeaker(Math.floor(Math.random() * numFactions));
  }

  function randomFactions() {
    const usedColors = new Set<string>();
    let selectedFactions: FactionId[] = [];
    let selectedColors: string[] = [];
    for (let index = 0; index < numFactions; index++) {
      const faction = setupFactions[index];
      if (!faction) {
        continue;
      }
      if (faction.id) {
        selectedFactions[index] = faction.id;
      }
      const color = faction.color;
      if (color) {
        usedColors.add(color);
        selectedColors[index] = color;
      }
    }
    const filteredFactions = Object.values(availableFactions ?? {}).filter(
      (faction) => {
        if (faction.locked) {
          return false;
        }
        if (faction.removedIn && options.expansions.has(faction.removedIn)) {
          return false;
        }
        if (faction.expansion === "BASE") {
          return true;
        }
        if (!options.expansions.has(faction.expansion)) {
          return false;
        }
        return true;
      }
    );
    const factionKeys = filteredFactions.map((faction) => faction.id);
    for (let index = 0; index < numFactions; index++) {
      const faction = setupFactions[index];
      if (!faction) {
        continue;
      }
      if (faction.id) {
        continue;
      }
      let selectedFaction: Optional<FactionId>;
      while (!selectedFaction || selectedFactions.includes(selectedFaction)) {
        let randomIndex = Math.floor(Math.random() * factionKeys.length);
        selectedFaction = factionKeys[randomIndex];
      }
      const color = getBestRemainingColor(selectedFaction, usedColors);
      if (color) {
        usedColors.add(color);
        selectedColors[index] = color;
      }
      selectedFactions[index] = selectedFaction;
    }
    setFactions(
      setupFactions.map((faction, index) => {
        const factionId: Optional<FactionId> = selectedFactions[index];
        if (!factionId) {
          if (faction.id && selectedFactions.includes(faction.id)) {
            return {
              ...faction,
              name: undefined,
              id: undefined,
              color: undefined,
            };
          }
          return { ...faction };
        }
        return {
          ...faction,
          name: factionId,
          id: factionId,
          color: selectedColors[index],
        };
      })
    );
  }

  const activeFactions = [...setupFactions];
  activeFactions.splice(numFactions);

  async function startGame() {
    setCreatingGame(true);

    const passwordToSend = password === "" ? undefined : password;

    const expansions = Array.from(options.expansions);
    const events = Array.from(options.events);
    const optionsToSend: Options = {
      ...options,
      expansions,
      events,
    };

    const res = await fetch("/api/create-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        factions: activeFactions,
        speaker: speaker,
        options: optionsToSend,
        password: passwordToSend,
      }),
    });
    const data = await res.json();
    router.push(`/game/${data.gameid}`);
  }

  function disableRandomizeFactionButton() {
    if (
      !availableFactions ||
      Object.keys(availableFactions).length < numFactions
    ) {
      return true;
    }
    for (let i = 0; i < numFactions; i++) {
      const faction = setupFactions[i];
      if (!faction?.id) {
        return false;
      }
    }
    return true;
  }

  function disableNextButton() {
    if (creatingGame) {
      return true;
    }
    if (speaker === -1) {
      return true;
    }
    for (let i = 0; i < numFactions; i++) {
      const faction = setupFactions[i];
      if (!faction?.color || !faction?.id) {
        return true;
      }
      if (
        options["game-variant"].startsWith("alliance") &&
        faction?.alliancePartner == undefined
      ) {
        return true;
      }
    }

    return false;
  }

  function toggleOption(value: any, option: string) {
    setOptions((currentOptions) => {
      const localOptions = { ...currentOptions };
      localOptions[option] = value;
      return localOptions;
    });
  }

  function toggleEvent(value: boolean, event: EventId) {
    const currentOptions = { ...options };
    if (value) {
      currentOptions.events.add(event);
    } else {
      currentOptions.events.delete(event);
    }
    setOptions(currentOptions);
  }

  function toggleExpansion(value: boolean, expansion: Expansion) {
    const currentOptions = { ...options };
    if (value) {
      currentOptions.expansions.add(expansion);

      // Add codices if using Thunder's Edge. Some components will not be usable otherwise.
      if (expansion === "THUNDERS EDGE") {
        currentOptions.expansions.add("CODEX ONE");
        currentOptions.expansions.add("CODEX TWO");
        currentOptions.expansions.add("CODEX THREE");
        currentOptions.expansions.add("CODEX FOUR");
      }
      setFactions(
        setupFactions.map((faction, _) => {
          const tempFaction: SetupFaction = { ...faction };
          const currFaction = tempFaction.id
            ? availableFactions[tempFaction.id]
            : undefined;
          if (!currFaction) {
            return tempFaction;
          }
          if (
            currFaction.removedIn &&
            currentOptions.expansions.has(currFaction.removedIn)
          ) {
            delete tempFaction.id;
            delete tempFaction.name;
            delete tempFaction.color;
          }
          if (!currentOptions.expansions.has(currFaction.expansion)) {
            delete tempFaction.id;
            delete tempFaction.name;
            delete tempFaction.color;
          }
          return tempFaction;
        })
      );
    } else {
      currentOptions.expansions.delete(expansion);
      if (expansion === "THUNDERS EDGE") {
        // Cannot play Twilight's Fall without Thunder's Edge.
        currentOptions.expansions.delete("TWILIGHTS FALL");
      }
      setFactions(
        setupFactions.map((faction, _) => {
          const tempFaction: SetupFaction = { ...faction };
          if (
            !currentOptions.expansions.has("POK") &&
            (tempFaction.color === "Magenta" || tempFaction.color === "Orange")
          ) {
            delete tempFaction.color;
          }
          const currFaction = tempFaction.id
            ? (availableFactions ?? {})[tempFaction.id]
            : undefined;
          if (!currFaction) {
            return tempFaction;
          }
          if (
            currFaction.removedIn &&
            currentOptions.expansions.has(currFaction.removedIn)
          ) {
            delete tempFaction.id;
            delete tempFaction.name;
            delete tempFaction.color;
          }
          if (!currentOptions.expansions.has(currFaction.expansion)) {
            delete tempFaction.id;
            delete tempFaction.name;
            delete tempFaction.color;
          }
          return tempFaction;
        })
      );
      if (!currentOptions.expansions.has("POK")) {
        if (numFactions > 6) {
          updatePlayerCount(6);
        }
      }
    }
    setOptions(currentOptions);
  }

  const maxFactions = options.expansions.has("POK") ? 8 : 6;
  return (
    <React.Fragment>
      <NonGameHeader
        leftSidebar={intl
          .formatMessage({
            id: "9DZz2w",
            description: "Text identifying that this is the setup step.",
            defaultMessage: "Setup Game",
          })
          .toUpperCase()}
        rightSidebar={intl
          .formatMessage({
            id: "9DZz2w",
            description: "Text identifying that this is the setup step.",
            defaultMessage: "Setup Game",
          })
          .toUpperCase()}
        mobileSidebars
      />
      {/* Large Screen */}
      <div className={styles.SetupGrid}>
        <div
          className="flexColumn"
          style={{
            height: "100%",
            justifyContent: "flex-start",
            paddingTop: rem(16),
            gridArea: "opt",
            minHeight: rem(114),
          }}
        >
          <Options
            updatePlayerCount={updatePlayerCount}
            toggleOption={toggleOption}
            toggleExpansion={toggleExpansion}
            toggleEvent={toggleEvent}
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
            events={events}
          />
        </div>
        <div
          className="flexColumn"
          style={{
            gridArea: "left",
            justifyContent: "space-around",
            alignItems: "flex-end",
            height: "100%",
            width: "100%",
          }}
        >
          <div style={{ gridArea: "left-top" }}>
            <FactionSelect
              colors={colors}
              factions={setupFactions}
              position={7}
              numFactions={numFactions}
              speaker={speaker}
              setFaction={updatePlayerFaction}
              setColor={updatePlayerColor}
              setSpeaker={setSpeaker}
              setPlayerName={updatePlayerName}
              setAlliancePartner={updateAlliancePartner}
              options={options}
            />
          </div>
          {numFactions > 3 &&
          !(numFactions === 4 && options["map-style"] === "standard") ? (
            <div style={{ gridArea: "left-mid" }}>
              <FactionSelect
                colors={colors}
                factions={setupFactions}
                position={6}
                numFactions={numFactions}
                speaker={speaker}
                setFaction={updatePlayerFaction}
                setColor={updatePlayerColor}
                setSpeaker={setSpeaker}
                setPlayerName={updatePlayerName}
                setAlliancePartner={updateAlliancePartner}
                options={options}
              />
            </div>
          ) : null}
          {numFactions > 6 ? (
            <div style={{ gridArea: "left-bot" }}>
              <FactionSelect
                colors={colors}
                factions={setupFactions}
                position={5}
                numFactions={numFactions}
                speaker={speaker}
                setFaction={updatePlayerFaction}
                setColor={updatePlayerColor}
                setSpeaker={setSpeaker}
                setPlayerName={updatePlayerName}
                setAlliancePartner={updateAlliancePartner}
                options={options}
              />
            </div>
          ) : null}
        </div>
        <div className="flexColumn" style={{ height: "100%", gridArea: "mid" }}>
          <div
            style={{
              gridArea: "top",
              visibility:
                numFactions > 3 &&
                !(numFactions === 4 && options["map-style"] !== "standard") &&
                !(numFactions === 5 && options["map-style"] !== "warp")
                  ? undefined
                  : "hidden",
            }}
          >
            <FactionSelect
              colors={colors}
              factions={setupFactions}
              position={0}
              numFactions={numFactions}
              speaker={speaker}
              setFaction={updatePlayerFaction}
              setColor={updatePlayerColor}
              setSpeaker={setSpeaker}
              setPlayerName={updatePlayerName}
              setAlliancePartner={updateAlliancePartner}
              options={options}
            />
          </div>
          {/* Map Section */}
          <div
            className="flexColumn"
            style={{
              flexShrink: 0,
              flexGrow: 0,
              position: "relative",
              gridArea: "map",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "min-content 1fr",
                gridAutoFlow: "row",
                fontFamily: "Myriad Pro",
                fontSize: rem(12),
                width: "100%",
                whiteSpace: "nowrap",
                columnGap: rem(8),
                rowGap: rem(4),
                justifyContent: "flex-start",
              }}
            >
              {getMapStyles(numFactions).length > 1 ? (
                <>
                  <div>
                    <FormattedMessage
                      id="ZZ/Lhe"
                      description="A label for a selector for selecting which map style to use."
                      defaultMessage="Map Type"
                    />
                    :
                  </div>
                  <div
                    className="flexRow"
                    style={{ gap: rem(4), justifyContent: "flex-start" }}
                  >
                    {getMapStyles(numFactions).map((style) => {
                      return (
                        <Chip
                          key={style}
                          selected={options["map-style"] === style}
                          toggleFn={() => {
                            toggleOption(style, "map-style");
                            toggleOption(
                              processMapString(
                                options["map-string"],
                                style,
                                numFactions,
                                options.expansions.has("THUNDERS EDGE")
                              ),
                              "processed-map-string"
                            );
                            const factionIds = extractFactionIds(
                              options["map-string"],
                              style,
                              numFactions,
                              options.expansions.has("THUNDERS EDGE")
                            );
                            if (factionIds) {
                              updateAllPlayerFactions(factionIds);
                            }
                          }}
                        >
                          {mapStyleString(style, intl)}
                        </Chip>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ height: rem(20), gridColumn: "1 / 3" }}></div>
              )}
              <div>
                <FormattedMessage
                  id="UJSVtn"
                  description="Label for a textbox used to specify the map string."
                  defaultMessage="Map String"
                />
                :
              </div>
              <input
                placeholder="Map String"
                type="textbox"
                pattern={"((([0-9]{1,4}((A|B)[0-5]?)?)|(P[1-8])|(-1))($|\\s))+"}
                style={{
                  width: "100%",
                  fontSize: rem(12),
                  fontFamily: "Myriad Pro",
                }}
                value={options["map-string"]}
                onChange={(event) => {
                  toggleOption(event.currentTarget.value, "map-string");
                  toggleOption(
                    processMapString(
                      event.currentTarget.value,
                      options["map-style"],
                      numFactions,
                      options.expansions.has("THUNDERS EDGE")
                    ),
                    "processed-map-string"
                  );
                  const factionIds = extractFactionIds(
                    event.currentTarget.value,
                    options["map-style"],
                    numFactions,
                    options.expansions.has("THUNDERS EDGE")
                  );
                  if (factionIds) {
                    updateAllPlayerFactions(factionIds);
                  }
                }}
              ></input>
            </div>
            <div
              style={{ position: "relative", width: rem(420), aspectRatio: 1 }}
            >
              <GameMap
                mapStyle={options["map-style"]}
                mapString={options["processed-map-string"] ?? ""}
                wormholeNexus={
                  options["expansions"].has("POK") ? "A" : undefined
                }
                factions={activeFactions}
                hideLegend
                hideFracture
                expansions={Array.from(options.expansions)}
              />
            </div>
          </div>
          <div
            style={{
              gridArea: "bot",
              visibility:
                !(numFactions === 4 && options["map-style"] !== "standard") &&
                !(numFactions === 5 && options["map-style"] === "warp") &&
                !(numFactions === 7 && options["map-style"] !== "warp")
                  ? undefined
                  : "hidden",
            }}
          >
            <FactionSelect
              colors={colors}
              factions={setupFactions}
              position={4}
              numFactions={numFactions}
              speaker={speaker}
              setFaction={updatePlayerFaction}
              setColor={updatePlayerColor}
              setSpeaker={setSpeaker}
              setPlayerName={updatePlayerName}
              setAlliancePartner={updateAlliancePartner}
              options={options}
            />
          </div>
        </div>
        {/* Randomize Section */}
        <div
          className="flexColumn"
          style={{
            gridArea: "rand",
            justifyContent: "flex-start",
            height: "100%",
            paddingTop: rem(16),
            minHeight: rem(114),
          }}
        >
          <LabeledDiv
            label={
              <FormattedMessage
                id="x42AMg"
                description="Label for a section that involves randomly selecting things."
                defaultMessage="Randomize"
              />
            }
          >
            <div
              className="flexRow"
              style={{ whiteSpace: "nowrap", minWidth: rem(200) }}
            >
              <button style={{ textAlign: "center" }} onClick={randomSpeaker}>
                <Strings.Speaker />
              </button>
              <button
                style={{ textAlign: "center" }}
                onClick={randomFactions}
                disabled={disableRandomizeFactionButton()}
              >
                <FormattedMessage
                  id="r2htpd"
                  description="Text on a button that will randomize factions."
                  defaultMessage="Factions"
                />
              </button>
            </div>
          </LabeledDiv>
          <button onClick={reset}>
            <FormattedMessage
              id="tocXJ4"
              description="Text on a button that will reset selections."
              defaultMessage="Reset"
            />
          </button>
        </div>
        <div
          className="flexColumn"
          style={{
            gridArea: "right",
            justifyContent: "space-around",
            height: "100%",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <div style={{ gridArea: "right-top" }}>
            <FactionSelect
              colors={colors}
              factions={setupFactions}
              position={1}
              numFactions={numFactions}
              speaker={speaker}
              setFaction={updatePlayerFaction}
              setColor={updatePlayerColor}
              setSpeaker={setSpeaker}
              setPlayerName={updatePlayerName}
              setAlliancePartner={updateAlliancePartner}
              options={options}
            />
          </div>
          {numFactions > 3 &&
          !(numFactions === 4 && options["map-style"] === "standard") ? (
            <div style={{ gridArea: "right-mid" }}>
              <FactionSelect
                colors={colors}
                factions={setupFactions}
                position={2}
                numFactions={numFactions}
                speaker={speaker}
                setFaction={updatePlayerFaction}
                setColor={updatePlayerColor}
                setSpeaker={setSpeaker}
                setPlayerName={updatePlayerName}
                setAlliancePartner={updateAlliancePartner}
                options={options}
              />
            </div>
          ) : null}
          {(numFactions > 6 && options["map-style"] === "standard") ||
          numFactions > 7 ? (
            <div style={{ gridArea: "right-bot" }}>
              <FactionSelect
                colors={colors}
                factions={setupFactions}
                position={3}
                numFactions={numFactions}
                speaker={speaker}
                setFaction={updatePlayerFaction}
                setColor={updatePlayerColor}
                setSpeaker={setSpeaker}
                setPlayerName={updatePlayerName}
                setAlliancePartner={updateAlliancePartner}
                options={options}
              />
            </div>
          ) : null}
        </div>
        {/* Start Game Section */}
        <div
          className="flexColumn"
          style={{ width: "100%", gridArea: "start", minHeight: rem(114) }}
        >
          <div className="flexRow">
            Speaker:
            <FactionSelectRadialMenu
              selectedFaction={setupFactions[speaker]?.id}
              borderColor={convertToFactionColor(setupFactions[speaker]?.color)}
              size={36}
              invalidFactions={
                setupFactions[speaker]?.id ? [setupFactions[speaker].id] : []
              }
              factions={setupFactions
                .filter((faction) => !!faction.id)
                .map((faction) => faction.id as FactionId)}
              onSelect={(factionId) => {
                const index = setupFactions.findIndex(
                  (faction) => faction.id === factionId
                );
                setSpeaker(index);
              }}
            />
          </div>
          <div className="flexRow">
            <InfoRow
              infoTitle="Password Protection"
              infoContent={
                <div>
                  Only users that have entered the password will be able to make
                  changes.
                  <br />
                  <br />
                  Once the game is started, it is not possible to change the
                  password.
                </div>
              }
            >
              <input
                id="password"
                type="textbox"
                placeholder="Password (optional)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </InfoRow>
          </div>
          <button
            style={{
              fontSize: rem(40),
              fontFamily: "Slider",
              color: creatingGame ? "var(--disabled-bg)" : undefined,
              position: "relative",
            }}
            onClick={startGame}
            disabled={disableNextButton()}
          >
            <FormattedMessage
              id="lYD2yu"
              description="Text on a button that will start a game."
              defaultMessage="Start Game"
            />
            {creatingGame ? (
              <div
                className="flexColumn"
                style={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: 1,
                    height: "80%",
                    opacity: 0.5,
                    animation: "spin 2s linear infinite",
                  }}
                >
                  <SiteLogo />
                </div>
              </div>
            ) : null}
          </button>
          {!creatingGame && disableNextButton() ? (
            <div
              className="flexColumn centered"
              style={{
                color: "firebrick",
                maxWidth: rem(240),
                fontFamily: "Myriad Pro",
              }}
            >
              <FormattedMessage
                id="LYA+Dm"
                description="Error message explaining that all factions and colors need to be selected."
                defaultMessage="Select all factions and colors"
              />
              {options["game-variant"].startsWith("alliance")
                ? " and alliance partners"
                : ""}
            </div>
          ) : null}
        </div>
      </div>
      {/* Mobile Screen */}
      <div
        className="flexColumn mobileOnly"
        style={{
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="flexColumn"
          style={{
            alignItems: "flex-start",
            gap: rem(8),
            width: "100%",
            justifyContent: "flex-start",
            paddingBottom: rem(8),
          }}
        >
          <MobileOptions
            updatePlayerCount={updatePlayerCount}
            toggleOption={toggleOption}
            toggleExpansion={toggleExpansion}
            toggleEvent={toggleEvent}
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
            reset={reset}
            events={events}
          />
          {setupFactions.map((_, index) => {
            if (index >= numFactions) {
              return null;
            }
            return (
              <FactionSelect
                key={index}
                colors={colors}
                factions={setupFactions}
                position={index}
                numFactions={numFactions}
                mobile={true}
                speaker={speaker}
                setFaction={updatePlayerFaction}
                setColor={updatePlayerColor}
                setSpeaker={setSpeaker}
                setPlayerName={updatePlayerName}
                setAlliancePartner={updateAlliancePartner}
                options={options}
              />
            );
          })}
          <div className="flexColumn" style={{ width: "fit-content" }}>
            <LabeledDiv label="Randomize">
              <div
                className="flexRow"
                style={{ whiteSpace: "nowrap", width: "100%" }}
              >
                <button style={{ textAlign: "center" }} onClick={randomSpeaker}>
                  <Strings.Speaker />
                </button>
                <button
                  style={{ textAlign: "center" }}
                  onClick={randomFactions}
                  disabled={disableRandomizeFactionButton()}
                >
                  Factions
                </button>
              </div>
            </LabeledDiv>

            {/* </div> */}
          </div>
          <div className="flexColumn" style={{ width: "100%" }}>
            <div className="flexRow">
              Speaker:
              <FactionSelectRadialMenu
                selectedFaction={setupFactions[speaker]?.id}
                borderColor={convertToFactionColor(
                  setupFactions[speaker]?.color
                )}
                size={36}
                invalidFactions={
                  setupFactions[speaker]?.id ? [setupFactions[speaker].id] : []
                }
                factions={setupFactions
                  .filter((faction) => !!faction.id)
                  .map((faction) => faction.id as FactionId)}
                onSelect={(factionId) => {
                  const index = setupFactions.findIndex(
                    (faction) => faction.id === factionId
                  );
                  setSpeaker(index);
                }}
              />
            </div>
            <div className="flexRow">
              <InfoRow
                infoTitle="Password Protection"
                infoContent={
                  <div>
                    Only users that have entered the password will be able to
                    make changes.
                    <br />
                    <br />
                    Once the game is started, it is not possible to change the
                    password.
                  </div>
                }
              >
                <input
                  id="password"
                  type="textbox"
                  placeholder="Password (optional)"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InfoRow>
            </div>
            <button
              style={{
                fontSize: rem(40),
                fontFamily: "Slider",
                color: creatingGame ? "var(--disabled-bg)" : undefined,
                position: "relative",
              }}
              onClick={startGame}
              disabled={disableNextButton()}
            >
              <FormattedMessage
                id="lYD2yu"
                description="Text on a button that will start a game."
                defaultMessage="Start Game"
              />
              {creatingGame ? (
                <div
                  className="flexColumn"
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: 1,
                      height: "80%",
                      opacity: 0.5,
                      animation: "spin 2s linear infinite",
                    }}
                  >
                    <SiteLogo />
                  </div>
                </div>
              ) : null}
            </button>
            {!creatingGame && disableNextButton() ? (
              <div
                className="flexColumn centered"
                style={{ color: "firebrick", maxWidth: rem(240) }}
              >
                Select all factions and colors
                {options["game-variant"].startsWith("alliance")
                  ? " and alliance partners"
                  : ""}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
