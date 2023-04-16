import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { Header, Footer, NonGameHeader } from "../../../src/Header";
import { FullScreenLoader } from "../../../src/Loader";
import ActionPhase from "../../../src/main/ActionPhase";
import AgendaPhase from "../../../src/main/AgendaPhase";
import ResultsPhase from "../../../src/main/ResultsPhase";
import SetupPhase from "../../../src/main/SetupPhase";
import StatusPhase from "../../../src/main/StatusPhase";
import StrategyPhase from "../../../src/main/StrategyPhase";
import SummaryColumn from "../../../src/main/SummaryColumn";
import { ObjectivePanel } from "../../../src/ObjectivePanel";
import { Updater } from "../../../src/Updater";
import { GameState } from "../../../src/util/api/state";
import { fetcher, setGameId } from "../../../src/util/api/util";
import { responsivePixels } from "../../../src/util/util";

export default function ObjectivesPage() {
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
      style={{ height: "100%", alignItems: "center" }}
    >
      <Updater />
      <NonGameHeader
        leftSidebar="OBJECTIVES"
        rightSidebar="OBJECTIVES"
        gameId={gameid}
      />
      <div
        style={{
          position: "relative",
          padding: `${responsivePixels(40)} 0 ${responsivePixels(20)} 0`,
          height: "100dvh",
        }}
      >
        <ObjectivePanel />
      </div>
      {/* <Footer /> */}
    </div>
  );
}
