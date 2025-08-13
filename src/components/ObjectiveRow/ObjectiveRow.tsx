import { useViewOnly } from "../../context/dataHooks";
import { useSharedModal } from "../../data/SharedModal";
import { SelectableRow } from "../../SelectableRow";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import { ModalContent } from "../Modal/Modal";

interface InfoContentProps {
  objective: Objective;
}

function InfoContent({ objective }: InfoContentProps) {
  return (
    <div
      className="myriadPro"
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
      {objective.description}
    </div>
  );
}

interface ObjectiveRowProps {
  objective: Objective;
  factionId?: FactionId;
  addObjective?: (objectiveId: ObjectiveId) => void;
  removeObjective?: (objectiveId: ObjectiveId) => void;
  scoreObjective?: (objectiveId: ObjectiveId, score: boolean) => void;
  viewing?: boolean;
  hideScorers?: boolean;
}

export default function ObjectiveRow({
  objective,
  factionId,
  addObjective,
  removeObjective,
  scoreObjective,
  viewing,
  hideScorers,
}: ObjectiveRowProps) {
  const viewOnly = useViewOnly();

  const { openModal } = useSharedModal();

  function canScore() {
    if (!scoreObjective || viewing || !factionId) {
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
            <div
              className="popupIcon"
              style={{ paddingRight: rem(8) }}
              onClick={() =>
                openModal(
                  <ModalContent
                    title={
                      <div style={{ fontSize: rem(40) }}>{objective.name}</div>
                    }
                  >
                    <InfoContent objective={objective} />
                  </ModalContent>
                )
              }
            >
              &#x24D8;
            </div>
          </div>
          <div className="flexColumn">
            {canScore() && scoreObjective ? (
              <button
                style={{ fontSize: rem(12) }}
                onClick={() => scoreObjective(objective.id, true)}
                disabled={viewOnly}
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
              if (scorer === factionId && scoreObjective) {
                return (
                  <div
                    key={`${scorer}-${index}`}
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: rem(32),
                      height: rem(32),
                    }}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        width: rem(12),
                        fontSize: rem(8),
                        lineHeight: rem(8),
                        height: rem(12),
                        top: 0,
                        left: rem(20),
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "var(--light-bg)",
                        color: "red",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        justifyContent: "center",
                        borderRadius: rem(12),
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
                    <FactionIcon factionId={scorer} size="100%" />
                  </div>
                );
              }
              return (
                <div
                  key={`${scorer}-${index}`}
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: rem(32),
                    height: rem(32),
                  }}
                >
                  <FactionIcon factionId={scorer} size="100%" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SelectableRow>
  );
}
