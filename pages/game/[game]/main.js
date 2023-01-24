import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { fetcher, setGameId } from '../../../src/util/api/util';
import AgendaPhase from '../../../src/main/AgendaPhase';
import SetupPhase from '../../../src/main/SetupPhase';
import StrategyPhase from '../../../src/main/StrategyPhase';
import ActionPhase from '../../../src/main/ActionPhase';
import StatusPhase from '../../../src/main/StatusPhase';
import { GameTimer } from '../../../src/Timer';
import { AgendaRow } from '../../../src/AgendaRow';
import { repealAgenda } from '../../../src/util/api/agendas';
import { Updater } from '../../../src/Updater';
import { responsivePixels } from '../../../src/util/util';
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

function refreshData(gameid, mutate) {
  mutate(`/api/${gameid}/state`, fetcher(`/api/${gameid}/state`));
  mutate(`/api/${gameid}/techs`, fetcher(`/api/${gameid}/techs`));
  mutate(`/api/${gameid}/planets`, fetcher(`/api/${gameid}/planets`));
  mutate(`/api/${gameid}/strategyCards`, fetcher(`/api/${gameid}/strategycards`));
  mutate(`/api/${gameid}/factions`, fetcher(`/api/${gameid}/factions`));
  mutate(`/api/${gameid}/objectives`, fetcher(`/api/${gameid}/objectives`));
  mutate(`/api/${gameid}/options`, fetcher(`/api/${gameid}/options`));
  mutate(`/api/${gameid}/agendas`, fetcher(`/api/${gameid}/agendas`));
}

function Sidebar({side, content}) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{letterSpacing: responsivePixels(3)}}>
      {content}
    </div>
  );
}
// function Header() {
//   const router = useRouter();
//   const { game: gameid } = router.query;
//   const { mutate } = useSWRConfig();
//   const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
//   const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
//   const [ qrCode, setQrCode ] = useState(null);

//   if (!qrCode && gameid) {
//     QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
//       color: {
//         dark: "#eeeeeeff",
//         light: "#222222ff",
//       },
//       width: 120,
//       height: 120,
//       margin: 4,
//     }, (err, url) => {
//       if (err) {
//         throw err;
//       }
//       setQrCode(url);
//     });
//   }

//   return (
//     <div className="flexColumn" style={{zIndex: 400, top: 0, position: "fixed", alignItems: "center", justifyContent: "center"}}>
//       <Sidebar side="left" content={`${state.phase} PHASE`} />
//       <Sidebar side="right" content={`ROUND ${state.round}`} />
//       <h2>Twilight Imperium Assistant</h2>
//       <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", left: responsivePixels(150), top: responsivePixels(12)}}>
//         {qrCode ? <img src={qrCode} /> : null}
//         <div>Game ID: {gameid}</div>
//         <button onClick={() => refreshData(gameid, mutate)}>Refresh</button>
//       </div>
//       <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "288px", top: "16px"}}>
//         <GameTimer />
//       </div>
//     </div>);
// }