import { ActionLog } from "./types/types";

export function logEntryIsType<DataType extends GameUpdateData>(
  logEntry: ActionLogEntry<GameUpdateData>,
  action: DataType["action"]
): logEntry is ActionLogEntry<DataType> {
  return logEntry.data.action === action;
}

export function getLogEntries<DataType extends GameUpdateData>(
  actionLog: ActionLog,
  type: DataType["action"]
): ActionLogEntry<DataType>[] {
  return actionLog.filter((logEntry) =>
    logEntryIsType<DataType>(logEntry, type)
  );
}

export function getResearchedTechs(actionLog: ActionLog, factionId: FactionId) {
  return getLogEntries<AddTechData>(actionLog, "ADD_TECH")
    .filter(
      (logEntry) =>
        logEntry.data.event.faction === factionId &&
        !logEntry.data.event.researchAgreement
    )
    .map((logEntry) => (logEntry.data as AddTechData).event.tech);
}

export function getRevealedObjectives(actionLog: ActionLog) {
  return getLogEntries<RevealObjectiveData>(actionLog, "REVEAL_OBJECTIVE").map(
    (logEntry) => logEntry.data.event.objective
  );
}

export function getReplacedTechs(actionLog: ActionLog, factionId: FactionId) {
  return getLogEntries<RemoveTechData>(actionLog, "REMOVE_TECH")
    .filter((logEntry) => logEntry.data.event.faction === factionId)
    .map((logEntry) => logEntry.data.event.tech);
}

export function getClaimedPlanets(actionLog: ActionLog, factionId: FactionId) {
  return getLogEntries<ClaimPlanetData>(actionLog, "CLAIM_PLANET")
    .filter((logEntry) => logEntry.data.event.faction === factionId)
    .map((logEntry) => logEntry.data.event);
}

export function getNewOwner(actionLog: ActionLog, planetName: string) {
  return getLogEntries<ClaimPlanetData>(actionLog, "CLAIM_PLANET")
    .filter((logEntry) => logEntry.data.event.planet === planetName)
    .map((logEntry) => logEntry.data.event.faction)[0];
}

export function getScoredObjectives(
  actionLog: ActionLog,
  factionId: FactionId
) {
  return getLogEntries<ScoreObjectiveData>(actionLog, "SCORE_OBJECTIVE")
    .filter((logEntry) => logEntry.data.event.faction === factionId)
    .map((logEntry) => logEntry.data.event.objective);
}

export function getAttachments(actionLog: ActionLog, planetId: PlanetId) {
  return getLogEntries<AddAttachmentData>(actionLog, "ADD_ATTACHMENT")
    .filter((logEntry) => logEntry.data.event.planet === planetId)
    .map((logEntry) => logEntry.data.event.attachment);
}

export function getObjectiveScorers(
  actionLog: ActionLog,
  objectiveId: ObjectiveId
) {
  return getLogEntries<ScoreObjectiveData>(actionLog, "SCORE_OBJECTIVE")
    .filter((logEntry) => logEntry.data.event.objective === objectiveId)
    .map((logEntry) => logEntry.data.event.faction);
}

export function getActiveAgenda(actionLog: ActionLog) {
  return getLogEntries<RevealAgendaData>(actionLog, "REVEAL_AGENDA").map(
    (logEntry) => logEntry.data.event.agenda
  )[0];
}

export function getAllVotes(actionLog: ActionLog) {
  return getLogEntries<CastVotesData>(actionLog, "CAST_VOTES").map(
    (logEntry) => logEntry.data.event
  );
}

export function getFactionVotes(actionLog: ActionLog, factionId: FactionId) {
  return getLogEntries<CastVotesData>(actionLog, "CAST_VOTES")
    .filter((logEntry) => logEntry.data.event.faction === factionId)
    .map((logEntry) => logEntry.data.event)[0];
}

export function getActionCardTargets(actionLog: ActionLog, card: string) {
  return getLogEntries<PlayActionCardData>(actionLog, "PLAY_ACTION_CARD")
    .filter((logEntry) => logEntry.data.event.card === card)
    .map((logEntry) => logEntry.data.event.target);
}

export function getPromissoryTargets(actionLog: ActionLog, card: string) {
  return getLogEntries<PlayPromissoryNoteData>(
    actionLog,
    "PLAY_PROMISSORY_NOTE"
  )
    .filter((logEntry) => logEntry.data.event.card === card)
    .map((logEntry) => logEntry.data.event.target);
}

export function getGainedRelic(actionLog: ActionLog) {
  return getLogEntries<GainRelicData>(actionLog, "GAIN_RELIC").map(
    (logEntry) => logEntry.data.event.relic
  )[0];
}

export function getPurgedPlanet(actionLog: ActionLog) {
  return getLogEntries<UpdatePlanetStateData>(actionLog, "UPDATE_PLANET_STATE")
    .filter((logEntry) => logEntry.data.event.state === "PURGED")
    .map((logEntry) => logEntry.data.event.planet)[0];
}

export function getSelectedFaction(actionLog: ActionLog) {
  return getLogEntries<SelectFactionData>(actionLog, "SELECT_FACTION").map(
    (logEntry) => logEntry.data.event.faction
  )[0];
}

export function getSelectedSubComponent(actionLog: ActionLog) {
  return getLogEntries<SelectSubComponentData>(
    actionLog,
    "SELECT_SUB_COMPONENT"
  ).map((logEntry) => logEntry.data.event.subComponent)[0];
}

export function getSelectedEligibleOutcomes(actionLog: ActionLog) {
  return getLogEntries<SelectEligibleOutcomesData>(
    actionLog,
    "SELECT_ELIGIBLE_OUTCOMES"
  ).map((logEntry) => logEntry.data.event.outcomes)[0];
}

export function getSelectedSubAgenda(actionLog: ActionLog) {
  return getLogEntries<SelectSubAgendaData>(actionLog, "SELECT_SUB_AGENDA").map(
    (logEntry) => {
      const subAgenda = logEntry.data.event.subAgenda;
      if (subAgenda === "None") {
        return undefined;
      }
      return subAgenda;
    }
  )[0];
}

export function getPlayedRiders(actionLog: ActionLog) {
  return getLogEntries<PlayRiderData>(actionLog, "PLAY_RIDER").map(
    (logEntry) => logEntry.data.event
  );
}

export function getSpeakerTieBreak(actionLog: ActionLog) {
  return getLogEntries<SpeakerTieBreakData>(actionLog, "SPEAKER_TIE_BREAK").map(
    (logEntry) => logEntry.data.event.tieBreak
  )[0];
}

export function getPlayedRelic(actionLog: ActionLog, relic: RelicId) {
  return getLogEntries<PlayRelicData>(actionLog, "PLAY_RELIC")
    .filter((logEntry) => logEntry.data.event.relic === relic)
    .map((logEntry) => logEntry.data.event)[0];
}

export function getAdjudicatorBaalSystem(actionLog: ActionLog) {
  return getLogEntries<PlayAdjudicatorBaalData>(
    actionLog,
    "PLAY_ADJUDICATOR_BAAL"
  ).map((logEntry) => logEntry.data.event.systemId)[0];
}

export function wereTilesSwapped(actionLog: ActionLog) {
  return (
    getLogEntries<SwapMapTilesData>(actionLog, "SWAP_MAP_TILES").length > 0
  );
}

export function getResearchAgreementFaction(
  actionLog: ActionLog,
  techId: TechId
) {
  return getLogEntries<AddTechData>(actionLog, "ADD_TECH")
    .filter(
      (logEntry) =>
        logEntry.data.event.tech === techId &&
        logEntry.data.event.researchAgreement
    )
    .map((logEntry) => logEntry.data.event.faction)[0];
}
