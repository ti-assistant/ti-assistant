import Image from "next/image";

function FactionSystemImage({
  className,
  factionName,
}: {
  className?: string;
  factionName: string;
}) {
  if (
    !factionName ||
    factionName === "Council Keleres" ||
    factionName === "ST_0"
  ) {
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          src="/images/systems/ST_0.png"
          alt={`Faction Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }
  const adjustedFactionName = factionName.replace("'", "");
  return (
    <div
      className={`flexRow ${className}`}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Image
        src={`/images/systems/${adjustedFactionName}.png`}
        alt={`${factionName}'s Home System`}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}

function validSystemNumber(number: string) {
  let intVal = parseInt(number);
  if (isNaN(intVal)) {
    return false;
  }
  if (
    intVal < 19 ||
    (intVal > 50 && intVal < 59) ||
    intVal === 81 ||
    intVal === 82 ||
    intVal > 91
  ) {
    return false;
  }
  return true;
}

function SystemImage({ systemNumber }: { systemNumber: string | undefined }) {
  if (!systemNumber || !validSystemNumber(systemNumber)) {
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          style={{ opacity: "10%" }}
          src="/images/systems/Hexagon.png"
          alt={`System Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }
  const checkForA = systemNumber.split("A");
  if (checkForA.length > 1) {
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          src={`/images/systems/ST_${checkForA[0]}A.png`}
          alt={`System ${systemNumber} Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }
  const checkForB = systemNumber.split("B");
  if (checkForB.length > 1) {
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          src={`/images/systems/ST_${checkForB[0]}A.png`}
          alt={`System ${systemNumber} Tile`}
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }
  if (parseInt(systemNumber) > 81) {
    return (
      <div
        className="flexRow"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Image
          style={{ opacity: "10%" }}
          src="/images/systems/Hexagon.png"
          alt={`System Tile`}
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
      <Image
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        layout="fill"
        objectFit="contain"
      />
      {/* TODO: Display planet owners on map.
    <div className="flexRow" style={{position: "absolute", backgroundColor: "#222", borderRadius: "100%", left: "10px", top: "25px", width: "18px", height: "18px", border: "1px solid red"}}>
      <div className="flexRow" style={{position: "relative", width: "90%", height: "90%"}}>
        <FullFactionSymbol faction={"Vuil'Raith Cabal"} />
      </div>
    </div> */}
    </div>
  );
}

export interface MapProps {
  mapString: string;
  mapStyle: string;
  mallice?: string;
  factions: {
    name?: string;
    startswith?: {
      faction?: string;
    };
  }[];
}

export function Map({ mapString, mapStyle, mallice, factions }: MapProps) {
  const systemTiles = mapString.split(" ");

  let numColumns = 7;
  if (factions.length > 6 || mapStyle === "large") {
    numColumns = 9;
  }

  let ghosts = false;
  let ghostsCorner = null;
  const updatedFactions = factions.map((faction, index) => {
    if (
      faction.name === "Council Keleres" &&
      faction.startswith &&
      faction.startswith.faction
    ) {
      return {
        ...faction,
        name: faction.startswith.faction,
      };
    }
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
    return faction;
  });

  type SystemValue = number | string | null;

  type Columns = [
    [SystemValue, SystemValue, SystemValue, SystemValue, SystemValue],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue,
      SystemValue
    ],
    [SystemValue, SystemValue, SystemValue, SystemValue, SystemValue]
  ];

  let columns: Columns = [
    [56, 55, 54, 53, 52],
    [57, 33, 32, 31, 30, 51],
    [58, 34, 16, 15, 14, 29, 50],
    [59, 35, 17, 5, 4, 13, 28, 49],
    [36, 18, 6, 0, "Mecatol Rex", 3, 12, 27, 48],
    [37, 19, 7, 1, 2, 11, 26, 47],
    [38, 20, 8, 9, 10, 25, 46],
    [39, 21, 22, 23, 24, 45],
    [40, 41, 42, 43, 44],
  ];

  function clearOuterRing() {
    columns[0] = [null, null, null, null, null];
    columns[1][0] = null;
    columns[1][5] = null;
    columns[2][0] = null;
    columns[2][6] = null;
    columns[3][0] = null;
    columns[3][7] = null;
    columns[4][0] = null;
    columns[4][8] = null;
    columns[5][0] = null;
    columns[5][7] = null;
    columns[6][0] = null;
    columns[6][6] = null;
    columns[7][0] = null;
    columns[7][5] = null;
    columns[8] = [null, null, null, null, null];
  }

  // Set special tiles.
  switch (updatedFactions.length) {
    case 3:
      if (!updatedFactions[0] || !updatedFactions[1] || !updatedFactions[2]) {
        break;
      }
      clearOuterRing();
      columns[7][1] = updatedFactions[0].name ?? "ST_0";
      columns[7][3] = "empty";
      columns[7][4] = "empty";
      columns[3][1] = "empty";
      columns[4][1] = "empty";
      columns[5][1] = "empty";
      columns[4][7] = updatedFactions[1].name ?? "ST_0";
      columns[1][1] = updatedFactions[2].name ?? "ST_0";
      columns[1][3] = "empty";
      columns[1][4] = "empty";
      columns[2][5] = "empty";
      columns[6][5] = "empty";
      break;
    case 4:
      if (
        !updatedFactions[0] ||
        !updatedFactions[1] ||
        !updatedFactions[2] ||
        !updatedFactions[3]
      ) {
        break;
      }
      clearOuterRing();
      columns[3][1] = updatedFactions[0].name ?? "ST_0";
      columns[7][2] = updatedFactions[1].name ?? "ST_0";
      columns[5][6] = updatedFactions[2].name ?? "ST_0";
      columns[1][3] = updatedFactions[3].name ?? "ST_0";
      break;
    case 5:
      if (
        !updatedFactions[0] ||
        !updatedFactions[1] ||
        !updatedFactions[2] ||
        !updatedFactions[3] ||
        !updatedFactions[4]
      ) {
        break;
      }
      clearOuterRing();
      switch (mapStyle) {
        case "standard":
          columns[6][1] = updatedFactions[0].name ?? "ST_0";
          columns[7][4] = updatedFactions[1].name ?? "ST_0";
          columns[4][7] = updatedFactions[2].name ?? "ST_0";
          columns[1][4] = updatedFactions[3].name ?? "ST_0";
          columns[2][1] = updatedFactions[4].name ?? "ST_0";
          break;
        case "skinny":
          columns[6][1] = updatedFactions[0].name ?? "ST_0";
          columns[7][3] = updatedFactions[1].name ?? "ST_0";
          columns[4][7] = updatedFactions[2].name ?? "ST_0";
          columns[1][3] = updatedFactions[3].name ?? "ST_0";
          columns[2][1] = updatedFactions[4].name ?? "ST_0";
          columns[1][1] = "empty";
          columns[1][4] = "empty";
          columns[2][5] = "empty";
          columns[7][1] = "empty";
          columns[7][4] = "empty";
          columns[6][5] = "empty";
          break;
        case "warp":
          columns[4][1] = updatedFactions[0].name ?? "ST_0";
          columns[7][1] = updatedFactions[1].name ?? "ST_0";
          columns[7][4] = updatedFactions[2].name ?? "ST_0";
          columns[1][4] = updatedFactions[3].name ?? "ST_0";
          columns[1][1] = updatedFactions[4].name ?? "ST_0";
          columns[4][5] = "ST_86A";
          columns[3][5] = "ST_87A";
          columns[3][6] = "ST_84A";
          columns[4][7] = "ST_85A";
          columns[5][5] = "ST_88A";
          columns[5][6] = "ST_83A";
          break;
      }
      break;
    case 6:
      if (
        !updatedFactions[0] ||
        !updatedFactions[1] ||
        !updatedFactions[2] ||
        !updatedFactions[3] ||
        !updatedFactions[4] ||
        !updatedFactions[5]
      ) {
        break;
      }
      switch (mapStyle) {
        case "standard":
          clearOuterRing();
          columns[4][1] = updatedFactions[0].name ?? "ST_0";
          columns[7][1] = updatedFactions[1].name ?? "ST_0";
          columns[7][4] = updatedFactions[2].name ?? "ST_0";
          columns[4][7] = updatedFactions[3].name ?? "ST_0";
          columns[1][4] = updatedFactions[4].name ?? "ST_0";
          columns[1][1] = updatedFactions[5].name ?? "ST_0";
          break;
        case "large":
          columns[4][0] = updatedFactions[0].name ?? "ST_0";
          columns[8][0] = updatedFactions[1].name ?? "ST_0";
          columns[8][4] = updatedFactions[2].name ?? "ST_0";
          columns[4][8] = updatedFactions[3].name ?? "ST_0";
          columns[0][4] = updatedFactions[4].name ?? "ST_0";
          columns[0][0] = updatedFactions[5].name ?? "ST_0";
          break;
      }
      break;
    case 7:
      if (
        !updatedFactions[0] ||
        !updatedFactions[1] ||
        !updatedFactions[2] ||
        !updatedFactions[3] ||
        !updatedFactions[4] ||
        !updatedFactions[5] ||
        !updatedFactions[6]
      ) {
        break;
      }
      switch (mapStyle) {
        case "standard":
          columns[4][0] = updatedFactions[0].name ?? "ST_0";
          columns[7][0] = updatedFactions[1].name ?? "ST_0";
          columns[8][2] = updatedFactions[2].name ?? "ST_0";
          columns[7][5] = updatedFactions[3].name ?? "ST_0";
          columns[1][5] = updatedFactions[4].name ?? "ST_0";
          columns[0][2] = updatedFactions[5].name ?? "ST_0";
          columns[1][0] = updatedFactions[6].name ?? "ST_0";
          columns[4][6] = "ST_86A";
          columns[3][6] = "ST_87A";
          columns[3][7] = "ST_84A";
          columns[4][8] = "ST_85A";
          columns[5][6] = "ST_88A";
          columns[5][7] = "ST_83A";
          break;
        case "warp":
          columns[8] = ["empty", "empty", "empty", "empty", "empty"];
          columns[4][0] = updatedFactions[0].name ?? "ST_0";
          columns[7][1] = updatedFactions[1].name ?? "ST_0";
          columns[7][4] = updatedFactions[2].name ?? "ST_0";
          columns[4][8] = updatedFactions[3].name ?? "ST_0";
          columns[1][5] = updatedFactions[4].name ?? "ST_0";
          columns[0][2] = updatedFactions[5].name ?? "ST_0";
          columns[1][0] = updatedFactions[6].name ?? "ST_0";
          columns[0][0] = "empty";
          columns[0][3] = "empty";
          columns[0][4] = "empty";
          columns[7][0] = "empty";
          columns[7][5] = "empty";
          columns[6][0] = "empty";
          columns[6][6] = "empty";
          columns[1][2] = "rotateOneTwenty:ST_83B";
          columns[3][4] = "ST_90B";
          columns[4][3] = "ST_85B";
          columns[4][5] = "ST_84B";
          columns[5][1] = "rotateOneEighty:ST_88B";
          columns[5][6] = "ST_86B";
          break;
      }
      break;
    case 8:
      if (
        !updatedFactions[0] ||
        !updatedFactions[1] ||
        !updatedFactions[2] ||
        !updatedFactions[3] ||
        !updatedFactions[4] ||
        !updatedFactions[5] ||
        !updatedFactions[6] ||
        !updatedFactions[7]
      ) {
        break;
      }
      columns[4][0] = updatedFactions[0].name ?? "ST_0";
      columns[7][0] = updatedFactions[1].name ?? "ST_0";
      columns[8][2] = updatedFactions[2].name ?? "ST_0";
      columns[7][5] = updatedFactions[3].name ?? "ST_0";
      columns[4][8] = updatedFactions[4].name ?? "ST_0";
      columns[1][5] = updatedFactions[5].name ?? "ST_0";
      columns[0][2] = updatedFactions[6].name ?? "ST_0";
      columns[1][0] = updatedFactions[7].name ?? "ST_0";
      switch (mapStyle) {
        case "warp":
          columns[0][0] = "empty";
          columns[0][3] = "empty";
          columns[0][4] = "empty";
          columns[8][0] = "empty";
          columns[8][1] = "empty";
          columns[8][4] = "empty";
          columns[3][4] = "ST_89B";
          columns[5][3] = "rotateOneEighty:ST_90B";
          columns[4][3] = "rotateSixty:ST_87A";
          columns[4][5] = "rotateOneTwenty:ST_88A";
          columns[1][2] = "rotateOneTwenty:ST_83B";
          columns[7][3] = "rotateOneTwenty:ST_85B";
          break;
      }
  }

  const classnames = "flexRow map";

  return (
    <div
      className={classnames}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "1%",
        boxSizing: "border-box",
        gap: 0,
      }}
    >
      {columns.map((column, index) => {
        if (numColumns === 7 && (index === 0 || index === 8)) {
          return null;
        }
        let classNames =
          numColumns === 9 ? "eightPlayerMapColumn" : "mapColumn";
        const nonNullTiles = column.filter((tile) => tile !== null);
        switch (nonNullTiles.length) {
          case 9:
            classNames += " nineTiles";
            break;
          case 8:
            classNames += " eightTiles";
            break;
          case 7:
            classNames += " sevenTiles";
            break;
          case 6:
            classNames += " sixTiles";
            break;
          case 5:
            classNames += " fiveTiles";
            break;
          case 4:
            classNames += " fourTiles";
            break;
        }
        switch (index) {
          case 0:
            classNames += " leftFour";
            break;
          case 1:
            classNames += " leftThree";
            break;
          case 2:
            classNames += " leftTwo";
            break;
          case 3:
            classNames += " leftOne";
            break;
          case 5:
            classNames += " rightOne";
            break;
          case 6:
            classNames += " rightTwo";
            break;
          case 7:
            classNames += " rightThree";
            break;
          case 8:
            classNames += " rightFour";
            break;
        }

        return (
          <div
            key={index}
            className={classNames}
            style={{ overflow: "visible" }}
          >
            {column.map((tileNum, subIndex) => {
              const key = tileNum + "-" + subIndex;
              if (tileNum === null) {
                return null;
              }
              if (tileNum === "empty") {
                return (
                  <div
                    key={key}
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  ></div>
                );
              }
              if (typeof tileNum === "string") {
                let classNames = "";
                if (tileNum.split(":").length > 1) {
                  classNames = tileNum.split(":")[0] ?? "";
                  tileNum = tileNum.split(":")[1] ?? "";
                }
                return (
                  <FactionSystemImage
                    key={key}
                    className={classNames}
                    factionName={tileNum}
                  />
                );
              }
              // if (systemTiles[tileNum]) {
              return (
                <SystemImage
                  key={key}
                  systemNumber={systemTiles[tileNum] ?? "0"}
                />
              );
              // }
            })}
          </div>
        );
      })}
      {ghosts ? (
        <div
          style={{
            position: "absolute",
            right:
              ghostsCorner === "top-right" || ghostsCorner === "bottom-right"
                ? "8%"
                : undefined,
            bottom:
              ghostsCorner === "bottom-right" || ghostsCorner === "bottom-left"
                ? "8%"
                : undefined,
            left:
              ghostsCorner === "bottom-left" || ghostsCorner === "top-left"
                ? "8%"
                : undefined,
            top:
              ghostsCorner === "top-right" || ghostsCorner === "top-left"
                ? "8%"
                : undefined,
            width: numColumns === 7 ? "14%" : "12%",
            height: numColumns === 7 ? "14%" : "12%",
          }}
        >
          <FactionSystemImage factionName={`ST_51`} />
        </div>
      ) : null}
      {mallice ? (
        <div
          style={{
            position: "absolute",
            left: ghostsCorner !== "bottom-left" ? "8%" : undefined,
            right: ghostsCorner === "bottom-left" ? "8%" : undefined,
            bottom: "8%",
            width: numColumns === 7 ? "14%" : "12%",
            height: numColumns === 7 ? "14%" : "12%",
          }}
        >
          <FactionSystemImage factionName={`ST_82${mallice}`} />
        </div>
      ) : null}
    </div>
  );
}
