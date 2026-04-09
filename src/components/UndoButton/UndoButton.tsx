"use client";

import { useCallback, useEffect } from "react";
import { useActionLog } from "../../context/dataHooks";
import UndoSVG from "../../icons/ui/Undo";
import { useUndo } from "../../util/api/undo";
import { rem } from "../../util/util";
import { usePathname } from "next/navigation";

export default function UndoButton({ gameId }: { gameId: string }) {
  const actionLog = useActionLog();
  const pathname = usePathname();
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

  if (!pathname.includes("/game/")) {
    return null;
  }

  const latestEntry = actionLog.at(actionLog.length - 1);
  if (!latestEntry) {
    return null;
  }

  return (
    <button
      className="iconButton"
      onKeyDown={(event) => {
        if (event.ctrlKey && event.key === "z") {
          undo(gameId);
        }
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        fontSize: "1rem",
      }}
      onClick={() => undo(gameId)}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        <UndoSVG />
      </div>
      {/* <FormattedMessage
        id="49oatW"
        description="Text shown on a button that will undo the previous action."
        defaultMessage="Undo"
      /> */}
    </button>
  );
}
