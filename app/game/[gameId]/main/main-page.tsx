"use client";

import { useContext, useEffect, useMemo } from "react";
import { FullScreenLoader } from "../../../../src/Loader";
import { useReportWebVitals } from "next/web-vitals";
import Footer from "../../../../src/components/Footer/Footer";
import Header from "../../../../src/components/Header/Header";
import Updater from "../../../../src/components/Updater/Updater";
import { GameIdContext, StateContext } from "../../../../src/context/Context";
import ActionPhase from "../../../../src/main/ActionPhase";
import AgendaPhase from "../../../../src/main/AgendaPhase";
import SetupPhase from "../../../../src/main/SetupPhase";
import StatusPhase from "../../../../src/main/StatusPhase";
import StrategyPhase from "../../../../src/main/StrategyPhase";
import { setGameId } from "../../../../src/util/api/util";
import ResultsPhase from "../../../../src/main/ResultsPhase";

export default function MainScreenPage() {
  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  const { innerContent, order, subOrder } = useMemo(() => {
    let innerContent = <FullScreenLoader />;
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
    return { innerContent, order, subOrder };
  }, [state.phase, state.finalPhase]);

  return (
    <>
      <Updater />
      <Header />
      {/* <div className="mainPage"> */}
      {innerContent}
      {/* {state.phase !== "SETUP" ? ( */}
      {/* <SummaryColumn order={order} subOrder={subOrder} /> */}
      {/* <div className="mobileOnly" style={{ width: "100%" }}>
          <FactionRow onClick={() => {}} />
        </div> */}
      {/* ) : null} */}
      {/* </div> */}
      {/* <Footer /> */}
    </>
  );
}
