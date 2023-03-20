import { useState } from "react";

import { Modal } from "./Modal";
import { FullFactionSymbol } from "./FactionCard";
import { responsivePixels } from "./util/util";
import { SelectableRow } from "./SelectableRow";
import { Objective } from "./util/api/objectives";

interface InfoContentProps {
  objective: Objective;
}

function InfoContent({ objective }: InfoContentProps) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        maxWidth: responsivePixels(800),
        width: "100%",
        minWidth: responsivePixels(320),
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {objective.description}
    </div>
  );
}

export interface ObjectiveRowProps {
  objective: Objective;
  factionName?: string;
  addObjective?: (objectiveName: string) => void;
  removeObjective?: (objectiveName: string) => void;
  scoreObjective?: (objectiveName: string, score: boolean) => void;
  viewing?: boolean;
  hideScorers?: boolean;
}

export function ObjectiveRow({
  objective,
  factionName,
  addObjective,
  removeObjective,
  scoreObjective,
  viewing,
  hideScorers,
}: ObjectiveRowProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  if (!objective) {
    return null;
  }

  function displayInfo() {
    setShowInfoModal(true);
  }

  function canScore() {
    if (!scoreObjective || viewing || !factionName) {
      return false;
    }
    if (objective.max && (objective.scorers ?? []).length >= objective.max) {
      return false;
    }
    if (objective.type === "SECRET" && (objective.scorers ?? []).length > 0) {
      return false;
    }
    return (
      !(objective.scorers ?? []).includes(factionName) || objective.repeatable
    );
  }

  return (
    <SelectableRow
      itemName={objective.name}
      selectItem={addObjective}
      removeItem={removeObjective}
    >
      {/* <div className="objectiveRow"> */}
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={
          <div style={{ fontSize: responsivePixels(40) }}>{objective.name}</div>
        }
        level={2}
      >
        <InfoContent objective={objective} />
      </Modal>
      <div className="flexColumn" style={{ width: "100%", gap: 0 }}>
        <div
          className="flexRow hoverParent"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexBasis: "50%",
              flexGrow: 2,
            }}
          >
            <div
              style={{ whiteSpace: "normal", display: "flex", flex: "2 0 50%" }}
            >
              {objective.name}
            </div>
            <div
              className="popupIcon"
              style={{ paddingRight: responsivePixels(8) }}
              onClick={displayInfo}
            >
              &#x24D8;
            </div>
          </div>
          <div className="flexColumn">
            {canScore() && scoreObjective ? (
              <button
                style={{ fontSize: responsivePixels(12) }}
                onClick={() => scoreObjective(objective.name, true)}
              >
                Score
              </button>
            ) : null}
          </div>
        </div>
        {hideScorers ? null : (
          <div
            className="flexRow"
            style={{
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            {(objective.scorers ?? []).map((scorer, index) => {
              if (scorer === factionName && scoreObjective) {
                return (
                  <div
                    key={`${scorer}-${index}`}
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: responsivePixels(32),
                      height: responsivePixels(32),
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        width: responsivePixels(12),
                        fontSize: responsivePixels(8),
                        lineHeight: responsivePixels(8),
                        height: responsivePixels(12),
                        top: 0,
                        left: responsivePixels(20),
                        position: "absolute",
                        zIndex: 40,
                        backgroundColor: "#222",
                        color: "red",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        justifyContent: "center",
                        borderRadius: responsivePixels(12),
                        boxShadow: `${responsivePixels(1)} ${responsivePixels(
                          1
                        )} ${responsivePixels(4)} black`,
                      }}
                      onClick={() => scoreObjective(objective.name, false)}
                    >
                      &#x2715;
                    </div>
                    <FullFactionSymbol faction={scorer} />
                    {/* <FactionSymbol faction={scorer} size={42} /> */}
                  </div>
                );
              }
              return (
                <div
                  key={`${scorer}-${index}`}
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: responsivePixels(32),
                    height: responsivePixels(32),
                  }}
                >
                  <FullFactionSymbol faction={scorer} />
                  {/* <FactionSymbol faction={scorer} size={42} /> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SelectableRow>
  );
}
