const addAttachmentFn = import("../util/api/addAttachment").then(
  (mod) => mod.addAttachment
);
const addTechFn = import("../util/api/addTech").then((mod) => mod.addTech);
const advancePhaseFn = import("../util/api/advancePhase").then(
  (mod) => mod.advancePhase
);
const assignStrategyCardFn = import("../util/api/assignStrategyCard").then(
  (mod) => mod.assignStrategyCard
);
const castVotesFn = import("../util/api/castVotes").then(
  (mod) => mod.castVotes
);
const changeOptionFn = import("../util/api/changeOption").then(
  (mod) => mod.changeOption
);
const chooseStartingTechFn = import("../util/api/chooseStartingTech").then(
  (mod) => mod.chooseStartingTech
);
const chooseSubFactionFn = import("../util/api/chooseSubFaction").then(
  (mod) => mod.chooseSubFaction
);
const claimPlanetFn = import("../util/api/claimPlanet").then(
  (mod) => mod.claimPlanet
);
const continueGameFn = import("../util/api/endGame").then(
  (mod) => mod.continueGame
);
const endGameFn = import("../util/api/endGame").then((mod) => mod.endGame);
const endTurnFn = import("../util/api/endTurn").then((mod) => mod.endTurn);
const gainRelicFn = import("../util/api/gainRelic").then(
  (mod) => mod.gainRelic
);
const giftOfPrescienceFn = import("../util/api/giftOfPrescience").then(
  (mod) => mod.giftOfPrescience
);
const hideAgendaFn = import("../util/api/revealAgenda").then(
  (mod) => mod.hideAgenda
);
const hideObjectiveFn = import("../util/api/revealObjective").then(
  (mod) => mod.hideObjective
);
const loseRelicFn = import("../util/api/gainRelic").then(
  (mod) => mod.loseRelic
);
const manualVPUpdateFn = import("../util/api/manualVPUpdate").then(
  (mod) => mod.manualVPUpdate
);
const markSecondaryFn = import("../util/api/markSecondary").then(
  (mod) => mod.markSecondary
);
const playActionCardFn = import("../util/api/playActionCard").then(
  (mod) => mod.playActionCard
);
const playComponentFn = import("../util/api/playComponent").then(
  (mod) => mod.playComponent
);
const playPromissoryNoteFn = import("../util/api/playPromissoryNote").then(
  (mod) => mod.playPromissoryNote
);
const playRelicFn = import("../util/api/playRelic").then(
  (mod) => mod.playRelic
);
const playRiderFn = import("../util/api/playRider").then(
  (mod) => mod.playRider
);
const removeAttachmentFn = import("../util/api/addAttachment").then(
  (mod) => mod.removeAttachment
);
const removeStartingTechFn = import("../util/api/chooseStartingTech").then(
  (mod) => mod.removeStartingTech
);
const removeTechFn = import("../util/api/addTech").then(
  (mod) => mod.removeTech
);
const repealAgendaFn = import("../util/api/resolveAgenda").then(
  (mod) => mod.repealAgenda
);
const resolveAgendaFn = import("../util/api/resolveAgenda").then(
  (mod) => mod.resolveAgenda
);
const revealAgendaFn = import("../util/api/revealAgenda").then(
  (mod) => mod.revealAgenda
);
const revealObjectiveFn = import("../util/api/revealObjective").then(
  (mod) => mod.revealObjective
);
const scoreObjectiveFn = import("../util/api/scoreObjective").then(
  (mod) => mod.scoreObjective
);
const selectActionFn = import("../util/api/selectAction").then(
  (mod) => mod.selectAction
);
const selectEligibleOutcomesFn = import(
  "../util/api/selectEligibleOutcomes"
).then((mod) => mod.selectEligibleOutcomes);
const selectFactionFn = import("../util/api/selectFaction").then(
  (mod) => mod.selectFaction
);
const selectSubAgendaFn = import("../util/api/selectSubAgenda").then(
  (mod) => mod.selectSubAgenda
);
const selectSubComponentFn = import("../util/api/selectSubComponent").then(
  (mod) => mod.selectSubComponent
);
const setGlobalPauseFn = import("../util/api/setPause").then(
  (mod) => mod.setGlobalPause
);
const setSpeakerFn = import("../util/api/setSpeaker").then(
  (mod) => mod.setSpeaker
);
const setObjectivePointsFn = import("../util/api/setObjectivePoints").then(
  (mod) => mod.setObjectivePoints
);
const speakerTieBreakFn = import("../util/api/speakerTieBreak").then(
  (mod) => mod.speakerTieBreak
);
const startVotingFn = import("../util/api/startVoting").then(
  (mod) => mod.startVoting
);
const swapStrategyCardsFn = import("../util/api/swapStrategyCards").then(
  (mod) => mod.swapStrategyCards
);
const unclaimPlanetFn = import("../util/api/claimPlanet").then(
  (mod) => mod.unclaimPlanet
);
const undoFn = import("../util/api/undo").then((mod) => mod.undo);
const unplayActionCardFn = import("../util/api/playActionCard").then(
  (mod) => mod.unplayActionCard
);
const unplayComponentFn = import("../util/api/playComponent").then(
  (mod) => mod.unplayComponent
);
const unplayPromissoryNoteFn = import("../util/api/playPromissoryNote").then(
  (mod) => mod.unplayPromissoryNote
);
const unplayRelicFn = import("../util/api/playRelic").then(
  (mod) => mod.unplayRelic
);
const unplayRiderFn = import("../util/api/playRider").then(
  (mod) => mod.unplayRider
);
const unselectActionFn = import("../util/api/selectAction").then(
  (mod) => mod.unselectAction
);
const unscoreObjectiveFn = import("../util/api/scoreObjective").then(
  (mod) => mod.unscoreObjective
);
const updateLeaderStateFn = import("../util/api/updateLeaderState").then(
  (mod) => mod.updateLeaderState
);
const updatePlanetStateFn = import("../util/api/updatePlanetState").then(
  (mod) => mod.updatePlanetState
);

export async function addAttachmentAsync(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const addAttachment = await addAttachmentFn;
  addAttachment(gameId, planet, attachment);
}

export async function addTechAsync(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const addTech = await addTechFn;
  addTech(gameId, faction, techId);
}

export async function advancePhaseAsync(
  gameId: string,
  skipAgenda: boolean = false
) {
  const advancePhase = await advancePhaseFn;
  advancePhase(gameId, skipAgenda);
}

export async function assignStrategyCardAsync(
  gameId: string,
  assignedTo: FactionId,
  cardId: StrategyCardId,
  pickedBy: FactionId
) {
  const assignStrategyCard = await assignStrategyCardFn;
  assignStrategyCard(gameId, assignedTo, cardId, pickedBy);
}

export async function castVotesAsync(
  gameId: string,
  faction: FactionId,
  votes: number,
  extraVotes: number,
  target?: string
) {
  const castVotes = await castVotesFn;
  castVotes(gameId, faction, votes, extraVotes, target);
}

export async function changeOptionAsync(
  gameId: string,
  option: string,
  value: any
) {
  const changeOption = await changeOptionFn;
  changeOption(gameId, option, value);
}

export async function chooseStartingTechAsync(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const chooseStartingTech = await chooseStartingTechFn;
  chooseStartingTech(gameId, faction, techId);
}

export async function chooseSubFactionAsync(
  gameId: string,
  faction: "Council Keleres",
  subFaction: SubFaction
) {
  const chooseSubFaction = await chooseSubFactionFn;
  chooseSubFaction(gameId, faction, subFaction);
}

export async function claimPlanetAsync(
  gameId: string,
  faction: FactionId,
  planet: PlanetId
) {
  const claimPlanet = await claimPlanetFn;
  claimPlanet(gameId, faction, planet);
}

export async function continueGameAsync(gameId: string) {
  const continueGame = await continueGameFn;
  continueGame(gameId);
}

export async function endGameAsync(gameId: string) {
  const endGame = await endGameFn;
  endGame(gameId);
}

export async function endTurnAsync(gameId: string, samePlayer?: boolean) {
  const endTurn = await endTurnFn;
  endTurn(gameId, samePlayer);
}

export async function gainRelicAsync(
  gameId: string,
  faction: FactionId,
  relic: RelicId
) {
  const gainRelic = await gainRelicFn;
  gainRelic(gameId, faction, relic);
}

export async function giftOfPrescienceAsync(
  gameId: string,
  faction: FactionId
) {
  const giftOfPrescience = await giftOfPrescienceFn;
  giftOfPrescience(gameId, faction);
}

export async function hideAgendaAsync(
  gameId: string,
  agenda: AgendaId,
  veto?: boolean
) {
  const hideAgenda = await hideAgendaFn;
  hideAgenda(gameId, agenda, veto);
}

export async function hideObjectiveAsync(
  gameId: string,
  objective: ObjectiveId
) {
  const hideObjective = await hideObjectiveFn;
  hideObjective(gameId, objective);
}

export async function loseRelicAsync(
  gameId: string,
  faction: FactionId,
  relic: RelicId
) {
  const loseRelic = await loseRelicFn;
  loseRelic(gameId, faction, relic);
}

export async function manualVPUpdateAsync(
  gameId: string,
  faction: FactionId,
  vps: number
) {
  const manualVPUpdate = await manualVPUpdateFn;
  manualVPUpdate(gameId, faction, vps);
}

export async function markSecondaryAsync(
  gameId: string,
  faction: FactionId,
  state: Secondary
) {
  const markSecondary = await markSecondaryFn;
  markSecondary(gameId, faction, state);
}

export async function playActionCardAsync(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const playActionCard = await playActionCardFn;
  playActionCard(gameId, card, target);
}

export async function playComponentAsync(gameId: string, name: string) {
  const playComponent = await playComponentFn;
  playComponent(gameId, name);
}

export async function playPromissoryNoteAsync(
  gameId: string,
  card: string,
  target: FactionId
) {
  const playPromissoryNote = await playPromissoryNoteFn;
  playPromissoryNote(gameId, card, target);
}

export async function playRelicAsync(gameId: string, event: PlayRelicEvent) {
  const playRelic = await playRelicFn;
  playRelic(gameId, event);
}

export async function playRiderAsync(
  gameId: string,
  rider: string,
  faction?: FactionId,
  outcome?: string
) {
  const playRider = await playRiderFn;
  playRider(gameId, rider, faction, outcome);
}

export async function removeAttachmentAsync(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const removeAttachment = await removeAttachmentFn;
  removeAttachment(gameId, planet, attachment);
}

export async function removeStartingTechAsync(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const removeStartingTech = await removeStartingTechFn;
  removeStartingTech(gameId, faction, techId);
}

export async function removeTechAsync(
  gameId: string,
  faction: FactionId,
  techId: TechId
) {
  const removeTech = await removeTechFn;
  removeTech(gameId, faction, techId);
}

export async function repealAgendaAsync(
  gameId: string,
  agenda: AgendaId,
  target: string
) {
  const repealAgenda = await repealAgendaFn;
  repealAgenda(gameId, agenda, target);
}

export async function resolveAgendaAsync(
  gameId: string,
  agenda: AgendaId,
  target: string
) {
  const resolveAgenda = await resolveAgendaFn;
  resolveAgenda(gameId, agenda, target);
}

export async function revealAgendaAsync(gameId: string, agenda: AgendaId) {
  const revealAgenda = await revealAgendaFn;
  revealAgenda(gameId, agenda);
}

export async function revealObjectiveAsync(
  gameId: string,
  objective: ObjectiveId
) {
  const revealObjective = await revealObjectiveFn;
  revealObjective(gameId, objective);
}

export async function scoreObjectiveAsync(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const scoreObjective = await scoreObjectiveFn;
  scoreObjective(gameId, faction, objective, key);
}

export async function selectActionAsync(gameId: string, action: Action) {
  const selectAction = await selectActionFn;
  selectAction(gameId, action);
}

export async function selectEligibleOutcomesAsync(
  gameId: string,
  outcomes: OutcomeType | "None"
) {
  const selectEligibleOutcomes = await selectEligibleOutcomesFn;
  selectEligibleOutcomes(gameId, outcomes);
}

export async function selectFactionAsync(
  gameId: string,
  faction: FactionId | "None"
) {
  const selectFaction = await selectFactionFn;
  selectFaction(gameId, faction);
}

export async function selectSubAgendaAsync(
  gameId: string,
  subAgenda: AgendaId | "None"
) {
  const selectSubAgenda = await selectSubAgendaFn;
  selectSubAgenda(gameId, subAgenda);
}

export async function selectSubComponentAsync(
  gameId: string,
  subComponent: string
) {
  const selectSubComponent = await selectSubComponentFn;
  selectSubComponent(gameId, subComponent);
}

export async function setGlobalPauseAsync(gameId: string, paused: boolean) {
  const setGlobalPause = await setGlobalPauseFn;
  setGlobalPause(gameId, paused);
}

export async function setSpeakerAsync(gameId: string, newSpeaker: FactionId) {
  const setSpeaker = await setSpeakerFn;
  setSpeaker(gameId, newSpeaker);
}

export async function setObjectivePointsAsync(
  gameId: string,
  objective: string,
  points: number
) {
  const setObjectivePoints = await setObjectivePointsFn;
  setObjectivePoints(gameId, objective, points);
}

export async function speakerTieBreakAsync(gameId: string, tieBreak: string) {
  const speakerTieBreak = await speakerTieBreakFn;
  speakerTieBreak(gameId, tieBreak);
}

export async function startVotingAsync(gameId: string) {
  const startVoting = await startVotingFn;
  startVoting(gameId);
}

export async function swapStrategyCardsAsync(
  gameId: string,
  cardOne: StrategyCardId,
  cardTwo: StrategyCardId,
  imperialArbiter?: boolean
) {
  const swapStrategyCards = await swapStrategyCardsFn;
  swapStrategyCards(gameId, cardOne, cardTwo, imperialArbiter);
}

export async function undoAsync(gameId: string) {
  const undo = await undoFn;
  undo(gameId);
}

export async function unclaimPlanetAsync(
  gameId: string,
  faction: FactionId,
  planet: PlanetId
) {
  const unclaimPlanet = await unclaimPlanetFn;
  unclaimPlanet(gameId, faction, planet);
}

export async function unplayActionCardAsync(
  gameId: string,
  card: string,
  target: FactionId | "None"
) {
  const unplayActionCard = await unplayActionCardFn;
  unplayActionCard(gameId, card, target);
}

export async function unplayComponentAsync(gameId: string, name: string) {
  const unplayComponent = await unplayComponentFn;
  unplayComponent(gameId, name);
}

export async function unplayPromissoryNoteAsync(
  gameId: string,
  card: string,
  target: FactionId
) {
  const unplayPromissoryNote = await unplayPromissoryNoteFn;
  unplayPromissoryNote(gameId, card, target);
}

export async function unplayRelicAsync(gameId: string, event: PlayRelicEvent) {
  const unplayRelic = await unplayRelicFn;
  unplayRelic(gameId, event);
}

export async function unplayRiderAsync(gameId: string, rider: string) {
  const unplayRider = await unplayRiderFn;
  unplayRider(gameId, rider);
}

export async function unselectActionAsync(gameId: string, action: Action) {
  const unselectAction = await unselectActionFn;
  unselectAction(gameId, action);
}

export async function unscoreObjectiveAsync(
  gameId: string,
  faction: FactionId,
  objective: ObjectiveId,
  key?: FactionId
) {
  const unscoreObjective = await unscoreObjectiveFn;
  unscoreObjective(gameId, faction, objective, key);
}

export async function updateLeaderStateAsync(
  gameId: string,
  factionId: FactionId,
  leaderType: LeaderType,
  state: LeaderState
) {
  const updateLeaderState = await updateLeaderStateFn;
  updateLeaderState(gameId, factionId, leaderType, state);
}

export async function updatePlanetStateAsync(
  gameId: string,
  planet: PlanetId,
  state: PlanetState
) {
  const updatePlanetState = await updatePlanetStateFn;
  updatePlanetState(gameId, planet, state);
}
