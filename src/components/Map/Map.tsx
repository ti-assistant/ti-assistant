import NextImage from "next/image";
import { ReactNode, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import { GameIdContext } from "../../context/Context";
import { getFactionColor } from "../../util/factions";
import {
  applyAllPlanetAttachments,
  getPlanetTypeColor,
} from "../../util/planets";
import { getTechTypeColor } from "../../util/techs";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./Map.module.scss";
import { updateMapString, validSystemNumber } from "../../util/map";
import {
  useAttachments,
  useFactions,
  usePlanets,
} from "../../context/dataHooks";

interface Cube {
  q: number;
  r: number;
  s: number;
}

interface Point {
  x: number;
  y: number;
}

function Cube(q: number, r: number, s: number): Cube {
  return {
    q,
    r,
    s,
  };
}

function Point(x: number, y: number): Point {
  return {
    x,
    y,
  };
}

const HEX_RATIO = 2 / Math.sqrt(3);

const CUBE_DIRECTIONS = [
  Cube(0, -1, +1),
  Cube(+1, -1, 0),
  Cube(+1, 0, -1),
  Cube(0, +1, -1),
  Cube(-1, +1, 0),
  Cube(-1, 0, +1),
] as const;

function cube_add(hex: Cube, vec: Cube) {
  return Cube(hex.q + vec.q, hex.r + vec.r, hex.s + vec.s);
}

function cube_neighbor(cube: Cube, direction: Cube) {
  return cube_add(cube, direction);
}

function cube_scale(hex: Cube, factor: number) {
  return Cube(hex.q * factor, hex.r * factor, hex.s * factor);
}

function cubeRing(center: Cube, radius: number) {
  const results: Cube[] = [];
  let hex = cube_add(center, cube_scale(CUBE_DIRECTIONS[4], radius));
  for (const direction of CUBE_DIRECTIONS) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = cube_neighbor(hex, direction);
    }
  }
  return results;
}

function cubeSpiral(center: Cube, radius: number) {
  let results: Cube[] = [center];
  for (let i = 1; i < radius; i++) {
    results = results.concat(cubeRing(center, i));
  }
  return results;
}

function CubeToPixel(hex: Cube, size: number) {
  const x = size * ((3 / 2) * hex.s);
  const y = size * ((Math.sqrt(3) / 2) * hex.s + Math.sqrt(3) * hex.q);
  return Point(x, y);
}

const FACTION_TO_SYSTEM_NUMBER: Record<FactionId, string> = {
  "Council Keleres": "92",
  "Federation of Sol": "1",
  "Mentak Coalition": "2",
  "Yin Brotherhood": "3",
  "Embers of Muaat": "4",
  Arborec: "5",
  "L1Z1X Mindnet": "6",
  Winnu: "7",
  "Nekro Virus": "8",
  "Naalu Collective": "9",
  "Barony of Letnev": "10",
  "Clan of Saar": "11",
  "Universities of Jol-Nar": "12",
  "Sardakk N'orr": "13",
  "Xxcha Kingdom": "14",
  "Yssaril Tribes": "15",
  "Emirates of Hacan": "16",
  "Ghosts of Creuss": "17",
  "Mahact Gene-Sorcerers": "52",
  Nomad: "53",
  "Vuil'raith Cabal": "54",
  "Titans of Ul": "55",
  Empyrean: "56",
  "Naaz-Rokha Alliance": "57",
  "Argent Flight": "58",
  "Augurs of Ilyxum": "1001",
  "Bentor Conglomerate": "1002",
  "Berserkers of Kjalengard": "1003",
  "Celdauri Trade Confederation": "1004",
  "Cheiran Hordes": "1005",
  "Dih-Mohn Flotilla": "1006",
  "Edyn Mandate": "1007",
  "Florzen Profiteers": "1008",
  "Free Systems Compact": "1009",
  "Ghemina Raiders": "1010",
  "Ghoti Wayfarers": "1011",
  "Gledge Union": "1012",
  "Glimmer of Mortheus": "1013",
  "Kollecc Society": "1014",
  "Kortali Tribunal": "1015",
  "Kyro Sodality": "1016",
  "Lanefir Remnants": "1017",
  "Li-Zho Dynasty": "1018",
  "L'tokk Khrask": "1019",
  "Mirveda Protectorate": "1020",
  "Monks of Kolume": "1021",
  "Myko-Mentori": "1022",
  "Nivyn Star Kings": "1023",
  "Nokar Sellships": "1024",
  "Olradin League": "1025",
  "Roh'Dhna Mechatronics": "1026",
  "Savages of Cymiae": "1027",
  "Shipwrights of Axis": "1028",
  "Tnelis Syndicate": "1029",
  "Vaden Banking Clans": "1030",
  "Vaylerian Scourge": "1031",
  "Veldyr Sovereignty": "1032",
  "Zealots of Rhodun": "1033",
  "Zelian Purifier": "1034",
} as const;

export function getFactionSystemNumber(
  faction:
    | {
        id?: FactionId;
        name?: string;
        startswith?: {
          faction?: FactionId;
        };
      }
    | undefined
) {
  if (!faction?.id) {
    return "92";
  }
  if (faction.id === "Council Keleres") {
    switch (faction.startswith?.faction) {
      case "Argent Flight":
        return "101";
      case "Xxcha Kingdom":
        return "100";
      case "Mentak Coalition":
        return "102";
    }
    return "92";
  }
  return FACTION_TO_SYSTEM_NUMBER[faction.id] ?? "92";
}

function getRotationClass(key: string) {
  switch (key) {
    case "rotateSixty":
      return styles.rotateSixty;
    case "rotateOneTwenty":
      return styles.rotateOneTwenty;
    case "rotateOneEighty":
      return styles.rotateOneEighty;
    case "rotateTwoForty":
      return styles.rotateTwoForty;
    case "rotateThreeHundred":
      return styles.rotateThreeHundred;
  }
}

function getRotationClassFromNumber(key: number) {
  switch (key) {
    case 1:
      return styles.rotateSixty;
    case 2:
      return styles.rotateOneTwenty;
    case 3:
      return styles.rotateOneEighty;
    case 4:
      return styles.rotateTwoForty;
    case 5:
      return styles.rotateThreeHundred;
  }
  return "";
}

export function SystemImage({
  gameId,
  showDetails,
  systemNumber,
}: {
  gameId: string;
  showDetails: Details;
  systemNumber: string | undefined;
}) {
  const attachments = useAttachments();
  const factions = useFactions();
  const planets = usePlanets();

  if (
    !systemNumber ||
    systemNumber === "0" ||
    !validSystemNumber(systemNumber)
  ) {
    if (systemNumber && systemNumber.split(":").length > 1) {
      const classNames = getRotationClass(systemNumber.split(":")[0] ?? "");
      systemNumber = systemNumber.split(":")[1] ?? "";
      return (
        <div
          className={`flexRow ${classNames}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <NextImage
            src={`/images/systems/ST_${systemNumber}.png`}
            alt={`System ${systemNumber} Tile`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    }
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <NextImage
          src={Hexagon}
          alt={`System Tile`}
          sizes="64px"
          fill
          style={{ opacity: "10%", objectFit: "contain" }}
          priority
        />
      </div>
    );
  }

  const parsedNum = parseInt(systemNumber);
  if (parsedNum > 4200) {
    systemNumber = (parsedNum - 3200).toString();
  }

  let systemPlanets = Object.values(planets ?? {}).filter((planet) => {
    if (!systemNumber) {
      return false;
    }
    if (systemNumber === "82A" || systemNumber === "82B") {
      return planet.system === "82B" || planet.system === "82A";
    }
    return planet.system === parseInt(systemNumber);
  });
  systemPlanets = applyAllPlanetAttachments(systemPlanets, attachments);

  let classNames: string | undefined = "";
  if (systemNumber.includes("A") && systemNumber.split("A").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("A")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("A")[0] ?? ""}A`;
  }
  if (systemNumber.includes("B") && systemNumber.split("B").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("B")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("B")[0] ?? ""}B`;
  }

  return (
    <div
      className={`flexRow ${classNames}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <NextImage
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        sizes="128px"
        fill
        style={{ objectFit: "contain" }}
        priority={
          systemNumber === "92" ||
          systemNumber === "18" ||
          systemNumber === "82A"
        }
      />
      {systemPlanets.map((planet) => {
        let detailsSymbol: ReactNode | null = null;
        const height =
          planet.id !== "Mallice" && planet.id !== "Creuss"
            ? `calc(24% * ${HEX_RATIO})`
            : "24%";
        switch (showDetails) {
          case "OWNERS": {
            if (!planet.owner) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "#222",
                  border: `${"2px"} solid ${getFactionColor(
                    (factions ?? {})[planet.owner]
                  )}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%` ?? 0,
                  marginTop: `${planet.position?.y}%` ?? 0,
                }}
              >
                <FactionIcon factionId={planet.owner} size="75%" />
              </div>
            );
            break;
          }
          case "TYPES": {
            if (planet.type === "NONE") {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "#222",
                  border: `${"2px"} solid ${getPlanetTypeColor(planet.type)}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%` ?? 0,
                  marginTop: `${planet.position?.y}%` ?? 0,
                }}
              >
                <PlanetIcon type={planet.type} size="70%" />
              </div>
            );
            break;
          }
          case "ATTACHMENTS": {
            if ((planet.attachments ?? []).length === 0) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "#222",
                  border: `${"2px"} solid ${"#eee"}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%` ?? 0,
                  marginTop: `${planet.position?.y}%` ?? 0,
                }}
              >
                <div
                  className="flexRow"
                  style={{ position: "relative", width: "70%", height: "70%" }}
                >
                  <div className="symbol">⎗</div>
                </div>
              </div>
            );
            break;
          }
          case "TECH_SKIPS": {
            let color: TechType | undefined;
            let size: string | undefined;
            for (const attribute of planet.attributes) {
              switch (attribute) {
                case "red-skip":
                  color = "RED";
                  size = "100%";
                  break;
                case "blue-skip":
                  color = "BLUE";
                  size = "95%";
                  break;
                case "green-skip":
                  color = "GREEN";
                  size = "100%";
                  break;
                case "yellow-skip":
                  color = "YELLOW";
                  size = "90%";
                  break;
              }
            }
            if (color && size) {
              detailsSymbol = (
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    backgroundColor: "#222",
                    border: `2px solid ${getTechTypeColor(color)}`,
                    borderRadius: "100%",
                    width: "24%",
                    height: height,
                    marginLeft: `${planet.position?.x}%` ?? 0,
                    marginTop: `${planet.position?.y}%` ?? 0,
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: "70%",
                      height: "70%",
                    }}
                  >
                    <TechIcon type={color} size={size} />
                  </div>
                </div>
              );
            }
            break;
          }
        }

        return (
          <div
            key={planet.id}
            className="flexRow"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            {detailsSymbol}
          </div>
        );
      })}
      {
        gameId && systemNumber === "18" && !systemPlanets[0]?.owner ? (
          <div
            className="flexRow"
            style={{
              position: "absolute",
              borderRadius: "100%",
              width: "40%",
              height: `calc(40% * ${HEX_RATIO})`,
            }}
          >
            <div
              className="flexRow"
              style={{ position: "relative", width: "90%", height: "90%" }}
            >
              <NextImage
                src={`/images/custodians.png`}
                alt={`Custodians Token`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ) : null
        // <div
        //   className="flexRow"
        //   style={{
        //     position: "absolute",
        //     backgroundColor: "#222",
        //     borderRadius: "100%",
        //     width: "20%",
        //     height: `calc(20% * ${HEX_RATIO})`,
        //     border: "1px solid red",
        //   }}
        // >
        //   <div
        //     className="flexRow"
        //     style={{ position: "relative", width: "90%", height: "90%" }}
        //   >
        //     <FullFactionSymbol faction={"Vuil'raith Cabal"} />
        //   </div>
        // </div>
      }
    </div>
  );
}

interface MapProps {
  mapString: string;
  mapStyle: MapStyle;
  mallice?: string;
  factions: {
    id?: FactionId;
    name?: string;
    startswith?: {
      faction?: FactionId;
    };
  }[];
  hideLegend?: boolean;
}

// const IMAGES_TO_PRELOAD = [
//   // Systems
//   "/images/systems/Hexagon.png",
//   "/images/systems/ST_1.png",
//   "/images/systems/ST_2.png",
//   "/images/systems/ST_3.png",
//   "/images/systems/ST_4.png",
//   "/images/systems/ST_5.png",
//   "/images/systems/ST_6.png",
//   "/images/systems/ST_7.png",
//   "/images/systems/ST_8.png",
//   "/images/systems/ST_9.png",
//   "/images/systems/ST_10.png",
//   "/images/systems/ST_11.png",
//   "/images/systems/ST_12.png",
//   "/images/systems/ST_13.png",
//   "/images/systems/ST_14.png",
//   "/images/systems/ST_15.png",
//   "/images/systems/ST_16.png",
//   "/images/systems/ST_17.png",
//   "/images/systems/ST_18.png",
//   "/images/systems/ST_19.png",
//   "/images/systems/ST_20.png",
//   "/images/systems/ST_21.png",
//   "/images/systems/ST_22.png",
//   "/images/systems/ST_23.png",
//   "/images/systems/ST_24.png",
//   "/images/systems/ST_25.png",
//   "/images/systems/ST_26.png",
//   "/images/systems/ST_27.png",
//   "/images/systems/ST_28.png",
//   "/images/systems/ST_29.png",
//   "/images/systems/ST_30.png",
//   "/images/systems/ST_31.png",
//   "/images/systems/ST_32.png",
//   "/images/systems/ST_33.png",
//   "/images/systems/ST_34.png",
//   "/images/systems/ST_35.png",
//   "/images/systems/ST_36.png",
//   "/images/systems/ST_37.png",
//   "/images/systems/ST_38.png",
//   "/images/systems/ST_39.png",
//   "/images/systems/ST_40.png",
//   "/images/systems/ST_41.png",
//   "/images/systems/ST_42.png",
//   "/images/systems/ST_43.png",
//   "/images/systems/ST_44.png",
//   "/images/systems/ST_45.png",
//   "/images/systems/ST_46.png",
//   "/images/systems/ST_47.png",
//   "/images/systems/ST_48.png",
//   "/images/systems/ST_49.png",
//   "/images/systems/ST_50.png",
//   "/images/systems/ST_51.png",
//   "/images/systems/ST_52.png",
//   "/images/systems/ST_53.png",
//   "/images/systems/ST_54.png",
//   "/images/systems/ST_55.png",
//   "/images/systems/ST_56.png",
//   "/images/systems/ST_57.png",
//   "/images/systems/ST_58.png",
//   "/images/systems/ST_59.png",
//   "/images/systems/ST_60.png",
//   "/images/systems/ST_61.png",
//   "/images/systems/ST_62.png",
//   "/images/systems/ST_63.png",
//   "/images/systems/ST_64.png",
//   "/images/systems/ST_65.png",
//   "/images/systems/ST_66.png",
//   "/images/systems/ST_67.png",
//   "/images/systems/ST_68.png",
//   "/images/systems/ST_69.png",
//   "/images/systems/ST_70.png",
//   "/images/systems/ST_71.png",
//   "/images/systems/ST_72.png",
//   "/images/systems/ST_73.png",
//   "/images/systems/ST_74.png",
//   "/images/systems/ST_75.png",
//   "/images/systems/ST_76.png",
//   "/images/systems/ST_77.png",
//   "/images/systems/ST_78.png",
//   "/images/systems/ST_79.png",
//   "/images/systems/ST_80.png",
//   "/images/systems/ST_81.png",
//   "/images/systems/ST_82A.png",
//   "/images/systems/ST_82B.png",
//   "/images/systems/ST_83A.png",
//   "/images/systems/ST_83B.png",
//   "/images/systems/ST_84A.png",
//   "/images/systems/ST_84B.png",
//   "/images/systems/ST_85A.png",
//   "/images/systems/ST_85B.png",
//   "/images/systems/ST_86A.png",
//   "/images/systems/ST_86B.png",
//   "/images/systems/ST_87A.png",
//   "/images/systems/ST_87B.png",
//   "/images/systems/ST_88A.png",
//   "/images/systems/ST_88B.png",
//   "/images/systems/ST_89A.png",
//   "/images/systems/ST_89B.png",
//   "/images/systems/ST_90A.png",
//   "/images/systems/ST_90B.png",
//   "/images/systems/ST_91A.png",
//   "/images/systems/ST_91B.png",
//   "/images/systems/ST_92.png",
// ];

function fillHomeSystems(a: string, numFactions: number) {
  let currentIndex = 0;
  return a
    .split(" ")
    .map((tile) => {
      if (tile === "0") {
        currentIndex++;
        if (currentIndex > numFactions) {
          return "-1";
        }
        return `P${currentIndex}`;
      }
      return tile;
    })
    .join(" ");
}

type Details = "NONE" | "ATTACHMENTS" | "OWNERS" | "TECH_SKIPS" | "TYPES";

export default function Map({
  mapString,
  mapStyle,
  mallice,
  factions,
  hideLegend,
}: MapProps) {
  const gameId = useContext(GameIdContext);

  const [showDetails, setShowDetails] = useState<Details>("NONE");

  // useEffect(() => {
  //   for (const img of IMAGES_TO_PRELOAD) {
  //     let image = new Image();
  //     image.src = img;
  //   }
  // }, []);

  const updatedMapString = updateMapString(
    mapString,
    mapStyle,
    factions.length
  );
  let updatedSystemTiles = ["18"].concat(updatedMapString.split(" "));
  // mapString !== "" ? ["18"].concat(...mapString.split(" ")) : systemTiles;
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      const parsedTile = parseInt(updatedTile);
      if (parsedTile > 4200) {
        return (parsedTile - 3200).toString();
      }
      return updatedTile;
    }
    if (tile.startsWith("P")) {
      const number = tile.at(tile.length - 1);
      if (!number) {
        return tile;
      }
      const factionIndex = parseInt(number);
      return getFactionSystemNumber(factions[factionIndex - 1]);
    }
    return tile;
  });

  const numTiles = updatedSystemTiles.length;
  let numRings = Math.ceil((3 + Math.sqrt(9 - 12 * (1 - numTiles))) / 6);
  const largestDimension = numRings * 2 - 1;
  const tilePercentage = 98 / largestDimension;

  const spiral = cubeSpiral(Cube(0, 0, 0), numRings);

  let ghosts = false;
  let ghostsCorner = null;
  factions.forEach((faction, index) => {
    if (faction.id === "Ghosts of Creuss") {
      switch (factions.length) {
        case 3:
          switch (index) {
            case 0:
              ghostsCorner = "top-right";
              break;
            case 1:
              ghostsCorner = "bottom-right";
              break;
            case 2:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 4:
          switch (index) {
            case 0:
              ghostsCorner = mapStyle === "standard" ? "top-left" : "top-right";
              break;
            case 1:
              ghostsCorner =
                mapStyle === "standard" ? "top-right" : "bottom-right";
              break;
            case 2:
              ghostsCorner =
                mapStyle === "standard" ? "bottom-right" : "bottom-left";
              break;
            case 3:
              ghostsCorner =
                mapStyle === "standard" ? "bottom-left" : "top-left";
              break;
          }
          break;
        case 5:
          switch (index) {
            case 0:
              ghostsCorner = "top-right";
              break;
            case 1:
              ghostsCorner = "bottom-right";
              break;
            case 2:
              ghostsCorner = "bottom-right";
              break;
            case 3:
              ghostsCorner = "bottom-left";
              break;
            case 4:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 6:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
              ghostsCorner = "bottom-right";
              break;
            case 4:
              ghostsCorner = "bottom-left";
              break;
            case 5:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 7:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
              ghostsCorner = "bottom-right";
              break;
            case 4:
              ghostsCorner = "bottom-left";
              break;
            case 5:
            case 6:
              ghostsCorner = "top-left";
              break;
          }
          break;
        case 8:
          switch (index) {
            case 0:
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
            case 3:
            case 4:
              ghostsCorner = "bottom-right";
              break;
            case 5:
              ghostsCorner = "bottom-left";
              break;
            case 6:
            case 7:
              ghostsCorner = "top-left";
              break;
          }
          break;
      }

      ghosts = true;
    }
  });
  if (!ghosts) {
    mapString.split(" ").forEach((system) => {
      if (system === "17") {
        ghosts = true;
        ghostsCorner = "bottom-right";
      }
    });
  }

  return (
    <div className={styles.Map}>
      {gameId && !hideLegend ? (
        <div className={styles.Legend}>
          <LabeledDiv
            label={
              <FormattedMessage
                id="5rR4S2"
                description="Label for a section that includes map details."
                defaultMessage="View Details"
              />
            }
            style={{
              width: "fit-content",
              backgroundColor: "#222",
              justifyContent: "stretch",
              alignItems: "stretch",
              paddingTop: "16px",
            }}
          >
            <div className={styles.LegendContent}>
              <button
                className={showDetails === "OWNERS" ? "selected" : ""}
                onClick={(e) => {
                  const newValue = showDetails === "OWNERS" ? "NONE" : "OWNERS";
                  setShowDetails(newValue);
                  e.stopPropagation();
                }}
              >
                <FormattedMessage
                  id="FhKQXR"
                  description="Text on a button that will show planet ownership."
                  defaultMessage="Owners"
                />
              </button>
              <button
                className={showDetails === "TYPES" ? "selected" : ""}
                onClick={(e) => {
                  const newValue = showDetails === "TYPES" ? "NONE" : "TYPES";
                  setShowDetails(newValue);
                  e.stopPropagation();
                }}
              >
                <FormattedMessage
                  id="wDLqxZ"
                  description="Text on a button that will show planet types."
                  defaultMessage="Types"
                />
              </button>
              <button
                className={showDetails === "TECH_SKIPS" ? "selected" : ""}
                onClick={(e) => {
                  const newValue =
                    showDetails === "TECH_SKIPS" ? "NONE" : "TECH_SKIPS";
                  setShowDetails(newValue);
                  e.stopPropagation();
                }}
              >
                <FormattedMessage
                  id="j3n7Nr"
                  description="Text on a button that will show planets with tech skips."
                  defaultMessage="Tech Skips"
                />
              </button>
              <button
                className={showDetails === "ATTACHMENTS" ? "selected" : ""}
                onClick={(e) => {
                  const newValue =
                    showDetails === "ATTACHMENTS" ? "NONE" : "ATTACHMENTS";
                  setShowDetails(newValue);
                  e.stopPropagation();
                }}
              >
                <FormattedMessage
                  id="1odgd1"
                  description="Text on a button that will show planet attachments."
                  defaultMessage="Attachments"
                />
              </button>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
      <div className={styles.MapBody}>
        {spiral.map((cube, index) => {
          const point = CubeToPixel(cube, tilePercentage * HEX_RATIO);
          let tile = updatedSystemTiles[index];
          if (!tile || tile === "-1") {
            return null;
          }
          return (
            <div
              className="flexRow"
              key={index}
              style={{
                position: "absolute",
                width: `${tilePercentage * HEX_RATIO}%`,
                height: `${tilePercentage}%`,
                marginLeft: `${point.x}%`,
                marginTop: `${point.y}%`,
              }}
            >
              <SystemImage
                gameId={gameId}
                showDetails={showDetails}
                systemNumber={tile}
              />
            </div>
          );
        })}
        {ghosts ? (
          <div
            style={{
              position: "absolute",
              right:
                ghostsCorner === "top-right" || ghostsCorner === "bottom-right"
                  ? "4%"
                  : undefined,
              bottom:
                ghostsCorner === "bottom-right" ||
                ghostsCorner === "bottom-left"
                  ? "4%"
                  : undefined,
              left:
                ghostsCorner === "bottom-left" || ghostsCorner === "top-left"
                  ? "4%"
                  : undefined,
              top:
                ghostsCorner === "top-right" || ghostsCorner === "top-left"
                  ? "4%"
                  : undefined,
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              gameId={gameId}
              showDetails={showDetails}
              systemNumber="51"
            />
          </div>
        ) : null}
        {mallice ? (
          <div
            style={{
              position: "absolute",
              left: ghostsCorner !== "bottom-left" ? "4%" : undefined,
              right: ghostsCorner === "bottom-left" ? "4%" : undefined,
              bottom: "4%",
              width: `${tilePercentage * HEX_RATIO}%`,
              height: `${tilePercentage * HEX_RATIO}%`,
            }}
          >
            <SystemImage
              gameId={gameId}
              showDetails={showDetails}
              systemNumber={mallice === "PURGED" ? "81" : `82${mallice}`}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
