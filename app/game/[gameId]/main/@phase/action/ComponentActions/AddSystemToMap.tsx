import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import GameMap from "../../../../../../../src/components/Map/GameMap";
import MapBuilder, {
  SystemImage,
} from "../../../../../../../src/components/MapBuilder/MapBuilder";
import {
  useCurrentTurn,
  useGameId,
  useOptions,
  usePlanets,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import { swapMapTilesAsync } from "../../../../../../../src/dynamic/api";
import { wereTilesSwapped } from "../../../../../../../src/util/actionLog";
import {
  getFactionSystemNumber,
  getWormholeNexusSystemNumber,
  updateMapString,
} from "../../../../../../../src/util/map";
import { getMapString } from "../../../../../../../src/util/options";
import { rem } from "../../../../../../../src/util/util";

const AddSystemToMap = {
  Content,
  LeftLabel,
};

export default AddSystemToMap;

function LeftLabel() {
  const currentTurn = useCurrentTurn();
  const alreadyUsed = wereTilesSwapped(currentTurn);

  return alreadyUsed ? "Updated Map" : "Add System";
}

function Content({
  requiredNeighbors,
  nonHomeNeighbors,
}: {
  requiredNeighbors: number;
  nonHomeNeighbors: boolean;
}) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const options = useOptions();
  const planets = usePlanets();

  const mapString = getMapString(options, mapOrderedFactionIds.length);
  if (!mapString) {
    return null;
  }

  let updatedMapString =
    mapString === ""
      ? updateMapString(
          mapString,
          options["map-style"],
          mapOrderedFactionIds.length
        )
      : mapString;
  let updatedSystemTiles = updatedMapString.split(" ");
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      return updatedTile;
    }
    if (tile.startsWith("P")) {
      const number = tile.at(tile.length - 1);
      if (!number) {
        return tile;
      }
      const factionIndex = parseInt(number);
      const factionId = mapOrderedFactionIds[factionIndex - 1];
      if (!factionId) {
        return tile;
      }
      return getFactionSystemNumber(factions[factionId]);
    }
    return tile;
  });
  updatedMapString = updatedSystemTiles.join(" ");
  let tileNumbers: string[] = [];
  for (let i = 19; i < 51; i++) {
    tileNumbers.push(i.toString());
  }
  if (options.expansions.includes("POK")) {
    for (let i = 59; i < 81; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (options.expansions.includes("THUNDERS EDGE")) {
    for (let i = 97; i < 118; i++) {
      tileNumbers.push(i.toString());
    }
  }
  if (options.expansions.includes("DISCORDANT STARS")) {
    for (let i = 4253; i < 4270; i++) {
      tileNumbers.push(i.toString());
    }
  }
  const alreadyUsed = wereTilesSwapped(currentTurn);

  if (alreadyUsed) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
        <GameMap
          mapString={mapString}
          mapStyle={options["map-style"]}
          factions={Object.values(factions)}
          hideLegend
          hideFracture
          wormholeNexus={getWormholeNexusSystemNumber(
            options,
            planets,
            factions
          )}
          planets={planets}
          expansions={options.expansions}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <DndProvider backend={HTML5Backend}>
        <div style={{ width: "100%", aspectRatio: 1 }}>
          <MapBuilder
            mapString={updatedMapString}
            updateMapString={(dragItem, dropItem) => {
              swapMapTilesAsync(gameId, dropItem, dragItem);
            }}
            dropOnly
            exploration
            mallice={undefined}
            requiredNeighbors={requiredNeighbors}
            nonHomeNeighbors={nonHomeNeighbors}
          ></MapBuilder>
        </div>
        <LabeledDiv
          label="Unused Tiles"
          style={{
            height: rem(80),
          }}
          innerStyle={{
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              display: "grid",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              columnGap: rem(8),
              width: "100%",
              justifyContent: "flex-start",
              overflowY: "auto",
              overflowX: "hidden",
              height: "100%",
            }}
          >
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
      </DndProvider>
    </div>
  );
}
