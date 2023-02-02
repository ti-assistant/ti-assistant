import { useRef, useState } from "react";
import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'

import { fetcher, poster } from './util/api/util'
import { ObjectiveRow } from "/src/ObjectiveRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { revealObjective, removeObjective, scoreObjective, unscoreObjective } from "./util/api/objectives";
import { useSharedUpdateTimes } from "./Updater";
import { LabeledLine } from "./LabeledDiv";


function sortObjectives(objectives, field, descending = false) {
  objectives.sort((a, b) => {
    if (a[field] > b[field]) {
      return descending ? -1 : 1;
    }
    if (a[field] < b[field]) {
      return descending ? 1 : -1;
    }
    return 0;
  });
}

function SecretTab() {
  const router = useRouter();
  const { game: gameid, faction: factionName } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const [editMode, setEditMode] = useState(false);
  


  const secretObjectives = Object.values(objectives).filter((obj) => {
    return obj.type === "secret";
  });
  sortObjectives(secretObjectives, "name");

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function addObj(objective) {
    revealObjective(mutate, gameid, factionName, objective);
    setEditMode(false);
  }
  function removeObj(objective) {
    removeObjective(mutate, gameid, factionName, objective);
  }
  function scoreObj(objective, add) {
    if (add) {
      scoreObjective(mutate, gameid, factionName, objective);
    } else {
      unscoreObjective(mutate, gameid, factionName, objective);
    }
  }

  const factionSecrets = new Set();
  for (const objective of secretObjectives) {
    if (!editMode) {
      if ((objective.factions ?? []).includes(factionName) ||
          (objective.scorers ?? []).includes(factionName)) {
        factionSecrets.add(objective);
      }
    } else {
      if (!(objective.factions ?? []).includes(factionName) &&
          !(objective.scorers ?? []).includes(factionName)) {
        factionSecrets.add(objective);
      }
    }
  }

  const maxHeight = screen.height - 450;

  function editModeButton(objs) {
    if (editMode) {
      return (<button onClick={toggleEditMode}>Done</button>);
    }
    // It's possible for 5 secret objectives to be scored by a player.
    // 3 normally, 1 from Obsidian, and 1 from Classified Document Leaks.
    if (objs.size <= 4) {
      return (<div className="flexColumn" style={{gap: "4px"}}>
        <button onClick={toggleEditMode}>Pick Objective</button>
        <div style={{fontSize: "16px", textAlign: "center"}}>Secret Objectives will only be revealed to other players when scored</div>
      </div>);
    } else {
      return (<div className="flexColumn" style={{gap: "4px"}}>
      <div style={{fontSize: "16px", textAlign: "center"}}>Secret Objectives will only be revealed to other players when scored</div>
    </div>);
    }
    return null;
  }

  return <div>
    <div>
      <LabeledLine />
      {factionSecrets.size !== 0 ?
        <div className="flexColumn largeFont" style={{maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
          {Array.from(factionSecrets).map((obj) => {
            return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
          })}
        </div> : null}
        <div className="flexRow" style={{padding:"4px"}}>{editModeButton(factionSecrets)}</div>
    </div>
  </div>;
}

// TODO: Rename to Objective Tab
export function ObjectiveList() {
  const router = useRouter();
  const { game: gameid, faction: factionName } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const [tabShown, setTabShown] = useState("stage-one");
  const [editMode, setEditMode] = useState(false);
  


  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }
  if (!objectives) {
    return (<div>Loading...</div>);
  }

  function addObj(objective) {
    revealObjective(mutate, gameid, factionName, objective);
    setEditMode(false);
  }
  function removeObj(objective) {
    removeObjective(mutate, gameid, factionName, objective);
  }
  function scoreObj(objective, add) {
    if (add) {
      scoreObjective(mutate, gameid, factionName, objective);
    } else {
      unscoreObjective(mutate, gameid, factionName, objective);
    }
  }

  let filteredObjectives = Object.values(objectives).filter((obj) => {
    return (editMode && !obj.selected) || (!editMode && obj.selected);
  })

  const stageOneObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-one";
  });
  sortObjectives(stageOneObjectives, "name");
  
  const stageTwoObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-two";
  });
  sortObjectives(stageTwoObjectives, "name");

  const secretObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "secret";
  });
  sortObjectives(secretObjectives, "name");

  const otherObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "other";
  });
  sortObjectives(otherObjectives, "name");

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function editModeButton(stage) {
    if (editMode) {
      return (<button onClick={toggleEditMode}>Done</button>);
    }
    switch (stage) {
      case "stage-one":
        if (stageOneObjectives.length < 5) {
          return (<button onClick={toggleEditMode}>Reveal Objective</button>);
        } else if (stageOneObjectives.length === 5 && stageTwoObjectives.length !== 6) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Incentive Program [For])</button>);
        }
        return null;
      case "stage-two":
        if (stageTwoObjectives.length < 5) {
          return (<button onClick={toggleEditMode}>Reveal Objective</button>);
        } else if (stageTwoObjectives.length === 5 && stageOneObjectives.length !== 6) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Incentive Program [Against])</button>);
        }
        return null;
      case "secret":
        if (secretObjectives.length < 3) {
          return (<div className="flexColumn" style={{gap: "4px"}}>
            <button onClick={toggleEditMode}>Reveal Objective</button>
            <div>This will not reveal to other players</div>
          </div>);
        } else if (secretObjectives.length === 3) {
          return (<button onClick={toggleEditMode}>Reveal Objective (Classified Document Leaks [For])</button>);
        }
        return null;
      case "other":
        return (<button onClick={toggleEditMode}>Select Objective</button>);
    }
    return null;
  }

  function changeTab(tabName) {
    if (tabShown === tabName) {
      setEditMode(false);
      setTabShown(null);
    } else {
      setEditMode(false);
      setTabShown(tabName);
    }
  }

  const maxHeight = screen.height - 420;

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "#222", padding: "4px 4px 0px 4px"}}>
        <Tab selectTab={changeTab} id="stage-one" selectedId={tabShown} content={
          "Stage I"
        } />
        <Tab selectTab={changeTab} id="stage-two" selectedId={tabShown} content={
          "Stage II"
        } />
        <Tab selectTab={changeTab} id="secret" selectedId={tabShown} content={
          "Secrets"
        } />
        <Tab selectTab={changeTab} id="other" selectedId={tabShown} content={
          "Other"
        } />
      </div>
      <TabBody id="stage-one" selectedId={tabShown} content={
        <div className="largeFont">
          <LabeledLine />
          {stageOneObjectives.length !== 0 ? <div className="flexColumn" style={{maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
            {stageOneObjectives.map((obj) => {
              return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
            })}
          </div> : null}
          {editModeButton("stage-one") ? <div className="flexRow" style={{padding: "8px 0px"}}>
            {editModeButton("stage-one")}
          </div> : null }
        </div>
      } />
      <TabBody id="stage-two" selectedId={tabShown} content={
        <div className="largeFont">
          <LabeledLine />
          {stageTwoObjectives.length !== 0 ? <div className="flexColumn" style={{maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
            {stageTwoObjectives.map((obj) => {
              return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
            })}
          </div> : null}
          {editModeButton("stage-two") ? <div className="flexRow" style={{padding: "8px 0px"}}>
          {editModeButton("stage-two")}
          </div> : null}
        </div>
      } />
      <TabBody id="secret" selectedId={tabShown} content={
        <SecretTab />
      } />
      <TabBody id="other" selectedId={tabShown} content={
        <div className="largeFont">
        <LabeledLine />
          {otherObjectives.length !== 0 ? <div className="flexColumn" style={{maxHeight: `${maxHeight}px`, overflow: "auto", display: "flex", padding: "4px 0px", justifyContent: "stretch", alignItems: "stretch"}}>
          {otherObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} faction={factionName} objective={obj} scoreObjective={scoreObj} removeObjective={editMode ? null : () => removeObj(obj.name)} addObjective={editMode ? () => addObj(obj.name) : null} />;
          })}
          </div> : null}
          {editModeButton("other") ? <div className="flexRow" style={{padding: "8px 0px"}}>
            {editModeButton("other")}
          </div> : null}
        </div>
      } />
    </div>
  )
}