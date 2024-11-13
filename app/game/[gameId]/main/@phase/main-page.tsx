"use client";

import { useEffect, useMemo } from "react";
import { useGameId, useGameState } from "../../../../../src/context/dataHooks";
import ActionPhase from "../../../../../src/main/ActionPhase";
import AgendaPhase from "../../../../../src/main/AgendaPhase";
import ResultsPhase from "../../../../../src/main/ResultsPhase";
import SetupPhase from "../../../../../src/main/SetupPhase";
import StatusPhase from "../../../../../src/main/StatusPhase";
import StrategyPhase from "../../../../../src/main/StrategyPhase";
import { setGameId } from "../../../../../src/util/api/util";

export default function MainScreenPage() {
  const gameId = useGameId();
  const state = useGameState();

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  const innerContent = useMemo(() => {
    let innerContent = null;
    let order: "SPEAKER" | "VICTORY_POINTS" = "SPEAKER";
    let subOrder: "SPEAKER" | "INITIATIVE" = "SPEAKER";
    switch (state.phase) {
      case "SETUP":
        innerContent = <SetupPhase />;
        break;
      case "STRATEGY":
        innerContent = <StrategyPhase />;
        break;
      case "ACTION":
        innerContent = <ActionPhase />;
        break;
      case "STATUS":
        innerContent = <StatusPhase />;
        break;
      case "AGENDA":
        innerContent = <AgendaPhase />;
        break;
      case "END":
        innerContent = <ResultsPhase />;
        order = "VICTORY_POINTS";
        subOrder =
          state.finalPhase === "ACTION" || state.finalPhase === "STATUS"
            ? "INITIATIVE"
            : "SPEAKER";
        break;
    }
    return innerContent;
  }, [state.phase, state.finalPhase]);

  return <>{innerContent}</>;
}
