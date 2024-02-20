"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getBaseFactions } from "../../server/data/factions";
import { ClientOnlyHoverMenu } from "../../src/HoverMenu";
import { Loader } from "../../src/Loader";
import { SelectableRow } from "../../src/SelectableRow";
import FactionIcon from "../../src/components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import Map from "../../src/components/Map/Map";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import ResponsiveLogo from "../../src/components/ResponsiveLogo/ResponsiveLogo";
import { Strings } from "../../src/components/strings";
import { convertToFactionColor } from "../../src/util/factions";
import { mapStyleString } from "../../src/util/strings";
import styles from "./setup.module.scss";
import dynamic from "next/dynamic";
import Circle from "../../src/components/Circle/Circle";
import TechSkipIcon from "../../src/components/TechSkipIcon/TechSkipIcon";
import ToggleTag from "../../src/components/ToggleTag/ToggleTag";
import { CustomSizeResources, FullResources } from "../../src/Resources";
import Image from "next/image";

const SetupFactionPanel = dynamic(
  () => import("../../src/components/SetupFactionPanel"),
  {
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
  isCouncil: boolean;
}

function createOptions(setupOptions: SetupOptions) {
  const expansions = Array.from(setupOptions.expansions);
  const optionsToSend: Options = {
    ...setupOptions,
    expansions: expansions,
  };
  return optionsToSend;
}

function MobileOptions({
  updatePlayerCount,
  toggleOption,
  toggleExpansion,
  options,
  numFactions,
  maxFactions,
  isCouncil,
}: OptionsProps) {
  const mapStringRef = useRef<HTMLInputElement>(null);
  const otherPointsRef = useRef<HTMLDivElement>(null);
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
      <div className="flexRow">
        {[...Array(maxFactions - 2)].map((e, index) => {
          const number = index + 3;
          return (
            <button
              key={number}
              onClick={() => updatePlayerCount(number)}
              className={numFactions === number ? "selected" : ""}
            >
              {number}
            </button>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "flex-start" }}
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
          <div style={{ width: "90vw", overflowX: "scroll" }}>
            <div
              className="flexColumn"
              style={{
                alignItems: "flex-start",
                padding: `${"8px"} ${"16px"} 0 ${"16px"}`,
              }}
            >
              <div className="flexColumn" style={{ alignItems: "flex-start" }}>
                <FormattedMessage
                  id="R06tnh"
                  description="A label for a selector specifying the number of victory points required."
                  defaultMessage="Victory Points"
                />
                :
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "flex-start",
                    padding: `0 ${"20px"}`,
                  }}
                >
                  <button
                    className={
                      options["victory-points"] === 10 ? "selected" : ""
                    }
                    onClick={() => {
                      toggleOption(10, "victory-points");
                    }}
                  >
                    10
                  </button>
                  <button
                    className={
                      options["victory-points"] === 14 ? "selected" : ""
                    }
                    onClick={() => {
                      toggleOption(14, "victory-points");
                    }}
                  >
                    14
                  </button>
                  <button
                    className={
                      options["victory-points"] !== 14 &&
                      options["victory-points"] !== 10
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      toggleOption(
                        parseInt(otherPointsRef.current?.innerText ?? "10"),
                        "victory-points"
                      );
                    }}
                  >
                    <FormattedMessage
                      id="sgqLYB"
                      description="Text on a button used to select a non-listed value"
                      defaultMessage="Other"
                    />
                  </button>
                  <div
                    ref={otherPointsRef}
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onClick={(e) => (e.currentTarget.innerText = "")}
                    onBlur={(e) => {
                      const victoryPoints = parseInt(e.target.innerText);
                      if (isNaN(victoryPoints) || victoryPoints <= 0) {
                        if (
                          options["victory-points"] !== 10 &&
                          options["victory-points"] !== 14
                        ) {
                          e.currentTarget.innerText =
                            options["victory-points"].toString();
                        } else {
                          e.currentTarget.innerText = "12";
                        }
                      } else {
                        toggleOption(victoryPoints, "victory-points");
                        e.currentTarget.innerText = victoryPoints.toString();
                      }
                    }}
                  >
                    12
                  </div>
                </div>
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
                    padding: `0 ${"20px"}`,
                  }}
                >
                  <button
                    className={options.expansions.has("POK") ? "selected" : ""}
                    onClick={() =>
                      toggleExpansion(!options.expansions.has("POK"), "POK")
                    }
                  >
                    <FormattedMessage
                      id="p9XVGB"
                      description="Text on a button that will enable/disable the Prophecy of Kings expansion."
                      defaultMessage="Prophecy of Kings"
                    />
                  </button>
                  <button
                    className={
                      options.expansions.has("CODEX ONE") ? "selected" : ""
                    }
                    onClick={() =>
                      toggleExpansion(
                        !options.expansions.has("CODEX ONE"),
                        "CODEX ONE"
                      )
                    }
                  >
                    <FormattedMessage
                      id="3Taw9H"
                      description="Text on a button that will enable/disable Codex I."
                      defaultMessage="Codex I"
                    />
                  </button>
                  <button
                    className={
                      options.expansions.has("CODEX TWO") ? "selected" : ""
                    }
                    onClick={() =>
                      toggleExpansion(
                        !options.expansions.has("CODEX TWO"),
                        "CODEX TWO"
                      )
                    }
                  >
                    <FormattedMessage
                      id="knYKVl"
                      description="Text on a button that will enable/disable Codex II."
                      defaultMessage="Codex II"
                    />
                  </button>
                  <button
                    className={
                      options.expansions.has("CODEX THREE") ? "selected" : ""
                    }
                    onClick={() =>
                      toggleExpansion(
                        !options.expansions.has("CODEX THREE"),
                        "CODEX THREE"
                      )
                    }
                  >
                    <FormattedMessage
                      id="zXrdrP"
                      description="Text on a button that will enable/disable Codex III."
                      defaultMessage="Codex III"
                    />
                  </button>
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
                    padding: `8px 16px`,
                    alignItems: "flex-start",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {mapStyles.length > 1 ? (
                    <React.Fragment>
                      <FormattedMessage
                        id="ZZ/Lhe"
                        description="A label for a selector for selecting which map style to use."
                        defaultMessage="Map Type:"
                      />
                      <div
                        className="flexRow"
                        style={{ paddingLeft: `${"16px"}` }}
                      >
                        {mapStyles.map((style) => {
                          return (
                            <button
                              key={style}
                              className={
                                options["map-style"] === style ? "selected" : ""
                              }
                              onClick={() => toggleOption(style, "map-style")}
                            >
                              {mapStyleString(style, intl)}
                            </button>
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
                  <span className="smallFont" style={{ paddingLeft: "4px" }}>
                    <FormattedMessage
                      id="zjv9Gr"
                      description="Part of a label explaining what the map string does."
                      defaultMessage="(filters out non-claimable planets)"
                    />
                  </span>
                  :
                  <input
                    ref={mapStringRef}
                    type="textbox"
                    className="mediumFont"
                    style={{ width: "100%" }}
                    onChange={(event) =>
                      toggleOption(event.currentTarget.value, "map-string")
                    }
                  ></input>
                </div>
              </div>
              {/* {isCouncil ? (
                <div>
                  Council Keleres:
                  <div
                    className="flexColumn"
                    style={{
                      alignItems: "flex-start",
                      padding: `8px 20px`,
                    }}
                  >
                    <button
                      className={
                        options["allow-double-council"] ? "selected" : ""
                      }
                      onClick={() =>
                        toggleOption(
                          !options["allow-double-council"],
                          "allow-double-council"
                        )
                      }
                    >
                      Allow selecting a duplicate sub-faction
                    </button>
                  </div>
                </div>
              ) : null} */}
            </div>
          </div>
        </ClientOnlyHoverMenu>
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
  isCouncil,
}: OptionsProps) {
  const mapStringRef = useRef<HTMLInputElement>(null);
  const otherPointsRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();

  const mapString = options["map-string"];

  useEffect(() => {
    if (mapStringRef.current && mapString === "") {
      mapStringRef.current.value = "";
    }
  }, [mapString]);

  let mapStyles: MapStyle[] = [];
  let variants: GameVariant[] = [];
  switch (numFactions) {
    case 3:
      mapStyles = ["standard"];
      variants = ["normal"];
      break;
    case 4:
      mapStyles = ["standard", "warp", "skinny"];
      variants = ["normal", "alliance-separate", "alliance-combined"];
      break;
    case 5:
      mapStyles = ["standard", "warp", "skinny"];
      variants = ["normal"];
      break;
    case 6:
      mapStyles = ["standard", "large"];
      variants = ["normal", "alliance-separate", "alliance-combined"];
      break;
    case 7:
      mapStyles = ["standard", "warp"];
      variants = ["normal"];
      break;
    case 8:
      mapStyles = ["standard", "warp"];
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
    <div className="flexColumn">
      <label>
        <FormattedMessage
          id="Jh0WRk"
          defaultMessage="Player Count"
          description="Label for a selector to change the number of players"
        />
      </label>
      <div className="flexRow">
        {[...Array(maxFactions - 2)].map((e, index) => {
          const number = index + 3;
          return (
            <button
              key={number}
              onClick={() => updatePlayerCount(number)}
              className={numFactions === number ? "selected" : ""}
            >
              {number}
            </button>
          );
        })}
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
              padding: `${"8px"} ${"16px"} 0 ${"16px"}`,
            }}
          >
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              <FormattedMessage
                id="R06tnh"
                description="A label for a selector specifying the number of victory points required."
                defaultMessage="Victory Points"
              />
              :
              <div
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  padding: `0 ${"20px"}`,
                }}
              >
                {defaultVPs.map((VPs, index) => {
                  return (
                    <button
                      key={index}
                      className={
                        options["victory-points"] === VPs ? "selected" : ""
                      }
                      onClick={() => {
                        toggleOption(VPs, "victory-points");
                      }}
                    >
                      {VPs}
                    </button>
                  );
                })}
                <button
                  className={
                    !defaultVPs.includes(options["victory-points"])
                      ? "selected"
                      : ""
                  }
                  onClick={() => {
                    toggleOption(
                      parseInt(otherPointsRef.current?.innerText ?? "10"),
                      "victory-points"
                    );
                  }}
                >
                  <FormattedMessage
                    id="sgqLYB"
                    description="Text on a button used to select a non-listed value"
                    defaultMessage="Other"
                  />
                </button>
                <div
                  ref={otherPointsRef}
                  spellCheck={false}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onClick={(e) => (e.currentTarget.innerText = "")}
                  onBlur={(e) => {
                    const victoryPoints = parseInt(e.target.innerText);
                    if (isNaN(victoryPoints) || victoryPoints <= 0) {
                      if (defaultVPs.includes(options["victory-points"])) {
                        e.currentTarget.innerText =
                          options["victory-points"].toString();
                      } else {
                        e.currentTarget.innerText = otherDefault.toString();
                      }
                    } else {
                      toggleOption(victoryPoints, "victory-points");
                      e.currentTarget.innerText = victoryPoints.toString();
                    }
                  }}
                >
                  {otherDefault}
                </div>
                {options["game-variant"] === "alliance-separate" ? (
                  <>
                    <div>
                      <FormattedMessage
                        id="+WkrHz"
                        description="Text between two fields linking them together."
                        defaultMessage="AND"
                      />
                    </div>
                    {defaultVPs.map((VPs, index) => {
                      return (
                        <button
                          key={index}
                          className={
                            options["secondary-victory-points"] === VPs
                              ? "selected"
                              : ""
                          }
                          onClick={() => {
                            toggleOption(VPs, "secondary-victory-points");
                          }}
                        >
                          {VPs}
                        </button>
                      );
                    })}
                    <button
                      className={
                        options["secondary-victory-points"] !== 14 &&
                        options["secondary-victory-points"] !== 10
                          ? "selected"
                          : ""
                      }
                      onClick={() => {
                        toggleOption(
                          parseInt(otherPointsRef.current?.innerText ?? "10"),
                          "secondary-victory-points"
                        );
                      }}
                    >
                      <FormattedMessage
                        id="sgqLYB"
                        description="Text on a button used to select a non-listed value"
                        defaultMessage="Other"
                      />
                    </button>
                    <div
                      ref={otherPointsRef}
                      spellCheck={false}
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onClick={(e) => (e.currentTarget.innerText = "")}
                      onBlur={(e) => {
                        const victoryPoints = parseInt(e.target.innerText);
                        if (isNaN(victoryPoints) || victoryPoints <= 0) {
                          if (
                            defaultVPs.includes(
                              options["secondary-victory-points"]
                            )
                          ) {
                            e.currentTarget.innerText =
                              options["secondary-victory-points"].toString();
                          } else {
                            e.currentTarget.innerText = otherDefault.toString();
                          }
                        } else {
                          toggleOption(
                            victoryPoints,
                            "secondary-victory-points"
                          );
                          e.currentTarget.innerText = victoryPoints.toString();
                        }
                      }}
                    >
                      {otherDefault}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
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
                  padding: `0 ${"20px"}`,
                }}
              >
                <button
                  className={options.expansions.has("POK") ? "selected" : ""}
                  onClick={() =>
                    toggleExpansion(!options.expansions.has("POK"), "POK")
                  }
                >
                  <FormattedMessage
                    id="p9XVGB"
                    description="Text on a button that will enable/disable the Prophecy of Kings expansion."
                    defaultMessage="Prophecy of Kings"
                  />
                </button>
                <button
                  className={
                    options.expansions.has("CODEX ONE") ? "selected" : ""
                  }
                  onClick={() =>
                    toggleExpansion(
                      !options.expansions.has("CODEX ONE"),
                      "CODEX ONE"
                    )
                  }
                >
                  <FormattedMessage
                    id="3Taw9H"
                    description="Text on a button that will enable/disable Codex I."
                    defaultMessage="Codex I"
                  />
                </button>
                <button
                  className={
                    options.expansions.has("CODEX TWO") ? "selected" : ""
                  }
                  onClick={() =>
                    toggleExpansion(
                      !options.expansions.has("CODEX TWO"),
                      "CODEX TWO"
                    )
                  }
                >
                  <FormattedMessage
                    id="knYKVl"
                    description="Text on a button that will enable/disable Codex II."
                    defaultMessage="Codex II"
                  />
                </button>
                <button
                  className={
                    options.expansions.has("CODEX THREE") ? "selected" : ""
                  }
                  onClick={() =>
                    toggleExpansion(
                      !options.expansions.has("CODEX THREE"),
                      "CODEX THREE"
                    )
                  }
                >
                  <FormattedMessage
                    id="zXrdrP"
                    description="Text on a button that will enable/disable Codex III."
                    defaultMessage="Codex III"
                  />
                </button>
              </div>
              <div
                className="flexColumn mediumFont"
                style={{
                  alignItems: "flex-start",
                  padding: `0 ${"20px"}`,
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
                    padding: `0 ${"20px"}`,
                  }}
                >
                  <button
                    className={
                      options.expansions.has("DISCORDANT STARS")
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      toggleExpansion(
                        !options.expansions.has("DISCORDANT STARS"),
                        "DISCORDANT STARS"
                      )
                    }
                  >
                    <FormattedMessage
                      id="ZlvDZB"
                      description="Text on a button that will enable/disable the Discordant Stars expansion."
                      defaultMessage="Discordant Stars"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <FormattedMessage
                id="46dzNs"
                description="A label for a section of options related to the map."
                defaultMessage="Map:"
              />
              <div
                className="flexColumn"
                style={{
                  fontFamily: "Myriad Pro",
                  padding: `8px 16px`,
                  alignItems: "flex-start",
                }}
              >
                {mapStyles.length > 1 ? (
                  <React.Fragment>
                    <FormattedMessage
                      id="ZZ/Lhe"
                      description="A label for a selector for selecting which map style to use."
                      defaultMessage="Map Type:"
                    />
                    <div
                      className="flexRow"
                      style={{ paddingLeft: `${"16px"}` }}
                    >
                      {mapStyles.map((style) => {
                        return (
                          <button
                            key={style}
                            className={
                              options["map-style"] === style ? "selected" : ""
                            }
                            onClick={() => toggleOption(style, "map-style")}
                          >
                            {mapStyleString(style, intl)}
                          </button>
                        );
                      })}
                    </div>
                  </React.Fragment>
                ) : null}
                <div
                  className="flexRow"
                  style={{
                    gap: 0,
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <FormattedMessage
                    id="UJSVtn"
                    description="Label for a textbox used to specify the map string."
                    defaultMessage="Map String"
                  />
                  <span className="smallFont" style={{ paddingLeft: "4px" }}>
                    <FormattedMessage
                      id="zjv9Gr"
                      description="Part of a label explaining what the map string does."
                      defaultMessage="(filters out non-claimable planets)"
                    />
                  </span>
                  :
                </div>
                <input
                  ref={mapStringRef}
                  type="textbox"
                  className="mediumFont"
                  style={{ width: "100%" }}
                  onChange={(event) =>
                    toggleOption(event.target.value, "map-string")
                  }
                ></input>
              </div>
            </div>
            {/* {isCouncil ? (
              <div>
                Council Keleres:
                <div
                  className="flexColumn"
                  style={{
                    alignItems: "flex-start",
                    padding: `8px 20px`,
                  }}
                >
                  <button
                    className={
                      options["allow-double-council"] ? "selected" : ""
                    }
                    onClick={() =>
                      toggleOption(
                        !options["allow-double-council"],
                        "allow-double-council"
                      )
                    }
                  >
                    Allow selecting a duplicate sub-faction
                  </button>
                </div>
              </div>
            ) : null} */}
            {variants.length > 1 ? (
              <div>
                Variants (WIP):
                <div
                  className="flexRow"
                  style={{
                    alignItems: "flex-start",
                    padding: `8px 20px`,
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
                      <button
                        key={variant}
                        className={
                          options["game-variant"] === variant ? "selected" : ""
                        }
                        onClick={() => {
                          toggleOption(baseVPs, "victory-points");
                          toggleOption(10, "secondary-victory-points");
                          toggleOption(variant, "game-variant");
                        }}
                      >
                        {variantText}
                      </button>
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
  setFaction: (index: number, factionId: FactionId | undefined) => void;
  setColor: (index: number, colorName: string | undefined) => void;
  setSpeaker: (index: number) => void;
  setPlayerName: (index: number, playerName: string) => void;
  setAlliancePartner: (
    index: number,
    alliancePartner: number | undefined
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

  function selectFaction(factionId: FactionId | undefined) {
    if (factionIndex == undefined) {
      return;
    }
    setFaction(factionIndex, factionId);
  }

  function selectColor(color: string | undefined) {
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

  function selectAlliancePartner(factionId: FactionId | undefined) {
    if (factionIndex == undefined) {
      return;
    }
    const index = factions.reduce(
      (alliance: number | undefined, faction, index) => {
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
      }}
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
          gap: "4px",
          padding: "8px",
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
                style={{ height: "32.67px" }}
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
                    gap: "4px",
                    padding: "8px",
                    maxWidth: "min(85vw, 750px)",
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
                          fontSize: "16px",
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
                      padding: `${"8px"}`,
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(3, auto)",
                      overflowX: "auto",
                      gap: `${"4px"}`,
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
                            width: "60px",
                            backgroundColor: factionColor,
                            color: factionColor,
                            height: "22px",
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
  "allow-double-council": true,
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

    if (speaker > count) {
      setSpeaker(0);
    }
  }

  function updatePlayerFaction(
    index: number,
    factionId: FactionId | undefined
  ) {
    const faction = setupFactions[index];
    if (!faction) {
      return;
    }
    const prevValue = faction.id;
    setFactions(
      setupFactions.map((faction, i) => {
        if (index === i) {
          return { ...faction, name: factionId, id: factionId };
        }
        if (factionId && faction.id === factionId) {
          return { ...faction, name: prevValue, id: prevValue };
        }
        return faction;
      })
    );
  }

  function updatePlayerColor(index: number, color: string | undefined) {
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
    alliancePartner: number | undefined
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
    let selectedFactions: FactionId[] = [];
    for (let index = 0; index < numFactions; index++) {
      const faction = setupFactions[index];
      if (!faction) {
        continue;
      }
      if (faction.id) {
        selectedFactions[index] = faction.id;
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
      let selectedFaction: FactionId | undefined;
      while (!selectedFaction || selectedFactions.includes(selectedFaction)) {
        let randomIndex = Math.floor(Math.random() * factionKeys.length);
        selectedFaction = factionKeys[randomIndex];
      }
      selectedFactions[index] = selectedFaction;
    }
    setFactions(
      setupFactions.map((faction, index) => {
        const factionId: FactionId | undefined = selectedFactions[index];
        if (!factionId) {
          if (faction.id && selectedFactions.includes(faction.id)) {
            return { ...faction, name: undefined, id: undefined };
          }
          return { ...faction };
        }
        return { ...faction, name: factionId, id: factionId };
      })
    );
  }

  function randomColors() {
    let selectedColors: string[] = [];
    for (let index = 0; index < numFactions; index++) {
      const faction = setupFactions[index];
      if (!faction) {
        continue;
      }
      if (faction.color) {
        selectedColors[index] = faction.color;
      }
    }
    const filteredColors = colors.filter((color) => {
      if (color === "Magenta" || color === "Orange") {
        if (!options.expansions.has("POK")) {
          return false;
        }
      }
      return true;
    });
    for (let index = 0; index < numFactions; index++) {
      const faction = setupFactions[index];
      if (!faction) {
        continue;
      }
      if (faction.color) {
        continue;
      }
      let selectedColor: string | undefined;
      while (!selectedColor || selectedColors.includes(selectedColor)) {
        let randomIndex = Math.floor(Math.random() * filteredColors.length);
        selectedColor = filteredColors[randomIndex];
      }
      selectedColors[index] = selectedColor;
    }
    setFactions(
      setupFactions.map((faction, index) => {
        const color = selectedColors[index];
        if (!color) {
          if (selectedColors.includes(faction?.color ?? "")) {
            return { ...faction, color: undefined };
          }
          return { ...faction };
        }
        return { ...faction, color: color };
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

  function disableRandomizeColorsButton() {
    if (colors.length < numFactions) {
      return true;
    }
    for (let i = 0; i < numFactions; i++) {
      const faction = setupFactions[i];
      if (!faction?.color) {
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

    if (invalidCouncil()) {
      return true;
    }
    return false;
  }

  function isCouncilInGame() {
    for (let i = 0; i < numFactions; i++) {
      const faction = setupFactions[i];
      if (faction?.id === "Council Keleres") {
        return true;
      }
    }
    return false;
  }

  function invalidCouncil() {
    if (options["allow-double-council"]) {
      return false;
    }
    let factionCount = options.expansions.has("POK") ? 0 : 1;
    for (let i = 0; i < numFactions; i++) {
      const faction = setupFactions[i];
      if (
        faction?.id === "Xxcha Kingdom" ||
        faction?.id === "Argent Flight" ||
        faction?.id === "Mentak Coalition" ||
        faction?.id === "Council Keleres"
      ) {
        ++factionCount;
      }
    }
    return factionCount === 4;
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
        ${gapLine}
        "left-top map right-top"
        ${gapLine}
        "left-mid map right-mid"
        ${gapLine}
        "trac bot start"`;
      case 7:
        if (options["map-style"] === "warp") {
          return `"opt top rand"
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
            justifyContent: "center",
            gridArea: "opt",
            minHeight: "114px",
          }}
        >
          <Options
            updatePlayerCount={updatePlayerCount}
            toggleOption={toggleOption}
            toggleExpansion={toggleExpansion}
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
            isCouncil={isCouncilInGame()}
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
        {/* Track Section */}
        {/* <div
          className="flexColumn"
          style={{ height: "100%", gridArea: "trac", minHeight: "114px" }}
        >
          <LabeledDiv
            label={
              <FormattedMessage
                id="tDgufj"
                description="Label on a section showing what can be tracked by the app."
                defaultMessage="Track"
              />
            }
          >
            <div
              className="flexRow"
              style={{
                width: "100%",
                minWidth: "240px",
                justifyContent: "space-evenly",
              }}
            >
              <div
                className="flexColumn"
                style={{ fontSize: "12px", gap: "2px", width: "60px" }}
              >
                <FormattedMessage
                  id="1fNqTf"
                  defaultMessage="Planets"
                  description="Planets."
                />
                <Circle
                  blur={false}
                  onClick={() => {
                    toggleOption(!options["hide-planets"], "hide-planets");
                  }}
                  tag={<ToggleTag value={!options["hide-planets"]} />}
                  tagBorderColor={options["hide-planets"] ? "red" : "green"}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      paddingTop: "2px",
                      paddingLeft: "2px",
                    }}
                  >
                    <CustomSizeResources
                      resources={3}
                      influence={2}
                      height={32}
                    />
                  </div>
                </Circle>
              </div>
              <div
                className="flexColumn"
                style={{ fontSize: "12px", gap: "2px", width: "60px" }}
              >
                <FormattedMessage
                  id="ys7uwX"
                  defaultMessage="Techs"
                  description="Shortened version of technologies."
                />
                <Circle
                  blur={false}
                  onClick={() => {
                    toggleOption(!options["hide-techs"], "hide-techs");
                  }}
                  tag={<ToggleTag value={!options["hide-techs"]} />}
                  tagBorderColor={options["hide-techs"] ? "red" : "green"}
                >
                  <TechSkipIcon size={28} outline />
                </Circle>
              </div>
              <div
                className="flexColumn"
                style={{ fontSize: "12px", gap: "2px", width: "60px" }}
              >
                <FormattedMessage
                  id="5Bl4Ek"
                  defaultMessage="Objectives"
                  description="Cards that define how to score victory points."
                />
                <Circle
                  blur={false}
                  onClick={() => {
                    toggleOption(
                      !options["hide-objectives"],
                      "hide-objectives"
                    );
                  }}
                  tag={<ToggleTag value={!options["hide-objectives"]} />}
                  tagBorderColor={options["hide-objectives"] ? "red" : "green"}
                >
                  <Image
                    src={`/images/objectives_icon_two.svg`}
                    alt={`Objectives Icon`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </Circle>
              </div>
            </div>
          </LabeledDiv>
        </div> */}
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
          className="flexRow"
          style={{
            flexShrink: 0,
            flexGrow: 0,
            position: "relative",
            width: "350px",
            aspectRatio: 1,
            gridArea: "map",
          }}
        >
          <Map
            mapStyle={options["map-style"]}
            mapString={options["map-string"]}
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
        <div className="flexColumn" style={{ gridArea: "rand" }}>
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
              style={{ whiteSpace: "nowrap", minWidth: "280px" }}
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
              <button
                style={{ textAlign: "center" }}
                onClick={randomColors}
                disabled={disableRandomizeColorsButton()}
              >
                <FormattedMessage
                  id="rqdwvE"
                  description="Text on a button that will randomize colors."
                  defaultMessage="Colors"
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
          style={{ width: "100%", gridArea: "start", minHeight: "114px" }}
        >
          <button
            style={{
              fontSize: `${"40px"}`,
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
          {!creatingGame && disableNextButton() && !invalidCouncil() ? (
            <div
              className="flexColumn centered"
              style={{ color: "firebrick", maxWidth: "240px" }}
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
          {invalidCouncil() ? (
            <div style={{ color: "firebrick" }}>
              No sub-factions available for Council Keleres
            </div>
          ) : null}
        </div>
      </div>
      {/* Mobile Screen */}
      <div
        className="flexColumn mobileOnly"
        style={{
          width: "100%",
          marginTop: "56px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          className="flexColumn"
          style={{
            alignItems: "flex-start",
            gap: "12px",
            width: "100%",
            justifyContent: "flex-start",
            height: "88svh",
            overflowY: "auto",
          }}
        >
          <div className="flexRow" style={{ width: "100%", fontSize: "20px" }}>
            <FormattedMessage
              id="9DZz2w"
              description="Text identifying that this is the setup step."
              defaultMessage="Setup Game"
            />
          </div>
          <MobileOptions
            updatePlayerCount={updatePlayerCount}
            toggleOption={toggleOption}
            toggleExpansion={toggleExpansion}
            options={options}
            numFactions={numFactions}
            maxFactions={maxFactions}
            isCouncil={isCouncilInGame()}
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
          <div className="flexColumn" style={{ width: "100%" }}>
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
                <button
                  style={{ textAlign: "center" }}
                  onClick={randomColors}
                  disabled={disableRandomizeColorsButton()}
                >
                  Colors
                </button>
              </div>
            </LabeledDiv>
            <button onClick={reset}>Reset</button>

            {/* </div> */}
          </div>
          <div className="flexColumn" style={{ width: "100%" }}>
            <button
              style={{
                fontSize: `${"40px"}`,
                fontFamily: "Slider",
              }}
              onClick={startGame}
              disabled={disableNextButton()}
            >
              {creatingGame ? <Loader /> : "Start Game"}
            </button>
            {!creatingGame && disableNextButton() && !invalidCouncil() ? (
              <div
                className="flexColumn centered"
                style={{ color: "firebrick", maxWidth: "240px" }}
              >
                Select all factions and colors
                {options["game-variant"].startsWith("alliance")
                  ? " and alliance partners"
                  : ""}
              </div>
            ) : null}
            {invalidCouncil() ? (
              <div style={{ color: "firebrick" }}>
                No sub-factions available for Council Keleres
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
