import NextImage from "next/image";

import Hexagon from "../../public/images/systems/Hexagon.png";
import { ReactNode, useEffect, useState } from "react";
import { MapStyle } from "./api/setup";
import { FullFactionSymbol } from "../FactionCard";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Attachment } from "./api/attachments";
import { Faction } from "./api/factions";
import { fetcher } from "./api/util";
import { Planet } from "./api/planets";
import { LabeledDiv } from "../LabeledDiv";

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

const FACTION_TO_SYSTEM_NUMBER: Record<string, string> = {
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
} as const;

function getFactionSystemNumber(
  faction:
    | {
        name?: string;
        startswith?: {
          faction?: string;
        };
      }
    | undefined
) {
  if (!faction?.name) {
    return "92";
  }
  if (faction.name === "Council Keleres") {
    return FACTION_TO_SYSTEM_NUMBER[faction.startswith?.faction ?? ""] ?? "92";
  }
  return FACTION_TO_SYSTEM_NUMBER[faction.name] ?? "92";
}

function getBaseSystemTiles(
  factions: {
    name?: string;
    startswith?: {
      faction?: string;
    };
  }[],
  mapStyle: MapStyle
) {
  let systemTiles: string[] = new Array(61).fill("0", 0);
  systemTiles[0] = "18";
  switch (factions.length) {
    case 3:
      delete systemTiles[19];
      delete systemTiles[20];
      systemTiles[22] = getFactionSystemNumber(factions[0]);
      delete systemTiles[24];
      delete systemTiles[25];
      delete systemTiles[26];
      systemTiles[28] = getFactionSystemNumber(factions[1]);
      delete systemTiles[30];
      delete systemTiles[31];
      delete systemTiles[32];
      systemTiles[34] = getFactionSystemNumber(factions[2]);
      delete systemTiles[36];
      break;
    case 4:
      systemTiles[36] = getFactionSystemNumber(factions[0]);
      systemTiles[23] = getFactionSystemNumber(factions[1]);
      systemTiles[27] = getFactionSystemNumber(factions[2]);
      systemTiles[32] = getFactionSystemNumber(factions[3]);
      break;
    case 5:
      switch (mapStyle) {
        case "standard":
          systemTiles[21] = getFactionSystemNumber(factions[0]);
          systemTiles[25] = getFactionSystemNumber(factions[1]);
          systemTiles[28] = getFactionSystemNumber(factions[2]);
          systemTiles[31] = getFactionSystemNumber(factions[3]);
          systemTiles[35] = getFactionSystemNumber(factions[4]);
          break;
        case "skinny":
          systemTiles[21] = getFactionSystemNumber(factions[0]);
          delete systemTiles[22];
          systemTiles[24] = getFactionSystemNumber(factions[1]);
          delete systemTiles[25];
          delete systemTiles[26];
          systemTiles[28] = getFactionSystemNumber(factions[2]);
          delete systemTiles[30];
          delete systemTiles[31];
          systemTiles[32] = getFactionSystemNumber(factions[3]);
          delete systemTiles[34];
          systemTiles[35] = getFactionSystemNumber(factions[4]);
          break;
        case "warp":
          systemTiles[4] = "86A";
          systemTiles[12] = "88A";
          systemTiles[14] = "87A";
          systemTiles[19] = getFactionSystemNumber(factions[0]);
          systemTiles[22] = getFactionSystemNumber(factions[1]);
          systemTiles[25] = getFactionSystemNumber(factions[2]);
          systemTiles[27] = "83A";
          systemTiles[28] = "85A";
          systemTiles[29] = "84A";
          systemTiles[31] = getFactionSystemNumber(factions[3]);
          systemTiles[34] = getFactionSystemNumber(factions[4]);
          break;
      }
      break;
    case 6:
      switch (mapStyle) {
        case "standard":
          systemTiles[19] = getFactionSystemNumber(factions[0]);
          systemTiles[22] = getFactionSystemNumber(factions[1]);
          systemTiles[25] = getFactionSystemNumber(factions[2]);
          systemTiles[28] = getFactionSystemNumber(factions[3]);
          systemTiles[31] = getFactionSystemNumber(factions[4]);
          systemTiles[34] = getFactionSystemNumber(factions[5]);
          break;
        case "large":
          systemTiles[37] = getFactionSystemNumber(factions[0]);
          systemTiles[41] = getFactionSystemNumber(factions[1]);
          systemTiles[45] = getFactionSystemNumber(factions[2]);
          systemTiles[49] = getFactionSystemNumber(factions[3]);
          systemTiles[53] = getFactionSystemNumber(factions[4]);
          systemTiles[57] = getFactionSystemNumber(factions[5]);
          break;
      }
      break;
    case 7:
      switch (mapStyle) {
        case "standard":
          systemTiles[13] = "86A";
          systemTiles[27] = "88A";
          systemTiles[29] = "87A";
          systemTiles[37] = getFactionSystemNumber(factions[0]);
          systemTiles[40] = getFactionSystemNumber(factions[1]);
          systemTiles[43] = getFactionSystemNumber(factions[2]);
          systemTiles[46] = getFactionSystemNumber(factions[3]);
          systemTiles[48] = "83A";
          systemTiles[49] = "85A";
          systemTiles[50] = "84A";
          systemTiles[52] = getFactionSystemNumber(factions[4]);
          systemTiles[55] = getFactionSystemNumber(factions[5]);
          systemTiles[58] = getFactionSystemNumber(factions[6]);
          break;
        case "warp":
          systemTiles[1] = "85B";
          systemTiles[4] = "84B";
          systemTiles[5] = "90B";
          systemTiles[20] = "rotateOneEighty:88B";
          systemTiles[22] = getFactionSystemNumber(factions[1]);
          systemTiles[25] = getFactionSystemNumber(factions[2]);
          systemTiles[27] = "86B";
          systemTiles[33] = "rotateOneTwenty:83B";
          systemTiles[37] = getFactionSystemNumber(factions[0]);
          for (let i = 39; i < 48; i++) {
            delete systemTiles[i];
          }
          systemTiles[49] = getFactionSystemNumber(factions[3]);
          systemTiles[52] = getFactionSystemNumber(factions[4]);
          delete systemTiles[53];
          delete systemTiles[54];
          systemTiles[55] = getFactionSystemNumber(factions[5]);
          delete systemTiles[57];
          systemTiles[58] = getFactionSystemNumber(factions[6]);
          break;
      }
      break;
    case 8:
      systemTiles[37] = getFactionSystemNumber(factions[0]);
      systemTiles[40] = getFactionSystemNumber(factions[1]);
      systemTiles[43] = getFactionSystemNumber(factions[2]);
      systemTiles[46] = getFactionSystemNumber(factions[3]);
      systemTiles[49] = getFactionSystemNumber(factions[4]);
      systemTiles[52] = getFactionSystemNumber(factions[5]);
      systemTiles[55] = getFactionSystemNumber(factions[6]);
      systemTiles[58] = getFactionSystemNumber(factions[7]);
      break;
  }
  return systemTiles;
}

function validSystemNumber(number: string) {
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return false;
  }
  if (intVal === 81 || intVal > 92) {
    return false;
  }
  return true;
}

function SystemImage({
  showOwners,
  systemNumber,
}: {
  showOwners: boolean;
  systemNumber: string | undefined;
}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  if (
    !systemNumber ||
    systemNumber === "0" ||
    !validSystemNumber(systemNumber)
  ) {
    if (systemNumber && systemNumber.split(":").length > 1) {
      const classNames = systemNumber.split(":")[0] ?? "";
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
          <div
            className="hiddenButton"
            style={{
              position: "absolute",
              width: "175%",
              height: "175%",
            }}
          >
            <NextImage
              src={`/images/systems/ST_${systemNumber}.png`}
              alt={`System ${systemNumber} Tile`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <NextImage
            src={`/images/systems/ST_${systemNumber}.png`}
            alt={`System ${systemNumber} Tile`}
            layout="fill"
            objectFit="contain"
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
          style={{ opacity: "10%" }}
          src={Hexagon}
          alt={`System Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }

  const systemPlanets = Object.values(planets ?? {}).filter((planet) => {
    if (!systemNumber) {
      return false;
    }
    if (systemNumber === "82A" || systemNumber === "82B") {
      return planet.system === 82;
    }
    return planet.system === parseInt(systemNumber);
  });

  return (
    <div
      className={`flexRow`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="hiddenButton"
        style={{
          position: "absolute",
          width: "175%",
          height: "175%",
        }}
      >
        <NextImage
          src={`/images/systems/ST_${systemNumber}.png`}
          alt={`System ${systemNumber} Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <NextImage
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        layout="fill"
        objectFit="contain"
      />
      {systemPlanets.map((planet) => {
        let ownerSymbol: ReactNode | null = null;
        if (planet.owner && showOwners) {
          const height =
            planet.name !== "Mallice" && planet.name !== "Creuss"
              ? `calc(24% * ${HEX_RATIO})`
              : "24%";
          ownerSymbol = (
            <div
              className="flexRow"
              style={{
                position: "absolute",
                backgroundColor: "#222",
                borderRadius: "100%",
                width: "24%",
                height: height,
                marginLeft: `${planet.position?.x}%` ?? 0,
                marginTop: `${planet.position?.y}%` ?? 0,
              }}
            >
              <div
                className="flexRow"
                style={{ position: "relative", width: "75%", height: "75%" }}
              >
                <FullFactionSymbol faction={planet.owner} />
              </div>
            </div>
          );
        }

        return (
          <div
            key={planet.name}
            className="flexRow"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            {ownerSymbol}
          </div>
        );
      })}
      {
        gameid && systemNumber === "18" && !systemPlanets[0]?.owner ? (
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
                layout="fill"
                objectFit="contain"
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

export interface MapProps {
  mapString: string;
  mapStyle: MapStyle;
  mallice?: string;
  factions: {
    name?: string;
    startswith?: {
      faction?: string;
    };
  }[];
}

const IMAGES_TO_PRELOAD = [
  // Systems
  "/images/systems/Hexagon.png",
  "/images/systems/ST_1.png",
  "/images/systems/ST_2.png",
  "/images/systems/ST_3.png",
  "/images/systems/ST_4.png",
  "/images/systems/ST_5.png",
  "/images/systems/ST_6.png",
  "/images/systems/ST_7.png",
  "/images/systems/ST_8.png",
  "/images/systems/ST_9.png",
  "/images/systems/ST_10.png",
  "/images/systems/ST_11.png",
  "/images/systems/ST_12.png",
  "/images/systems/ST_13.png",
  "/images/systems/ST_14.png",
  "/images/systems/ST_15.png",
  "/images/systems/ST_16.png",
  "/images/systems/ST_17.png",
  "/images/systems/ST_18.png",
  "/images/systems/ST_19.png",
  "/images/systems/ST_20.png",
  "/images/systems/ST_21.png",
  "/images/systems/ST_22.png",
  "/images/systems/ST_23.png",
  "/images/systems/ST_24.png",
  "/images/systems/ST_25.png",
  "/images/systems/ST_26.png",
  "/images/systems/ST_27.png",
  "/images/systems/ST_28.png",
  "/images/systems/ST_29.png",
  "/images/systems/ST_30.png",
  "/images/systems/ST_31.png",
  "/images/systems/ST_32.png",
  "/images/systems/ST_33.png",
  "/images/systems/ST_34.png",
  "/images/systems/ST_35.png",
  "/images/systems/ST_36.png",
  "/images/systems/ST_37.png",
  "/images/systems/ST_38.png",
  "/images/systems/ST_39.png",
  "/images/systems/ST_40.png",
  "/images/systems/ST_41.png",
  "/images/systems/ST_42.png",
  "/images/systems/ST_43.png",
  "/images/systems/ST_44.png",
  "/images/systems/ST_45.png",
  "/images/systems/ST_46.png",
  "/images/systems/ST_47.png",
  "/images/systems/ST_48.png",
  "/images/systems/ST_49.png",
  "/images/systems/ST_50.png",
  "/images/systems/ST_51.png",
  "/images/systems/ST_52.png",
  "/images/systems/ST_53.png",
  "/images/systems/ST_54.png",
  "/images/systems/ST_55.png",
  "/images/systems/ST_56.png",
  "/images/systems/ST_57.png",
  "/images/systems/ST_58.png",
  "/images/systems/ST_59.png",
  "/images/systems/ST_60.png",
  "/images/systems/ST_61.png",
  "/images/systems/ST_62.png",
  "/images/systems/ST_63.png",
  "/images/systems/ST_64.png",
  "/images/systems/ST_65.png",
  "/images/systems/ST_66.png",
  "/images/systems/ST_67.png",
  "/images/systems/ST_68.png",
  "/images/systems/ST_69.png",
  "/images/systems/ST_70.png",
  "/images/systems/ST_71.png",
  "/images/systems/ST_72.png",
  "/images/systems/ST_73.png",
  "/images/systems/ST_74.png",
  "/images/systems/ST_75.png",
  "/images/systems/ST_76.png",
  "/images/systems/ST_77.png",
  "/images/systems/ST_78.png",
  "/images/systems/ST_79.png",
  "/images/systems/ST_80.png",
  "/images/systems/ST_81.png",
  "/images/systems/ST_82A.png",
  "/images/systems/ST_82B.png",
  "/images/systems/ST_83A.png",
  "/images/systems/ST_83B.png",
  "/images/systems/ST_84A.png",
  "/images/systems/ST_84B.png",
  "/images/systems/ST_85A.png",
  "/images/systems/ST_85B.png",
  "/images/systems/ST_86A.png",
  "/images/systems/ST_86B.png",
  "/images/systems/ST_87A.png",
  "/images/systems/ST_87B.png",
  "/images/systems/ST_88A.png",
  "/images/systems/ST_88B.png",
  "/images/systems/ST_89A.png",
  "/images/systems/ST_89B.png",
  "/images/systems/ST_90A.png",
  "/images/systems/ST_90B.png",
  "/images/systems/ST_91A.png",
  "/images/systems/ST_91B.png",
  "/images/systems/ST_92.png",
];

export function Map({ mapString, mapStyle, mallice, factions }: MapProps) {
  const router = useRouter();
  const { game: gameid } = router.query;

  const [showOwners, setShowOwners] = useState(false);

  useEffect(() => {
    for (const img of IMAGES_TO_PRELOAD) {
      let image = new Image();
      image.src = img;
    }
  }, []);

  const systemTiles = getBaseSystemTiles(factions, mapStyle);
  let updatedSystemTiles = ["18"].concat(...mapString.split(" "));
  updatedSystemTiles = systemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      return updatedTile;
    }
    return tile;
  });

  let numRings = 4;
  if (factions.length > 6 || mapStyle === "large") {
    numRings = 5;
  }
  const largestDimension = numRings * 2 - 1;
  const tilePercentage = 98 / largestDimension;

  const spiral = cubeSpiral(Cube(0, 0, 0), numRings);

  let ghosts = false;
  let ghostsCorner = null;
  factions.forEach((faction, index) => {
    if (faction.name === "Ghosts of Creuss") {
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
              ghostsCorner = "top-left";
              break;
            case 1:
              ghostsCorner = "top-right";
              break;
            case 2:
              ghostsCorner = "bottom-right";
              break;
            case 3:
              ghostsCorner = "bottom-left";
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

  return (
    <div className="flexRow" style={{ height: "100%", width: "100%" }}>
      {gameid ? (
        <LabeledDiv
          label="View Details"
          style={{
            position: "absolute",
            marginLeft: "-120%",
            width: "fit-content",
            backgroundColor: "#222",
          }}
        >
          <button
            className={showOwners ? "selected" : ""}
            onClick={(e) => {
              setShowOwners(!showOwners);
              e.stopPropagation();
            }}
          >
            Show Owners
          </button>
        </LabeledDiv>
      ) : null}
      {spiral.map((cube, index) => {
        const point = CubeToPixel(cube, tilePercentage * HEX_RATIO);
        let tile = updatedSystemTiles[index];
        if (!tile) {
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
            <SystemImage showOwners={showOwners} systemNumber={tile} />
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
              ghostsCorner === "bottom-right" || ghostsCorner === "bottom-left"
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
          <SystemImage showOwners={showOwners} systemNumber="51" />
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
          <SystemImage showOwners={showOwners} systemNumber={`82${mallice}`} />
        </div>
      ) : null}
    </div>
  );
}
