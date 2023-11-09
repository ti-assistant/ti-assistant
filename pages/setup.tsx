import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ClientOnlyHoverMenu } from "../src/HoverMenu";
import { SelectableRow } from "../src/SelectableRow";
import { Selector } from "../src/Selector";
import FactionIcon from "../src/components/FactionIcon/FactionIcon";
import { FactionPanel } from "../src/components/FactionPanel";
import FactionSelectRadialMenu from "../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../src/components/LabeledDiv/LabeledDiv";
import Map from "../src/components/Map/Map";
import NonGameHeader from "../src/components/NonGameHeader/NonGameHeader";
import { fetcher } from "../src/util/api/util";
import { convertToFactionColor } from "../src/util/factions";
import { responsivePixels } from "../src/util/util";
import { Loader } from "../src/Loader";
import ResponsiveLogo from "../src/components/ResponsiveLogo/ResponsiveLogo";

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

  const mapString = options["map-string"];

  const [rowOrColumn, setRowOrColumn] = useState("flexRow");

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

  useEffect(() => {
    if (window.innerWidth < 900) {
      setRowOrColumn("flexColumn");
    }
  }, []);
  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      <label>Player Count</label>
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
        <ClientOnlyHoverMenu label="Options">
          <div style={{ width: "90vw", overflowX: "scroll" }}>
            <div
              className="flexColumn"
              style={{
                alignItems: "flex-start",
                padding: `${responsivePixels(8)} ${responsivePixels(
                  16
                )} 0 ${responsivePixels(16)}`,
              }}
            >
              <div className="flexColumn" style={{ alignItems: "flex-start" }}>
                Victory Points:
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "flex-start",
                    padding: `0 ${responsivePixels(20)}`,
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
                    Other
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
                Expansions:
                <div
                  className={rowOrColumn}
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    padding: `0 ${responsivePixels(20)}`,
                  }}
                >
                  <button
                    className={options.expansions.has("POK") ? "selected" : ""}
                    onClick={() =>
                      toggleExpansion(!options.expansions.has("POK"), "POK")
                    }
                  >
                    Prophecy of Kings
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
                    Codex I
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
                    Codex II
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
                    Codex III
                  </button>
                </div>
              </div>
              <div>
                Map:
                <div
                  className="flexColumn"
                  style={{
                    fontFamily: "Myriad Pro",
                    padding: `${responsivePixels(8)} ${responsivePixels(16)}`,
                    alignItems: "flex-start",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {mapStyles.length > 1 ? (
                    <React.Fragment>
                      Map Type:
                      <div
                        className="flexRow"
                        style={{ paddingLeft: `${responsivePixels(16)}` }}
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
                              {capitalizeFirstLetter(style)}
                            </button>
                          );
                        })}
                      </div>
                    </React.Fragment>
                  ) : null}
                  Map String (filters out non-claimable planets):
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
              {isCouncil ? (
                <div>
                  Council Keleres:
                  <div
                    className="flexColumn"
                    style={{
                      alignItems: "flex-start",
                      padding: `${responsivePixels(8)} ${responsivePixels(20)}`,
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
              ) : null}
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
      <label>Player Count</label>
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
      <ClientOnlyHoverMenu label="Options">
        <div>
          <div
            className="flexColumn"
            style={{
              alignItems: "flex-start",
              padding: `${responsivePixels(8)} ${responsivePixels(
                16
              )} 0 ${responsivePixels(16)}`,
            }}
          >
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              Victory Points:
              <div
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  padding: `0 ${responsivePixels(20)}`,
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
                  Other
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
                    <div>AND</div>
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
                      Other
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
              Expansions:
              <div
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  padding: `0 ${responsivePixels(20)}`,
                }}
              >
                <button
                  className={options.expansions.has("POK") ? "selected" : ""}
                  onClick={() =>
                    toggleExpansion(!options.expansions.has("POK"), "POK")
                  }
                >
                  Prophecy of Kings
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
                  Codex I
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
                  Codex II
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
                  Codex III
                </button>
              </div>
              <div
                className="flexColumn mediumFont"
                style={{
                  alignItems: "flex-start",
                  padding: `0 ${responsivePixels(20)}`,
                }}
              >
                Homebrew:
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "flex-start",
                    padding: `0 ${responsivePixels(20)}`,
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
                    Discordant Stars
                  </button>
                </div>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              Map:
              <div
                className="flexColumn"
                style={{
                  fontFamily: "Myriad Pro",
                  padding: `${responsivePixels(8)} ${responsivePixels(16)}`,
                  alignItems: "flex-start",
                }}
              >
                {mapStyles.length > 1 ? (
                  <React.Fragment>
                    Map Type:
                    <div
                      className="flexRow"
                      style={{ paddingLeft: `${responsivePixels(16)}` }}
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
                            {capitalizeFirstLetter(style)}
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
                  Map String
                  <span
                    className="smallFont"
                    style={{ paddingLeft: responsivePixels(4) }}
                  >
                    (filters out non-claimable planets)
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
            {isCouncil ? (
              <div>
                Council Keleres:
                <div
                  className="flexColumn"
                  style={{
                    alignItems: "flex-start",
                    padding: `${responsivePixels(8)} ${responsivePixels(20)}`,
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
            ) : null}
            {variants.length > 1 ? (
              <div>
                Variants (WIP):
                <div
                  className="flexRow"
                  style={{
                    alignItems: "flex-start",
                    padding: `${responsivePixels(8)} ${responsivePixels(20)}`,
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

// function FactionSelect({}: FactionSelectProps) {
//   const color = convertToFactionColor("blue");
//   return (
//     <>
//       <FactionSelectRadialMenu
//         factions={[]}
//         onSelect={() => {
//           return color;
//         }}
//       />
//       <SelectableRow itemId="potato" />
//       <Selector hoverMenuLabel="Why" options={[]} toggleItem={() => {}} />
//       <FactionIcon factionId="Vuil'raith Cabal" size={40} />
//       <FactionPanel
//         options={{
//           expansions: [],
//           "allow-double-council": false,
//           "game-variant": "normal",
//           "map-style": "standard",
//           "victory-points": 12,
//         }}
//         faction={{
//           color: "Blue",
//           id: "Arborec",
//           name: "Arborec",
//         }}
//       />
//     </>
//   );
//   return <div>{color}</div>;
// }

function FactionSelect({
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
  const {
    data: availableFactions,
  }: { data?: Partial<Record<FactionId, BaseFaction>> } = useSWR(
    "/api/factions",
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: colors }: { data?: string[] } = useSWR("/api/colors", fetcher, {
    revalidateIfStale: false,
  });

  const factionIndex = mobile
    ? position
    : getFactionIndex(numFactions, position, options);
  const faction = factions[factionIndex] ?? {};
  const playerName = faction.playerName;
  const currentNameRef = nameRef?.current;
  useEffect(() => {
    if (currentNameRef && !playerName) {
      currentNameRef.value = "Enter Player Name...";
    }
  }, [playerName, currentNameRef]);

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
  const filteredColors = (colors ?? []).filter((color) => {
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
      element.value = faction.playerName ?? "Enter Player Name...";
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
      defaultValue={"Enter Player Name..."}
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
      rightLabel={isSpeaker ? "Speaker" : undefined}
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
          gap: responsivePixels(4),
          padding: responsivePixels(8),
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
                itemId={faction.id}
                removeItem={() => selectFaction(undefined)}
                style={{ height: responsivePixels(32.67) }}
              >
                {faction.id}
                <FactionPanel
                  faction={faction}
                  options={createOptions(options)}
                />
              </SelectableRow>
            ) : (
              <ClientOnlyHoverMenu label="Pick Faction">
                <div
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: "repeat(10, minmax(0, 1fr))",
                    gap: responsivePixels(4),
                    padding: responsivePixels(8),
                    maxWidth: "88vw",
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
                          fontSize: responsivePixels(16),
                        }}
                        onClick={() => selectFaction(faction.id)}
                      >
                        <FactionIcon factionId={faction.id} size={20} />
                        {faction.id}
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
            ) : // <Selector
            //   hoverMenuLabel="Partner"
            //   options={selectedFactions.filter(
            //     (factionName) => factionName !== faction.name
            //   )}
            //   selectedItem={
            //     faction.alliancePartner != undefined
            //       ? factions[faction.alliancePartner]?.name
            //       : undefined
            //   }
            //   toggleItem={(factionName, add) => {
            //     if (add) {
            //       selectAlliancePartner(factionName);
            //     } else {
            //       selectAlliancePartner(undefined);
            //     }
            //   }}
            //   renderItem={(factionName) => {
            //     return (
            //       // <LabeledDiv label="Partner">
            //       <SelectableRow
            //         itemId={factionName}
            //         removeItem={() => selectAlliancePartner(undefined)}
            //         // style={{
            //         //   height: responsivePixels(32.67),
            //         //   width: responsivePixels(32.67),
            //         // }}
            //       >
            //         <div
            //           style={{
            //             position: "relative",
            //             width: responsivePixels(32),
            //             height: responsivePixels(32),
            //           }}
            //         >
            //           <FullFactionSymbol faction={factionName} />
            //         </div>
            //       </SelectableRow>
            //       // </LabeledDiv>
            //     );
            //   }}
            // />
            null}
          </div>
          <div
            className="flexRow"
            style={{
              width: mobile ? "auto" : "100%",
              justifyContent: "space-between",
            }}
          >
            <ClientOnlyHoverMenu
              label={faction.color ? "Color" : "Color"}
              renderProps={(closeFn) => {
                return (
                  <div
                    className="flexRow"
                    style={{
                      padding: `${responsivePixels(8)}`,
                      display: "grid",
                      gridAutoFlow: "column",
                      gridTemplateRows: "repeat(3, auto)",
                      overflowX: "auto",
                      gap: `${responsivePixels(4)}`,
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
                            width: `${responsivePixels(60)}`,
                            writingMode: "horizontal-tb",
                            backgroundColor: factionColor,
                            color: factionColor,
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
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            ></ClientOnlyHoverMenu>
            {mobile || isSpeaker ? null : (
              <button onClick={() => setSpeaker(factionIndex)}>
                Make Speaker
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
  "allow-double-council": false,
  "game-variant": "normal",
  "map-style": "standard",
  "map-string": "",
  "victory-points": 10,
  "secondary-victory-points": 10,
};

export default function SetupPage() {
  const [speaker, setSpeaker] = useState(0);
  const [factions, setFactions] = useState([...INITIAL_FACTIONS]);
  const [options, setOptions] = useState<SetupOptions>({
    ...INITIAL_OPTIONS,
    expansions: new Set(INITIAL_OPTIONS.expansions),
  });
  const [numFactions, setNumFactions] = useState(6);
  const [creatingGame, setCreatingGame] = useState(false);

  const router = useRouter();

  const { data: availableFactions }: { data?: Record<FactionId, BaseFaction> } =
    useSWR("/api/factions", fetcher, {
      revalidateIfStale: false,
    });
  const { data: colors }: { data?: string[] } = useSWR("/api/colors", fetcher, {
    revalidateIfStale: false,
  });

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
    const faction = factions[index];
    if (!faction) {
      return;
    }
    const prevValue = faction.id;
    setFactions(
      factions.map((faction, i) => {
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
    const faction = factions[index];
    if (!faction) {
      return;
    }
    const prevValue = faction.color;
    setFactions(
      factions.map((faction, i) => {
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
      factions.map((faction, i) => {
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
      factions.map((faction, i) => {
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
      const faction = factions[index];
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
      const faction = factions[index];
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
      factions.map((faction, index) => {
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
      const faction = factions[index];
      if (!faction) {
        continue;
      }
      if (faction.color) {
        selectedColors[index] = faction.color;
      }
    }
    const filteredColors = (colors ?? []).filter((color) => {
      if (color === "Magenta" || color === "Orange") {
        if (!options.expansions.has("POK")) {
          return false;
        }
      }
      return true;
    });
    for (let index = 0; index < numFactions; index++) {
      const faction = factions[index];
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
      factions.map((faction, index) => {
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

  const activeFactions = [...factions];
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
      const faction = factions[i];
      if (!faction?.id) {
        return false;
      }
    }
    return true;
  }

  function disableRandomizeColorsButton() {
    if (!colors || colors.length < numFactions) {
      return true;
    }
    for (let i = 0; i < numFactions; i++) {
      const faction = factions[i];
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
      const faction = factions[i];
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
      const faction = factions[i];
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
      const faction = factions[i];
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
        factions.map((faction, _) => {
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

  function MiddleTopGapDiv({}) {
    let height = "0";
    switch (numFactions) {
      case 3:
        height = responsivePixels(114);
        break;
      case 4:
        if (options["map-style"] !== "standard") {
          height = responsivePixels(114);
          break;
        }
        return null;
      case 5:
        if (options["map-style"] !== "warp") {
          height = responsivePixels(114);
          break;
        }
        return null;
      default:
        return null;
    }
    return <div style={{ flex: `${height} 0 0` }}></div>;
  }

  function RightTopGapDiv({}) {
    let height = responsivePixels(80);
    switch (numFactions) {
      case 3:
        height = responsivePixels(60);
        break;
      case 4:
        height =
          options["map-style"] === "standard"
            ? responsivePixels(110)
            : responsivePixels(60);
        break;
      case 5:
      case 6:
        height = responsivePixels(60);
        break;
      case 7:
        if (options["map-style"] === "warp") {
          height = responsivePixels(80);
          break;
        }
      case 8:
        height = responsivePixels(24);
        break;
    }
    return <div style={{ height: height }}></div>;
  }

  function SideGapDiv({}) {
    let height = responsivePixels(80);
    switch (numFactions) {
      default:
        return null;
      case 4:
        height =
          options["map-style"] === "standard"
            ? responsivePixels(0)
            : responsivePixels(36);
        break;
      case 5:
      case 6:
        height = responsivePixels(36);
        break;
      case 7:
      case 8:
        height = responsivePixels(0);
        break;
    }
    return <div style={{ height: height }}></div>;
  }

  function LeftTopGapDiv({}) {
    let height = responsivePixels(68);
    switch (numFactions) {
      case 3:
        height = responsivePixels(48);
        break;
      case 4:
        height =
          options["map-style"] === "standard"
            ? responsivePixels(148)
            : responsivePixels(44);
        break;
      case 5:
      case 6:
        height = responsivePixels(44);
        break;
      case 7:
      case 8:
        height = responsivePixels(8);
        break;
    }
    return <div style={{ height: height }}></div>;
  }
  function LeftBottomGapDiv({}) {
    let height = responsivePixels(80);
    switch (numFactions) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        return null;
    }
    return <div style={{ height: height }}></div>;
  }
  function RightBottomGapDiv({}) {
    let height = responsivePixels(64);
    switch (numFactions) {
      case 3:
        height = responsivePixels(244);
        break;
      case 4:
        height =
          options["map-style"] === "standard"
            ? responsivePixels(168)
            : responsivePixels(23);
        break;
      case 5:
      case 6:
        height = responsivePixels(23);
        break;
      case 7:
        if (options["map-style"] === "warp") {
          height = responsivePixels(64);
          break;
        }
      case 8:
        height = responsivePixels(22);
        break;
    }
    return <div style={{ height: height }}></div>;
  }

  const maxFactions = options.expansions.has("POK") ? 8 : 6;
  // const mapSize = (Math.min(window.innerHeight, window.innerWidth * .5) - 96) * .6;
  return (
    <React.Fragment>
      <NonGameHeader leftSidebar="SETUP GAME" rightSidebar="SETUP GAME" />
      {/* Large Screen */}
      <div
        className="flexRow nonMobile"
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          margin: `${responsivePixels(48)} 0 0 0`,
          width: "100%",
        }}
      >
        <div
          className="flexColumn"
          style={{
            height: "100%",
            justifyContent: "flex-start",
            marginTop: responsivePixels(12),
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
          <LeftTopGapDiv />
          <FactionSelect
            factions={factions}
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
          <SideGapDiv />
          {numFactions > 3 &&
          !(numFactions === 4 && options["map-style"] === "standard") ? (
            <FactionSelect
              factions={factions}
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
          ) : null}
          <SideGapDiv />
          {numFactions > 6 ? (
            <FactionSelect
              factions={factions}
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
          ) : null}
          <LeftBottomGapDiv />
        </div>
        <div
          className="flexColumn"
          style={{
            flex: `30vw 0 0`,
            height: "100%",
            justifyContent: "flex-start",
          }}
        >
          <MiddleTopGapDiv />
          {numFactions > 3 &&
          !(numFactions === 4 && options["map-style"] !== "standard") &&
          !(numFactions === 5 && options["map-style"] !== "warp") ? (
            <FactionSelect
              factions={factions}
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
          ) : null}
          <div
            className="flexRow"
            style={{
              flexShrink: 0,
              flexGrow: 0,
              position: "relative",
              width: "30vw",
              height: "30vw",
            }}
          >
            {/* TODO: Add zoom button 
              <div style={{position: "absolute", right: 24, top: 24}}>
                Icon button zoom
              </div>
            */}
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
            <FactionSelect
              factions={factions}
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
          ) : null}
        </div>
        <div
          className="flexColumn"
          style={{
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div className="flexColumn" style={{ width: "100%" }}>
            <LabeledDiv label="Randomize">
              <div
                className="flexRow"
                style={{ whiteSpace: "nowrap", width: "100%" }}
              >
                <button style={{ textAlign: "center" }} onClick={randomSpeaker}>
                  Speaker
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

          {/* Spacing Div */}
          <RightTopGapDiv />

          <FactionSelect
            factions={factions}
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
          <SideGapDiv />
          {numFactions > 3 &&
          !(numFactions === 4 && options["map-style"] === "standard") ? (
            <FactionSelect
              factions={factions}
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
          ) : null}
          <SideGapDiv />
          {(numFactions > 6 && options["map-style"] === "standard") ||
          numFactions > 7 ? (
            <FactionSelect
              factions={factions}
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
          ) : null}
          <RightBottomGapDiv />
          <div className="flexColumn" style={{ width: "100%" }}>
            <button
              style={{
                fontSize: `${responsivePixels(40)}`,
                fontFamily: "Slider",
                color: creatingGame ? "#222" : undefined,
                position: "relative",
              }}
              onClick={startGame}
              disabled={disableNextButton()}
            >
              Start Game
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
                style={{ color: "firebrick", maxWidth: responsivePixels(240) }}
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
      {/* Mobile Screen */}
      <div
        className="flexColumn mobileOnly"
        style={{
          width: "100%",
          marginTop: responsivePixels(56),
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          className="flexColumn"
          style={{
            alignItems: "flex-start",
            gap: responsivePixels(12),
            width: "100%",
            justifyContent: "flex-start",
            height: "88svh",
            overflowY: "auto",
          }}
        >
          <div
            className="flexRow"
            style={{ width: "100%", fontSize: responsivePixels(20) }}
          >
            Setup Game
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
          {factions.map((faction, index) => {
            if (index >= numFactions) {
              return null;
            }
            return (
              <FactionSelect
                key={index}
                factions={factions}
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
                  Speaker
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
                fontSize: `${responsivePixels(40)}`,
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
                style={{ color: "firebrick", maxWidth: responsivePixels(240) }}
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
