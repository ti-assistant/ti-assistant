"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import MapLapse from "./MapLapse";
import TechGraph from "./TechGraph";
import { VictoryPointsGraph } from "./VictoryPointsGraph";
import BorderedDiv from "../../../../../../src/components/BorderedDiv/BorderedDiv";
import Chip from "../../../../../../src/components/Chip/Chip";
import { GameLog } from "../../../../../../src/components/GameLog/GameLog";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import { LogEntryElementProps } from "../../../../../../src/components/LogEntry";
import {
  useActionLog,
  useGameId,
  useOptions,
} from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { useGameData } from "../../../../../../src/context/gameDataHooks";
import { getBaseData } from "../../../../../../src/data/baseData";
import { Loader } from "../../../../../../src/Loader";
import { getMapString } from "../../../../../../src/util/options";
import { ActionLog, Optional } from "../../../../../../src/util/types/types";
import { rem } from "../../../../../../src/util/util";
import Timers from "./Timers";
import { processMapString } from "../../../../../../src/util/map";

type View = "Game Log" | "Victory Points" | "Techs" | "Map Lapse" | "Timers";

export default function ResultsPhase() {
  const factions = useFactions();
  const gameId = useGameId();
  const options = useOptions();
  const [viewing, setViewing] = useState<View>("Game Log");

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const mapString = getMapString(options, mapOrderedFactions.length);

  return (
    <React.Fragment>
      <div className="flexColumn" style={{ height: "100svh", width: "25%" }}>
        <LabeledDiv label="View">
          <Chip
            selected={viewing === "Game Log"}
            toggleFn={() => setViewing("Game Log")}
          >
            Game Log
          </Chip>
          <Chip
            selected={viewing === "Victory Points"}
            toggleFn={() => setViewing("Victory Points")}
          >
            Victory Points
          </Chip>
          <Chip
            selected={viewing === "Techs"}
            toggleFn={() => setViewing("Techs")}
          >
            Techs
          </Chip>
          {mapString ? (
            <Chip
              selected={viewing === "Map Lapse"}
              toggleFn={() => setViewing("Map Lapse")}
            >
              Map Lapse
            </Chip>
          ) : null}
          <Chip
            selected={viewing === "Timers"}
            toggleFn={() => setViewing("Timers")}
          >
            Timers
          </Chip>
        </LabeledDiv>
        <a
          href={`/api/${gameId}/download`}
          download={`${gameId}_data`}
          style={{ textAlign: "center" }}
        >
          <BorderedDiv>Download Game Data</BorderedDiv>
        </a>
      </div>
      <div style={{ marginTop: rem(96), width: "100%" }}>
        <InnerContent viewing={viewing} />
      </div>
    </React.Fragment>
  );
}

interface RoundInfo {
  planets: Partial<Record<PlanetId, Planet>>;
  mapString?: string;
  techs: Partial<Record<FactionId, Record<TechType, number>>>;
  victoryPoints: Partial<Record<FactionId, Record<ObjectiveType, number>>>;
}

interface TimerData {
  longestTurn: number;
  numTurns: number;
}

interface CondensedGameData {
  annotatedLog: WithKey<LogEntryElementProps>[];
  rounds: Record<number, RoundInfo>;
  timerData: Partial<Record<FactionId, TimerData>>;
}

type WithKey<T> = T & { key: number };

function InnerContent({ viewing }: { viewing: View }) {
  const storedActionLog = useActionLog();
  const intl = useIntl();
  const gameData = useGameData();

  const worker = useRef<Worker>();

  const [condensedData, setCondensedData] =
    useState<Optional<CondensedGameData>>();

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

  const baseData = useMemo(() => {
    return getBaseData(intl);
  }, [intl]);

  useEffect(() => {
    worker.current = new Worker(
      new URL("./game-log.worker.tsx", import.meta.url),
      {
        name: "game-log",
        type: "module",
      }
    );

    worker.current.postMessage({
      reversedActionLog,
      initialGameData,
      baseData,
    });

    worker.current.onmessage = (event) => {
      setCondensedData(event.data);
    };
    return () => {
      worker.current?.terminate();
    };
  }, [initialGameData, reversedActionLog, baseData]);

  if (reversedActionLog.length === 0 || !condensedData) {
    return (
      <LabeledDiv label="Loading...">
        <Loader />
      </LabeledDiv>
    );
  }

  return (
    <>
      {viewing === "Game Log" ? (
        <LabeledDiv label="Game Log (Beta)">
          <GameLog annotatedLog={condensedData.annotatedLog} />
        </LabeledDiv>
      ) : null}
      {viewing === "Victory Points" ? (
        <LabeledDiv label="Victory Points" style={{ width: "fit-content" }}>
          <VictoryPointsGraph rounds={condensedData.rounds} />
        </LabeledDiv>
      ) : null}
      {viewing === "Techs" ? (
        <LabeledDiv label="Techs" style={{ width: "fit-content" }}>
          <TechGraph rounds={condensedData.rounds} />
        </LabeledDiv>
      ) : null}
      {viewing === "Map Lapse" ? (
        <LabeledDiv label="Map Lapse" style={{ width: "fit-content" }}>
          <MapLapse rounds={condensedData.rounds} />
        </LabeledDiv>
      ) : null}
      {viewing === "Timers" ? (
        <LabeledDiv label="Timers" style={{ width: "fit-content" }}>
          <Timers timerData={condensedData.timerData} />
        </LabeledDiv>
      ) : null}
    </>
  );
}

let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
  return {};
};
import("../../../../../../server/data/factions").then((module) => {
  getBaseFactions = module.getBaseFactions;
});

let getBasePlanets: DataFunction<PlanetId, BasePlanet> = () => {
  return {};
};
import("../../../../../../server/data/planets").then((module) => {
  getBasePlanets = module.getBasePlanets;
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
      const homeBasePlanets = Object.values(getBasePlanets(intl)).filter(
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
  const actionLog = (gameData.actionLog ?? []) as ActionLog;
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
  const options: Options = structuredClone(gameData.options);
  options["processed-map-string"] = processMapString(
    options["map-string"] ?? "",
    options["map-style"],
    factions.length
  );

  return {
    factions: factions,
    speaker: speaker,
    options: options,
  };
}
