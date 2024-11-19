"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import BorderedDiv from "../components/BorderedDiv/BorderedDiv";
import { GameLog } from "../components/GameLog/GameLog";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import {
  useActionLog,
  useFactions,
  useGameData,
  useGameId,
  useOptions,
} from "../context/dataHooks";
import { rem } from "../util/util";
import Chip from "../components/Chip/Chip";
import { VictoryPointsGraph } from "../../app/game/[gameId]/main/@phase/results/VictoryPointsGraph";
import TechGraph from "../../app/game/[gameId]/main/@phase/results/TechGraph";
import { getMapString } from "../util/options";
import MapLapse from "../../app/game/[gameId]/main/@phase/results/MapLapse";
import { useIntl, IntlShape } from "react-intl";
import { LogEntryElementProps } from "../components/LogEntry";
import { Loader } from "../Loader";
import { Optional } from "../util/types/types";
import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";
import { getBaseData } from "../data/baseData";

type View = "Game Log" | "Victory Points" | "Techs" | "Map Lapse";

export default function ResultsPhase() {
  const factions = useFactions();
  const gameId = useGameId();
  const options = useOptions();
  const [viewing, setViewing] = useState<View>("Game Log");

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const mapString = getMapString(options, mapOrderedFactions.length);

  // TODO - pull data building out of sub-factions into here.
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
        </LabeledDiv>
        <a
          href={`/api/${gameId}/download`}
          download={`${gameId}_data`}
          style={{ textAlign: "center" }}
        >
          <BorderedDiv>Download Game Data</BorderedDiv>
        </a>
      </div>
      <div style={{ marginTop: rem(108), width: "100%" }}>
        <InnerContent viewing={viewing} />
        {/* {viewing === "Game Log" ? (
          <LabeledDiv label="Game Log (Beta)">
            <GameLog />
          </LabeledDiv>
        ) : null}
        {viewing === "Victory Points" ? (
          <LabeledDiv label="Victory Points" style={{ width: "fit-content" }}>
            <VictoryPointsGraph />
          </LabeledDiv>
        ) : null}
        {viewing === "Techs" ? (
          <LabeledDiv label="Techs" style={{ width: "fit-content" }}>
            <TechGraph />
          </LabeledDiv>
        ) : null}
        {viewing === "Map Lapse" ? (
          <LabeledDiv label="Map Lapse" style={{ width: "fit-content" }}>
            <MapLapse />
          </LabeledDiv>
        ) : null} */}
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

interface CondensedGameData {
  annotatedLog: WithKey<LogEntryElementProps>[];
  rounds: Record<number, RoundInfo>;
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
  }, [initialGameData, reversedActionLog]);

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
    </>
  );
}

let getBaseFactions: DataFunction<FactionId, BaseFaction> = () => {
  return {};
};
import("../../server/data/factions").then((module) => {
  getBaseFactions = module.getBaseFactions;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../../server/data/planets").then((module) => {
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

  return {
    factions: factions,
    speaker: speaker,
    options: gameData.options,
  };
}
