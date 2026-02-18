import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GameMap from "../../../../../../../../src/components/Map/GameMap";
import MapBuilder from "../../../../../../../../src/components/MapBuilder/MapBuilder";
import {
  useActionLog,
  useGameId,
  useLeader,
  useOptions,
  usePlanets,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../../src/context/factionDataHooks";
import { swapMapTilesAsync } from "../../../../../../../../src/dynamic/api";
import { wereTilesSwapped } from "../../../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../../../src/util/api/actionLog";
import {
  getFactionSystemNumber,
  getWormholeNexusSystemNumber,
} from "../../../../../../../../src/util/map";
import { getMapString } from "../../../../../../../../src/util/options";
import { rem } from "../../../../../../../../src/util/util";

export default function RiftwalkerMeian() {
  const actionLog = useActionLog();
  const factions = useFactions();
  const gameId = useGameId();
  const options = useOptions();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const riftwalkerMeian = useLeader("Riftwalker Meian");

  const mapString = getMapString(options, Object.keys(factions).length);
  if (!mapString) {
    return null;
  }

  if (!riftwalkerMeian) {
    return null;
  }

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition,
  );
  let updatedSystemTiles = mapString.split(" ");
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
      return getFactionSystemNumber(mapOrderedFactions[factionIndex - 1]);
    }
    return tile;
  });
  const alreadyUsed = wereTilesSwapped(getCurrentTurnLogEntries(actionLog));
  if (alreadyUsed) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
        <GameMap
          mapString={updatedSystemTiles.join(" ")}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          wormholeNexus={getWormholeNexusSystemNumber(
            options,
            planets,
            factions,
          )}
          hideLegend
          hideFracture
          planets={planets}
          expansions={options.expansions}
        />
      </div>
    );
  }
  const mallice = getWormholeNexusSystemNumber(options, planets, factions);
  return (
    <div
      className="flexColumn"
      style={{ width: rem(320), height: rem(320), marginBottom: rem(16) }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        <DndProvider backend={HTML5Backend}>
          <div style={{ width: "100%", aspectRatio: 1 }}>
            <MapBuilder
              mapString={updatedSystemTiles.join(" ")}
              updateMapString={(dragItem, dropItem) => {
                if (viewOnly || dragItem.index === dropItem.index) {
                  return;
                }
                swapMapTilesAsync(gameId, dropItem, dragItem);
              }}
              riftWalker
              mallice={
                mallice === "PURGED" || mallice === "81" ? mallice : undefined
              }
            ></MapBuilder>
          </div>
        </DndProvider>
      </div>
    </div>
  );
}
