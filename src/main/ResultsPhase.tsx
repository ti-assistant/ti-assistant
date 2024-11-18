"use client";

import React, { useState } from "react";
import BorderedDiv from "../components/BorderedDiv/BorderedDiv";
import { GameLog } from "../components/GameLog/GameLog";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import { useFactions, useGameId, useOptions } from "../context/dataHooks";
import { rem } from "../util/util";
import Chip from "../components/Chip/Chip";
import { VictoryPointsGraph } from "../../app/game/[gameId]/main/@phase/results/VictoryPointsGraph";
import TechGraph from "../../app/game/[gameId]/main/@phase/results/TechGraph";
import { getMapString } from "../util/options";
import MapLapse from "../../app/game/[gameId]/main/@phase/results/MapLapse";

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
        {viewing === "Game Log" ? (
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
        ) : null}
      </div>
    </React.Fragment>
  );
}
