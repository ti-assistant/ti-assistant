import { useRouter } from "next/router";
import { useEffect } from "react";
import { Footer, Header } from "../../../src/Header";
import { FullScreenLoader } from "../../../src/Loader";
import { Updater } from "../../../src/Updater";
import { useGameData } from "../../../src/data/GameData";
import ActionPhase from "../../../src/main/ActionPhase";
import AgendaPhase from "../../../src/main/AgendaPhase";
import ResultsPhase from "../../../src/main/ResultsPhase";
import SetupPhase from "../../../src/main/SetupPhase";
import StatusPhase from "../../../src/main/StatusPhase";
import StrategyPhase from "../../../src/main/StrategyPhase";
import SummaryColumn from "../../../src/main/SummaryColumn";
import { setGameId } from "../../../src/util/api/util";

export default function MainScreenPage() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["state"]);
  const state = gameData.state;

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

  // Consider combining things into a single thing, with separate values for each column.
  // This will allow re-using the right column, which will usually be the summary.

  let innerContent = <FullScreenLoader />;
  let order: "SPEAKER" | "VICTORY_POINTS" = "SPEAKER";
  let subOrder: "SPEAKER" | "INITIATIVE" = "SPEAKER";
  switch (state?.phase) {
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
  return (
    <div
      className="flexColumn"
      style={{ height: "100%", alignItems: "center", gap: 0 }}
    >
      <Updater />
      <Header />
      <div className="mainPage">
        {innerContent}
        {state?.phase && state.phase !== "SETUP" ? (
          <SummaryColumn order={order} subOrder={subOrder} />
        ) : null}
      </div>
      <Footer />
    </div>
  );
}
