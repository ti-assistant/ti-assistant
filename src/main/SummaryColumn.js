import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useState } from "react";
import { FactionCard } from '../FactionCard.js'
import { fetcher } from '../util/api/util';
import { FactionSummary } from '../FactionSummary';

export default function SummaryColumn() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ showTechs, setShowTechs ] = useState(true);
  const [ showPlanets, setShowPlanets ] = useState(true);

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  let maxSummaryWidth = "400px";
  if (!showPlanets && !showTechs) {
    maxSummaryWidth = "200px";
  } else if (!showPlanets) {
    maxSummaryWidth = "280px";
  } else if (!showTechs) {
    maxSummaryWidth = "280px";
  }

  const factionCardOptions = {
    hideTitle: true,
  };
  const factionSummaryOptions = {
    showIcon: true,
    hidePlanets: !showPlanets,
    hideTechs: !showTechs,
  };
    
  return (
    <div className="flexColumn" style={{width: "100%", alignItems: "stretch", gap: "6px", maxWidth: maxSummaryWidth}}>
      <div className="flexRow">Speaker Order</div>
      <div className="flexRow">
        <button onClick={() => setShowTechs(!showTechs)}>{showTechs ? "Hide Techs" : "Show Techs"}</button>
        <button onClick={() => setShowPlanets(!showPlanets)}>{showPlanets ? "Hide Planets" : "Show Planets"}</button>
      </div>
      {orderedFactions.map(([name, faction]) => {
        return (
          <FactionCard key={name} faction={faction} opts={factionCardOptions} content={
            <FactionSummary factionName={name} options={factionSummaryOptions} />
          } />
        );
      })}
    </div>
  );
}