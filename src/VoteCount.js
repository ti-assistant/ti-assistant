import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr'
import { BasicFactionTile } from './FactionTile';
import { useSharedCurrentAgenda } from './Timer';
import { setSpeaker } from './util/api/state';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { applyAllPlanetAttachments, filterToClaimedPlanets } from './util/planets';
import { FactionTile } from '/src/FactionCard.js'

const enableVotingTargets = false;

export function VoteCount({ factionName, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: factions, factionError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { data: planets, planetError } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { data: attachments, attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher, {
    refreshInterval: 5000,
  });
  const [ usingPredictiveIntelligence, setUsingPredictiveIntelligence ] = useState(true);
  const [ castVotes, setCastVotes ] = useState(0);
  const { currentAgenda } = useSharedCurrentAgenda();

  useEffect(() => {
    setCastVotes(0);
  }, [currentAgenda]);

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
      }}
    >
      <div className="flexRow" style={{gap: "16px", padding: "4px 4px 4px 8px", justifyContent: "flex-start", alignItems: "center"}}>
      {faction ? 
          <div style={{flexBasis: "50%", flexGrow: 4, whiteSpace: "nowrap"}}>
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
          <div className="hoverParent" style={{fontSize: "16px"}}>
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
          {castVotes > 0 ? <div className="arrowDown" onClick={() => setCastVotes(castVotes - 1)}></div> : <div style={{width: "12px"}}></div>}
          <div className="flexRow" style={{width: "32px"}}>{castVotes}</div>
          {<div className="arrowUp" onClick={() => setCastVotes(castVotes + 1)}></div>}
        </div>
        {/* <div className="flexRow">
          <button style={{width: "42px"}}>Select Target</button>
        </div> */}
      </div>
    </div>
  );
}