import { useContext, useState } from "react";
import { Tab, TabBody } from "./Tab";
import LabeledLine from "./components/LabeledLine/LabeledLine";
import { GameIdContext, ObjectiveContext } from "./context/Context";
import {
  hideObjectiveAsync,
  revealObjectiveAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "./dynamic/api";
import ObjectiveRow from "./components/ObjectiveRow/ObjectiveRow";
import { objectiveTypeString } from "./util/strings";
import { FormattedMessage, useIntl } from "react-intl";

function sortObjectivesByName(objectives: Objective[]) {
  objectives.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
}

function SecretTab({ factionId }: { factionId: FactionId }) {
  const gameId = useContext(GameIdContext);
  const objectives = useContext(ObjectiveContext);

  const [editMode, setEditMode] = useState(false);

  const secretObjectives = Object.values(objectives ?? {}).filter((obj) => {
    return obj.type === "SECRET";
  });
  sortObjectivesByName(secretObjectives);

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function addObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    revealObjectiveAsync(gameId, objectiveId);
    setEditMode(false);
  }
  function removeObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    hideObjectiveAsync(gameId, objectiveId);
  }
  function scoreObj(objectiveId: ObjectiveId, add: boolean) {
    if (!gameId || !factionId) {
      return;
    }
    if (add) {
      scoreObjectiveAsync(gameId, factionId, objectiveId);
    } else {
      unscoreObjectiveAsync(gameId, factionId, objectiveId);
    }
  }

  const factionSecrets = new Set<Objective>();
  for (const objective of secretObjectives) {
    if (!editMode) {
      if (
        (objective.factions ?? []).includes(factionId) ||
        (objective.scorers ?? []).includes(factionId)
      ) {
        factionSecrets.add(objective);
      }
    } else {
      if (
        !(objective.factions ?? []).includes(factionId) &&
        !(objective.scorers ?? []).includes(factionId)
      ) {
        factionSecrets.add(objective);
      }
    }
  }

  const maxHeight = "calc(100dvh - 450px)";

  function editModeButton(objs: Set<Objective>) {
    if (editMode) {
      return <button onClick={toggleEditMode}>Done</button>;
    }
    // It's possible for 5 secret objectives to be scored by a player.
    // 3 normally, 1 from Obsidian, and 1 from Classified Document Leaks.
    if (objs.size <= 4) {
      return (
        <div className="flexColumn" style={{ gap: "4px" }}>
          <button onClick={toggleEditMode}>
            <FormattedMessage
              id="6L07nG"
              description="Text telling the user to reveal an objective."
              defaultMessage="Reveal Objective"
            />
          </button>
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
              maxHeight: maxHeight,
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
                  key={obj.id}
                  factionId={factionId}
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
export function ObjectiveList({ factionId }: { factionId: FactionId }) {
  const gameId = useContext(GameIdContext);
  const objectives = useContext(ObjectiveContext);

  const intl = useIntl();

  const [tabShown, setTabShown] = useState("STAGE ONE");
  const [editMode, setEditMode] = useState(false);

  function addObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    revealObjectiveAsync(gameId, objectiveId);
    setEditMode(false);
  }
  function removeObj(objectiveId: ObjectiveId) {
    if (!gameId || !factionId) {
      return;
    }
    hideObjectiveAsync(gameId, objectiveId);
  }
  function scoreObj(objectiveId: ObjectiveId, add: boolean) {
    if (!gameId || !factionId) {
      return;
    }
    if (add) {
      scoreObjectiveAsync(gameId, factionId, objectiveId);
    } else {
      unscoreObjectiveAsync(gameId, factionId, objectiveId);
    }
  }

  let filteredObjectives = Object.values(objectives ?? {}).filter((obj) => {
    return (editMode && !obj.selected) || (!editMode && obj.selected);
  });

  sortObjectivesByName(filteredObjectives);

  const stageOneObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "STAGE ONE";
  });

  const stageTwoObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "STAGE TWO";
  });

  const secretObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "SECRET";
  });

  const otherObjectives = filteredObjectives.filter((obj) => {
    return obj.type === "OTHER";
  });

  function toggleEditMode() {
    setEditMode(!editMode);
  }

  function editModeButton(stage: ObjectiveType) {
    if (editMode) {
      return <button onClick={toggleEditMode}>Done</button>;
    }
    switch (stage) {
      case "STAGE ONE":
        let maxStageOne = 6;
        for (const objective of stageOneObjectives) {
          if (objective.phase) {
            maxStageOne = 7;
          }
        }
        if (stageOneObjectives.length < maxStageOne) {
          return (
            <button onClick={toggleEditMode}>
              <FormattedMessage
                id="6L07nG"
                description="Text telling the user to reveal an objective."
                defaultMessage="Reveal Objective"
              />
            </button>
          );
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
      case "STAGE TWO":
        if (stageTwoObjectives.length < 5) {
          return (
            <button onClick={toggleEditMode}>
              <FormattedMessage
                id="6L07nG"
                description="Text telling the user to reveal an objective."
                defaultMessage="Reveal Objective"
              />
            </button>
          );
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
      case "SECRET":
        if (secretObjectives.length < 3) {
          return (
            <div className="flexColumn" style={{ gap: "4px" }}>
              <button onClick={toggleEditMode}>
                <FormattedMessage
                  id="6L07nG"
                  description="Text telling the user to reveal an objective."
                  defaultMessage="Reveal Objective"
                />
              </button>
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
      case "OTHER":
        return (
          <button onClick={toggleEditMode}>
            <FormattedMessage
              id="6L07nG"
              description="Text telling the user to reveal an objective."
              defaultMessage="Reveal Objective"
            />
          </button>
        );
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

  const maxHeight = "calc(100dvh - 420px)";

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
        <Tab selectTab={changeTab} id="STAGE ONE" selectedId={tabShown}>
          {objectiveTypeString("STAGE ONE", intl)}
        </Tab>
        <Tab selectTab={changeTab} id="STAGE TWO" selectedId={tabShown}>
          {objectiveTypeString("STAGE TWO", intl)}
        </Tab>
        <Tab selectTab={changeTab} id="secret" selectedId={tabShown}>
          {objectiveTypeString("SECRET", intl)}
        </Tab>
        <Tab selectTab={changeTab} id="other" selectedId={tabShown}>
          {objectiveTypeString("OTHER", intl)}
        </Tab>
      </div>
      <TabBody id="STAGE ONE" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {stageOneObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: maxHeight,
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
                    key={obj.id}
                    factionId={factionId}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode || (obj.scorers ?? []).length > 0
                        ? undefined
                        : () => removeObj(obj.id)
                    }
                    addObjective={editMode ? () => addObj(obj.id) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("STAGE ONE") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("STAGE ONE")}
            </div>
          ) : null}
        </div>
      </TabBody>
      <TabBody id="STAGE TWO" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {stageTwoObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: maxHeight,
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
                    key={obj.id}
                    factionId={factionId}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode ? undefined : () => removeObj(obj.id)
                    }
                    addObjective={editMode ? () => addObj(obj.id) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("STAGE TWO") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("STAGE TWO")}
            </div>
          ) : null}
        </div>
      </TabBody>
      <TabBody id="secret" selectedId={tabShown}>
        <SecretTab factionId={factionId} />
      </TabBody>
      <TabBody id="other" selectedId={tabShown}>
        <div className="largeFont">
          <LabeledLine />
          {otherObjectives.length !== 0 ? (
            <div
              className="flexColumn"
              style={{
                maxHeight: maxHeight,
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
                    key={obj.id}
                    factionId={factionId}
                    objective={obj}
                    scoreObjective={scoreObj}
                    removeObjective={
                      editMode ? undefined : () => removeObj(obj.id)
                    }
                    addObjective={editMode ? () => addObj(obj.id) : undefined}
                  />
                );
              })}
            </div>
          ) : null}
          {editModeButton("OTHER") ? (
            <div className="flexRow" style={{ padding: "8px 0px" }}>
              {editModeButton("OTHER")}
            </div>
          ) : null}
        </div>
      </TabBody>
    </div>
  );
}
