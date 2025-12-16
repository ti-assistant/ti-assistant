import React from "react";
import { useSelectedAction } from "../../../../../../src/context/actionLogDataHooks";
import {
  useGameId,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFactionSecondary } from "../../../../../../src/context/factionDataHooks";
import { useActiveFactionId } from "../../../../../../src/context/gameDataHooks";
import { markSecondaryAsync } from "../../../../../../src/dynamic/api";
import {
  AdditionalActions,
  FactionActionButtons,
  NextPlayerButtons,
} from "../../../main/@phase/action/ActionPhase";

export default function FactionActionPhase({
  factionId,
}: {
  factionId: FactionId;
}) {
  const activeFactionId = useActiveFactionId();
  const selectedAction = useSelectedAction();

  if (!activeFactionId) {
    return null;
  }

  if (factionId !== activeFactionId) {
    switch (selectedAction) {
      case "Leadership":
      case "Diplomacy":
      case "Politics":
      case "Construction":
      case "Trade":
      case "Warfare":
      case "Technology":
      case "Imperial":
        return (
          <>
            <SecondaryCheck factionId={factionId} />
            <AdditionalActions
              factionId={factionId}
              style={{ width: "100%" }}
              secondaryOnly={true}
            />
          </>
        );
    }
    return null;
  }

  return (
    <>
      <FactionActionButtons factionId={factionId} />
      <div
        className="flexColumn"
        style={{ width: "95%", alignItems: "flex-start" }}
      >
        <AdditionalActions
          factionId={factionId}
          style={{ width: "100%", alignItems: "flex-start" }}
          primaryOnly={true}
        />
      </div>
      {selectedAction ? (
        <div className="flexRow" style={{ width: "100%" }}>
          <NextPlayerButtons activeFactionId={factionId} />
        </div>
      ) : null}
    </>
  );
}

function SecondaryCheck({ factionId }: { factionId: FactionId }) {
  const gameId = useGameId();
  const secondaryState = useFactionSecondary(factionId);
  const viewOnly = useViewOnly();
  return (
    <div className="flexRow">
      {secondaryState === "PENDING" ? (
        <React.Fragment>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, factionId, "DONE");
            }}
            disabled={viewOnly}
          >
            Mark Completed
          </button>
          <button
            onClick={() => {
              markSecondaryAsync(gameId, factionId, "SKIPPED");
            }}
            disabled={viewOnly}
          >
            Skip
          </button>
        </React.Fragment>
      ) : (
        <button
          onClick={() => {
            markSecondaryAsync(gameId, factionId, "PENDING");
          }}
          disabled={viewOnly}
        >
          Not Done Yet
        </button>
      )}
    </div>
  );
}
