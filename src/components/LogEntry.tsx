import { FormattedMessage } from "react-intl";
import { AgendaRow } from "../AgendaRow";
import {
  useAbilities,
  useAgendas,
  useAllPlanets,
  useGenomes,
  useParadigms,
  useRelics,
  useTechs,
  useUpgrades,
} from "../context/dataHooks";
import { useFaction, useFactions } from "../context/factionDataHooks";
import { InfoRow } from "../InfoRow";
import {
  getFactionBorder,
  getFactionColor,
  getFactionName,
} from "../util/factions";
import { getTechColor, getTechTypeColor } from "../util/techs";
import { rem } from "../util/util";
import ExpeditionIcon from "./Expedition/ExpeditionIcon";
import FactionComponents from "./FactionComponents/FactionComponents";
import FactionIcon from "./FactionIcon/FactionIcon";
import FormattedDescription from "./FormattedDescription/FormattedDescription";
import LabeledLine from "./LabeledLine/LabeledLine";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import TimerDisplay from "./TimerDisplay/TimerDisplay";

function ColoredFactionName({ factionId }: { factionId: FactionId }) {
  let faction = useFaction(factionId);
  const altFaction = useFaction("Obsidian");
  if (!faction && factionId === "Firmament") {
    faction = altFaction;
  }
  const color = getFactionColor(faction);

  return (
    <span
      style={{
        color,
      }}
    >
      {getFactionName(faction)}
    </span>
  );
}

export interface LogEntryElementProps {
  logEntry: ActionLogEntry<GameUpdateData>;
  activePlayer?: FactionId | "None";
  currRound: number;
  startTimeSeconds: number;
  endTimeSeconds: number;
}

export function LogEntryElement({
  logEntry,
  activePlayer,
  currRound,
  startTimeSeconds,
  endTimeSeconds,
}: LogEntryElementProps) {
  const agendas = useAgendas();
  const factions = useFactions();
  const planets = useAllPlanets();
  const relics = useRelics();
  const techs = useTechs();

  const abilities = useAbilities();
  const genomes = useGenomes();
  const upgrades = useUpgrades();
  const paradigms = useParadigms();

  switch (logEntry.data.action) {
    case "ADD_ATTACHMENT": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
                fontSize: rem(16),
              }}
              width={84}
            />
          }
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "var(--background-color)",
            zIndex: 1,
          }}
        />
      );
    }
    case "ASSIGN_STRATEGY_CARD": {
      let cardId = logEntry.data.event.id;
      if (!cardId) {
        cardId = (logEntry.data.event as any).name;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ColoredFactionName factionId={logEntry.data.event.pickedBy} /> :{" "}
            {logEntry.data.event.assignedTo !== logEntry.data.event.pickedBy ? (
              <>
                Gave {cardId} to{" "}
                <ColoredFactionName
                  factionId={logEntry.data.event.assignedTo}
                />
              </>
            ) : (
              cardId
            )}
          </div>
          <TimerDisplay
            time={endTimeSeconds - startTimeSeconds}
            style={{
              fontSize: rem(16),
            }}
            width={84}
          />
        </div>
      );
    }
    case "SELECT_ACTION": {
      let faction =
        activePlayer && activePlayer !== "None"
          ? factions[activePlayer]
          : undefined;
      if (!faction && activePlayer === "Firmament") {
        faction = factions["Obsidian"];
      }
      return (
        <LabeledLine
          color={getFactionColor(faction)}
          borderColor={getFactionBorder(faction)}
          leftLabel={getFactionName(faction)}
          label={logEntry.data.event.action}
          rightLabel={
            <TimerDisplay
              time={endTimeSeconds - startTimeSeconds}
              style={{
                fontSize: rem(16),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> gained
          relic : {logEntry.data.event.relic}
        </div>
      );
    }
    case "LOSE_RELIC": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> lost
          relic : {logEntry.data.event.relic}
        </div>
      );
    }
    case "PLAY_COMPONENT": {
      // Certain components get displayed by subsequent entries.
      switch (logEntry.data.event.name) {
        case "Gain Relic": {
          return null;
        }
      }
      if (!activePlayer || activePlayer === "None") {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={activePlayer} /> used{" "}
          {logEntry.data.event.name}
        </div>
      );
    }
    case "SELECT_SUB_COMPONENT": {
      return (
        <div
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Used Ssruu as {logEntry.data.event.subComponent}
        </div>
      );
    }
    case "SELECT_FACTION": {
      return (
        <div
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Used Z&apos;eu Ω on {logEntry.data.event.faction}
        </div>
      );
    }
    case "SET_SPEAKER": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          New Speaker:
          <ColoredFactionName factionId={logEntry.data.event.newSpeaker} />
        </div>
      );
    }
    case "SET_TYRANT": {
      if (!logEntry.data.event.newTyrant) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          New Tyrant:
          <ColoredFactionName factionId={logEntry.data.event.newTyrant} />
        </div>
      );
    }
    case "SCORE_OBJECTIVE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          scored <ObjectiveRow objectiveId={logEntry.data.event.objective} />
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          lost control of {planet}
        </div>
      );
    }
    case "UNSCORE_OBJECTIVE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          lost <ObjectiveRow objectiveId={logEntry.data.event.objective} />
          {logEntry.data.event.key ? ` (${logEntry.data.event.key})` : null}
        </div>
      );
    }
    case "MANUAL_VP_UPDATE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          {logEntry.data.event.vps > 0 ? "gained" : "lost"}{" "}
          {Math.abs(logEntry.data.event.vps)}{" "}
          <FormattedMessage
            id="PzyYtG"
            description="Shortened version of Victory Points."
            defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
            values={{ count: logEntry.data.event.vps }}
          />
        </div>
      );
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          selected {logEntry.data.event.subFaction}
          <FactionComponents.Icon
            factionId={logEntry.data.event.subFaction}
            size={20}
          />
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          researched
          <span style={{ color: getTechColor(tech) }}>{tech.name}</span>
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} />
          returned
          <span style={{ color: getTechColor(tech) }}>{tech.name}</span>
        </div>
      );
    }
    case "CLAIM_PLANET": {
      const planet = planets[logEntry.data.event.planet];
      if (!planet) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.faction} /> took
          control of {planet.name}
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
              padding: `0 ${rem(10)}`,
              gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
            padding: `0 ${rem(10)}`,
            gap: rem(4),
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
                fontSize: rem(16),
              }}
              width={84}
            />
          }
        />
      );
    }
    case "PLAY_RELIC": {
      const relicOwner = relics[logEntry.data.event.relic]?.owner;
      if (!relicOwner) {
        return null;
      }
      switch (logEntry.data.event.relic) {
        case "Maw of Worlds": {
          const tech = techs[logEntry.data.event.tech];
          if (!tech) {
            return null;
          }
          return (
            <div
              className="flexRow"
              style={{
                padding: `0 ${rem(10)}`,
                gap: rem(4),
              }}
            >
              <ColoredFactionName factionId={relicOwner} />
              purged Maw of Worlds to gain
              <span style={{ color: getTechColor(tech) }}>{tech.name}</span>
            </div>
          );
        }
        case "The Crown of Emphidia": {
          return (
            <div
              className="flexRow"
              style={{
                padding: `0 ${rem(10)}`,
                gap: rem(4),
              }}
            >
              <ColoredFactionName factionId={relicOwner} />
              scored <ObjectiveRow objectiveId="Tomb + Crown of Emphidia" />
            </div>
          );
        }
      }
      return null;
    }
    case "PLAY_ADJUDICATOR_BAAL": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId="Embers of Muaat" />
          used Adjudicator Ba&apos;al to replace system{" "}
          {logEntry.data.event.systemId} with Muaat supernova.
        </div>
      );
    }
    case "HIDE_AGENDA": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Agenda Vetoed
        </div>
      );
    }
    case "REVEAL_OBJECTIVE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Revealed Objective:{" "}
          <ObjectiveRow objectiveId={logEntry.data.event.objective} />
        </div>
      );
    }
    case "UPDATE_PLANET_STATE": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Purged Planet: {logEntry.data.event.planet}
        </div>
      );
    }
    case "PURGE_SYSTEM": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          Purged System: {logEntry.data.event.systemId}
        </div>
      );
    }
    case "PURGE_TECH": {
      const tech = techs[logEntry.data.event.techId];
      if (!tech) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          {logEntry.data.event.factionId ? (
            <>
              <ColoredFactionName factionId={logEntry.data.event.factionId} />{" "}
              purged{" "}
            </>
          ) : (
            <>All players purged </>
          )}
          <span style={{ color: getTechColor(tech) }}>{tech.name}</span>
        </div>
      );
    }

    case "COMMIT_TO_EXPEDITION": {
      if (!logEntry.data.event.factionId) {
        return null;
      }
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.factionId} />
          committed to the Expedition
          <ExpeditionIcon expedition={logEntry.data.event.expedition} />
        </div>
      );
    }
    case "UNPASS": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.factionId} />
          chose to no longer be passed
        </div>
      );
    }
    case "CHOOSE_TF_FACTION": {
      return (
        <div
          className="flexRow"
          style={{
            padding: `0 ${rem(10)}`,
            gap: rem(4),
          }}
        >
          <ColoredFactionName factionId={logEntry.data.event.factionId} />
          selected{" "}
          <FactionIcon
            factionId={logEntry.data.event.subFaction}
            size={16}
          />{" "}
          for their{" "}
          {logEntry.data.event.type === "Planet"
            ? "Home System"
            : "Starting Units"}
        </div>
      );
    }
    case "GAIN_TF_CARD": {
      switch (logEntry.data.event.type) {
        case "ABILITY":
          const ability = abilities[logEntry.data.event.ability];
          if (!ability) {
            return null;
          }
          return (
            <InfoRow
              infoTitle={ability.name}
              infoContent={
                <FormattedDescription description={ability.description} />
              }
            >
              <div
                className="flexRow"
                style={{
                  padding: `0 ${rem(10)}`,
                  gap: rem(4),
                }}
              >
                <ColoredFactionName factionId={logEntry.data.event.faction} />
                gained{" "}
                <span style={{ color: getTechTypeColor(ability.type) }}>
                  {ability.name}
                </span>
              </div>
            </InfoRow>
          );
        case "GENOME":
          const genome = genomes[logEntry.data.event.genome];
          if (!genome) {
            return null;
          }
          return (
            <InfoRow
              infoTitle={genome.name}
              infoContent={
                <FormattedDescription description={genome.description} />
              }
            >
              <div
                className="flexRow"
                style={{
                  padding: `0 ${rem(10)}`,
                  gap: rem(4),
                }}
              >
                <ColoredFactionName factionId={logEntry.data.event.faction} />
                gained {genome.name}
              </div>
            </InfoRow>
          );
        case "PARADIGM":
          const paradigm = paradigms[logEntry.data.event.paradigm];
          if (!paradigm) {
            return null;
          }
          return (
            <InfoRow
              infoTitle={paradigm.name}
              infoContent={
                <FormattedDescription description={paradigm.description} />
              }
            >
              <div
                className="flexRow"
                style={{
                  padding: `0 ${rem(10)}`,
                  gap: rem(4),
                }}
              >
                <ColoredFactionName factionId={logEntry.data.event.faction} />
                gained {paradigm.name}
              </div>
            </InfoRow>
          );
        case "UNIT_UPGRADE":
          const upgrade = upgrades[logEntry.data.event.upgrade];
          if (!upgrade) {
            return null;
          }
          return (
            <InfoRow
              infoTitle={upgrade.name}
              infoContent={
                <FormattedDescription description={upgrade.description} />
              }
            >
              <div
                className="flexRow"
                style={{
                  padding: `0 ${rem(10)}`,
                  gap: rem(4),
                }}
              >
                <ColoredFactionName factionId={logEntry.data.event.faction} />
                gained {upgrade.name}
              </div>
            </InfoRow>
          );
      }
    }
    case "RESOLVE_AGENDA":
    case "PLAY_ACTION_CARD":
    case "START_VOTING":
    case "MARK_PRIMARY":
    case "MARK_SECONDARY":
    case "END_TURN":
    case "END_GAME":
      return null;
  }
  return (
    <div style={{ width: "100%", backgroundColor: "orange" }}>
      <LabeledLine leftLabel={logEntry.data.action} />
    </div>
  );
}
