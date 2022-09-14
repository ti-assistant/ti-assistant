import { useState } from "react";
import Image from 'next/image';

import { ObjectiveRow } from "/src/ObjectiveRow.js";
import { Tab, TabBody } from "/src/Tab.js";


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

export function ObjectiveList({ faction, objectives, addObjective, removeObjective }) {
  const [tabShown, setTabShown] = useState("stage-one");
  const [editMode, setEditMode] = useState(false);
  const [localObjectives, setLocalObjectives] = useState(objectives);

  function removeObjective(toRemove) {
    setLocalObjectives(localObjectives.map((obj) => {
      if (obj.name === toRemove) {
        return {
          ...obj,
          selected: false,
        };
      }
      return obj;
    }));
  }
  function addObjective(toAdd) {
    setLocalObjectives(localObjectives.map((obj) => {
      if (obj.name === toAdd) {
        return {
          ...obj,
          selected: true,
        };
      }
      return obj;
    }));
  }

  let filteredObjectives = localObjectives.filter((obj) => {
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

  function scoreObjective(toScore, score) {
    setLocalObjectives(localObjectives.map((obj) => {
      if (obj.name === toScore) {
        let scoredBy = (obj.scoredBy ?? []);
        if (score) {
          scoredBy = [...scoredBy, "Naaz-Rokha Alliance", faction, "Embers of Muaat", "Naalu Collective", "Federation of Sol", "Vuil'Raith Cabal", "Nomad", "Empyrean"];
        } else {
          scoredBy = scoredBy.filter((scorer) => {
            return faction !== scorer;
          });
        }
        return {
          ...obj,
          scoredBy: scoredBy.sort(),
        };
      }
      return obj;
    }));
  }

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "white", padding: "4px 4px 0px 4px", borderBottom: "1px solid black"}}>
        <Tab selectTab={setTabShown} id="stage-one" selectedId={tabShown} content={
          "Stage I"
        } />
        <Tab selectTab={setTabShown} id="stage-two" selectedId={tabShown} content={
          "Stage II"
        } />
        <Tab selectTab={setTabShown} id="secret" selectedId={tabShown} content={
          "Secrets"
        } />
        <Tab selectTab={setTabShown} id="other" selectedId={tabShown} content={
          "Other"
        } />
      </div>
      <TabBody id="stage-one" selectedId={tabShown} content={
        <div style={{maxHeight: "450px", overflow: "auto"}}>
          {stageOneObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} faction={faction} objective={obj} scoreObjective={scoreObjective} removeObjective={editMode ? null : () => removeObjective(obj.name)} addObjective={editMode ? () => addObjective(obj.name) : null} />;
          })}
        </div>
      } />
      <TabBody id="stage-two" selectedId={tabShown} content={
        <div style={{maxHeight: "450px", overflow: "auto"}}>
          {stageTwoObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} objective={obj} />;
          })}
        </div>
      } />
      <TabBody id="secret" selectedId={tabShown} content={
        <div style={{maxHeight: "450px", overflow: "auto"}}>
          {secretObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} objective={obj} />;
          })}
        </div>
      } />
      <TabBody id="other" selectedId={tabShown} content={
        <div style={{maxHeight: "450px", overflow: "auto"}}>
          {otherObjectives.map((obj) => {
            return <ObjectiveRow key={obj.name} objective={obj} />;
          })}
        </div>
      } />
      <button onClick={toggleEditMode}>Add Objective</button>
    </div>
  )
}