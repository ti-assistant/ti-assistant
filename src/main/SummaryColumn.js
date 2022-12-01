import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { FactionCard } from '../FactionCard.js'
import { fetcher } from '../util/api/util';
import { FactionSummary, UpdateObjectivesModal, UpdatePlanetsModal, UpdateTechsModal } from '../FactionSummary';
import { updateOption } from '../util/api/options.js';
import { useState } from 'react';

export default function SummaryColumn() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);

  const [ showTechModal, setShowTechModal ] = useState(false);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  const [ showPlanetModal, setShowPlanetModal ] = useState(false);

  if (!options || !factions) {
    return <div>Loading...</div>;
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  const showTechs = options['faction-summary-show-techs'] ?? true;
  const showPlanets = options['faction-summary-show-planets'] ?? true;
  
  function setOption(optionName, value) {
    updateOption(mutate, gameid, options, optionName, value);
  }

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
      <UpdateTechsModal visible={showTechModal} onComplete={() => setShowTechModal(false)} />
      <UpdateObjectivesModal visible={showObjectiveModal} onComplete={() => setShowObjectiveModal(false)} />
      <UpdatePlanetsModal visible={showPlanetModal} onComplete={() => setShowPlanetModal(false)} />
      <div className="flexRow">Speaker Order</div>
      <div className="flexRow">
        <button onClick={() => setOption("faction-summary-show-techs", !showTechs)}>{showTechs ? "Hide Techs" : "Show Techs"}</button>
        <button onClick={() => setOption("faction-summary-show-planets", !showPlanets)}>{showPlanets ? "Hide Planets" : "Show Planets"}</button>
      </div>
      <div className="flexRow">
        {showTechs ? <button onClick={() => setShowTechModal(true)}>Update Techs</button> : null}
        <button onClick={() => setShowObjectiveModal(true)}>Score Objectives</button>
        {showPlanets ? <button onClick={() => setShowPlanetModal(true)}>Update Planets</button> : null}
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