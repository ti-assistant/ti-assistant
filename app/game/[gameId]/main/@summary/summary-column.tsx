"use client";

import { useContext, useMemo } from "react";
import { StateContext } from "../../../../../src/context/Context";
import SummaryColumn from "../../../../../src/main/SummaryColumn";

export default function SummaryColumnPage() {
  const state = useContext(StateContext);

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
