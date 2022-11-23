import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from "react";
import SummaryColumn from './SummaryColumn';
import { AgendaTimer, useSharedCurrentAgenda } from '../Timer';
import { fetcher, poster } from '../util/api/util';
import { VoteCount } from '../VoteCount';
import { BasicFactionTile } from '../FactionTile';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{maxWidth: "400px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {content}
    </div>
  );
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const { resetAgendaPhase } = useSharedCurrentAgenda();

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    const phase = "STRATEGY";
    const activeFactionName = state.speaker;
    const round = state.round + 1;
    resetAgendaPhase();

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;
    state.round = round;

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  const votingOrder = Object.values(factions).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === 1) {
      return 1;
    }
    if (b.order === 1) {
      return -1;
    }
    return a.order - b.order;
  });
    
  return (
  <div className="flexRow" style={{gap: "40px", height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
    <div className="flexColumn" style={{flexBasis: "25%", gap: "4px", alignItems: "stretch"}}>
      <div className="flexRow" style={{gap: "12px"}}>
        <div style={{textAlign: "center", flexGrow: 4}}>Voting Order</div>
        <div style={{textAlign: "center", width: "80px"}}>Available Votes</div>
        <div style={{textAlign: "center", width: "80px"}}>Cast Votes</div>
        {/* <div style={{textAlign: "center", width: "60px"}}>Target</div> */}
      </div>
      {votingOrder.map((faction) => {
        return <VoteCount key={faction.name} factionName={faction.name} />
      })}
    </div>
    <div className='flexColumn' style={{flexBasis: "30%", gap: "12px"}}>            
      <ol className='flexColumn' style={{alignItems: "flex-start", gap: "20px", margin: "0px", padding: "0px", fontSize: "24px"}}>
        <AgendaTimer />
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
              Reveal and read one Agenda
          </div>
        </li>
        <li>In Speaker Order:
        <div className="flexColumn" style={{fontSize: "22px", paddingLeft: "8px", gap: "4px", alignItems: "flex-start"}}>
          <div>Perform any <i>When an Agenda is revealed</i> actions</div>
          <div>Perform any <i>After an Agenda is revealed</i> actions</div>
        </div>
        </li>
        <li>Discuss</li>
        <li>In Voting Order: Cast votes (or abstain)</li>
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
              Choose outcome if tied
          </div>
        </li>
        <li>Resolve agenda outcome</li>
        <li>Repeat Steps 1 to 6</li>
        <li>Ready all planets</li>
    </ol>
      <button onClick={() => nextPhase()}>Start Next Round</button>
    </div>
    <div className="flexColumn" style={{flexBasis: "33%", maxWidth: "400px"}}>
      <SummaryColumn />
    </div>
  </div>
  );
}