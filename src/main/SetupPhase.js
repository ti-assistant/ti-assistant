import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useRef, useState } from "react";
import { FactionCard, FactionSymbol, FullFactionSymbol, StartingComponents } from '../FactionCard';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { removeObjective, revealObjective } from '../util/api/objectives';
import { claimPlanet, readyPlanets } from '../util/api/planets';
import { useSharedUpdateTimes } from '../Updater';
import { HoverMenu } from '../HoverMenu';
import { LabeledDiv } from '../LabeledDiv';
import { getFactionColor, getFactionName } from '../util/factions';
import { finalizeSubState, hideSubStateObjective, revealSubStateObjective } from '../util/api/subState';
import { responsivePixels } from '../util/util';
import { NumberedItem } from '../NumberedItem';

export function startFirstRound(mutate, gameid, subState, factions, planets, objectives, state, options) {
  finalizeSubState(mutate, gameid, subState);
  const data = {
    action: "ADVANCE_PHASE",
  };
  if (factions['Council Keleres']) {
    for (const planet of factions['Council Keleres'].startswith.planets) {
      claimPlanet(mutate, gameid, planets, planet, "Council Keleres", options);
    }
    readyPlanets(mutate, gameid, planets, factions['Council Keleres'].startswith.planets, "Council Keleres");
  }
  (subState.objectives ?? []).forEach((objectiveName) => {
    revealObjective(mutate, gameid, objectives, null, objectiveName);
  });
  const activeFactionName = state.speaker;
  const phase = "STRATEGY";

  const updatedState = {...state};
  state.phase = phase;
  state.activeplayer = activeFactionName;

  const updateOptions = {
    optimisticData: updatedState,
  };

  mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), updateOptions);
}

function factionTechChoicesComplete(factions) {
  let complete = true;
  Object.values(factions).forEach((faction) => {
    if (faction.startswith.choice) {
      const numSelected = (faction.startswith.techs ?? []).length;
      const numRequired = faction.startswith.choice.select;
      const numAvailable = faction.startswith.choice.options.length;
      if (numSelected !== numRequired && numSelected !== numAvailable) {
        complete = false;
      }
    }
  });
  return complete;
}

function factionSubFactionChoicesComplete(factions) {
  if (!factions['Council Keleres']) {
    return true;
  }
  return (factions['Council Keleres'].startswith.planets ?? []).length !== 0;
}

export function setupPhaseComplete(factions, subState) {
  return factionSubFactionChoicesComplete(factions) &&
    factionTechChoicesComplete(factions) &&
    (subState.objectives ?? []).length > 1;
}

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  // const [ subState, setSubState ] = useState({});
  const [ revealedObjectives, setRevealedObjectives ] = useState([]);
  


  if (!state || !planets || !factions || !objectives || !options) {
    return <div>Loading...</div>;
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });




  function nextPhase() {
    startFirstRound(mutate, gameid, subState, factions, planets, objectives, state, options);
  }


  function addObj(objective) {
    revealSubStateObjective(mutate, gameid, subState, objective.name);
    // setSubState({
    //   ...subState,
    //   objectives: [...(subState.objectives ?? []), objective],
    // })
  }

  function removeObj(objectiveName) {
    hideSubStateObjective(mutate, gameid, subState, objectiveName);
    // setSubState({
    //   ...subState,
    //   objectives: (subState.objectives ?? []).filter((objective) => objective.name !== objectiveName),
    // });
    // setRevealedObjectives(revealedObjectives.filter((objective) => objective.name !== objectiveName));
    // removeObjective(mutate, gameid, objectives, null, objectiveName);
  }

  const stageOneObjectives = Object.values(objectives ?? {}).filter((objective) => objective.type === "stage-one");
  const selectedStageOneObjectives = stageOneObjectives.filter((objective) => objective.selected);

  const flexBasis = 100 / Object.keys(factions ?? {}).length;

  const revealedObjectiveNames = (subState.objectives ?? []);
  const availableObjectives = Object.values(objectives ?? {}).filter((objective) => {
    return objective.type === "stage-one" && !revealedObjectiveNames.includes(objective.name);
  });

  return (
    <div className="flexColumn" style={{alignItems: "center", justifyContent: "flex-start", marginTop: responsivePixels(100)}}>
      {/* <ObjectiveModal visible={showObjectiveModal} type="stage-one" onComplete={() => setShowObjectiveModal(false)} /> */}
      <ol className='flexColumn' style={{alignItems: "flex-start", margin: 0, padding: 0, fontSize: responsivePixels(24), margin: `0 ${responsivePixels(20)} 0 ${responsivePixels(40)}`}}>
        <NumberedItem>Build the galaxy</NumberedItem>
        <NumberedItem>Shuffle decks</NumberedItem>
        <NumberedItem><LabeledDiv label="Gather starting components">
        <div className="flexRow" style={{position: "relative", flexWrap: "wrap", alignItems:"flex-start", justifyContent: "space-evenly"}}>
          {orderedFactions.map(([name, faction]) => {
            return (
            <HoverMenu key={name} label={name} borderColor={getFactionColor(faction)}>
              <div style={{padding: `0 ${responsivePixels(8)} ${responsivePixels(8)} ${responsivePixels(8)}`}}>
                <StartingComponents faction={faction} />
              </div>
            </HoverMenu>
            // <FactionCard key={name} faction={faction} opts={{
            //   displayStartingComponents: true,
            //   fontSize: "16px",
            //   iconSize: "60%"
            // }} />
            );
          })}
        </div></LabeledDiv>
        </NumberedItem>
        <NumberedItem>Draw 2 secret objectives and keep one</NumberedItem>
        <NumberedItem>Re-shuffle secret objectives</NumberedItem>
        <NumberedItem>
          <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])}>
            Draw 5 stage one objectives and reveal 2
            {(subState.objectives ?? []).length > 0 ? 
              <LabeledDiv label="Revealed Objectives">
                <div className="flexColumn" style={{alignItems: "stretch"}}>
                {(subState.objectives ?? []).map((objectiveName) => {
                  return <ObjectiveRow key={objectiveName} objective={objectives[objectiveName]} removeObjective={() => removeObj(objectiveName)} viewing={true} />;
                })}
                </div>
              </LabeledDiv>
            : null}
        {(subState.objectives ?? []).length < 2 ? 
          <HoverMenu label="Reveal Objective" direction="up">
            <div className='flexRow' style={{padding: `${responsivePixels(8)}`,
    flexWrap: "wrap",
    maxHeight: `${responsivePixels(140)}`,
    alignItems: "stretch",
    gap: `${responsivePixels(4)}`,
    writingMode: "vertical-lr",
    justifyContent: "flex-start"}}>
              {Object.values(availableObjectives).filter((objective) => {
                return objective.type === "stage-one"
              })
                .map((objective) => {
                  return <button onClick={() => addObj(objective)}>{objective.name}</button>
                })}
            </div>
          </HoverMenu>
        : null}
          </LabeledDiv>
        </NumberedItem>
        <NumberedItem>
          <LabeledDiv label={`Speaker: ${getFactionName(factions[state.speaker])}`} color={getFactionColor(factions[state.speaker])}>
            Draw 5 stage two objectives
          </LabeledDiv>
        </NumberedItem>
      </ol>
      {!setupPhaseComplete(factions, subState) ? 
        <div style={{color: "indianred", fontFamily: "Myriad Pro", fontWeight: "bold"}}>Select all faction choices and reveal 2 objectives</div>
      : null}
      {/* {!factionTechChoicesComplete() ?
        <div style={{color: "darkred"}}>Select all faction tech choices</div> :
        null}
      {!factionSubFactionChoicesComplete() ?
        <div style={{color: "darkred"}}>Select Council Keleres sub-faction</div> :
        null}
      {(subState.objectives ?? []).length < 2 ? <div style={{color: "darkred"}}>Reveal two stage one objectives</div> : null} */}
      <button disabled={!setupPhaseComplete(factions, subState)} style={{fontSize: responsivePixels(40)}} onClick={() => nextPhase()}>Start Game</button>
    </div>
  );
}