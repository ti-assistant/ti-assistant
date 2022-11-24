import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import SummaryColumn from './SummaryColumn';
import { AgendaTimer, useSharedCurrentAgenda } from '../Timer';
import { fetcher, poster } from '../util/api/util';
import { VoteCount } from '../VoteCount';
import { BasicFactionTile } from '../FactionTile';
import { AgendaRow } from '../AgendaRow';
import { Modal } from '../Modal';
import { passAgenda, resolveAgenda } from '../util/api/agendas';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{maxWidth: "400px", minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: "20px"}}>
      {content}
    </div>
  );
}

function AgendaSelectModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  if (!agendas) {
    return null;
  }

  const orderedAgendas = Object.values(agendas).filter((agenda) => {
    return !agenda.resolved;
  }).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  })

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal Agenda`}
    content={
      <div className="flexColumn" style={{alignItems: "flex-start"}}>
        {orderedAgendas.map((agenda) => {
          return (
            <AgendaRow key={agenda.name} agenda={agenda} addAgenda={() => onComplete(agenda.name)} />
          );
        })}
      </div>
  } />
  );
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  const [ agenda, setAgenda ] = useState(null);
  const [ agendaModal, setAgendaModal ] = useState(null);

  const [ factionVotes, setFactionVotes ] = useState({});

  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const { currentAgenda, resetAgendaPhase } = useSharedCurrentAgenda();

  // When completing an agenda, make changes.
  useEffect(() => {
    if (agenda) {
      const votes = computeVotes();
      let maxVotes = 0;
      let chosenTarget = null;
      Object.entries(votes).forEach(([target, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
          chosenTarget = target;
        }
      });
      resolveAgenda(mutate, gameid, agendas, agenda.name, chosenTarget);
      setAgenda(null);
      setFactionVotes({});
    }
  }, [currentAgenda]);

  if (!factions) {
    return <div>Loading...</div>;
  }


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

  function selectAgenda(agendaName) {
    if (agendaName !== null) {
      setAgenda(agendas[agendaName]);
    }
    setAgendaModal(false);
    setFactionVotes({});
  }

  function changeVote(factionName, castVotes, target) {
    if (target === "Abstain") {
      return;
    }
    const updatedVotes = {...factionVotes};
    updatedVotes[factionName] = {
      target: target,
      votes: castVotes,
    };
    setFactionVotes(updatedVotes);
  }

  function computeVotes() {
    const castVotes = agenda && agenda.elect === "For/Against" ? {"For": 0, "Against": 0} : {};
    Object.values(factionVotes).forEach((votes) => {
      if (!castVotes[votes.target]) {
        castVotes[votes.target] = 0;
      }
      castVotes[votes.target] += votes.votes;
    });
    const orderedVotes = Object.keys(castVotes).sort((a, b) => {
      if (a === "For") {
        return -1;
      }
      if (b === "For") {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 1;
    }).reduce(
      (obj, key) => { 
        obj[key] = castVotes[key]; 
        return obj;
      }, 
      {}
    );
    return orderedVotes;
  }

  const orderedVotes = computeVotes();

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

  const flexDirection = agenda && agenda.elect === "For/Against" ? "flexRow" : "flexColumn";
    
  return (
  <div className="flexRow" style={{gap: "40px", height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
    <AgendaSelectModal visible={agendaModal} onComplete={(agendaName) => selectAgenda(agendaName)} />
    <div className="flexColumn" style={{flexBasis: "30%", gap: "4px", alignItems: "stretch"}}>
      <div className="flexRow" style={{gap: "12px"}}>
        <div style={{textAlign: "center", flexGrow: 4}}>Voting Order</div>
        <div style={{textAlign: "center", width: "80px"}}>Available Votes</div>
        <div style={{textAlign: "center", width: "80px"}}>Cast Votes</div>
        <div style={{textAlign: "center", width: "80px"}}>Target</div>
      </div>
      {votingOrder.map((faction) => {
        return <VoteCount key={faction.name} factionName={faction.name} changeVote={changeVote} agenda={agenda} />
      })}
    </div>
    <div className='flexColumn' style={{flexBasis: "30%", gap: "12px"}}>            
      <ol className='flexColumn' style={{alignItems: "flex-start", gap: "20px", margin: "0px", padding: "0px", fontSize: "24px"}}>
        <div className="flexColumn" style={{borderRadius: "10px", padding: "8px", border: "1px solid #555", gap: "8px", alignItems: "center", width: "100%"}}>
        {agenda ? 
          <AgendaRow agenda={agenda} removeAgenda={() => {setAgenda(null); setFactionVotes({});}} />
        : <button onClick={() => setAgendaModal(true)}>Select Agenda</button>}
        {orderedVotes ? 
          <div className={flexDirection} style={{gap: "4px", paddingLeft: "20px", alignItems: "flex-start", width: "100%"}}>
          {Object.entries(orderedVotes).map(([name, number]) => {
            return <div>{name}: {number}</div>
          })}
          </div>
        : null}
        </div>
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