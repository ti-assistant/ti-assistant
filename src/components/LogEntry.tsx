import { useContext } from "react";
import { AgendaRow } from "../AgendaRow";
import {
  AgendaContext,
  FactionContext,
  ObjectiveContext,
  TechContext,
} from "../context/Context";
import { BLACK_TEXT_GLOW } from "../util/borderGlow";
import { getFactionColor, getFactionName } from "../util/factions";
import { pluralize } from "../util/util";
import LabeledLine from "./LabeledLine/LabeledLine";
import TimerDisplay from "./TimerDisplay/TimerDisplay";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import FactionIcon from "./FactionIcon/FactionIcon";
import TechIcon from "./TechIcon/TechIcon";
import { getTechColor } from "../util/techs";

function ColoredFactionName({ factionId }: { factionId: FactionId }) {
  const factions = useContext(FactionContext);

  const faction = factions[factionId];
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
  activePlayer?: FactionId | "None";
  currRound: number;
  startTimeSeconds: number;
  endTimeSeconds: number;
}) {
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const techs = useContext(TechContext);

  switch (logEntry.data.action) {
    case "ADD_ATTACHMENT": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          Attached {logEntry.data.event.attachment} to{" "}
          {logEntry.data.event.planet}
        </div>
      );
    }
    case "GIFT_OF_PRESCIENCE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> used
          Gift of Prescience.
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
                fontSize: "16px",
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
            padding: `0 ${"10px"}`,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ColoredFactionName factionId={logEntry.data.event.pickedBy} /> :{" "}
            {logEntry.data.event.id}
          </div>
          <TimerDisplay
            time={endTimeSeconds - startTimeSeconds}
            style={{
              fontSize: "16px",
            }}
            width={84}
          />
        </div>
      );
    }
    case "SELECT_ACTION": {
      const faction =
        activePlayer && activePlayer !== "None"
          ? factions[activePlayer]
          : undefined;
      return (
        <LabeledLine
          color={getFactionColor(faction)}
          leftLabel={getFactionName(faction)}
          label={logEntry.data.event.action}
          rightLabel={
            <TimerDisplay
              time={endTimeSeconds - startTimeSeconds}
              style={{
                fontSize: "16px",
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
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> gained
          relic : {logEntry.data.event.relic}
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
      //         padding: `0 ${"10px"}`,
      //         gap: "4px",
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
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          New Speaker:
          <ColoredFactionName factionId={logEntry.data.event.newSpeaker} />
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
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          scored <ObjectiveRow objective={objective} hideScorers />
          {logEntry.data.event.key ? ` (${logEntry.data.event.key})` : null}
        </div>
      );
    }
    case "SELECT_ELIGIBLE_OUTCOMES": {
      const outcomes = logEntry.data.event.outcomes;
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          Eligible outcomes revealed as{" "}
          {outcomes === "For/Against" ? outcomes : `Elect ${outcomes}`}
        </div>
      );
    }
    case "SELECT_SUB_AGENDA": {
      const subAgenda = logEntry.data.event.subAgenda;
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          Covert agenda revealed as {subAgenda}
        </div>
      );
    }
    case "HIDE_OBJECTIVE": {
      const objective = logEntry.data.event.objective;
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          {objective} removed
        </div>
      );
    }
    case "UNCLAIM_PLANET": {
      const planet = logEntry.data.event.planet;
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          lost control of {planet}
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
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
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
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
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
      const tech = techs[logEntry.data.event.tech];
      if (!tech) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          selected{" "}
          <span style={{ color: getTechColor(tech) }}>
            {logEntry.data.event.tech}
          </span>
          as a starting tech
        </div>
      );
    }
    case "CHOOSE_SUB_FACTION": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          selected {logEntry.data.event.subFaction}
          <FactionIcon factionId={logEntry.data.event.subFaction} size={20} />
          as their sub-faction
        </div>
      );
    }
    case "ADD_TECH": {
      const tech = techs[logEntry.data.event.tech];
      if (!tech) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          researched
          <span style={{ color: getTechColor(tech) }}>
            {logEntry.data.event.tech}
          </span>
        </div>
      );
    }
    case "REMOVE_TECH": {
      const tech = techs[logEntry.data.event.tech];
      if (!tech) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          returned
          <span style={{ color: getTechColor(tech) }}>
            {logEntry.data.event.tech}
          </span>
        </div>
      );
    }
    case "CLAIM_PLANET": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
            gap: "4px",
            fontFamily: "Myriad Pro",
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> took
          control of {logEntry.data.event.planet}
          {logEntry.data.event.prevOwner ? (
            <>
              {" "}
              from{" "}
              <ColoredFactionName factionId={logEntry.data.event.prevOwner} />
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
              padding: `0 ${"10px"}`,
            }}
          >
            <ColoredFactionName factionId={logEntry.data.event.faction} />
            Abstained
          </div>
        );
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          cast {logEntry.data.event.votes} for {logEntry.data.event.target}
        </div>
      );
    }
    case "PLAY_RIDER": {
      if (!logEntry.data.event.faction) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${"10px"}`,
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
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
            padding: `0 ${"10px"}`,
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
                fontSize: "16px",
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
            padding: `0 ${"10px"}`,
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
            padding: `0 ${"10px"}`,
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
