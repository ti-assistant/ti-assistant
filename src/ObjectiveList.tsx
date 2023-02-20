import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import { fetcher } from "./util/api/util";
import { ObjectiveRow } from "./ObjectiveRow";
import { Tab, TabBody } from "./Tab";
import {
  revealObjective,
  removeObjective,
  scoreObjective,
  unscoreObjective,
  Objective,
  ObjectiveType,
} from "./util/api/objectives";
import { LabeledLine } from "./LabeledDiv";

function sortObjectivesByName(objectives: Objective[]) {
  objectives.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
}

function SecretTab({ factionName }: { factionName: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string; faction?: string } = router.query;
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const [editMode, setEditMode] = useState(false);

  const secretObjectives = Object.values(objectives ?? {}).filter((obj) => {
    return obj.type === "secret";
  });
  sortObjectivesByName(secretObjectives);

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function addObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    revealObjective(gameid, factionName, objectiveName);
    setEditMode(false);
  }
  function removeObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    removeObjective(gameid, factionName, objectiveName);
  }
  function scoreObj(objectiveName: string, add: boolean) {
    if (!gameid || !factionName) {
      return;
    }
    if (add) {
      scoreObjective(gameid, factionName, objectiveName);
    } else {
      unscoreObjective(gameid, factionName, objectiveName);
    }
  }

  const factionSecrets = new Set<Objective>();
  for (const objective of secretObjectives) {
    if (!editMode) {
      if (
        (objective.factions ?? []).includes(factionName) ||
        (objective.scorers ?? []).includes(factionName)
      ) {
        factionSecrets.add(objective);
      }
    } else {
      if (
        !(objective.factions ?? []).includes(factionName) &&
        !(objective.scorers ?? []).includes(factionName)
      ) {
        factionSecrets.add(objective);
      }
    }
  }

  const maxHeight = screen.height - 450;

  function editModeButton(objs: Set<Objective>) {
    if (editMode) {
      return <button onClick={toggleEditMode}>Done</button>;
    }
    // It's possible for 5 secret objectives to be scored by a player.
    // 3 normally, 1 from Obsidian, and 1 from Classified Document Leaks.
    if (objs.size <= 4) {
      return (
        <div className="flexColumn" style={{ gap: "4px" }}>
          <button onClick={toggleEditMode}>Pick Objective</button>
          <div style={{ fontSize: "16px", textAlign: "center" }}>
            Secret Objectives will only be revealed to other players when scored
          </div>
        </div>
      );
    } else {
      return (
        <div className="flexColumn" style={{ gap: "4px" }}>
          <div style={{ fontSize: "16px", textAlign: "center" }}>
            Secret Objectives will only be revealed to other players when scored
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      <div>
        <LabeledLine />
        {factionSecrets.size !== 0 ? (
          <div
            className="flexColumn largeFont"
            style={{
              maxHeight: `${maxHeight}px`,
              overflow: "auto",
              display: "flex",
              padding: "4px 0px",
              justifyContent: "stretch",
              alignItems: "stretch",
            }}
          >
            {Array.from(factionSecrets).map((obj) => {
              return (
                <ObjectiveRow
                  key={obj.name}
                  factionName={factionName}
                  objective={obj}
                  scoreObjective={scoreObj}
                  removeObjective={editMode ? undefined : removeObj}
                  addObjective={editMode ? addObj : undefined}
                />
              );
            })}
          </div>
        ) : null}
        <div className="flexRow" style={{ padding: "4px" }}>
          {editModeButton(factionSecrets)}
        </div>
      </div>
    </div>
  );
}

// TODO: Rename to Objective Tab
export function ObjectiveList() {
  const router = useRouter();
  const {
    game: gameid,
    faction: factionName,
  }: { game?: string; faction?: string } = router.query;
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const [tabShown, setTabShown] = useState("stage-one");
  const [editMode, setEditMode] = useState(false);

  if (!gameid || !factionName) {
    return <div>Loading...</div>;
  }

  function addObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    revealObjective(gameid, factionName, objectiveName);
    setEditMode(false);
  }
  function removeObj(objectiveName: string) {
    if (!gameid || !factionName) {
      return;
    }
    removeObjective(gameid, factionName, objectiveName);
  }
  function scoreObj(objectiveName: string, add: boolean) {
    if (!gameid || !factionName) {
      return;
    }
    if (add) {
      scoreObjective(gameid, factionName, objectiveName);
    } else {
      unscoreObjective(gameid, factionName, objectiveName);
    }
  }

  let filteredObjectives = Object.values(objectives ?? {}).filter((obj) => {
    return (editMode && !obj.selected) || (!editMode && obj.selected);
  });

  sortObjectivesByName(filteredObjectives);

  const stageOneObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-one";
  });

  const stageTwoObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "stage-two";
  });

  const secretObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "secret";
  });

  const otherObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "other";
  });

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function editModeButton(stage: ObjectiveType) {
    if (editMode) {
      return <button onClick={toggleEditMode}>Done</button>;
    }
    switch (stage) {
      case "stage-one":
        if (stageOneObjectives.length < 5) {
          return <button onClick={toggleEditMode}>Reveal Objective</button>;
        } else if (
          stageOneObjectives.length === 5 &&
          stageTwoObjectives.length !== 6
        ) {
          return (
            <button onClick={toggleEditMode}>
              Reveal Objective (Incentive Program [For])
            </button>
          );
        }
        return null;
      case "stage-two":
        if (stageTwoObjectives.length < 5) {
          return <button onClick={toggleEditMode}>Reveal Objective</button>;
        } else if (
          stageTwoObjectives.length === 5 &&
          stageOneObjectives.length !== 6
        ) {
          return (
            <button onClick={toggleEditMode}>
              Reveal Objective (Incentive Program [Against])
            </button>
          );
        }
        return null;
      case "secret":
        if (secretObjectives.length < 3) {
          return (
            <div className="flexColumn" style={{ gap: "4px" }}>
              <button onClick={toggleEditMode}>Reveal Objective</button>
              <div>This will not reveal to other players</div>
            </div>
          );
        } else if (secretObjectives.length === 3) {
          return (
            <button onClick={toggleEditMode}>
              Reveal Objective (Classified Document Leaks [For])
            </button>
          );
        }
        return null;
      case "other":
        return <button onClick={toggleEditMode}>Select Objective</button>;
    }
  }

  function changeTab(tabName: string) {
    if (tabShown === tabName) {
      setEditMode(false);
      setTabShown("");
    } else {
      setEditMode(false);
      setTabShown(tabName);
    }
  }

  const maxHeight = screen.height - 420;

  return (
    <div>
      <div
        className="flexRow"
        style={{
          position: "sticky",
          top: "41px",
          backgroundColor: "#222",
          padding: "4px 4px 0px 4px",
        }}
      >
        <Tab selectTab={changeTab} id="stage-one" selectedId={tabShown}>
          Stage I
        </Tab>
        <Tab selectTab={changeTab} id="stage-two" selectedId={tabShown}>
          Stage II
        </Tab>
        <Tab selectTab={changeTab} id="secret" selectedId={tabShown}>
          Secrets
        </Tab>
        <Tab selectTab={changeTab} id="other" selectedId={tabShown}>
          Other
        </Tab>
      </div>
      <TabBody id="stage-one" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {stageOneObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: `${maxHeight}px`,
                overflow: "auto",
                display: "flex",
                padding: "4px 0px",
                justifyContent: "stretch",
                alignItems: "stretch",
              }}
            >
              {stageOneObjectives.map((obj) => {
                return (
                  <ObjectiveRow
                    key={obj.name}
                    factionName={factionName}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode ? undefined : () => removeObj(obj.name)
                    }
                    addObjective={editMode ? () => addObj(obj.name) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("stage-one") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("stage-one")}
            </div>
          ) : null}
        </div>
      </TabBody>
      <TabBody id="stage-two" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {stageTwoObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: `${maxHeight}px`,
                overflow: "auto",
                display: "flex",
                padding: "4px 0px",
                justifyContent: "stretch",
                alignItems: "stretch",
              }}
            >
              {stageTwoObjectives.map((obj) => {
                return (
                  <ObjectiveRow
                    key={obj.name}
                    factionName={factionName}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode ? undefined : () => removeObj(obj.name)
                    }
                    addObjective={editMode ? () => addObj(obj.name) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("stage-two") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("stage-two")}
            </div>
          ) : null}
        </div>
      </TabBody>
      <TabBody id="secret" selectedId={tabShown}>
        <SecretTab factionName={factionName} />
      </TabBody>
      <TabBody id="other" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {otherObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: `${maxHeight}px`,
                overflow: "auto",
                display: "flex",
                padding: "4px 0px",
                justifyContent: "stretch",
                alignItems: "stretch",
              }}
            >
              {otherObjectives.map((obj) => {
                return (
                  <ObjectiveRow
                    key={obj.name}
                    factionName={factionName}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode ? undefined : () => removeObj(obj.name)
                    }
                    addObjective={editMode ? () => addObj(obj.name) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("other") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("other")}
            </div>
          ) : null}
        </div>
      </TabBody>
    </div>
  );
}
