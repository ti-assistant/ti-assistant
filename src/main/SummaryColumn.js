import { useRouter } from 'next/router'
import useSWR, { mutate } from 'swr'
import { FactionCard } from '../FactionCard.js'
import { fetcher } from '../util/api/util';
import { FactionSummary, UpdateObjectivesModal, UpdatePlanetsModal, UpdateTechsModal } from '../FactionSummary';
import { updateOption } from '../util/api/options.js';
import { useRef, useState } from 'react';
import { useSharedUpdateTimes } from '../Updater.js';
import { LabeledDiv } from '../LabeledDiv.js';
import { getFactionColor, getFactionName } from '../util/factions.js';
import { responsivePixels } from '../util/util.js';
import { StaticFactionTimer } from '../Timer.js';

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

  let maxSummaryWidth = responsivePixels(800);
  // if (!showPlanets && !showTechs) {
  //   maxSummaryWidth = responsivePixels(128);
  // } else if (!showPlanets) {
  //   maxSummaryWidth = "280px";
  // } else if (!showTechs) {
  //   maxSummaryWidth = "280px";
  // }

  const factionCardOptions = {
    hideTitle: true,
    iconSize: "95px",
  };
  const factionSummaryOptions = {
    showIcon: true,
    hidePlanets: !showPlanets,
    hideTechs: !showTechs,
  };

  const numFactions = Object.keys(factions).length;
    
  return (
    <div className="flexColumn" style={{width: "100%", alignItems: "stretch", height: "100vh", maxWidth: maxSummaryWidth, gap: numFactions < 8 ? responsivePixels(12) : responsivePixels(4)}}>
      {/* <UpdateTechsModal visible={showTechModal} onComplete={() => setShowTechModal(false)} />
      <UpdateObjectivesModal visible={showObjectiveModal} onComplete={() => setShowObjectiveModal(false)} />
      <UpdatePlanetsModal visible={showPlanetModal} onComplete={() => setShowPlanetModal(false)} /> */}
        {/* <LabeledDiv label="Update">
        <div className="flexRow" style={{width: "100%"}}>
          {showTechs ? <button style={{fontSize: responsivePixels(14)}} onClick={() => setShowTechModal(true)}>Techs</button> : null}
          <button style={{fontSize: responsivePixels(14)}} onClick={() => setShowObjectiveModal(true)}>Objectives</button>
          {showPlanets ? <button style={{fontSize: responsivePixels(14)}} onClick={() => setShowPlanetModal(true)}>Planets</button> : null}
        </div>
        </LabeledDiv> */}
      {numFactions < 8 ? <div className="flexRow">Speaker Order</div> : null}

      {orderedFactions.map(([name, faction]) => {
        return (
          <div style={{flex: `${responsivePixels(72)} 0 0`}}>
            <LabeledDiv key={name} label={getFactionName(faction)} rightLabel={<StaticFactionTimer factionName={name} style={{fontSize: responsivePixels(16), width: "auto"}} />} color={getFactionColor(faction)} style={{height: "100%"}}>
            {/* <FactionCard key={name} faction={faction} opts={factionCardOptions} content={ */}
              <FactionSummary factionName={name} options={factionSummaryOptions} />
            </LabeledDiv>
          </div>
        );
      })}
      {/* {numFactions < 8 ? <div className="flexColumn" style={{gap: responsivePixels(4), whiteSpace: "nowrap"}}>
        <div className="flexRow" style={{gap: responsivePixels(12)}}>
          <button style={{fontSize: responsivePixels(14)}} onClick={() => setOption("faction-summary-show-techs", !showTechs)}>{showTechs ? "Hide Techs" : "Show Techs"}</button>
          <button style={{fontSize: responsivePixels(14)}} onClick={() => setOption("faction-summary-show-planets", !showPlanets)}>{showPlanets ? "Hide Planets" : "Show Planets"}</button>
        </div>
      </div> :null} */}
    </div>
  );
}