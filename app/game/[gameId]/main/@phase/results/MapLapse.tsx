import { useMemo, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import Toggle from "../../../../../../src/components/Toggle/Toggle";
import {
  useActionLog,
  useFactions,
  useGameData,
  useGameState,
  useOptions,
} from "../../../../../../src/context/dataHooks";
import { getBaseData } from "../../../../../../src/data/baseData";
import {
  buildObjectives,
  buildPlanets,
} from "../../../../../../src/data/gameDataBuilder";
import { getHandler } from "../../../../../../src/util/api/gameLog";
import { updateGameData } from "../../../../../../src/util/api/handler";
import {
  computeVPsByCategory,
  getFactionColor,
} from "../../../../../../src/util/factions";
import { Optional } from "../../../../../../src/util/types/types";
import {
  objectEntries,
  objectKeys,
  rem,
} from "../../../../../../src/util/util";
import Graph, { Line } from "./Graph";
import { getMapString } from "../../../../../../src/util/options";
import Map from "../../../../../../src/components/Map/Map";
import {
  getMalliceSystemNumber,
  processMapString,
} from "../../../../../../src/util/map";
import FixedMap from "../../../../../../src/components/Map/FixedMap";
import Chip from "../../../../../../src/components/Chip/Chip";

export default function MapLapse({}) {
  const storedActionLog = useActionLog();
  const factions = useFactions();
  const options = useOptions();
  const intl = useIntl();
  const state = useGameState();
  const gameData = useGameData();

  const [round, setRound] = useState<number>(state.round);

  const reversedActionLog = useMemo(() => {
    const actionLog = storedActionLog ?? [];
    return [...actionLog].reverse();
  }, [storedActionLog]);

  const setupGameData = useMemo(() => {
    return buildSetupGameData(gameData);
  }, [gameData]);

  const initialGameData = useMemo(() => {
    return buildInitialGameData(setupGameData, intl);
  }, [setupGameData, intl]);

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  const planetsAtRound = useMemo(() => {
    const dynamicGameData = structuredClone(initialGameData);
    const rounds: Record<
      number,
      {
        planets: Partial<Record<PlanetId, Planet>>;
        mapString?: string;
      }
    > = {};
    for (const logEntry of reversedActionLog) {
      if (
        logEntry.data.action === "ADVANCE_PHASE" &&
        dynamicGameData.state.phase === "SETUP"
      ) {
        rounds[0] = {
          planets: buildPlanets(dynamicGameData, getBaseData(intl)),
          mapString: getMapString(
            dynamicGameData.options,
            mapOrderedFactions.length
          ),
        };
      }
      const currentRound = dynamicGameData.state.round;
      const handler = getHandler(dynamicGameData, cleanLogData(logEntry.data));
      if (!handler) {
        console.log("Handler not found", logEntry);
        return {};
      }
      updateGameData(dynamicGameData, handler.getUpdates());
      if (currentRound !== dynamicGameData.state.round) {
        rounds[currentRound] = {
          planets: buildPlanets(dynamicGameData, getBaseData(intl)),
          mapString: getMapString(
            dynamicGameData.options,
            mapOrderedFactions.length
          ),
        };
      }
    }
    rounds[dynamicGameData.state.round] = {
      planets: buildPlanets(dynamicGameData, getBaseData(intl)),
      mapString: getMapString(
        dynamicGameData.options,
        mapOrderedFactions.length
      ),
    };
    return rounds;
  }, [initialGameData, reversedActionLog]);

  const mapString = getMapString(
    initialGameData.options,
    mapOrderedFactions.length
  );

  const planets = planetsAtRound[round];
  if (!planets) {
    return null;
  }
  return (
    <div
      className="flexRow"
      style={{
        width: rem(640),
        height: rem(512),
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div className="flexColumn" style={{ alignItems: "flex-start" }}>
        {objectKeys(planetsAtRound).map((roundNum) => {
          return (
            <Chip
              key={roundNum}
              selected={roundNum == round}
              toggleFn={() => setRound(roundNum)}
            >
              {roundNum == 0
                ? "Start of Game"
                : roundNum == objectKeys(planetsAtRound).length - 1
                ? "End of Game"
                : `Round ${roundNum}`}
            </Chip>
          );
        })}
      </div>
      <div
        className="flexColumn"
        style={{ position: "relative", height: rem(512), aspectRatio: "1/1" }}
      >
        <FixedMap
          factions={mapOrderedFactions}
          mapString={planets.mapString ?? ""}
          mapStyle={options ? options["map-style"] ?? "standard" : "standard"}
          mallice={getMalliceSystemNumber(options, planets.planets, factions)}
          planets={planets.planets}
        />
      </div>
    </div>
  );
}

function cleanLogData(data: GameUpdateData) {
  const cleanData = data;
  switch (cleanData.action) {
    case "ASSIGN_STRATEGY_CARD":
      const id = cleanData.event.id;
      if (!id) {
        cleanData.event.id = (cleanData.event as any).name;
      }
      break;
  }
  return cleanData;
}

let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
  return {};
};
import("../../../../../../server/data/factions").then((module) => {
  getBaseFactions = module.getBaseFactions;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../../../../../../server/data/planets").then((module) => {
  BASE_PLANETS = module.BASE_PLANETS;
});

function buildInitialGameData(
  setupData: {
    factions: SetupFaction[];
    speaker: number;
    options: Options;
  },
  intl: IntlShape
) {
  const gameFactions: GameFaction[] = setupData.factions.map(
    (faction, index) => {
      if (!faction.name || !faction.color || !faction.id) {
        throw new Error("Faction missing name or color.");
      }
      // Determine speaker order for each faction.
      let order: number;
      if (index >= setupData.speaker) {
        order = index - setupData.speaker + 1;
      } else {
        order = index + setupData.factions.length - setupData.speaker + 1;
      }

      // Get home planets for each faction.
      // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
      const homeBasePlanets = Object.values(BASE_PLANETS).filter(
        (planet) => planet.faction === faction.name && planet.home
      );
      const homePlanets: Partial<Record<PlanetId, { ready: boolean }>> = {};
      homeBasePlanets.forEach((planet) => {
        homePlanets[planet.id] = {
          ready: true,
        };
      });

      // Get starting techs for each faction.
      const baseFaction = getBaseFactions(intl)[faction.id];
      if (!baseFaction) {
        return {
          // Client specified values
          name: faction.name,
          id: faction.id,
          color: faction.color,
          playerName: faction.playerName,
          order: order,
          mapPosition: index,
          // Faction specific values
          planets: homePlanets,
          techs: {},
          startswith: { units: {} },
          // State values
          hero: "locked",
          commander: "locked",
        };
      }
      const startingTechs: Partial<Record<TechId, { ready: boolean }>> = {};
      (baseFaction.startswith.techs ?? []).forEach((tech) => {
        startingTechs[tech] = {
          ready: true,
        };
      });

      return {
        // Client specified values
        name: faction.name,
        id: faction.id,
        color: faction.color,
        playerName: faction.playerName,
        order: order,
        mapPosition: index,
        // Faction specific values
        planets: homePlanets,
        techs: startingTechs,
        startswith: baseFaction.startswith,
        // State values
        hero: "locked",
        commander: "locked",
      };
    }
  );

  let baseFactions: Partial<Record<FactionId, GameFaction>> = {};
  let basePlanets: Partial<Record<PlanetId, GamePlanet>> = {};
  let speakerName: Optional<FactionId>;
  gameFactions.forEach((faction, index) => {
    if (index === setupData.speaker) {
      speakerName = faction.id;
    }
    const localFaction = { ...faction };
    if (
      faction.id === "Winnu" &&
      !setupData.options.expansions.includes("POK")
    ) {
      localFaction.startswith.choice = {
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
    }
    baseFactions[faction.id] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name as PlanetId] = {
        ...planet,
        owner: faction.id,
      };
    });
  });

  let baseObjectives: Partial<Record<ObjectiveId, GameObjective>> = {
    "Custodians Token": {
      selected: true,
    },
    "Imperial Point": {
      selected: true,
    },
    "Support for the Throne": {
      selected: true,
    },
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 180);

  const gameState: StoredGameData = {
    state: {
      speaker: speakerName ?? "Vuil'raith Cabal",
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: setupData.options,
    objectives: baseObjectives,
    sequenceNum: 1,
  };

  return gameState;
}

function buildSetupGameData(gameData: GameData): {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
} {
  const actionLog = gameData.actionLog ?? [];
  let speaker = 1;
  for (let i = actionLog.length - 1; i >= 0; i--) {
    const entry = actionLog[i];
    if (entry?.data.action === "ASSIGN_STRATEGY_CARD") {
      const initialSpeaker = gameData.factions[entry.data.event.pickedBy];
      if (initialSpeaker) {
        speaker = initialSpeaker.mapPosition;
        break;
      }
    }
  }

  const factions: SetupFaction[] = [];
  for (const faction of Object.values(gameData.factions)) {
    factions[faction.mapPosition] = {
      color: faction.color,
      name: faction.id,
      id: faction.id,
      playerName: faction.playerName,
    };
  }

  const options: Options = gameData.options;
  if (options["map-string"]) {
    // Reset map string.
    options["processed-map-string"] = processMapString(
      options["map-string"],
      options["map-style"],
      factions.length
    );
  }

  return {
    factions: factions,
    speaker: speaker,
    options: gameData.options,
  };
}
