import { rem } from "../../util/util";
import { LogEntryElement, LogEntryElementProps } from "../LogEntry";

type WithKey<T> = T & { key: number };

export function GameLog({
  annotatedLog,
}: {
  annotatedLog: WithKey<LogEntryElementProps>[];
}) {
  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        height: rem(500),
        overflow: "auto",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {annotatedLog.map((entry) => (
        <LogEntryElement
          key={entry.key}
          logEntry={entry.logEntry}
          activePlayer={entry.activePlayer}
          currRound={entry.currRound}
          startTimeSeconds={entry.startTimeSeconds}
          endTimeSeconds={entry.endTimeSeconds}
        />
      ))}
    </div>
  );
}
