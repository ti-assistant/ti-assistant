import { useRouter } from 'next/router'
import useSWR from 'swr'
import { BasicFactionTile } from './FactionTile';
import { hasTech } from './util/api/techs';

import { fetcher } from './util/api/util';
import { applyPlanetAttachments } from './util/helpers';
import { FactionTile } from '/src/FactionCard.js'

export function VoteCount({ factionName, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
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
  
  if (factionError || planetError || attachmentsError) {
    return (<div>Failed to load faction info</div>);
  }

  const faction = factions[factionName] ?? null;


  const ownedPlanets = Object.values(planets ?? {}).filter((planet) => {
    return (planet.owners ?? []).includes(factionName);
  }).map((planet) => {
    return applyPlanetAttachments(planet, attachments);
  });
  
  let influence = 0;
  for (const planet of ownedPlanets) {
    if (planet.ready || options.total) {
      influence += planet.influence;
    }
  }

  let extraVotes = 0;
  if (factionName === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  if (hasTech(faction, "Predictive Intelligence")) {
    extraVotes += 3;
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
            <BasicFactionTile faction={faction} speaker={state.speaker === faction.name} opts={{fontSize: "16px"}} />
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
          </div>
        </div>
      </div>
    </div>
  );
}