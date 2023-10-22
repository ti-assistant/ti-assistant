import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo } from "react";
import { FullScreenLoader, Loader } from "../../../src/Loader";
import Footer from "../../../src/components/Footer/Footer";
import Header from "../../../src/components/Header/Header";
import Updater from "../../../src/components/Updater/Updater";
import { StateContext } from "../../../src/context/Context";
import DataProvider from "../../../src/context/DataProvider";
import ActionPhase from "../../../src/main/ActionPhase";
import AgendaPhase from "../../../src/main/AgendaPhase";
import SetupPhase from "../../../src/main/SetupPhase";
import StatusPhase from "../../../src/main/StatusPhase";
import StrategyPhase from "../../../src/main/StrategyPhase";
import SummaryColumn from "../../../src/main/SummaryColumn";
import { setGameId } from "../../../src/util/api/util";
import FactionRow from "../../../src/components/FactionRow/FactionRow";

// const DataProvider = dynamic(
//   () => import("../../../src/context/DataProvider"),
//   {
//     loading: () => <Loader />,
//   }
// );
// const ActionPhase = dynamic(() => import("../../../src/main/ActionPhase"), {
//   loading: () => <Loader />,
// });
// const AgendaPhase = dynamic(() => import("../../../src/main/AgendaPhase"), {
//   loading: () => <Loader />,
// });
const ResultsPhase = dynamic(() => import("../../../src/main/ResultsPhase"), {
  loading: () => <Loader />,
});
// const SetupPhase = dynamic(() => import("../../../src/main/SetupPhase"), {
//   loading: () => <Loader />,
// });
// const StatusPhase = dynamic(() => import("../../../src/main/StatusPhase"), {
//   loading: () => <Loader />,
// });
// const StrategyPhase = dynamic(() => import("../../../src/main/StrategyPhase"), {
//   loading: () => <Loader />,
// });
// const SummaryColumn = dynamic(() => import("../../../src/main/SummaryColumn"), {
//   loading: () => <Loader />,
// });

export default function MainScreenPage() {
  return (
    <div
      className="flexColumn"
      style={{ height: "100%", alignItems: "center", gap: 0 }}
    >
      <DataProvider>
        <InnerMainPage />
      </DataProvider>
    </div>
  );
}

function InnerMainPage({}) {
  const router = useRouter();
  const state = useContext(StateContext);
  const { game: gameid }: { game?: string } = router.query;

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

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
      <div className="mainPage">
        {innerContent}
        {/* {state.phase !== "SETUP" ? ( */}
        <SummaryColumn order={order} subOrder={subOrder} />
        {/* <div className="mobileOnly" style={{ width: "100%" }}>
          <FactionRow onClick={() => {}} />
        </div> */}
        {/* ) : null} */}
      </div>
      <Footer />
    </>
  );
}
