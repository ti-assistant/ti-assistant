"use client";

import { useEffect } from "react";
import { useGameId } from "../../../../../src/context/dataHooks";
import { usePhase } from "../../../../../src/context/stateDataHooks";
import { setGameId } from "../../../../../src/util/api/util";
import ActionPhase from "./action/ActionPhase";
import AgendaPhase from "./agenda/AgendaPhase";
import EdictPhase from "./edict/EdictPhase";
import ResultsPhase from "./results/ResultsPhase";
import SetupPhase from "./setup/SetupPhase";
import StatusPhase from "./status/StatusPhase";
import StrategyPhase from "./strategy/StrategyPhase";

export default function MainScreenPage() {
  const gameId = useGameId();
  const phase = usePhase();

  useEffect(() => {
    if (!!gameId && phase !== "UNKNOWN") {
      setGameId(gameId);
    }
  }, [gameId, phase]);

  return <InnerContent phase={phase} />;
}

function InnerContent({ phase }: { phase: Phase }) {
  switch (phase) {
    case "SETUP":
      return <SetupPhase />;
    case "STRATEGY":
      return <StrategyPhase />;
    case "ACTION":
      return <ActionPhase />;
    case "STATUS":
      return <StatusPhase />;
    case "AGENDA":
      return <AgendaPhase />;
    case "EDICT":
      return <EdictPhase />;
    case "END":
      return <ResultsPhase />;
  }
  return null;
}
