import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { BasicFactionTile } from './FactionTile';
import { HoverMenu } from './HoverMenu';
import { LabeledDiv } from './LabeledDiv';
import { useSharedCurrentAgenda } from './Timer';
import { useSharedUpdateTimes } from './Updater';
import { setSpeaker } from './util/api/state';
import { castSubStateVotes } from './util/api/subState';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { getFactionColor, getFactionName } from './util/factions';
import { applyAllPlanetAttachments, filterToClaimedPlanets } from './util/planets';
import { responsivePixels } from './util/util';

export function getTargets(agenda, factions, strategycards, planets, agendas, objectives) {
  if (!agenda) {
    return [];
  }
switch (agenda.elect) {
    case "For/Against":
      return [
        "For",
        "Against",
        "Abstain",
      ];
    case "Player":
      return [...Object.values(factions).map((faction) => {return faction.name}), "Abstain"];
    case "Strategy Card":
      return [...Object.keys(strategycards), "Abstain"];
    case "Planet":
      const ownedPlanetNames = Object.values(planets).filter((planet) => (planet.owners ?? []).length > 0).map((planet) => planet.name);
      return [...ownedPlanetNames, "Abstain"];
    case "Cultural Planet":
      const culturalPlanets = Object.values(planets).filter((planet) => {
        return planet.type === "Cultural";
      }).map((planet) => planet.name);
      return [...culturalPlanets, "Abstain"];
    case "Hazardous Planet":
      const hazardousPlanets = Object.values(planets).filter((planet) => {
        return planet.type === "Hazardous";
      }).map((planet) => planet.name);
      return [...hazardousPlanets, "Abstain"];
    case "Industrial Planet":
      const industrialPlanets = Object.values(planets).filter((planet) => {
        return planet.type === "Industrial";
      }).map((planet) => planet.name);
      return [...industrialPlanets, "Abstain"];
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets).filter((planet) => {
        return (planet.owners ?? []).length > 0 && !planet.home && planet.name !== "Mecatol Rex";
      }).map((planet) => planet.name);
      return [...electablePlanets, "Abstain"];
    case "Law":
      const passedLaws = Object.values(agendas).filter((agenda) => {
        return agenda.type === "law" && agenda.passed;
      }).map((law) => law.name);
      return [...passedLaws, "Abstain"];
    case "Scored Secret Objective":
      const secrets = Object.values(objectives).filter((objective) => {
        return objective.type === "secret";
      });
      const scoredSecrets = secrets.filter((objective) => {
        return (objective.scorers ?? []).length > 0;
      });
      if (scoredSecrets.length === 0) {
        return [...secrets.map((secret) => secret.name), "Abstain"];
      }
      return [...scoredSecrets.map((secret) => secret.name), "Abstain"];
  }
  return [];
}

export function canFactionVote(factionName, agendas, state, factions) {
  if (factionName === "Nekro Virus") {
    return false;
  }
  if (factionName === "Xxcha Kingdom" && factions[factionName].commander === "unlocked") {
    return true;
  }
  const publicExecution = agendas['Public Execution'] ?? {};
  if (publicExecution.resolved &&
      publicExecution.target === factionName &&
      publicExecution.activeRound === state.round) {
    return false;
  }
  return true;
}

function isValidVoteCount(numVotes, factionName, factions, planets, attachments, options) {

}

function computeRemainingVotes(factionName, factions, planets, attachments, options) {
  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const orderedPlanets = updatedPlanets.sort((a, b) => {
    const aRatio = a.resources > 0 ? a.influence / a.resources : Number.MAX_SAFE_INTEGER;
    const bRatio = b.resources > 0 ? b.influence / b.resources : Number.MAX_SAFE_INTEGER;
    if (aRatio !== bRatio) {
      return bRatio - aRatio;
    }
    if (a.influence !== b.influence) {
      return b.influence - a.influence;
    }
    if ((a.attributes ?? []).length !== (b.attributes ?? []).length) {
      return (a.attributes ?? []).length - (b.attributes ?? []).length;
    }
    return 0;
  });

  let influenceNeeded = factions[factionName].votes ?? 0;
  if (factionName === "Argent Flight") {
    influenceNeeded = Math.max(influenceNeeded - Object.keys(factions).length, 0);
  }
  let planetCount = 0;
  let remainingVotes = 0;
  for (const planet of orderedPlanets) {
    let planetInfluence = planet.influence;
    if (factionName === "Xxcha Kingdom") {
      if (options.expansions.includes("codex-three") &&
          factions[factionName].hero === "unlocked") {
            console.log("Adding");
        planetInfluence += planet.resources;
      }
      if (factions[factionName].commander === "unlocked") {
        console.log("Double Add");
        planetInfluence += 1;
      }
    }
    if (influenceNeeded > 0 && planetInfluence <= influenceNeeded) {
      influenceNeeded -= planetInfluence;
      console.log(`Using ${planet.name} for ${planetInfluence} votes`);
      continue;
    }
    if (factionName === "Xxcha Kingdom" && factions[factionName].commander === "unlocked") {
      planetInfluence -= 1;
    }
    planetCount++;

    remainingVotes += planetInfluence;
  }

  console.log(influenceNeeded);

  // Player cast an invalid number of votes. Forcibly adjust.
  if (influenceNeeded > 0) {
    remainingVotes = Math.max(remainingVotes - influenceNeeded, 0);
  }

  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (factionName === "Xxcha Kingdom" && factions[factionName].commander === "unlocked") {
    extraVotes += planetCount;
  }
  const hasPredictiveIntelligence = hasTech(factions[factionName], "Predictive Intelligence");
  if (hasPredictiveIntelligence) {
    extraVotes += 3;
  }

  return {
    influence: remainingVotes,
    extraVotes: extraVotes,
  };
}

export function VoteCount({ factionName, agenda, changeVote, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: factions, factionError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: planets, planetError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: attachments, attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: strategycards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options = {} } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const [ usingPredictiveIntelligence, setUsingPredictiveIntelligence ] = useState(true);
  // const [ castVotes, setCastVotes ] = useState(0);
  const [ target, setTarget ] = useState(null);
  const [ showTargets, setShowTargets ] = useState(false);
  const { currentAgenda } = useSharedCurrentAgenda();
  


  function toggleTargets() {
    setShowTargets(!showTargets);
  }

  function hideTargets() {
    setShowTargets(false);
  }

  function updateTarget(newTarget) {
    setTarget(newTarget);
    if (castVotes > 0) {
      changeVote(factionName, castVotes, newTarget);
    }
  }

  // Reset cast votes whenever current agenda changes.
  // useEffect(() => {
  //   setCastVotes(0);
  //   setTarget(null);
  // }, [currentAgenda]);

  const elect = agenda.elect;

  useEffect(() => {
    setTarget(null);
  }, [elect]);

  function castVotes(target, votes) {
    if (!target || target === "Abstain") {
      castSubStateVotes(mutate, gameid, factionName, "Abstain", 0);
    } else {
      castSubStateVotes(mutate, gameid, factionName, target, votes);
    }
  }

  // function updateCastVotes(votes) {
  //   setCastVotes(votes);
  //   if (target) {
  //     changeVote(factionName, votes, target);
  //   }
  // }

  if (factionError || planetError || attachmentsError) {
    return (<div>Failed to load faction info</div>);
  }

  const faction = factions[factionName] ?? null;


  const {influence, extraVotes} = computeRemainingVotes(factionName, factions, planets, attachments, options);

  // const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  // const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  // let influence = 0;
  // for (const planet of updatedPlanets) {
  //   if (planet.ready || opts.total) {
  //     if (options.expansions.includes("codex-three") &&
  //         factionName === "Xxcha Kingdom" &&
  //         faction.hero === "unlocked") {
  //       influence += planet.resources + planet.influence;
  //     } else {
  //       influence += planet.influence;
  //     }
  //   }
  // }
  // influence -= Math.min(factions[factionName].votes ?? 0, influence);

  // let extraVotes = 0;
  // if (factionName === "Argent Flight") {
  //   extraVotes += Object.keys(factions).length;
  // }
  // if (factionName === "Xxcha Kingdom" && faction.commander === "unlocked") {
  //   extraVotes += updatedPlanets.length;
  // }
  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  const menuButtons = [];
  if (factionName !== state.speaker) {
    menuButtons.push({
        text: "Set Speaker",
        action: () => setSpeaker(mutate, gameid, factionName, factions),
    });
  }
  if (hasPredictiveIntelligence) {
    menuButtons.push({
      text: usingPredictiveIntelligence ? "Cancel Predictive Intelligence" : "Use Predictive Intelligence",
      action: () => setUsingPredictiveIntelligence(!usingPredictiveIntelligence),
    });
  }

  const targetButtonStyle = {
    fontFamily: "Myriad Pro",
    whiteSpace: "nowrap",
    position: "absolute",
    display: showTargets ? "flex" : "none",
    zIndex: 1000,
    left: "100%",
    marginLeft: "4px",
    height: "40px",
    menuButtonStyletop: "0",
  };

  const targets = getTargets(agenda, factions, strategycards, planets, agendas, objectives);
  const factionSubState = ((subState.factions ?? {})[factionName] ?? {});

  return (
    <LabeledDiv label={getFactionName(faction)} color={getFactionColor(faction)}>
      
    {/* <div
      style={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        border: `3px solid #333`,
        fontSize: opts.fontSize ?? "24px",
        position: "relative",
        cursor: "auto",
        height: "64px",
        justifyContent: "center",
      }}> */}
      <div className="flexRow" style={{gap: responsivePixels(16), width: "100%", justifyContent: "space-between", alignItems: "center"}}>
      {/* {faction ? 
          <div style={{flexBasis: "200px", flexGrow: 0, flexShrink: 0, whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={faction} speaker={state.speaker === faction.name} menuButtons={menuButtons} opts={{fontSize: "16px"}} />
          </div>
        : null} */}
        {!canFactionVote(factionName, agendas, state, factions) ? 
          "Cannot Vote"
        : 
        <React.Fragment>
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          whiteSpace: "nowrap",
          flexShrink: 0,
          height: "100%",
        }}>
          <div style={{
            color: "#72d4f7",
            lineHeight: responsivePixels(35),
            fontSize: responsivePixels(35),
            textShadow: `0 0 ${responsivePixels(4)} #72d4f7`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: responsivePixels(28),
            height: responsivePixels(35),
          }}>
            &#x2B21;
          </div>
          <div style={{
            lineHeight: responsivePixels(35),
            fontSize: responsivePixels(12),
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: responsivePixels(28),
            height: responsivePixels(35),
          }}>
            {influence}
          </div>
          <div style={{fontSize: responsivePixels(16)}}>
            + {extraVotes}
            {/* <div className="flexColumn hoverInfo right">
              <div className="flexColumn" style={{gap: responsivePixels(8)}}>
                {factionName === "Argent Flight" ? 
                  <div className="flexColumn" style={{gap: "4px", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", border: `2px solid #333`, borderRadius: "5px"}}>
                    Zeal
                    <span style={{fontFamily: "Myriad Pro"}}>When you cast at least 1 vote, cast 1 additional vote for each player in the game, including you.</span>
                  </div>
                : null} */}
                {/* {hasPredictiveIntelligence && usingPredictiveIntelligence ? 
                  <div className="flexColumn" style={{gap: "4px", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", border: `2px solid #333`, borderRadius: "5px"}}>
                    Predictive Intelligence: <span style={{fontFamily: "Myriad Pro"}}>When you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card.</span>
                  </div>
                : null} */}
              {/* </div>
            </div> */}
          </div>
        </div>
        <div className="flexRow hoverParent" style={{flexShrink: 0, gap: responsivePixels(4), fontSize: responsivePixels(20)}}>
          {factionSubState.votes > 0 ? <div className="arrowDown" onClick={() => castVotes(factionSubState.target, factionSubState.votes - 1)}></div> : <div style={{width: responsivePixels(12)}}></div>}
          <div className="flexRow" style={{width: responsivePixels(24)}}>{factionSubState.votes ?? 0}</div>
          {factionSubState.target && factionSubState.target !== "Abstain" ? <div className="arrowUp" onClick={() => castVotes(factionSubState.target, factionSubState.votes + 1)}></div> : <div style={{width: responsivePixels(12)}}></div>}
        </div>
        </React.Fragment>}
        <div style={{flexGrow: 4}}>
          <HoverMenu label={
            factionSubState.target ? factions[factionSubState.target] ? getFactionName(factions[factionSubState.target]) : factionSubState.target : "Select"
          } buttonStyle={{fontSize: responsivePixels(14)}} style={{minWidth: "100%"}}>
            <div className="flexRow" style={{padding: responsivePixels(8), gap: responsivePixels(4), alignItems: "stretch", justifyContent: "flex-start", display: "grid", gridAutoFlow: "column", gridTemplateRows: `repeat(${Math.min(targets.length, 11)}, auto)`}}>
              {targets.map((target) => {
                return (
                  <button key={target} style={{writingMode: "horizontal-tb", fontSize: responsivePixels(14)}} onClick={() => {castVotes(target, 0)}}>{target}</button>
                );
              })}
            </div>
          </HoverMenu>
        </div>
        {/* <div className="flexRow" style={{flexShrink: 0, minWidth: "72px"}}>
          <button className={showTargets ? "selected" : ""} onClick={toggleTargets}>{target ? target : "Select"}</button>
        </div>
        {targets && targets.length !== 0 ? <div className="flexColumn" style={targetButtonStyle}>
        <div className="flexColumn" style={{maxHeight: "400px", flexWrap: "wrap", alignItems: "stretch", gap: "4px"}}>
          {targets.map((target) => {
            return (
              <div key={target} style={{cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid #555`, borderRadius: "5px", fontSize: opts.fontSize ?? "16px"}} onClick={() => {hideTargets(); updateTarget(target)}}>{target}</div>)
          })}
        </div>
        </div> : null} */}
      </div>
    {/* </div> */}
    </LabeledDiv>
  );
}