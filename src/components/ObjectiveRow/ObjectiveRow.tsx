import { useViewOnly } from "../../context/dataHooks";
import { useObjective } from "../../context/objectiveDataHooks";
import InfoModal from "../../InfoModal";
import { SelectableRow } from "../../SelectableRow";
import { em, rem } from "../../util/util";
import FactionComponents from "../FactionComponents/FactionComponents";
import FormattedDescription from "../FormattedDescription/FormattedDescription";

interface InfoContentProps {
  objective: Objective;
}

function InfoContent({ objective }: InfoContentProps) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        maxWidth: rem(800),
        width: "100%",
        minWidth: rem(320),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <FormattedDescription description={objective.description} />
    </div>
  );
}

interface ObjectiveRowProps {
  objectiveId: ObjectiveId;
  factionId?: FactionId;
  addObjective?: (objectiveId: ObjectiveId) => void;
  removeObjective?: (objectiveId: ObjectiveId) => void;
  scoreObjective?: (objectiveId: ObjectiveId, score: boolean) => void;
}

export default function ObjectiveRow({
  objectiveId,
  factionId,
  addObjective,
  removeObjective,
  scoreObjective,
}: ObjectiveRowProps) {
  const objective = useObjective(objectiveId);
  const viewOnly = useViewOnly();

  if (!objective) {
    return null;
  }

  function canScore(objective: Objective) {
    if (!scoreObjective || !factionId) {
      return false;
    }
    if (objective.max && (objective.scorers ?? []).length >= objective.max) {
      return false;
    }
    if (objective.type === "SECRET" && (objective.scorers ?? []).length > 0) {
      return false;
    }
    return (
      !(objective.scorers ?? []).includes(factionId) || objective.repeatable
    );
  }

  return (
    <SelectableRow
      itemId={objective.id}
      selectItem={addObjective}
      removeItem={removeObjective}
      viewOnly={viewOnly}
    >
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
            <div style={{ display: "flex", flex: "2 0 50%" }}>
              {objective.name}
            </div>
            <InfoModal title={objective.name} style={{ marginLeft: em(8) }}>
              <InfoContent objective={objective} />
            </InfoModal>
          </div>
          {canScore(objective) && scoreObjective ? (
            <button
              style={{ fontSize: em(12) }}
              onClick={() => scoreObjective(objective.id, true)}
              disabled={viewOnly}
            >
              Score
            </button>
          ) : null}
        </div>
        {!scoreObjective ? null : (
          <div
            className="flexRow"
            style={{
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "flex-start",
            }}
          >
            {(objective.scorers ?? []).map((scorer, index) => {
              if (scorer === factionId && scoreObjective) {
                return (
                  <div
                    key={`${scorer}-${index}`}
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: em(32),
                      height: em(32),
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        width: em(12),
                        fontSize: em(8),
                        lineHeight: em(8),
                        height: em(12),
                        top: 0,
                        left: em(20),
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "var(--light-bg)",
                        color: "red",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        justifyContent: "center",
                        borderRadius: em(12),
                        boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                      }}
                      onClick={
                        viewOnly
                          ? undefined
                          : () => scoreObjective(objective.id, false)
                      }
                    >
                      &#x2715;
                    </div>
                    <FactionComponents.Icon factionId={scorer} size="100%" />
                  </div>
                );
              }
              return (
                <div
                  key={`${scorer}-${index}`}
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: em(32),
                    height: em(32),
                  }}
                >
                  <FactionComponents.Icon factionId={scorer} size="100%" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SelectableRow>
  );
}
