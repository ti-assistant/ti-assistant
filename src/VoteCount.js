import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { BasicFactionTile } from './FactionTile';
import { useSharedCurrentAgenda } from './Timer';
import { setSpeaker } from './util/api/state';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { applyAllPlanetAttachments, filterToClaimedPlanets } from './util/planets';

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
      return [...Object.values(factions).map((faction) => {return faction.shortname}), "Abstain"];
    case "Strategy Card":
      return [...Object.keys(strategycards), "Abstain"];
    case "Planet":
      return [...Object.keys(planets), "Abstain"];
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
    case "Non-Home, Non-Mecatol Rex planet":
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets).filter((planet) => {
        return !planet.home && planet.name !== "Mecatol Rex";
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
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const [ usingPredictiveIntelligence, setUsingPredictiveIntelligence ] = useState(true);
  const [ castVotes, setCastVotes ] = useState(0);
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
  useEffect(() => {
    setCastVotes(0);
    setTarget(null);
  }, [currentAgenda]);

  const elect = agenda.elect;

  useEffect(() => {
    setTarget(null);
  }, [elect]);

  function updateCastVotes(votes) {
    setCastVotes(votes);
    if (target) {
      changeVote(factionName, votes, target);
    }
  }

  if (factionError || planetError || attachmentsError) {
    return (<div>Failed to load faction info</div>);
  }

  const faction = factions[factionName] ?? null;


  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  let influence = 0;
  for (const planet of updatedPlanets) {
    if (planet.ready || options.total) {
      influence += planet.influence;
    }
  }

  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  const menuButtons = [];
  if (factionName !== state.speaker) {
    menuButtons.push({
        text: "Set Speaker",
        action: () => setSpeaker(mutate, gameid, state, factionName, factions),
    });
  }
  if (hasPredictiveIntelligence) {
    if (usingPredictiveIntelligence) {
      extraVotes += 3;
    }
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

  return (
    <div
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
      }}>
      <div className="flexRow" style={{gap: "16px", padding: "4px 4px 4px 8px", justifyContent: "flex-start", alignItems: "center"}}>
      {faction ? 
          <div style={{flexBasis: "45%", flexGrow: 4, flexShrink: 0, whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={faction} speaker={state.speaker === faction.name} menuButtons={menuButtons} opts={{fontSize: "16px"}} />
          </div>
        : null}
        <div className="votingBlock">
          <div className="influenceSymbol">
            &#x2B21;
          </div>
          <div className="influenceTextWrapper">
            {influence}
          </div>
          <div style={{fontSize: "16px"}}>
            + {extraVotes}
            <div className="flexColumn hoverInfo right">
              <div className="flexColumn" style={{gap: "4px"}}>
                {factionName === "Argent Flight" ? 
                  <div className="flexColumn" style={{gap: "4px", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", border: `2px solid #333`, borderRadius: "5px"}}>
                    Zeal
                    <span style={{fontFamily: "Myriad Pro"}}>When you cast at least 1 vote, cast 1 additional vote for each player in the game, including you.</span>
                  </div>
                : null}
                {/* {hasPredictiveIntelligence && usingPredictiveIntelligence ? 
                  <div className="flexColumn" style={{gap: "4px", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", border: `2px solid #333`, borderRadius: "5px"}}>
                    Predictive Intelligence: <span style={{fontFamily: "Myriad Pro"}}>When you cast votes during the agenda phase, you may cast 3 additional votes; if you do, and the outcome you voted for is not resolved, exhaust this card.</span>
                  </div>
                : null} */}
              </div>
            </div>
          </div>
        </div>
        <div className="flexRow hoverParent" style={{flexShrink: 0, width: "72px", gap: "4px", fontSize: "24px"}}>
          {castVotes > 0 ? <div className="arrowDown" onClick={() => updateCastVotes(castVotes - 1)}></div> : <div style={{width: "12px"}}></div>}
          <div className="flexRow" style={{width: "32px"}}>{castVotes}</div>
          {<div className="arrowUp" onClick={() => updateCastVotes(castVotes + 1)}></div>}
        </div>
        <div className="flexRow" style={{flexShrink: 0, minWidth: "72px"}}>
          <button className={showTargets ? "selected" : ""} onClick={toggleTargets}>{target ? target : "Select"}</button>
        </div>
        {targets && targets.length !== 0 ? <div className="flexColumn" style={targetButtonStyle}>
        <div className="flexColumn" style={{maxHeight: "400px", flexWrap: "wrap", alignItems: "stretch", gap: "4px"}}>
          {targets.map((target) => {
            return (
              <div key={target} style={{cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid #555`, borderRadius: "5px", fontSize: opts.fontSize ?? "16px"}} onClick={() => {hideTargets(); updateTarget(target)}}>{target}</div>)
          })}
        </div>
        </div> : null}
      </div>
    </div>
  );
}