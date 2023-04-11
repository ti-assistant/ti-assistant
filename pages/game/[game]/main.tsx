import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";
import { fetcher, setGameId } from "../../../src/util/api/util";
import AgendaPhase from "../../../src/main/AgendaPhase";
import SetupPhase from "../../../src/main/SetupPhase";
import StrategyPhase from "../../../src/main/StrategyPhase";
import ActionPhase from "../../../src/main/ActionPhase";
import StatusPhase from "../../../src/main/StatusPhase";
import { Updater } from "../../../src/Updater";
import { Footer, Header } from "../../../src/Header";
import ResultsPhase from "../../../src/main/ResultsPhase";
import { GameState } from "../../../src/util/api/state";
import { FullScreenLoader } from "../../../src/Loader";
import SummaryColumn from "../../../src/main/SummaryColumn";

export default function MainScreenPage() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

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
