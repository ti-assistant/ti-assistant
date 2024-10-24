"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getBaseFactions } from "../../server/data/factions";
import { ClientOnlyHoverMenu } from "../../src/HoverMenu";
import { Loader } from "../../src/Loader";
import { SelectableRow } from "../../src/SelectableRow";
import Chip from "../../src/components/Chip/Chip";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import Map from "../../src/components/Map/Map";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import NumberInput from "../../src/components/NumberInput/NumberInput";
import ResponsiveLogo from "../../src/components/ResponsiveLogo/ResponsiveLogo";
import Toggle from "../../src/components/Toggle/Toggle";
import { Strings } from "../../src/components/strings";
import { convertToFactionColor } from "../../src/util/factions";
import { mapStyleString } from "../../src/util/strings";
import { Optional } from "../../src/util/types/types";
import { objectEntries, rem } from "../../src/util/util";
import styles from "./setup.module.scss";
import { extractFactionIds, processMapString } from "../../src/util/map";

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
  options: SetupOptions;
  numFactions: number;
  maxFactions: number;
}

function createOptions(setupOptions: SetupOptions) {
  const expansions = Array.from(setupOptions.expansions);
  const optionsToSend: Options = {
    ...setupOptions,
    expansions: expansions,
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
  options,
  numFactions,
  maxFactions,
  reset,
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
              fontSize={16}
              toggleFn={() => updatePlayerCount(number)}
            >
              {number}
            </Chip>
          );
        })}
      </div>
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
              <div className="flexRow" style={{ alignItems: "flex-start" }}>
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
                    &
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
              <div className="flexColumn" style={{ alignItems: "flex-start" }}>
                <FormattedMessage
                  id="2jNcVD"
                  description="A label for a selector specifying which expansions should be enabled."
                  defaultMessage="Expansions:"
                />
                <div
                  className={styles.Expansions}
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: `0 ${rem(20)}`,
                  }}
                >
                  <Toggle
                    selected={options.expansions.has("POK")}
                    toggleFn={(prevValue) => {
                      toggleExpansion(!prevValue, "POK");
                    }}
                  >
                    <Strings.Expansion expansion="POK" />
                  </Toggle>
                  <Toggle
                    selected={options.expansions.has("CODEX ONE")}
                    toggleFn={(prevValue) => {
                      toggleExpansion(!prevValue, "CODEX ONE");
                    }}
                  >
                    <Strings.Expansion expansion="CODEX ONE" />
                  </Toggle>
                  <Toggle
                    selected={options.expansions.has("CODEX TWO")}
                    toggleFn={(prevValue) => {
                      toggleExpansion(!prevValue, "CODEX TWO");
                    }}
                  >
                    <Strings.Expansion expansion="CODEX TWO" />
                  </Toggle>
                  <Toggle
                    selected={options.expansions.has("CODEX THREE")}
                    toggleFn={(prevValue) => {
                      toggleExpansion(!prevValue, "CODEX THREE");
                    }}
                  >
                    <Strings.Expansion expansion="CODEX THREE" />
                  </Toggle>
                </div>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    alignItems: "flex-start",
                    padding: `0 ${rem(20)}`,
                  }}
                >
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
              </div>
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
                                    numFactions
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
                          numFactions
                        ),
                        "processed-map-string"
                      );
                    }}
                  ></input>
                </div>
              </div>
              <div>
                Scenarios:
                <div
                  className="flexRow"
                  style={{
                    alignItems: "flex-start",
                    padding: `${rem(8)} ${rem(20)}`,
                  }}
                >
                  <Toggle
                    selected={options.scenario === "AGE_OF_EXPLORATION"}
                    toggleFn={(prevValue) => {
                      if (prevValue) {
                        toggleOption(undefined, "scenario");
                      } else {
                        toggleOption("AGE_OF_EXPLORATION", "scenario");
                      }
                    }}
                  >
                    <FormattedMessage
                      id="sZua2x"
                      defaultMessage="Age of Exploration"
                      description="Name of scenario in which players can add new tiles to the map."
                    />
                  </Toggle>
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
  options,
  numFactions,
  maxFactions,
}: OptionsProps) {
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

  let defaultVPs = [10, 14];
  let otherDefault = 12;
  if (options["game-variant"] === "alliance-combined") {
    defaultVPs = [20, 22, 24];
    otherDefault = 26;
  }

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
                id="2jNcVD"
                description="A label for a selector specifying which expansions should be enabled."
                defaultMessage="Expansions:"
              />
              <div
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  padding: `0 ${rem(16)}`,
                }}
              >
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
                </Toggle>
                <Toggle
                  selected={options.expansions.has("CODEX ONE")}
                  toggleFn={(prevValue) => {
                    toggleExpansion(!prevValue, "CODEX ONE");
                  }}
                >
                  <FormattedMessage
                    id="3Taw9H"
                    description="Text on a button that will enable/disable Codex I."
                    defaultMessage="Codex I"
                  />
                </Toggle>
                <Toggle
                  selected={options.expansions.has("CODEX TWO")}
                  toggleFn={(prevValue) => {
                    toggleExpansion(!prevValue, "CODEX TWO");
                  }}
                >
                  <FormattedMessage
                    id="knYKVl"
                    description="Text on a button that will enable/disable Codex II."
                    defaultMessage="Codex II"
                  />
                </Toggle>
                <Toggle
                  selected={options.expansions.has("CODEX THREE")}
                  toggleFn={(prevValue) => {
                    toggleExpansion(!prevValue, "CODEX THREE");
                  }}
                >
                  <FormattedMessage
                    id="zXrdrP"
                    description="Text on a button that will enable/disable Codex III."
                    defaultMessage="Codex III"
                  />
                </Toggle>
              </div>
              <div
                className="flexColumn mediumFont"
                style={{
                  alignItems: "flex-start",
                  padding: `0 ${rem(16)}`,
                }}
              >
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
            </div>
            <div>
              Scenarios:
              <div
                className="flexRow"
                style={{
                  alignItems: "flex-start",
                  padding: `${rem(8)} ${rem(20)}`,
                }}
              >
                <Toggle
                  selected={options.scenario === "AGE_OF_EXPLORATION"}
                  toggleFn={(prevValue) => {
                    if (prevValue) {
                      toggleOption(undefined, "scenario");
                    } else {
                      toggleOption("AGE_OF_EXPLORATION", "scenario");
                    }
                  }}
                >
                  <FormattedMessage
                    id="sZua2x"
                    defaultMessage="Age of Exploration"
                    description="Name of scenario in which players can add new tiles to the map."
                  />
                </Toggle>
              </div>
            </div>
            {variants.length > 1 ? (
              <div>
                Variants (WIP):
                <div
                  className="flexRow"
                  style={{
                    alignItems: "flex-start",
                    padding: `${rem(8)} ${rem(20)}`,
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
          return 3;
        case 6:
          return 2;
        case 0:
          return 0;
        case 1:
          return standard ? 1 : 0;
        case 2:
          return 1;
        case 4:
          return 2;
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
  const availableFactions = getBaseFactions(intl);

  const factionIndex = mobile
    ? position
    : getFactionIndex(numFactions, position, options);
  const faction = factions[factionIndex] ?? {};
  const playerName = faction.playerName;
  const currentNameRef = nameRef?.current;
  useEffect(() => {
    if (currentNameRef && !playerName) {
      currentNameRef.value = intl.formatMessage({
        id: "4n1LQO",
        description: "Initial text in a textbox used to input a player's name",
        defaultMessage: "Enter Player Name...",
      });
    }
  }, [playerName, currentNameRef, intl]);

  const isSpeaker = speaker === factionIndex;

  const filteredFactions = Object.values(availableFactions ?? {}).filter(
    (faction) => {
      if (faction.expansion === "BASE") {
        return true;
      }
      if (!options.expansions.has(faction.expansion)) {
        return false;
      }
      return true;
    }
  );
  const filteredColors = colors.filter((color) => {
    if (color === "Magenta" || color === "Orange") {
      if (!options.expansions.has("POK")) {
        return false;
      }
    }
    return true;
  });

  const selectedFactions = factions
    .filter((faction, index) => !!faction.id && index < numFactions)
    .map((faction) => faction.id as FactionId);

  function selectFaction(factionId: Optional<FactionId>) {
    if (factionIndex == undefined) {
      return;
    }
    setFaction(factionIndex, factionId);
  }

  function selectColor(color: Optional<string>) {
    if (factionIndex == undefined) {
      return;
    }
    setColor(factionIndex, color);
  }

  function savePlayerName(element: HTMLInputElement) {
    if (factionIndex == undefined) {
      return;
    }
    if (element.value !== "" && !element.value.includes("Player")) {
      setPlayerName(factionIndex, element.value);
    } else {
      const faction = factions[factionIndex];
      if (!faction) {
        return;
      }
      element.value =
        faction.playerName ??
        intl.formatMessage({
          id: "4n1LQO",
          description:
            "Initial text in a textbox used to input a player's name",
          defaultMessage: "Enter Player Name...",
        });
    }
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

  const label = (
    <input
      ref={nameRef}
      tabIndex={position + 1}
      type="textbox"
      spellCheck={false}
      defaultValue={intl.formatMessage({
        id: "4n1LQO",
        description: "Initial text in a textbox used to input a player's name",
        defaultMessage: "Enter Player Name...",
      })}
      style={{
        fontFamily: "Slider",
        borderColor: factionColor,
        fontSize: rem(13.33),
      }}
      onFocus={(e) => (e.currentTarget.value = "")}
      onClick={(e) => (e.currentTarget.value = "")}
      onBlur={(e) => savePlayerName(e.currentTarget)}
    />
  );

  const selectedColors = factions.map((faction) => faction.color);

  return (
    <LabeledDiv
      label={label}
      rightLabel={isSpeaker ? <Strings.Speaker /> : undefined}
      color={factionColor}
      style={{ width: mobile ? "100%" : "22vw" }}
    >
      {faction.id ? (
        <div
          className="flexColumn"
          style={{
            position: "absolute",
            opacity: 0.5,
            left: 0,
            width: "100%",
            zIndex: -1,
          }}
        >
          <FactionIcon factionId={faction.id} size={mobile ? 52 : 80} />
        </div>
      ) : null}
      <div
        className="flexColumn"
        style={{
          width: "100%",
          alignItems: "flex-start",
          whiteSpace: "nowrap",
          gap: rem(4),
          padding: rem(8),
          boxSizing: "border-box",
        }}
      >
        <div
          className={mobile ? "flexRow largeFont" : "flexColumn largeFont"}
          style={{
            whiteSpace: "pre-line",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            className="flexRow"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            {faction.id ? (
              <SelectableRow
                itemId={availableFactions[faction.id].name}
                removeItem={() => selectFaction(undefined)}
                style={{ height: rem(32.67) }}
              >
                {availableFactions[faction.id].name}
                <SetupFactionPanel
                  faction={availableFactions[faction.id]}
                  options={createOptions(options)}
                />
              </SelectableRow>
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
                    gridTemplateRows: "repeat(10, minmax(0, 1fr))",
                    gap: rem(4),
                    padding: rem(8),
                    maxWidth: `min(80vw, ${rem(750)})`,
                    overflowX: "auto",
                  }}
                >
                  {filteredFactions.map((faction) => {
                    return (
                      <button
                        key={faction.id}
                        className={`flexRow ${
                          selectedFactions.includes(faction.id) ? "faded" : ""
                        }`}
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          fontSize: rem(16),
                        }}
                        onClick={() => selectFaction(faction.id)}
                      >
                        <FactionIcon factionId={faction.id} size={20} />
                        {faction.name}
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
          <div
            className="flexRow"
            style={{
              width: mobile ? "auto" : "100%",
              justifyContent: "space-between",
            }}
          >
            <ClientOnlyHoverMenu
              label={
                <FormattedMessage
                  id="Lm8L7/"
                  description="Text on a hover menu for picking a player's color."
                  defaultMessage="Color"
                />
              }
              renderProps={(closeFn) => {
                return (
                  <div
                    className="flexRow"
                    style={{
                      padding: `${rem(8)}`,
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(3, auto)",
                      overflowX: "auto",
                      gap: `${rem(4)}`,
                      justifyContent: "flex-start",
                    }}
                  >
                    {filteredColors.map((color) => {
                      const factionColor = convertToFactionColor(color);
                      const alreadySelected = selectedColors.includes(color);
                      return (
                        <button
                          key={color}
                          style={{
                            width: rem(60),
                            backgroundColor: factionColor,
                            color: factionColor,
                            height: rem(22),
                            opacity:
                              faction.color !== color && alreadySelected
                                ? 0.25
                                : undefined,
                          }}
                          className={faction.color === color ? "selected" : ""}
                          onClick={() => {
                            closeFn();
                            selectColor(color);
                          }}
                        ></button>
                      );
                    })}
                  </div>
                );
              }}
            ></ClientOnlyHoverMenu>
            {mobile || isSpeaker ? null : (
              <button onClick={() => setSpeaker(factionIndex)}>
                <FormattedMessage
                  id="JS92Jj"
                  description="Text on a button that will make a faction the speaker."
                  defaultMessage="Make Speaker"
                />
              </button>
            )}
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
  ]),
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
}: {
  factions: Record<FactionId, BaseFaction>;
  colors: string[];
}) {
  const [speaker, setSpeaker] = useState(0);
  const [setupFactions, setFactions] = useState([...INITIAL_FACTIONS]);
  const [options, setOptions] = useState<SetupOptions>({
    ...INITIAL_OPTIONS,
    expansions: new Set(INITIAL_OPTIONS.expansions),
  });
  const [numFactions, setNumFactions] = useState(6);
  const [creatingGame, setCreatingGame] = useState(false);

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
      processMapString(options["map-string"], "standard", count),
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
      if (faction.color) {
        usedColors.add(faction.color);
        selectedColors[index] = faction.color;
      }
    }
    const filteredFactions = Object.values(availableFactions ?? {}).filter(
      (faction) => {
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

    const expansions = Array.from(options.expansions);
    const optionsToSend: Options = {
      ...options,
      expansions: expansions,
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

  function toggleExpansion(value: boolean, expansion: Expansion) {
    const currentOptions = { ...options };
    if (value) {
      currentOptions.expansions.add(expansion);
    } else {
      currentOptions.expansions.delete(expansion);
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
          if (!currFaction || currFaction.expansion === "BASE") {
            return tempFaction;
          }
          if (!currentOptions.expansions.has(currFaction.expansion)) {
            delete tempFaction.id;
            delete tempFaction.name;
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

  function getGridTemplateAreas() {
    let gapLine = `". map ."`;
    switch (numFactions) {
      case 3:
        return `"opt top rand"
        "opt map ."
        ${gapLine}
        "left-top map right-top"
        ${gapLine}
        ${gapLine}
        ${gapLine}
        ${gapLine}
        "trac bot start"`;
      case 4:
        if (options["map-style"] === "standard") {
          return `"opt top rand"
              "opt map ."
              ${gapLine}
              ". map right-top"
              "left-top map right-top"
              "left-top map ."
              ${gapLine}
              "trac bot start"`;
        }
      // Fall-through
      case 5:
      case 6:
        return `"opt top rand"
        "opt map ."
        ${gapLine}
        "left-top map right-top"
        ${gapLine}
        "left-mid map right-mid"
        ${gapLine}
        "trac bot start"`;
      case 7:
        if (options["map-style"] === "warp") {
          return `"opt top rand"
          "opt map ."
          "left-top map ."
          "left-top map right-top"
          "left-mid map right-top"
          "left-mid map right-mid"
          "left-bot map right-mid"
          "left-bot map ."
          "trac bot start"`;
        }
      // Fall-through
      case 8:
        return `"opt top rand"
        "opt map ."
        "left-top map right-top"
        "left-mid map right-mid"
        "left-bot map right-bot"
        "trac bot start"`;
    }
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
      <div
        className={`${styles.SetupGrid} nonMobile`}
        style={{
          gridTemplateAreas: getGridTemplateAreas(),
        }}
      >
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
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
          />
        </div>
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
        {numFactions > 3 &&
        !(numFactions === 4 && options["map-style"] !== "standard") &&
        !(numFactions === 5 && options["map-style"] !== "warp") ? (
          <div style={{ gridArea: "top" }}>
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
        ) : null}
        {/* Map Section */}
        <div
          className="flexColumn"
          style={{
            flexShrink: 0,
            flexGrow: 0,
            position: "relative",
            width: rem(360),
            aspectRatio: 1,
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
                              numFactions
                            ),
                            "processed-map-string"
                          );
                          const factionIds = extractFactionIds(
                            options["map-string"],
                            style,
                            numFactions
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
              style={{ width: "100%", fontSize: rem(12) }}
              value={options["map-string"]}
              onChange={(event) => {
                toggleOption(event.currentTarget.value, "map-string");
                toggleOption(
                  processMapString(
                    event.currentTarget.value,
                    options["map-style"],
                    numFactions
                  ),
                  "processed-map-string"
                );
                const factionIds = extractFactionIds(
                  event.currentTarget.value,
                  options["map-style"],
                  numFactions
                );
                if (factionIds) {
                  updateAllPlayerFactions(factionIds);
                }
              }}
            ></input>
          </div>
          <Map
            mapStyle={options["map-style"]}
            mapString={options["processed-map-string"] ?? ""}
            mallice={options["expansions"].has("POK") ? "A" : undefined}
            factions={activeFactions}
          />
        </div>
        {!(numFactions === 4 && options["map-style"] !== "standard") &&
        !(numFactions === 5 && options["map-style"] === "warp") &&
        !(numFactions === 7 && options["map-style"] !== "warp") ? (
          <div style={{ gridArea: "bot" }}>
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
        ) : null}
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
        {/* Start Game Section */}
        <div
          className="flexColumn"
          style={{ width: "100%", gridArea: "start", minHeight: rem(114) }}
        >
          <button
            style={{
              fontSize: rem(40),
              fontFamily: "Slider",
              color: creatingGame ? "#222" : undefined,
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
                  <ResponsiveLogo size="100%" />
                </div>
              </div>
            ) : null}
          </button>
          {!creatingGame && disableNextButton() ? (
            <div
              className="flexColumn centered"
              style={{ color: "firebrick", maxWidth: rem(240) }}
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
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
            reset={reset}
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
            <button
              style={{
                fontSize: rem(40),
                fontFamily: "Slider",
              }}
              onClick={startGame}
              disabled={disableNextButton()}
            >
              {creatingGame ? <Loader /> : "Start Game"}
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
