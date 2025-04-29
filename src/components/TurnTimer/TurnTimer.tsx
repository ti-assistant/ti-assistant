import { useContext } from "react";
import { SettingsContext } from "../../context/contexts";
import { useActionLog } from "../../context/dataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { getFinalActionOfPreviousTurn } from "../../util/api/actionLog";
import { rem } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";

export default function TurnTimer({ gameTime }: { gameTime: number }) {
  const actionLog = useActionLog();
  const state = useGameState();
  const finalAction = getFinalActionOfPreviousTurn(actionLog);

  const { settings } = useContext(SettingsContext);

  if (!settings["show-turn-timer"]) {
    return null;
  }

  if (!finalAction) {
    return null;
  }

  const prevTurnStartTime = finalAction.gameSeconds ?? 0;

  let label = "Turn";
  switch (state.phase) {
    case "AGENDA":
    case "STATUS":
      label = "Phase";
      break;
  }

  return (
    <div style={{ width: "100%", whiteSpace: "nowrap" }}>
      <div
        className="flexColumn"
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: rem(4),
        }}
      >
        <TimerDisplay
          time={gameTime - prevTurnStartTime}
          label={label}
          width={120}
          style={{ fontSize: rem(20) }}
        />
      </div>
    </div>
  );
}
