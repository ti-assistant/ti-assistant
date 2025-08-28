import { useState } from "react";
import Chip from "../../../../../../src/components/Chip/Chip";
import GameMap from "../../../../../../src/components/Map/GameMap";
import { useOptions } from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { useGameState } from "../../../../../../src/context/stateDataHooks";
import { getWormholeNexusSystemNumber } from "../../../../../../src/util/map";
import { objectKeys, rem } from "../../../../../../src/util/util";

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

export default function MapLapse({
  rounds,
}: {
  rounds: Record<number, RoundInfo>;
}) {
  const factions = useFactions();
  const options = useOptions();
  const state = useGameState();

  const [round, setRound] = useState<number>(state.round);

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const planets = rounds[round];
  if (!planets) {
    return null;
  }

  const hasFracture = options.expansions.includes("THUNDERS EDGE");

  const height = hasFracture ? rem(470) : rem(512);

  return (
    <div
      className={hasFracture ? "flexColumn" : "flexRow"}
      style={{
        width: rem(620),
        height: hasFracture ? rem(490) : rem(500),
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
        gap: 0,
      }}
    >
      <div className="flexRow" style={{ alignItems: "flex-start" }}>
        {objectKeys(rounds).map((roundNum) => {
          return (
            <Chip
              key={roundNum}
              selected={roundNum == round}
              toggleFn={() => setRound(roundNum)}
            >
              {roundNum == 0
                ? "Start of Game"
                : roundNum == objectKeys(rounds).length - 1
                ? "End of Game"
                : `Round ${roundNum}`}
            </Chip>
          );
        })}
      </div>
      <div
        className="flexColumn"
        style={{
          width: "100%",
          alignItems: hasFracture ? "flex-start" : "center",
        }}
      >
        <div
          className="flexColumn"
          style={{ position: "relative", height: height, aspectRatio: "1/1" }}
        >
          <GameMap
            defaultOverlay="OWNERS"
            factions={mapOrderedFactions}
            mapString={planets.mapString ?? ""}
            mapStyle={options ? options["map-style"] ?? "standard" : "standard"}
            wormholeNexus={getWormholeNexusSystemNumber(
              options,
              planets.planets,
              factions
            )}
            planets={planets.planets}
            hideLegend
          />
        </div>
      </div>
    </div>
  );
}
