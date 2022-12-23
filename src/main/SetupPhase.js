import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useRef, useState } from "react";
import { FactionCard } from '../FactionCard';
import { fetcher, poster } from '../util/api/util';
import { ObjectiveModal } from '../ObjectiveModal';
import { BasicFactionTile } from '../FactionTile';
import { ObjectiveRow } from '../ObjectiveRow';
import { removeObjective } from '../util/api/objectives';
import { claimPlanet, readyPlanets } from '../util/api/planets';
import { useSharedUpdateTimes } from '../Updater';

export default function SetupPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: options } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const [ showObjectiveModal, setShowObjectiveModal ] = useState(false);
  const [ revealedObjectives, setRevealedObjectives ] = useState([]);
  const { setUpdateTime } = useSharedUpdateTimes();

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

  function factionTechChoicesComplete() {
    let complete = true;
    orderedFactions.forEach(([name, faction]) => {
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

  function factionSubFactionChoicesComplete() {
    if (!factions['Council Keleres']) {
      return true;
    }
    return (factions['Council Keleres'].startswith.planets ?? []).length !== 0;
  }

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    if (factions['Council Keleres']) {
      for (const planet of factions['Council Keleres'].startswith.planets) {
        claimPlanet(mutate, setUpdateTime, gameid, planets, planet, "Council Keleres", options);
      }
      readyPlanets(mutate, setUpdateTime, gameid, planets, factions['Council Keleres'].startswith.planets, "Council Keleres");
    }
    const activeFactionName = state.speaker;
    const phase = "STRATEGY";

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;

    const updateOptions = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data, setUpdateTime), updateOptions);
  }

  function removeObj(objectiveName) {
    setRevealedObjectives(revealedObjectives.filter((objective) => objective.name !== objectiveName));
    removeObjective(mutate, setUpdateTime, gameid, objectives, null, objectiveName);
  }

  const stageOneObjectives = Object.values(objectives ?? {}).filter((objective) => objective.type === "stage-one");
  const selectedStageOneObjectives = stageOneObjectives.filter((objective) => objective.selected);

  function statusPhaseComplete() {
    return factionSubFactionChoicesComplete() &&
      factionTechChoicesComplete() &&
      selectedStageOneObjectives.length > 1;
  }

  return (
    <div className="flexColumn" style={{alignItems: "center", height: "100vh"}}>
      <ObjectiveModal visible={showObjectiveModal} type="stage-one" onComplete={() => setShowObjectiveModal(false)} />
      <ol className='flexColumn' style={{alignItems: "center", margin: "0px", padding: "0px", fontSize: "24px", gap: "8px"}}>
        <li>Build the galaxy</li>
        <li>Shuffle decks</li>
        <li>Gather starting components</li>
        <div className="flexRow" style={{alignItems:"stretch", justifyContent: "space-between", gap: "8px"}}>
          {orderedFactions.map(([name, faction]) => {
            return <FactionCard key={name} faction={faction} opts={{
              displayStartingComponents: true,
              fontSize: "16px",
            }} />
          })}
        </div>
        <li>Draw 2 secret objectives and keep one</li>
        <li>Re-shuffle secret objectives</li>
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Draw 5 stage one objectives and reveal 2
          </div>
        </li>
        {selectedStageOneObjectives.length > 0 ?
          <ObjectiveRow objective={selectedStageOneObjectives[0]} removeObjective={() => removeObj(selectedStageOneObjectives[0].name)} viewing={true} /> :
          <button onClick={() => setShowObjectiveModal(true)}>Reveal Objective</button>}
        {selectedStageOneObjectives.length > 1 ?
          <ObjectiveRow objective={selectedStageOneObjectives[1]} removeObjective={() => removeObj(selectedStageOneObjectives[1].name)} /> :
          <button onClick={() => setShowObjectiveModal(true)}>Reveal Objective</button>}
        <li>
          <div className="flexRow" style={{gap: "8px", whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={factions[state.speaker]} speaker={true} opts={{fontSize: "18px"}} />
            Draw 5 stage two objectives
          </div>
        </li>
      </ol>
      {!factionTechChoicesComplete() ?
        <div style={{color: "darkred"}}>Select all faction tech choices</div> :
        null}
      {!factionSubFactionChoicesComplete() ?
        <div style={{color: "darkred"}}>Select Council Keleres sub-faction</div> :
        null}
      {selectedStageOneObjectives.length < 2 ? <div style={{color: "darkred"}}>Reveal two stage one objectives</div> : null}
      <button disabled={!statusPhaseComplete()} onClick={() => nextPhase()}>Start Game</button>
    </div>
  );
}