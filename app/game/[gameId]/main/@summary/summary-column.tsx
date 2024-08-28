"use client";

import { useMemo } from "react";
import SummaryColumn from "../../../../../src/main/SummaryColumn";
import { useGameState } from "../../../../../src/context/dataHooks";

export default function SummaryColumnPage() {
  const state = useGameState();

  const { order, subOrder } = useMemo(() => {
    let order: "SPEAKER" | "VICTORY_POINTS" = "SPEAKER";
    let subOrder: "SPEAKER" | "INITIATIVE" = "SPEAKER";
    if (state.phase === "END") {
      order = "VICTORY_POINTS";
      subOrder =
        state.finalPhase === "ACTION" || state.finalPhase === "STATUS"
          ? "INITIATIVE"
          : "SPEAKER";
    }
    return { order, subOrder };
  }, [state.phase, state.finalPhase]);

  return <SummaryColumn order={order} subOrder={subOrder} />;
}
