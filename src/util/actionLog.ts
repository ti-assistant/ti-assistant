export function getResearchedTechs(
  actionLog: ActionLogEntry[],
  factionId: FactionId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "ADD_TECH" &&
        logEntry.data.event.faction === factionId
    )
    .map((logEntry) => (logEntry.data as AddTechData).event.tech);
}

export function getRevealedObjectives(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "REVEAL_OBJECTIVE")
    .map((logEntry) => (logEntry.data as RevealObjectiveData).event.objective);
}

export function getReplacedTechs(
  actionLog: ActionLogEntry[],
  factionId: FactionId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "REMOVE_TECH" &&
        logEntry.data.event.faction === factionId
    )
    .map((logEntry) => (logEntry.data as AddTechData).event.tech);
}

export function getClaimedPlanets(
  actionLog: ActionLogEntry[],
  factionId: FactionId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "CLAIM_PLANET" &&
        logEntry.data.event.faction === factionId
    )
    .map((logEntry) => (logEntry.data as ClaimPlanetData).event);
}

export function getNewOwner(actionLog: ActionLogEntry[], planetName: string) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "CLAIM_PLANET" &&
        logEntry.data.event.planet === planetName
    )
    .map((logEntry) => (logEntry.data as ClaimPlanetData).event.faction)[0];
}

export function getScoredObjectives(
  actionLog: ActionLogEntry[],
  factionId: FactionId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "SCORE_OBJECTIVE" &&
        logEntry.data.event.faction === factionId
    )
    .map((logEntry) => (logEntry.data as ScoreObjectiveData).event.objective);
}

export function getAttachments(
  actionLog: ActionLogEntry[],
  planetId: PlanetId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "ADD_ATTACHMENT" &&
        logEntry.data.event.planet === planetId
    )
    .map((logEntry) => (logEntry.data as AddAttachmentData).event.attachment);
}

export function getObjectiveScorers(
  actionLog: ActionLogEntry[],
  objectiveId: ObjectiveId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "SCORE_OBJECTIVE" &&
        logEntry.data.event.objective === objectiveId
    )
    .map((logEntry) => (logEntry.data as ScoreObjectiveData).event.faction);
}

export function getActiveAgenda(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "REVEAL_AGENDA")
    .map((logEntry) => (logEntry.data as RevealAgendaData).event.agenda)[0];
}

export function isSetSpeakerData(data: GameUpdateData): data is SetSpeakerData {
  return data.action === "SET_SPEAKER";
}

export function getAllVotes(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "CAST_VOTES")
    .map((logEntry) => (logEntry.data as CastVotesData).event);
}

export function getFactionVotes(
  actionLog: ActionLogEntry[],
  factionId: FactionId
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "CAST_VOTES" &&
        logEntry.data.event.faction === factionId
    )
    .map((logEntry) => (logEntry.data as CastVotesData).event)[0];
}

export function getActionCardTargets(
  actionLog: ActionLogEntry[],
  card: string
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "PLAY_ACTION_CARD" &&
        logEntry.data.event.card === card
    )
    .map((logEntry) => (logEntry.data as PlayActionCardData).event.target);
}

export function getPromissoryTargets(
  actionLog: ActionLogEntry[],
  card: string
) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "PLAY_PROMISSORY_NOTE" &&
        logEntry.data.event.card === card
    )
    .map((logEntry) => (logEntry.data as PlayPromissoryNoteData).event.target);
}

export function getGainedRelic(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "GAIN_RELIC")
    .map((logEntry) => (logEntry.data as GainRelicData).event.relic)[0];
}

export function getPurgedPlanet(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "UPDATE_PLANET_STATE" &&
        logEntry.data.event.state === "PURGED"
    )
    .map(
      (logEntry) => (logEntry.data as UpdatePlanetStateData).event.planet
    )[0];
}

export function getSelectedFaction(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "SELECT_FACTION")
    .map((logEntry) => (logEntry.data as SelectFactionData).event.faction)[0];
}

export function getSelectedSubComponent(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "SELECT_SUB_COMPONENT")
    .map(
      (logEntry) => (logEntry.data as SelectSubComponentData).event.subComponent
    )[0];
}

export function getSelectedEligibleOutcomes(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "SELECT_ELIGIBLE_OUTCOMES")
    .map(
      (logEntry) => (logEntry.data as SelectEligibleOutcomesData).event.outcomes
    )[0];
}

export function getSelectedSubAgenda(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "SELECT_SUB_AGENDA")
    .map((logEntry) => {
      const subAgenda = (logEntry.data as SelectSubAgendaData).event.subAgenda;
      if (subAgenda === "None") {
        return undefined;
      }
      return subAgenda;
    })[0];
}

export function getPlayedRiders(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "PLAY_RIDER")
    .map((logEntry) => (logEntry.data as PlayRiderData).event);
}

export function getSpeakerTieBreak(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "SPEAKER_TIE_BREAK")
    .map(
      (logEntry) => (logEntry.data as SpeakerTieBreakData).event.tieBreak
    )[0];
}

export function getPlayedRelic(actionLog: ActionLogEntry[], relic: RelicId) {
  return actionLog
    .filter(
      (logEntry) =>
        logEntry.data.action === "PLAY_RELIC" &&
        logEntry.data.event.relic === relic
    )
    .map((logEntry) => (logEntry.data as PlayRelicData).event)[0];
}

export function getAdjudicatorBaalSystem(actionLog: ActionLogEntry[]) {
  return actionLog
    .filter((logEntry) => logEntry.data.action === "PLAY_ADJUDICATOR_BAAL")
    .map(
      (logEntry) => (logEntry.data as PlayAdjudicatorBaalData).event.systemId
    )[0];
}
