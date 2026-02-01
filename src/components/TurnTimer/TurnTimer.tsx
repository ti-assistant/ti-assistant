import { useContext } from "react";
import { SettingsContext } from "../../context/contexts";
import { useActionLog } from "../../context/dataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { getFinalActionOfPreviousTurn } from "../../util/api/actionLog";
import { rem } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";
import { FormattedMessage } from "react-intl";

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
  let label = (
    <FormattedMessage
      id="Hp1kqe"
      defaultMessage="Turn"
      description="A single player's turn."
    />
  );
  switch (state.phase) {
    case "AGENDA":
    case "STATUS":
      label = (
        <FormattedMessage
          id="rmSsKq"
          defaultMessage="Phase"
          description="A section of the game (e.g. Strategy Phase)."
        />
      );
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
          time={Math.max(gameTime - prevTurnStartTime, 0)}
          label={label}
          width={120}
          style={{ fontSize: rem(20) }}
        />
      </div>
    </div>
  );
}
