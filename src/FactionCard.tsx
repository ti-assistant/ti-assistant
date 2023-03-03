import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useState,
} from "react";
import useSWR from "swr";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import { SelectableRow } from "./SelectableRow";
import {
  unassignStrategyCard,
  swapStrategyCards,
  setFirstStrategyCard,
  StrategyCard,
} from "./util/api/cards";
import { chooseSubFaction, Faction, SubFaction } from "./util/api/factions";
import {
  chooseStartingTech,
  hasTech,
  removeStartingTech,
  Tech,
} from "./util/api/techs";
import { fetcher } from "./util/api/util";
import { getFactionColor, getFactionName } from "./util/factions";
import { getTechColor } from "./util/techs";
import { getNextIndex, responsivePixels } from "./util/util";
import { Options } from "./util/api/options";
import { GameState } from "./util/api/state";
import { getDefaultStrategyCards } from "./util/api/defaults";

export interface FactionSymbolProps {
  faction: string;
  size: number;
}

export function FactionSymbol({ faction, size }: FactionSymbolProps) {
  let width = size;
  let height = size;
  switch (faction) {
    case "Arborec":
      width = height * 0.816;
      break;
    case "Barony of Letnev":
      width = height * 0.96;
      break;
    case "Clan of Saar":
      height = width / 1.017;
      break;
    case "Embers of Muaat":
      width = height * 0.591;
      break;
    case "Emirates of Hacan":
      height = width / 1.064;
      break;
    case "Federation of Sol":
      height = width / 1.151;
      break;
    case "Ghosts of Creuss":
      height = width / 1.058;
      break;
    case "L1Z1X Mindnet":
      height = width / 1.268;
      break;
    case "Mentak Coalition":
      height = width / 1.023;
      break;
    case "Naalu Collective":
      height = width / 1.259;
      break;
    case "Nekro Virus":
      height = width / 1.021;
      break;
    case "Sardakk N'orr":
      width = height * 0.878;
      break;
    case "Universities of Jol'Nar":
      height = width / 1.093;
      break;
    case "Winnu":
      height = width / 1.051;
      break;
    case "Xxcha Kingdom":
      height = width / 1.043;
      break;
    case "Yin Brotherhood":
      width = height * 0.979;
      break;
    case "Yssaril Tribes":
      width = height * 0.95;
      break;
    case "Argent Flight":
      height = width / 1.013;
      break;
    case "Empyrean":
      width = height * 0.989;
      break;
    case "Mahact Gene-Sorcerers":
      height = width / 1.229;
      break;
    case "Naaz-Rokha Alliance":
      width = height * 0.829;
      break;
    case "Nomad":
      width = height * 0.958;
      break;
    case "Titans of Ul":
      width = height * 0.984;
      break;
    case "Vuil'Raith Cabal":
      width = height * 0.974;
      break;
    case "Council Keleres":
      width = height * 0.944;
      break;
  }
  const adjustedFactionName = faction.replace("'", "");
  return (
    <Image
      src={`/images/factions/${adjustedFactionName}.webp`}
      alt={`${faction} Icon`}
      width={`${width}px`}
      height={`${height}px`}
    />
  );
}

export interface FullFactionSymbolProps {
  faction: string;
}

export function FullFactionSymbol({ faction }: FullFactionSymbolProps) {
  const adjustedFactionName = faction.replace("'", "");
  return (
    <Image
      src={`/images/factions/${adjustedFactionName}.webp`}
      alt={`${faction} Icon`}
      layout="fill"
      objectFit="contain"
    />
  );
}

const shouldNotPluralize = ["Infantry"];

function pluralize(text: string, number: number) {
  if (number === 1 || shouldNotPluralize.includes(text)) {
    return `${text}`;
  } else {
    return `${text}s`;
  }
}

const unitOrder = [
  "Carrier",
  "Cruiser",
  "Destroyer",
  "Dreadnought",
  "Flagship",
  "War Sun",
  "Fighter",
  "Infantry",
  "Space Dock",
  "PDS",
];

const techOrder = ["red", "green", "blue", "yellow", "upgrade"];

export interface StartingComponentsProps {
  faction: Faction;
}

export function StartingComponents({ faction }: StartingComponentsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const startswith = faction.startswith;

  const orderedPlanets = (startswith.planets ?? []).sort((a, b) => {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  const orderedUnits = Object.entries(startswith.units).sort(
    (a, b) => unitOrder.indexOf(a[0]) - unitOrder.indexOf(b[0])
  );
  const orderedTechs = techs
    ? (startswith.techs ?? [])
        .filter((tech) => {
          if (!techs) {
            return false;
          }
          return !!techs[tech];
        })
        .filter((tech) => {
          return !!techs[tech];
        })
        .map((tech) => {
          return techs[tech] as Tech;
        })
        .sort((a, b) => {
          const typeDiff =
            techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
          if (typeDiff !== 0) {
            return typeDiff;
          }
          const prereqDiff = a.prereqs.length - b.prereqs.length;
          if (prereqDiff !== 0) {
            return prereqDiff;
          }
          if (a.name < b.name) {
            return -1;
          } else {
            return 1;
          }
        })
    : [];
  const orderedChoices = techs
    ? ((startswith.choice ?? {}).options ?? [])
        .filter((tech) => {
          return !(startswith.techs ?? []).includes(tech);
        })
        .filter((tech) => {
          return !!techs[tech];
        })
        .map((tech) => {
          return techs[tech] as Tech;
        })
        .sort((a, b) => {
          const typeDiff =
            techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
          if (typeDiff !== 0) {
            return typeDiff;
          }
          const prereqDiff = a.prereqs.length - b.prereqs.length;
          if (prereqDiff !== 0) {
            return prereqDiff;
          }
          if (a.name < b.name) {
            return -1;
          } else {
            return 1;
          }
        })
    : [];

  function addTech(tech: string) {
    if (!gameid) {
      return;
    }
    chooseStartingTech(gameid, faction.name, tech);
  }

  function removeTech(tech: string) {
    if (!gameid) {
      return;
    }
    removeStartingTech(gameid, faction.name, tech);
  }

  function selectSubFaction(subFaction: SubFaction) {
    if (!gameid) {
      return;
    }
    chooseSubFaction(gameid, faction.name, subFaction);
  }

  let numToChoose = !startswith.choice
    ? 0
    : startswith.choice.select - (startswith.techs ?? []).length;
  if (orderedChoices.length < numToChoose) {
    numToChoose = orderedChoices.length;
  }

  return (
    <div
      className="flexColumn"
      style={{
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: responsivePixels(4),
      }}
    >
      {startswith.planetchoice ? "Choose Sub-Faction" : null}
      {startswith.planetchoice && options ? (
        <div
          className="flexColumn"
          style={{ gap: responsivePixels(4), alignItems: "flex-start" }}
        >
          {startswith.planetchoice.options.map((faction) => {
            if (
              !(options["allow-double-council"] ?? false) &&
              factions &&
              factions[faction]
            ) {
              return null;
            }
            if (
              faction === "Argent Flight" &&
              !options.expansions.includes("pok")
            ) {
              return null;
            }
            return (
              <button
                key={faction}
                className={startswith.faction === faction ? "selected" : ""}
                onClick={() => selectSubFaction(faction)}
              >
                {faction}
              </button>
            );
          })}
        </div>
      ) : null}
      Planets
      <div
        style={{ paddingLeft: responsivePixels(4), fontFamily: "Myriad Pro" }}
      >
        {orderedPlanets.map((planet) => {
          return <div key={planet}>{planet}</div>;
        })}
      </div>
      Units
      <div
        className="flexColumn"
        style={{
          paddingLeft: responsivePixels(4),
          fontFamily: "Myriad Pro",
          justifyContent: "stretch",
          alignItems: "flex-start",
          gap: responsivePixels(1),
        }}
      >
        {orderedUnits.map(([unit, number]) => {
          return <div key={unit}>{`${number} ${pluralize(unit, number)}`}</div>;
        })}
      </div>
      Techs {startswith.choice ? "(Choice)" : null}
      <div style={{ paddingLeft: "4px" }}>
        {orderedTechs.map((tech) => {
          if (startswith.choice) {
            return (
              <SelectableRow
                key={tech.name}
                itemName={tech.name}
                removeItem={() => removeTech(tech.name)}
                style={{
                  color: getTechColor(tech),
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {tech.name}
              </SelectableRow>
            );
          }
          return (
            <div
              key={tech.name}
              style={{
                whiteSpace: "nowrap",
                fontFamily: "Myriad Pro",
                color: getTechColor(tech),
                fontSize: responsivePixels(16),
              }}
            >
              {tech.name}
            </div>
          );
        })}
      </div>
      {numToChoose > 0 ? (
        <div>
          {/* Choose {numToChoose} more {pluralize("tech", numToChoose)} */}
          <ClientOnlyHoverMenu
            label="Choose Starting Tech"
            style={{ minWidth: "100%" }}
          >
            <div
              className="flexColumn"
              style={{
                gap: "4px",
                alignItems: "stretch",
                whiteSpace: "nowrap",
                padding: "8px",
              }}
            >
              {orderedChoices.map((tech) => {
                return (
                  <button key={tech.name} onClick={() => addTech(tech.name)}>
                    {tech.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
          {/* <div>
            {orderedChoices.map((tech) => {
              return <TechRow key={tech.name} tech={tech} addTech={() => addTech(tech.name)} />;
            })}
          </div> */}
        </div>
      ) : null}
    </div>
  );
}

export interface FactionTileOpts {
  fontSize?: string;
  hideName?: boolean;
}

export interface FactionTileProps {
  faction: Faction;
  onClick?: () => void;
  menu?: {};
  opts?: FactionTileOpts;
}

export function FactionTile({
  faction,
  onClick,
  menu,
  opts = {},
}: FactionTileProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [showMenu, setShowMenu] = useState(false);

  const card = Object.values(strategyCards).find(
    (card) => card.faction === faction.name
  );

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function hideMenu() {
    setShowMenu(false);
  }

  function publicDisgrace() {
    if (!gameid) {
      return;
    }
    hideMenu();
    if (!card) {
      return;
    }
    unassignStrategyCard(gameid, card.name);
  }

  function quantumDatahubNode() {
    if (!gameid) {
      return;
    }
    hideMenu();
    const hacanCard = Object.values(strategyCards).find(
      (card) => card.faction === "Emirates of Hacan"
    );
    if (!card || !hacanCard) {
      return;
    }
    swapStrategyCards(gameid, card, hacanCard);
  }

  function giftOfPrescience() {
    if (!gameid) {
      return;
    }
    hideMenu();
    if (!card) {
      return;
    }
    setFirstStrategyCard(gameid, card.name);
  }

  // NOTE: Only works for Strategy phase. Other phases are not deterministic.
  function didFactionJustGo() {
    if (!factions || !state || !state.activeplayer) {
      return false;
    }
    const numFactions = Object.keys(factions ?? {}).length;
    if (numFactions === 3 || numFactions === 4) {
      let numPicked = 0;
      for (const card of Object.values(strategyCards)) {
        if (card.faction) {
          ++numPicked;
        }
      }
      if (numPicked === numFactions) {
        return faction.order === numFactions;
      }
      if (numPicked > numFactions) {
        const nextOrder = numFactions - (numPicked - numFactions) + 1;
        return faction.order === nextOrder;
      }
    }
    if (state.activeplayer === "None") {
      return faction.order === numFactions;
    }
    return (
      getNextIndex(faction.order, numFactions + 1, 1) ===
      factions[state.activeplayer]?.order
    );
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions ?? {}).length;
    let numPicked = 0;
    for (const card of Object.values(strategyCards)) {
      if (card.faction) {
        ++numPicked;
      }
    }
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  const iconStyle: CSSProperties = {
    height: "40px",
    position: "absolute",
    zIndex: -1,
    left: 0,
    width: "100%",
    opacity: "60%",
  };

  function getMenuButtons() {
    if (!state) {
      return [];
    }
    const buttons: ReactNode[] = [];
    switch (state.phase) {
      case "STRATEGY":
        if (didFactionJustGo()) {
          // NOTE: Doesn't work correctly for 3 to 4 players.
          buttons.push(
            <div
              key="Public Disgrace"
              style={{
                cursor: "pointer",
                gap: "4px",
                padding: "4px 8px",
                boxShadow: "1px 1px 4px black",
                backgroundColor: "#222",
                border: `2px solid ${color}`,
                borderRadius: "5px",
                fontSize: opts.fontSize ?? "24px",
              }}
              onClick={publicDisgrace}
            >
              Public Disgrace
            </div>
          );
        }
        if (haveAllFactionsPicked() && factions) {
          // TODO: Decide whether this should be on Hacan instead.
          const hacan = factions["Emirates of Hacan"];
          if (
            hacan &&
            faction.name !== "Emirates of Hacan" &&
            hasTech(hacan, "Quantum Datahub Node")
          ) {
            buttons.push(
              <div
                key="Quantum Datahub Node"
                style={{
                  position: "relative",
                  cursor: "pointer",
                  gap: "4px",
                  padding: "4px 8px",
                  boxShadow: "1px 1px 4px black",
                  backgroundColor: "#222",
                  border: `2px solid ${color}`,
                  borderRadius: "5px",
                  fontSize: opts.fontSize ?? "24px",
                }}
                onClick={quantumDatahubNode}
              >
                Quantum Datahub Node
              </div>
            );
          }
          const naalu = factions["Naalu Collective"];
          if (card && naalu && faction.name !== "Naalu Collective") {
            buttons.push(
              <div
                key="Gift of Prescience"
                style={{
                  position: "relative",
                  cursor: "pointer",
                  gap: "4px",
                  padding: "4px 8px",
                  boxShadow: "1px 1px 4px black",
                  backgroundColor: "#222",
                  border: `2px solid ${color}`,
                  borderRadius: "5px",
                  fontSize: opts.fontSize ?? "24px",
                }}
                onClick={giftOfPrescience}
              >
                {card.order === 0
                  ? "Undo Gift of Prescience"
                  : "Gift of Prescience"}
              </div>
            );
          }
        }
        return buttons;
      case "ACTION":
        break;
      case "STATUS":
        break;
      case "AGENDA":
        break;
    }
    return buttons;
  }

  const speaker = faction.name === state?.speaker;

  const color = getFactionColor(faction);
  const border = "3px solid " + (faction.passed ? "#555" : color);
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);

  return (
    <div
      style={{ position: "relative" }}
      tabIndex={0}
      onBlur={onClick ? () => {} : hideMenu}
    >
      <div
        onClick={onClick ? onClick : toggleMenu}
        style={{
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          border: border,
          fontSize: opts.fontSize ?? "24px",
          position: "relative",
          cursor:
            onClick || (menu && getMenuButtons().length !== 0)
              ? "pointer"
              : "auto",
          alignItems: "center",
          whiteSpace: "nowrap",
          padding: "0px 4px",
        }}
      >
        <div
          className="flexRow"
          style={{
            justifyContent: "flex-start",
            gap: "4px",
            padding: "0px 4px",
            height: "40px",
          }}
        >
          <div className="flexRow" style={iconStyle}>
            <FactionSymbol faction={faction.name} size={40} />
          </div>
          {speaker ? (
            <div
              style={{
                fontFamily: "Myriad Pro",
                position: "absolute",
                color: color === "Black" ? "#eee" : color,
                borderRadius: "5px",
                border: `2px solid ${color}`,
                padding: "0px 2px",
                fontSize: "12px",
                top: "-10px",
                left: "4px",
                zIndex: 1,
                backgroundColor: "#222",
              }}
            >
              Speaker
            </div>
          ) : null}
          {opts.hideName ? null : (
            <div style={{ textAlign: "center", position: "relative" }}>
              {getFactionName(faction)}
            </div>
          )}
        </div>
      </div>
      {menu ? (
        <div
          className="flexColumn"
          style={{
            fontFamily: "Myriad Pro",
            left: "100%",
            marginLeft: "4px",
            top: "0",
            position: "absolute",
            display: showMenu ? "flex" : "none",
            height: "40px",
            zIndex: 2,
          }}
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", gap: "4px" }}
          >
            {getMenuButtons()}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export interface FactionCardOpts {
  displayStartingComponents?: boolean;
  fontSize?: string;
  hideTitle?: boolean;
  iconSize?: string;
}

export interface FactionCardProps {
  faction: Faction;
  rightLabel?: ReactNode;
  onClick?: () => void;
  opts?: FactionCardOpts;
  style?: CSSProperties;
}

export function FactionCard({
  children,
  faction,
  onClick,
  rightLabel,
  style = {},
  opts = {},
}: PropsWithChildren<FactionCardProps>) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const speaker = faction.name === state?.speaker;

  const label = speaker
    ? `Speaker: ${getFactionName(faction)}`
    : getFactionName(faction);

  return (
    <LabeledDiv
      label={label}
      rightLabel={rightLabel}
      color={getFactionColor(faction)}
      onClick={onClick}
      style={{ justifyContent: "flex-start", ...style }}
    >
      <div
        className="flexColumn"
        style={{
          width: "100%",
          justifyContent: "flex-start",
          fontSize: opts.fontSize ?? "24px",
          position: "relative",
          height: "100%",
        }}
      >
        {opts.hideTitle ? null : (
          <div
            className="flexRow"
            style={{
              zIndex: -2,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                zIndex: -1,
                opacity: "40%",
                position: "absolute",
                top: 0,
                width: opts.iconSize ? opts.iconSize : "100%",
                height: opts.iconSize ? opts.iconSize : "100%",
              }}
            >
              <FullFactionSymbol faction={faction.name} />
            </div>
          </div>
        )}
        {children}
        {opts.displayStartingComponents ? (
          <StartingComponents faction={faction} />
        ) : null}
      </div>
    </LabeledDiv>
  );
}
