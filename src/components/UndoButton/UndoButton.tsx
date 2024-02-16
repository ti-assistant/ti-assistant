"use client";

import { useCallback, useContext, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { ActionLogContext } from "../../context/Context";
import { undoAsync } from "../../dynamic/api";

export default function UndoButton({ gameId }: { gameId?: string }) {
  const actionLog = useContext(ActionLogContext);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameId || !actionLog || actionLog.length === 0) {
        return;
      }
      if (event.ctrlKey && event.key === "z") {
        undoAsync(gameId);
      }
    },
    [gameId, actionLog]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!gameId || !actionLog || actionLog.length === 0) {
    return null;
  }

  const latestEntry = actionLog.at(actionLog.length - 1);
  if (!latestEntry) {
    return null;
  }

  return (
    <button
      onKeyDown={(event) => {
        if (event.ctrlKey && event.key === "z") {
          undoAsync(gameId);
        }
      }}
      style={{ fontSize: "20px" }}
      onClick={() => undoAsync(gameId)}
    >
      <FormattedMessage
        id="49oatW"
        description="Text shown on a button that will undo the previous action."
        defaultMessage="Undo"
      />
    </button>
  );
}
