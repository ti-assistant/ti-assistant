import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useRef, useState } from "react";
import SummaryColumn from './SummaryColumn';
import { AgendaTimer, useSharedCurrentAgenda } from '../Timer';
import { fetcher, poster } from '../util/api/util';
import { getTargets, VoteCount } from '../VoteCount';
import { BasicFactionTile } from '../FactionTile';
import { AgendaRow } from '../AgendaRow';
import { Modal } from '../Modal';
import { repealAgenda, resolveAgenda } from '../util/api/agendas';
import { LawsInEffect } from '../LawsInEffect';
import { SelectableRow } from '../SelectableRow';
import { useSharedUpdateTimes } from '../Updater';
import { HoverMenu } from '../HoverMenu';
import { LabeledDiv } from '../LabeledDiv';
import { getFactionColor, getFactionName } from '../util/factions';
import { finalizeSubState, hideSubStateAgenda, revealSubStateAgenda, setSubStateOther } from '../util/api/subState';
import { resetCastVotes, updateCastVotes } from '../util/api/factions';
import { responsivePixels } from '../util/util';
import { NumberedItem } from '../NumberedItem';
import { resetAgendaTimers } from '../util/api/timers';
import { resetStrategyCards } from '../util/api/cards';
import { setAgendaNum } from '../util/api/state';

function AgendaSelectModal({ visible, onComplete, filter }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  if (!agendas) {
    return null;
  }

  let filteredAgendas = Object.values(agendas).filter((agenda) => {
    if (!filter) return true;
    for (const [type, value] of Object.entries(filter)) {
      if (value && agenda[type] !== value) {
        return false;
      }
    }
    return true;
  });

  const orderedAgendas = filteredAgendas.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });

  let width = 1400;
  if (orderedAgendas.length < 35) {
    width = 920;
  }
  if (orderedAgendas.length < 18) {
    width = 460;
  }

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal Agenda`}
    content={
      <div className="flexColumn" style={{justifyContent: "stretch", paddingTop: "4px", width: `${width}px`, alignItems: "flex-start", flexWrap: "wrap", overflowY: "hidden", maxHeight: "80vh", height: "850px"}}>
        {orderedAgendas.map((agenda) => {
          return (
            <div key={agenda.name} style={{flex: "0 0 5%"}}>
              <AgendaRow agenda={agenda} addAgenda={() => onComplete(agenda.name)} />
            </div>
          );
        })}
      </div>
  } />
  );
}

function OutcomeSelectModal({ visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  const outcomes = new Set();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal Eligible Outcome`}
    content={
      <div className="flexColumn" style={{justifyContent: "flex-start", padding: "8px 0px", alignItems: "flex-start", gap: "8px"}}>
        {Array.from(outcomes).map((outcome) => {
          return (
            <div key={outcome}>
              <SelectableRow key={outcome} content={
                <div style={{ display: "flex", zIndex: 2}}>
                  {outcome}
                 </div>} itemName={outcome} selectItem={() => onComplete(outcome)} />
            </div>
          );
        })}
      </div>
  } />
  );
}

export function computeVotes(agenda, subStateFactions = {}) {
  const castVotes = agenda && agenda.elect === "For/Against" ? {"For": 0, "Against": 0} : {};
  Object.values(subStateFactions).forEach((faction) => {
    if (faction.target && faction.target !== "Abstain" && faction.votes > 0) {
      if (!castVotes[faction.target]) {
        castVotes[faction.target] = 0;
      }
      castVotes[faction.target] += faction.votes ?? 0;
    }
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

export function startNextRound(mutate, gameid, factions, timers, state, subState, strategyCards) {
  resetCastVotes(mutate, gameid, factions);
  resetAgendaTimers(mutate, gameid, timers);
  resetStrategyCards(mutate, gameid, strategyCards);
  const data = {
    action: "START_NEXT_ROUND",
  };

  const updatedState = {...state};
  state.phase = "STRATEGY";
  state.activeplayer = state.speaker;
  state.round = state.round + 1;
  state.agendaNum = 1;

  const options = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  finalizeSubState(mutate, gameid, subState);
}

function agendaUpdates(agendaName) {
  switch (agendaName) {
    
  }
}

export default function AgendaPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: factions, factionError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets, planetError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const { data: timers } = useSWR(gameid ? `/api/${gameid}/timers` : null, fetcher);


  const [ agenda, setAgenda ] = useState(null);
  const [ agendaModal, setAgendaModal ] = useState(null);
  // Only used for Covert Legislation.
  // const [ subAgenda, setSubAgenda ] = useState(null);
  const [ subAgendaModal, setSubAgendaModal ] = useState(null);
  const [ outcome, setOutcome ] = useState(null);
  const [ outcomeModal, setOutcomeModal ] = useState(null);

  const [ factionVotes, setFactionVotes ] = useState({});

  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  const [ speakerTieBreak, setSpeakerTieBreak ] = useState(null);
  const [ miscount, setMiscount ] = useState(false);
  const { advanceAgendaPhase, resetAgendaPhase } = useSharedCurrentAgenda();
  
  if (!agendas) {
    return null;
  }

  let currentAgenda = null;
  const agendaNum = state.agendaNum ?? 1;
  if (subState.agenda) {
    currentAgenda = agendas[subState.agenda];
  }

  if (!agendas || !factions || !planets || !strategyCards || !objectives || !state) {
    return <div>Loading...</div>;
  }

  const votes  = computeVotes(currentAgenda, subState.factions);
  const maxVotes = Object.values(votes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(votes).filter(([target, voteCount]) => {
    return voteCount === maxVotes;
  }).map(([target, voteCount]) => {
    return target;
  });
  const isTie = selectedTargets.length !== 1;

  const localAgenda = {...currentAgenda};
  if (subState.outcome) {
    localAgenda.elect = subState.outcome;
  }

  const allTargets = getTargets(localAgenda, factions, strategyCards, planets, agendas, objectives);

  // function toggleSpeakerTieBreak(target) {
  //   if (speakerTieBreak === target) {
  //     setSpeakerTieBreak(null);
  //   } else {
  //     setSpeakerTieBreak(target);
  //   }
  // }
  
  function selectSpeakerTieBreak(tieBreak) {
    setSubStateOther(mutate, gameid, subState, "tieBreak", tieBreak);
  }


  async function completeAgenda() {
    const target = isTie ? subState.tieBreak : selectedTargets[0];
    let activeAgenda = subState.agenda;
    if (subState.subAgenda) {
      activeAgenda = subState.subAgenda;
      resolveAgenda(mutate, gameid, agendas, subState.agenda, subState.subAgenda);
    }
    agendaUpdates(mutate, gameid, activeAgenda);
    resolveAgenda(mutate, gameid, agendas, activeAgenda, target);

    updateCastVotes(mutate, gameid, factions, subState.factions);
    hideSubStateAgenda(mutate, gameid, subState, "");
    if (activeAgenda === "Miscount Disclosed") {
      repealAgenda(mutate, gameid, agendas, target);
      revealSubStateAgenda(mutate, gameid, subState, target);
      setSubStateOther(mutate, gameid, subState, "miscount", true);
    } else {
      finalizeSubState(mutate, gameid, subState);
      const agendaNum = state.agendaNum ?? 1;
      setAgendaNum(mutate, gameid, state, agendaNum + 1);
    }
  }

  function nextPhase() {
    startNextRound(mutate, gameid, factions, timers, state, subState, strategyCards);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }
  
  function selectAgenda(agendaName) {
    revealSubStateAgenda(mutate, gameid, subState, agendaName);
  }
  function hideAgenda(agendaName) {
    hideSubStateAgenda(mutate, gameid, subState, agendaName);
  }

  // function selectAgenda(agendaName) {
  //   if (agendaName !== null) {
  //     setAgenda(agendas[agendaName]);
  //   }
  //   setAgendaModal(false);
  //   setSubAgenda(null);
  //   setFactionVotes({});
  // }
  function selectSubAgenda(agendaName) {
    setSubStateOther(mutate, gameid, subState, "subAgenda", agendaName);
    if (agendaName !== null) {
      // setSubAgenda(agendas[agendaName]);
    }
    setSubAgendaModal(false);
  }
  function selectEligibleOutcome(outcome) {
    setSubStateOther(mutate, gameid, subState, "outcome", outcome);
    setOutcome(outcome);
    // setSubAgenda(null);
    setOutcomeModal(false);
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

  // function computeVotes() {
  //   const castVotes = agenda && agenda.elect === "For/Against" ? {"For": 0, "Against": 0} : {};
  //   Object.values(subState.factions ?? {}).forEach((faction) => {
  //     if (faction.target && faction.target !== "Abstain") {
  //       if (!castVotes[faction.target]) {
  //         castVotes[faction.target] = 0;
  //       }
  //       castVotes[faction.target] += faction.votes ?? 0;
  //     }
  //   });
  //   const orderedVotes = Object.keys(castVotes).sort((a, b) => {
  //     if (a === "For") {
  //       return -1;
  //     }
  //     if (b === "For") {
  //       return 1;
  //     }
  //     if (a < b) {
  //       return -1;
  //     }
  //     return 1;
  //   }).reduce(
  //     (obj, key) => { 
  //       obj[key] = castVotes[key]; 
  //       return obj;
  //     }, 
  //     {}
  //   );
  //   return orderedVotes;
  // }

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

  const orderedAgendas = Object.values(agendas ?? {}).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  });
  const outcomes = new Set();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });

  let width = 1400;
  if (orderedAgendas.length < 35) {
    width = 920;
  }
  if (orderedAgendas.length < 18) {
    width = 460;
  }

  const flexDirection = currentAgenda && currentAgenda.elect === "For/Against" ? "flexRow" : "flexColumn";
  const label = !!subState.miscount ? "Re-voting on Miscounted Agenda" : agendaNum === 1 ? "FIRST AGENDA" : "SECOND AGENDA";

  const numFactions = votingOrder.length;

  const checksAndBalances = agendas['Checks and Balances'] ?? {};

  return (
  <div className="flexRow" style={{gap: responsivePixels(40), height: "100vh", width: "100%", alignItems: "flex-start", justifyContent: "space-between"}}>
    <AgendaSelectModal visible={agendaModal} onComplete={(agendaName) => selectAgenda(agendaName)} />
    <AgendaSelectModal visible={subAgendaModal} onComplete={(agendaName) => selectSubAgenda(agendaName)} filter={{elect: subState.outcome}} />
    <OutcomeSelectModal visible={outcomeModal} onComplete={(eligibleOutcome) => selectEligibleOutcome(eligibleOutcome)} />
    <div className="flexColumn" style={{paddingTop: responsivePixels(140), gap: numFactions > 7 ? 0 : responsivePixels(8), alignItems: "stretch", width: responsivePixels(300)}}>
      {numFactions < 7 ? <div className="flexRow" style={{alignItems: "flex-end"}}>
        <div style={{textAlign: "center", width: responsivePixels(80)}}>Available Votes</div>
        <div style={{textAlign: "center", width: responsivePixels(40)}}>Cast Votes</div>
        <div style={{textAlign: "center", width: responsivePixels(120)}}>Target</div>
      </div> : null}
      {votingOrder.map((faction) => {
        return <VoteCount key={faction.name} factionName={faction.name} changeVote={changeVote} agenda={localAgenda} />
      })}
      <LawsInEffect />
    </div>
    <div className='flexColumn' style={{flexBasis: "30%", paddingTop: responsivePixels(80)}}> 
      <AgendaTimer />
      {agendaNum > 2 ? <div style={{fontSize: responsivePixels(40), textAlign: "center", marginTop: responsivePixels(120), width: "100%"}}>
        Agenda Phase Complete
        </div> : 
      <ol className='flexColumn' style={{alignItems: "flex-start", margin: "0", padding: "0", fontSize: responsivePixels(18), alignItems: "stretch"}}>
        <NumberedItem>
          <div className="flexRow mediumFont" style={{justifyContent: "flex-start", whiteSpace: "nowrap"}}>
            {!miscount ? 
            !currentAgenda ? <div className="flexRow" style={{justifyContent: "flex-start"}}>
              <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])}>
                <HoverMenu label="Reveal and Read one Agenda">
                  <div className="flexRow" style={{padding: responsivePixels(8), gap: responsivePixels(4), writingMode: "vertical-lr", alignItems: 'stretch', justifyContent: "flex-start", maxHeight: responsivePixels(400), flexWrap: "wrap"}}>
                    {orderedAgendas.map((agenda) => {
                      return <button key={agenda.name} className={agenda.resolved ? "faded" : ""} style={{fontSize: responsivePixels(14)}} onClick={() => selectAgenda(agenda.name)}>{agenda.name}</button>
                    })}
                  </div>
                </HoverMenu>
              </LabeledDiv>
              </div> :
              <LabeledDiv label={label}>
                <AgendaRow agenda={currentAgenda} removeAgenda={() => hideAgenda(currentAgenda.name)} />
              </LabeledDiv>
            : "Re-voting on miscounted agenda"}
          </div>
          <div className='flexColumn' style={{gap: responsivePixels(4)}}>
          {/* {agenda ? 
            <LabeledDiv label="AGENDA" style={{width: "auto"}}>
              <AgendaRow agenda={agenda} removeAgenda={() => {setAgenda(null); setFactionVotes({});}} />
            </LabeledDiv>
          : <HoverMenu label="Reveal Agenda">
            <div className="flexRow" style={{gap: "4px", writingMode: "vertical-lr", alignItems: 'stretch', justifyContent: "flex-start", padding: "8px", maxHeight: "530px", flexWrap: "wrap"}}>
              {orderedAgendas.map((agenda) => {
                return <button onClick={() => selectAgenda(agenda.name)}>{agenda.name}</button>
              })}
            </div>
          </HoverMenu>} */}
          
          {/* <button onClick={() => setAgendaModal(true)}>Reveal Agenda</button> */}
        </div>
        </NumberedItem>
        {currentAgenda && currentAgenda.name === "Covert Legislation" ? 
          <NumberedItem>
            <div className="flexRow mediumFont" style={{justifyContent: "flex-start", whiteSpace: "nowrap"}}>

            {subState.outcome ? 
              <LabeledDiv label="ELIGIBLE OUTCOMES">
              <SelectableRow itemName={subState.outcome} content={
                <div style={{display: "flex"}}>
                  {subState.outcome}
                </div>} removeItem={() => selectEligibleOutcome(null)} />
              </LabeledDiv> : 
            <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])}>

            <HoverMenu label="Reveal Eligible Outcomes">
              <div className='flexColumn' style={{padding: responsivePixels(8), gap: responsivePixels(4), alignItems: "stretch", justifyContent: 'flex-start'}}>
              {Array.from(outcomes).map((outcome) => {
                return <button key={outcome} style={{fontSize: responsivePixels(14)}} onClick={() => selectEligibleOutcome(outcome)}>{outcome}</button>
              })}
              </div>
            </HoverMenu>
            </LabeledDiv>}
            </div>
            </NumberedItem>
          : null}
        <NumberedItem>In Speaker Order:
        <div className="flexColumn largeFont" style={{paddingLeft: responsivePixels(8), gap: responsivePixels(4), alignItems: "flex-start"}}>
          <div>Perform any <i>When an Agenda is revealed</i> actions</div>
          <div>Perform any <i>After an Agenda is revealed</i> actions</div>
        </div>
        </NumberedItem>
        <NumberedItem>Discuss</NumberedItem>
        <NumberedItem>
          In Voting Order: Cast votes (or abstain)
          {votes && Object.keys(votes).length > 0 ? 
          <div className={flexDirection} style={{marginTop: responsivePixels(12), gap: responsivePixels(4), padding: `${responsivePixels(8)} ${responsivePixels(20)}`, alignItems: "flex-start", width: "100%", border: `${responsivePixels(1)} solid #555`, borderRadius: responsivePixels(10)}}>
          {Object.entries(votes).map(([target, voteCount]) => {
            return <div key={target}>{target}: {voteCount}</div>
          })}
          </div>
        : null}
        </NumberedItem>
        {currentAgenda && isTie ? 
          <NumberedItem>
            <div>
              {!subState.tieBreak ? <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])} style={{width: "auto"}}>
                <HoverMenu label="Choose outcome if tied">
                  <div className="flexRow" style={{alignItems: "stretch", justifyContent: "flex-start", gap: responsivePixels(4), padding: responsivePixels(8), writingMode: "vertical-lr", maxHeight: responsivePixels(320), flexWrap: "wrap"}}>
                    {selectedTargets.length > 0 ? selectedTargets.map((target) => {
                      return <button key={target} style={{fontSize: responsivePixels(14)}} className={subState.tieBreak === target ? "selected" : ""} onClick={() => selectSpeakerTieBreak(target)}>{target}</button>;
                    }) : 
                    allTargets.map((target) => {
                      if (target === "Abstain") {
                        return null;
                      }
                      return <button key={target} style={{fontSize: responsivePixels(14)}} className={subState.tieBreak === target ? "selected" : ""} onClick={() => selectSpeakerTieBreak(target)}>{target}</button>;
                    })}
                  </div>
                </HoverMenu>
              </LabeledDiv> : 
              <LabeledDiv label="SPEAKER SELECTED OPTION">
                <SelectableRow itemName={subState.tieBreak} removeItem={() => selectSpeakerTieBreak(null)}>
                  {subState.tieBreak}
                </SelectableRow>
              </LabeledDiv>
              }
            </div>
          </NumberedItem>
        : null}
        {/* <NumberedItem>
          <div className="flexRow" style={{justifyContent: "flex-start", gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
              Choose outcome if tied
          </div>
          {isTie ? 
           <div className="flexRow" style={{paddingTop: "8px", gap: "4px", flexWrap: "wrap", maxWidth: "600px", width: "100%"}}>
            {selectedTargets.length > 0 ? selectedTargets.map((target) => {
              return <button key={target} className={speakerTieBreak === target ? "selected" : ""} onClick={() => toggleSpeakerTieBreak(target)}>{target}</button>;
            }) : 
            allTargets.map((target) => {
              if (target === "Abstain") {
                return null;
              }
              return <button key={target} className={speakerTieBreak === target ? "selected" : ""} onClick={() => toggleSpeakerTieBreak(target)}>{target}</button>;
            })}
            </div>
          : null}
        </NumberedItem> */}
        <NumberedItem>Resolve agenda outcome
          <div className="flexColumn mediumFont" style={{width: "100%", paddingTop: responsivePixels(4)}}>
          {currentAgenda && currentAgenda.name === "Covert Legislation" ? 
            !subState.subAgenda ? 
            <HoverMenu label="Reveal Covert Legislation Agenda">
              <div className="flexRow" style={{gap: responsivePixels(4), writingMode: "vertical-lr", alignItems: 'stretch', justifyContent: "flex-start", padding: responsivePixels(8), maxHeight: responsivePixels(240), flexWrap: "wrap"}}>
                {Object.values(agendas ?? {}).filter((agenda) => agenda.elect === outcome)
                .map((agenda) => {
                  return <button style={{fontSize: responsivePixels(14)}} onClick={() => selectSubAgenda(agenda.name)}>{agenda.name}</button>;
                })}
              </div>
            </HoverMenu>
            : <AgendaRow agenda={agendas[subState.subAgenda]} removeAgenda={() => selectSubAgenda(null)} />
          : null}
          {!isTie && selectedTargets.length > 0 ? 
            <div className="flexColumn" style={{paddingTop: responsivePixels(8), width: "100%"}}>
              <button onClick={completeAgenda}>Resolve with target: {selectedTargets[0]}</button>
            </div>
          : null}
          {isTie && subState.tieBreak && (selectedTargets.length === 0 || selectedTargets.includes(subState.tieBreak)) ? 
            <div className="flexColumn" style={{paddingTop: responsivePixels(8), width: "100%"}}>
              <button onClick={completeAgenda}>Resolve with target: {subState.tieBreak}</button>
            </div>
          : null}
          </div>
        </NumberedItem>
        {currentAgenda === 1 ? <NumberedItem>Repeat Steps 1 to 6</NumberedItem> : null}
        {checksAndBalances.resolved &&
         checksAndBalances.target === "Against" &&
         checksAndBalances.activeRound === state.round ?
         <NumberedItem>Ready three planets</NumberedItem>
         : <NumberedItem>Ready all planets</NumberedItem>}
    </ol>}
      <button style={{marginTop: responsivePixels(12), fontSize: responsivePixels(24)}} onClick={() => nextPhase()}>Start Next Round</button>
    </div>
    <div className="flexColumn" style={{flexBasis: "30%", maxWidth: responsivePixels(400)}}>
      <SummaryColumn />
    </div>
  </div>
  );
}
