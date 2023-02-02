import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useEffect } from "react";
import { fetcher, setGameId } from '../../../src/util/api/util';
import AgendaPhase from '../../../src/main/AgendaPhase';
import SetupPhase from '../../../src/main/SetupPhase';
import StrategyPhase from '../../../src/main/StrategyPhase';
import ActionPhase from '../../../src/main/ActionPhase';
import StatusPhase from '../../../src/main/StatusPhase';
import { Updater } from '../../../src/Updater';
import { Footer, Header } from '../../../src/Header';
import ResultsPhase from '../../../src/main/ResultsPhase';

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

  if (!state) {
    return <div>Loading...</div>;
  }

  // Consider combining things into a single thing, with separate values for each column.
  // This will allow re-using the right column, which will usually be the summary.

  let innerContent = null;
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
      break;
  }
  return (
    <div className="flexColumn" style={{alignItems: "center"}}>
      <Updater />
      <Header />
      {innerContent}
      <Footer />
    </div>
  );
}
