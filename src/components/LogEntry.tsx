import { useRouter } from "next/router";
import { ObjectiveRow } from "../ObjectiveRow";
import { useGameData } from "../data/GameData";
import { ActionLogEntry } from "../util/api/util";
import { BLACK_TEXT_GLOW, LabeledLine } from "../LabeledDiv";
import { Phase } from "../util/api/state";
import { TimerDisplay } from "../Timer";
import { pluralize, responsivePixels } from "../util/util";
import { getFactionColor, getFactionName } from "../util/factions";
import { PlanetRow } from "../PlanetRow";
import { AgendaRow } from "../AgendaRow";

function ColoredFactionName({ factionName }: { factionName: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "objectives"]);
  const factions = gameData.factions;

  const faction = factions[factionName];
  const color = getFactionColor(faction);

  return (
    <span
      style={{
        color,
        textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
      }}
    >
      {getFactionName(faction)}
    </span>
  );
}

export function LogEntryElement({
  logEntry,
  activePlayer,
  currRound,
  startTimeSeconds,
  endTimeSeconds,
}: {
  logEntry: ActionLogEntry;
  activePlayer?: string;
  currRound: number;
  startTimeSeconds: number;
  endTimeSeconds: number;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["agendas", "factions", "objectives"]);
  const agendas = gameData.agendas ?? {};
  const factions = gameData.factions;
  const objectives = gameData.objectives ?? {};

  switch (logEntry.data.action) {
    case "ADD_ATTACHMENT": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          Attached {logEntry.data.event.attachment} to{" "}
          {logEntry.data.event.planet}
        </div>
      );
    }
    case "ADVANCE_PHASE": {
      let phase = "Strategy";
      switch (logEntry.data.event.state?.phase) {
        case "STRATEGY":
          phase = "Action";
          break;
        case "ACTION":
          phase = "Status";
          break;
        case "STATUS":
          if (logEntry.data.event.skipAgenda) {
            phase = "Strategy";
          } else {
            phase = "Agenda";
          }
          break;
        case "AGENDA":
          phase = "Strategy";
          break;
      }
      return (
        <LabeledLine
          leftLabel={`Round ${currRound}`}
          label={`${phase} Phase`}
          rightLabel={
            <TimerDisplay
              time={endTimeSeconds - startTimeSeconds}
              style={{
                fontSize: responsivePixels(16),
              }}
              width={84}
            />
          }
        />
      );
    }
    case "ASSIGN_STRATEGY_CARD": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ColoredFactionName factionName={logEntry.data.event.pickedBy} /> :{" "}
            {logEntry.data.event.name}
          </div>
          <TimerDisplay
            time={endTimeSeconds - startTimeSeconds}
            style={{
              fontSize: responsivePixels(16),
            }}
            width={84}
          />
        </div>
      );
    }
    case "SELECT_ACTION": {
      const faction = factions[activePlayer ?? ""];
      return (
        <LabeledLine
          color={getFactionColor(faction)}
          leftLabel={getFactionName(faction)}
          label={logEntry.data.event.action}
          rightLabel={
            <TimerDisplay
              time={endTimeSeconds - startTimeSeconds}
              style={{
                fontSize: responsivePixels(16),
              }}
              width={84}
            />
          }
        />
      );
    }
    case "GAIN_RELIC": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />{" "}
          gained relic : {logEntry.data.event.relic}
        </div>
      );
    }
    case "PLAY_COMPONENT": {
      // TODO: Add different text for different components.
      return null;
    }
    case "MARK_SECONDARY": {
      // TODO: Display for all but Technology
      return null;
      // if (logEntry.data.event.state === "DONE") {
      //   return (
      //     <div
      //       className="flexRow"
      //       style={{
      //         padding: `0 ${responsivePixels(10)}`,
      //         gap: responsivePixels(4),
      //         fontFamily: "Myriad Pro",
      //       }}
      //     >
      //       Followed by
      //       <ColoredFactionName factionName={logEntry.data.event.faction} />
      //     </div>
      //   );
      // }
      // return null;
    }
    case "SET_SPEAKER": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          New Speaker:
          <ColoredFactionName factionName={logEntry.data.event.newSpeaker} />
        </div>
      );
    }
    case "SCORE_OBJECTIVE": {
      const objective = objectives[logEntry.data.event.objective];
      if (!objective) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          scored <ObjectiveRow objective={objective} hideScorers />
          {logEntry.data.event.key ? ` (${logEntry.data.event.key})` : null}
        </div>
      );
    }
    case "UNSCORE_OBJECTIVE": {
      const objective = objectives[logEntry.data.event.objective];
      if (!objective) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          lost <ObjectiveRow objective={objective} hideScorers />
          {logEntry.data.event.key ? ` (${logEntry.data.event.key})` : null}
        </div>
      );
    }
    case "MANUAL_VP_UPDATE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          {logEntry.data.event.vps > 0 ? "gained" : "lost"}{" "}
          {Math.abs(logEntry.data.event.vps)}{" "}
          {pluralize("VP", Math.abs(logEntry.data.event.vps))}
        </div>
      );
    }
    case "END_GAME": {
      return null;
    }
    case "CHOOSE_STARTING_TECH": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          selected {logEntry.data.event.tech} as a starting tech
        </div>
      );
    }
    case "ADD_TECH": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          researched {logEntry.data.event.tech}
        </div>
      );
    }
    case "REMOVE_TECH": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          returned {logEntry.data.event.tech}
        </div>
      );
    }
    case "CLAIM_PLANET": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
            gap: responsivePixels(4),
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} /> took
          control of {logEntry.data.event.planet}
          {logEntry.data.event.prevOwner ? (
            <>
              {" "}
              from{" "}
              <ColoredFactionName factionName={logEntry.data.event.prevOwner} />
            </>
          ) : null}
        </div>
      );
    }
    case "CAST_VOTES": {
      if (logEntry.data.event.target === "Abstain") {
        return (
          <div
            className="flexRow"
            style={{
              padding: `0 ${responsivePixels(10)}`,
            }}
          >
            <ColoredFactionName factionName={logEntry.data.event.faction} />
            Abstained
          </div>
        );
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction} />
          cast {logEntry.data.event.votes} for {logEntry.data.event.target}
        </div>
      );
    }
    case "PLAY_RIDER": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
          }}
        >
          <ColoredFactionName factionName={logEntry.data.event.faction ?? ""} />
          played {logEntry.data.event.rider} and predicted{" "}
          {logEntry.data.event.outcome}
        </div>
      );
    }
    case "SPEAKER_TIE_BREAK": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
          }}
        >
          Speaker broke the tie in favor of {logEntry.data.event.tieBreak}
        </div>
      );
    }
    case "REVEAL_AGENDA": {
      const agenda = agendas[logEntry.data.event.agenda];
      if (!agenda) {
        return null;
      }
      return (
        <LabeledLine
          leftLabel={<AgendaRow agenda={agenda} hideOutcome />}
          rightLabel={
            <TimerDisplay
              time={endTimeSeconds - startTimeSeconds}
              style={{
                fontSize: responsivePixels(16),
              }}
              width={84}
            />
          }
        />
      );
    }
    case "PLAY_ACTION_CARD": {
      return null;
    }
    case "HIDE_AGENDA": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
          }}
        >
          Agenda Vetoed
        </div>
      );
    }
    case "REVEAL_OBJECTIVE": {
      const objective = objectives[logEntry.data.event.objective];
      if (!objective) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${responsivePixels(10)}`,
          }}
        >
          Revealed Objective: <ObjectiveRow objective={objective} hideScorers />
        </div>
      );
    }
    case "RESOLVE_AGENDA": {
      // TODO: See if anything needs to be added.
      return null;
    }
    case "END_TURN":
      return null;
  }
  return (
    <div style={{ width: "100%", backgroundColor: "orange" }}>
      <LabeledLine leftLabel={logEntry.data.action} />
    </div>
  );
}
