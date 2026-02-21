"use client";

import { useCallback, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useActionLog } from "../../context/dataHooks";
import { useUndo } from "../../util/api/undo";
import { rem } from "../../util/util";

export default function UndoButton({ gameId }: { gameId: string }) {
  const actionLog = useActionLog();
  const undo = useUndo();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameId || !actionLog || actionLog.length === 0) {
        return;
      }
      if (event.ctrlKey && event.key === "z") {
        undo(gameId);
      }
    },
    [gameId, actionLog],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!actionLog || actionLog.length === 0) {
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
          undo(gameId);
        }
      }}
      style={{ fontSize: rem(20) }}
      onClick={() => undo(gameId)}
    >
      <FormattedMessage
        id="49oatW"
        description="Text shown on a button that will undo the previous action."
        defaultMessage="Undo"
      />
    </button>
  );
}
