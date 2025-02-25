import { useEffect, useState } from "react";
import { useActionLog, useGameState, useTimers } from "../../context/dataHooks";
import { getNthMostRecentAction } from "../../util/api/actionLog";
import { rem } from "../../util/util";
import TimerDisplay from "../TimerDisplay/TimerDisplay";

export default function AgendaTimer({ agendaNum }: { agendaNum: number }) {
  const actionLog = useActionLog();
  const timers = useTimers();

  const phaseStart = getNthMostRecentAction(actionLog, "ADVANCE_PHASE", 1);
  const firstResolution = getNthMostRecentAction(
    actionLog,
    "RESOLVE_AGENDA",
    2
  );
  const secondResolution = getNthMostRecentAction(
    actionLog,
    "RESOLVE_AGENDA",
    1
  );

  const [localTime, setLocalTime] = useState(timers.game ?? 0);

  let timerStart: number;
  let timerEnd: number;
  if (agendaNum === 1) {
    timerStart = phaseStart?.gameSeconds ?? 0;
    timerEnd =
      firstResolution?.gameSeconds ??
      secondResolution?.gameSeconds ??
      localTime;
  } else {
    timerStart =
      firstResolution?.gameSeconds ??
      secondResolution?.gameSeconds ??
      localTime;
    timerEnd = firstResolution ? secondResolution?.gameSeconds ?? 0 : localTime;
  }

  useEffect(() => {
    const gameTime = timers.game ?? 0;
    if (gameTime > localTime) {
      setLocalTime(gameTime);
    }
  }, [timers.game, localTime]);

  let label = "First Agenda";
  if (agendaNum === 2) {
    label = "Second Agenda";
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
          time={timerEnd - timerStart}
          label={label}
          width={120}
          style={{ fontSize: rem(20) }}
        />
      </div>
    </div>
  );
}
