import { Optional } from "../types/types";

export const Events = {
  AddAttachmentEvent,
  AddTechEvent,
  AdvancePhaseEvent,
  AssignStrategyCardEvent,
  CastVotesEvent,
  ChooseStartingTechEvent,
  ChooseSubFactionEvent,
  ChooseTFFactionEvent,
  ClaimPlanetEvent,
  CommitToExpeditionEvent,
  ContinueGameEvent,
  EndGameEvent,
  EndTurnEvent,
  GainAllianceEvent,
  GainRelicEvent,
  GainTFCardEvent,
  GiftOfPrescienceEvent,
  HideAgendaEvent,
  HideObjectiveEvent,
  LoseAllianceEvent,
  LoseRelicEvent,
  LoseTFCardEvent,
  ManualCCUpdateEvent,
  ManualVoteUpdateEvent,
  ManualVPUpdateEvent,
  MarkPrimaryEvent,
  MarkSecondaryEvent,
  PlayActionCardEvent,
  PlayAdjudicatorBaalEvent,
  PlayPromissoryNoteEvent,
  PlayRiderEvent,
  PurgeSystemEvent,
  PurgeTechEvent,
  RemoveAttachmentEvent,
  RemoveStartingTechEvent,
  RemoveTechEvent,
  RepealAgendaEvent,
  ResolveAgendaEvent,
  RevealAgendaEvent,
  RevealObjectiveEvent,
  ScoreObjectiveEvent,
  SelectActionEvent,
  SelectEligibleOutcomesEvent,
  SelectFactionEvent,
  SelectSubAgendaEvent,
  SelectSubComponentEvent,
  SetObjectivePointsEvent,
  SetSpeakerEvent,
  SetTyrantEvent,
  SpeakerTieBreakEvent,
  StartVotingEvent,
  SwapMapTilesEvent,
  SwapStrategyCardsEvent,
  ToggleStructureEvent,
  UnclaimPlanetEvent,
  UndoAdjudicatorBaalEvent,
  UnpassEvent,
  UnplayActionCardEvent,
  UnplayPromissoryNoteEvent,
  UnplayRiderEvent,
  UnpurgeSystemEvent,
  UnpurgeTechEvent,
  UnscoreObjectiveEvent,
  UnselectActionEvent,
  UpdateBreakthroughStateEvent,
  UpdateLeaderStateEvent,
  UpdatePlanetStateEvent,
} as const;

function AddAttachmentEvent(
  planetId: PlanetId,
  attachmentId: AttachmentId,
): AddAttachmentData {
  return {
    action: "ADD_ATTACHMENT",
    event: {
      attachment: attachmentId,
      planet: planetId,
    },
  };
}

function AddTechEvent(
  factionId: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[],
  researchAgreement?: boolean,
  shareKnowledge?: boolean,
): AddTechData {
  return {
    action: "ADD_TECH",
    event: {
      faction: factionId,
      additionalFactions,
      tech: techId,
      researchAgreement,
      shareKnowledge,
    },
  };
}

function AdvancePhaseEvent(skipAgenda?: boolean): AdvancePhaseData {
  return {
    action: "ADVANCE_PHASE",
    event: {
      skipAgenda: !!skipAgenda,
    },
  };
}

function AssignStrategyCardEvent(
  assignedTo: FactionId,
  cardId: StrategyCardId,
  pickedBy: FactionId,
): AssignStrategyCardData {
  return {
    action: "ASSIGN_STRATEGY_CARD",
    event: {
      assignedTo,
      id: cardId,
      pickedBy,
    },
  };
}

function CastVotesEvent(
  factionId: FactionId,
  votes: number,
  extraVotes: number,
  target?: string,
): CastVotesData {
  return {
    action: "CAST_VOTES",
    event: {
      faction: factionId,
      votes,
      extraVotes,
      target,
    },
  };
}

function ChooseStartingTechEvent(
  factionId: FactionId,
  techId: TechId,
): ChooseStartingTechData {
  return {
    action: "CHOOSE_STARTING_TECH",
    event: {
      faction: factionId,
      tech: techId,
    },
  };
}

function ChooseSubFactionEvent(
  factionId: "Council Keleres",
  subFactionId: SubFaction,
): ChooseSubFactionData {
  return {
    action: "CHOOSE_SUB_FACTION",
    event: {
      faction: factionId,
      subFaction: subFactionId,
    },
  };
}

function ChooseTFFactionEvent(
  factionId: FactionId,
  subFactionId: Optional<FactionId>,
  type: "Unit" | "Planet",
): ChooseTFFactionData {
  return {
    action: "CHOOSE_TF_FACTION",
    event: {
      factionId,
      subFaction: subFactionId,
      type,
    },
  };
}

function ClaimPlanetEvent(
  factionId: FactionId,
  planetId: PlanetId,
): ClaimPlanetData {
  return {
    action: "CLAIM_PLANET",
    event: {
      faction: factionId,
      planet: planetId,
    },
  };
}

function CommitToExpeditionEvent(
  expedition: keyof Expedition,
  factionId: Optional<FactionId>,
): CommitToExpeditionData {
  return {
    action: "COMMIT_TO_EXPEDITION",
    event: {
      expedition,
      factionId,
    },
  };
}

function ContinueGameEvent(): ContinueGameData {
  return {
    action: "CONTINUE_GAME",
    event: {},
  };
}

function EndGameEvent(): EndGameData {
  return {
    action: "END_GAME",
    event: {},
  };
}

function EndTurnEvent(
  samePlayer?: boolean,
  jumpToPlayer?: FactionId,
): EndTurnData {
  return {
    action: "END_TURN",
    event: {
      samePlayer,
      jumpToPlayer,
    },
  };
}

function GainAllianceEvent(
  factionId: FactionId,
  fromFactionId: FactionId,
): GainAllianceData {
  return {
    action: "GAIN_ALLIANCE",
    event: {
      faction: factionId,
      fromFaction: fromFactionId,
    },
  };
}

function GainRelicEvent(
  factionId: FactionId,
  relicId: RelicId,
  planetId?: PlanetId,
): GainRelicData {
  return {
    action: "GAIN_RELIC",
    event: {
      faction: factionId,
      relic: relicId,
      planet: planetId,
    },
  };
}

function GainTFCardEvent(
  faction: FactionId,
  event: AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent,
): GainTFCardData {
  return {
    action: "GAIN_TF_CARD",
    event: {
      faction,
      ...event,
    },
  };
}

function GiftOfPrescienceEvent(factionId: FactionId): GiftOfPrescienceData {
  return {
    action: "GIFT_OF_PRESCIENCE",
    event: {
      faction: factionId,
    },
  };
}

function HideAgendaEvent(agendaId: AgendaId, veto?: boolean): HideAgendaData {
  return {
    action: "HIDE_AGENDA",
    event: {
      agenda: agendaId,
      veto,
    },
  };
}

function HideObjectiveEvent(objectiveId: ObjectiveId): HideObjectiveData {
  return {
    action: "HIDE_OBJECTIVE",
    event: {
      objective: objectiveId,
    },
  };
}

function LoseAllianceEvent(
  factionId: FactionId,
  fromFactionId: FactionId,
): LoseAllianceData {
  return {
    action: "LOSE_ALLIANCE",
    event: {
      faction: factionId,
      fromFaction: fromFactionId,
    },
  };
}

function LoseRelicEvent(
  factionId: FactionId,
  relicId: RelicId,
  planetId?: PlanetId,
): LoseRelicData {
  return {
    action: "LOSE_RELIC",
    event: {
      faction: factionId,
      relic: relicId,
      planet: planetId,
    },
  };
}

function LoseTFCardEvent(
  faction: FactionId,
  event: AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent,
): LoseTFCardData {
  return {
    action: "LOSE_TF_CARD",
    event: {
      faction,
      ...event,
    },
  };
}

function ManualCCUpdateEvent(
  factionId: FactionId,
  commandCounters: number,
): ManualCCUpdateData {
  return {
    action: "MANUAL_CC_UPDATE",
    event: {
      faction: factionId,
      commandCounters,
    },
  };
}

function ManualVoteUpdateEvent(
  factionId: FactionId,
  votes: number,
): ManualVoteUpdateData {
  return {
    action: "MANUAL_VOTE_UPDATE",
    event: {
      faction: factionId,
      votes,
    },
  };
}

function ManualVPUpdateEvent(
  factionId: FactionId,
  vps: number,
): ManualVPUpdateData {
  return {
    action: "MANUAL_VP_UPDATE",
    event: {
      faction: factionId,
      vps,
    },
  };
}

function MarkPrimaryEvent(completed: boolean): MarkPrimaryData {
  return {
    action: "MARK_PRIMARY",
    event: {
      completed,
    },
  };
}

function MarkSecondaryEvent(
  factionId: FactionId,
  secondary: Secondary,
): MarkSecondaryData {
  return {
    action: "MARK_SECONDARY",
    event: {
      faction: factionId,
      state: secondary,
    },
  };
}

function PlayActionCardEvent(
  card: string,
  target: FactionId | "None",
): PlayActionCardData {
  return {
    action: "PLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };
}

function PlayAdjudicatorBaalEvent(systemId: SystemId): PlayAdjudicatorBaalData {
  return {
    action: "PLAY_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };
}

function PlayPromissoryNoteEvent(
  card: string,
  target: FactionId,
): PlayPromissoryNoteData {
  return {
    action: "PLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };
}

function PlayRiderEvent(
  rider: string,
  factionId?: FactionId,
  outcome?: string,
): PlayRiderData {
  return {
    action: "PLAY_RIDER",
    event: {
      rider,
      faction: factionId,
      outcome,
    },
  };
}

function PurgeSystemEvent(systemId: SystemId): PurgeSystemData {
  return {
    action: "PURGE_SYSTEM",
    event: {
      systemId,
    },
  };
}

function PurgeTechEvent(techId: TechId, factionId?: FactionId): PurgeTechData {
  return {
    action: "PURGE_TECH",
    event: {
      techId,
      factionId,
    },
  };
}

function RemoveAttachmentEvent(
  planetId: PlanetId,
  attachmentId: AttachmentId,
): RemoveAttachmentData {
  return {
    action: "REMOVE_ATTACHMENT",
    event: {
      attachment: attachmentId,
      planet: planetId,
    },
  };
}

function RemoveStartingTechEvent(
  factionId: FactionId,
  techId: TechId,
): RemoveStartingTechData {
  return {
    action: "REMOVE_STARTING_TECH",
    event: {
      faction: factionId,
      tech: techId,
    },
  };
}

function RemoveTechEvent(
  factionId: FactionId,
  techId: TechId,
  additionalFactions?: FactionId[],
): RemoveTechData {
  return {
    action: "REMOVE_TECH",
    event: {
      faction: factionId,
      additionalFactions,
      tech: techId,
    },
  };
}

function RepealAgendaEvent(
  agendaId: AgendaId,
  target: string,
): RepealAgendaData {
  return {
    action: "REPEAL_AGENDA",
    event: {
      agenda: agendaId,
      target,
    },
  };
}

function ResolveAgendaEvent(
  agendaId: AgendaId,
  target: string,
): ResolveAgendaData {
  return {
    action: "RESOLVE_AGENDA",
    event: {
      agenda: agendaId,
      target,
    },
  };
}

function RevealAgendaEvent(agendaId: AgendaId): RevealAgendaData {
  return {
    action: "REVEAL_AGENDA",
    event: {
      agenda: agendaId,
    },
  };
}

function RevealObjectiveEvent(objectiveId: ObjectiveId): RevealObjectiveData {
  return {
    action: "REVEAL_OBJECTIVE",
    event: {
      objective: objectiveId,
    },
  };
}

function ScoreObjectiveEvent(
  factionId: FactionId,
  objectiveId: ObjectiveId,
  key?: FactionId,
): ScoreObjectiveData {
  return {
    action: "SCORE_OBJECTIVE",
    event: {
      faction: factionId,
      objective: objectiveId,
      key,
    },
  };
}

function SelectActionEvent(action: Action): SelectActionData {
  return {
    action: "SELECT_ACTION",
    event: {
      action,
    },
  };
}

function SelectEligibleOutcomesEvent(
  outcomes: OutcomeType | "None",
): SelectEligibleOutcomesData {
  return {
    action: "SELECT_ELIGIBLE_OUTCOMES",
    event: {
      outcomes,
    },
  };
}

function SelectFactionEvent(factionId: FactionId | "None"): SelectFactionData {
  return {
    action: "SELECT_FACTION",
    event: {
      faction: factionId,
    },
  };
}

function SelectSubAgendaEvent(
  subAgenda: AgendaId | "None",
): SelectSubAgendaData {
  return {
    action: "SELECT_SUB_AGENDA",
    event: {
      subAgenda,
    },
  };
}

function SelectSubComponentEvent(subComponent: string): SelectSubComponentData {
  return {
    action: "SELECT_SUB_COMPONENT",
    event: {
      subComponent,
    },
  };
}

function SetObjectivePointsEvent(
  objectiveId: ObjectiveId,
  points: number,
): SetObjectivePointsData {
  return {
    action: "SET_OBJECTIVE_POINTS",
    event: {
      objective: objectiveId,
      points,
    },
  };
}

function SetSpeakerEvent(newSpeaker: FactionId): SetSpeakerData {
  return {
    action: "SET_SPEAKER",
    event: {
      newSpeaker,
    },
  };
}

function SetTyrantEvent(newTyrant: Optional<FactionId>): SetTyrantData {
  return {
    action: "SET_TYRANT",
    event: {
      newTyrant,
    },
  };
}

function SpeakerTieBreakEvent(tieBreak: string): SpeakerTieBreakData {
  return {
    action: "SPEAKER_TIE_BREAK",
    event: {
      tieBreak,
    },
  };
}

function StartVotingEvent(): StartVotingData {
  return {
    action: "START_VOTING",
    event: {},
  };
}

function SwapMapTilesEvent(
  oldItem: {
    systemNumber: string;
    index: number;
  },
  newItem: {
    systemNumber: string;
    index: number;
  },
): SwapMapTilesData {
  return {
    action: "SWAP_MAP_TILES",
    event: {
      oldItem,
      newItem,
    },
  };
}

function SwapStrategyCardsEvent(
  cardOne: StrategyCardId,
  cardTwo: StrategyCardId,
  imperialArbiter?: boolean,
): SwapStrategyCardsData {
  return {
    action: "SWAP_STRATEGY_CARDS",
    event: {
      cardOne,
      cardTwo,
      imperialArbiter,
    },
  };
}

function ToggleStructureEvent(
  planetId: PlanetId,
  structure: "Space Dock" | "PDS",
  change: "Add" | "Remove",
): ToggleStructureData {
  return {
    action: "TOGGLE_STRUCTURE",
    event: {
      planetId,
      structure,
      change,
    },
  };
}

function UnclaimPlanetEvent(
  factionId: FactionId,
  planetId: PlanetId,
): UnclaimPlanetData {
  return {
    action: "UNCLAIM_PLANET",
    event: {
      faction: factionId,
      planet: planetId,
    },
  };
}

function UndoAdjudicatorBaalEvent(systemId: SystemId): UndoAdjudicatorBaalData {
  return {
    action: "UNDO_ADJUDICATOR_BAAL",
    event: {
      systemId,
    },
  };
}

function UnpassEvent(factionId: FactionId): UnpassData {
  return {
    action: "UNPASS",
    event: {
      factionId,
    },
  };
}

function UnplayActionCardEvent(
  card: string,
  target: FactionId | "None",
): UnplayActionCardData {
  return {
    action: "UNPLAY_ACTION_CARD",
    event: {
      card,
      target,
    },
  };
}

function UnplayPromissoryNoteEvent(
  card: string,
  target: FactionId,
): UnplayPromissoryNoteData {
  return {
    action: "UNPLAY_PROMISSORY_NOTE",
    event: {
      card,
      target,
    },
  };
}

function UnplayRiderEvent(rider: string): UnplayRiderData {
  return {
    action: "UNPLAY_RIDER",
    event: {
      rider,
    },
  };
}

function UnpurgeSystemEvent(systemId: SystemId): UnpurgeSystemData {
  return {
    action: "UNPURGE_SYSTEM",
    event: {
      systemId,
    },
  };
}

function UnpurgeTechEvent(
  techId: TechId,
  factionId?: FactionId,
): UnpurgeTechData {
  return {
    action: "UNPURGE_TECH",
    event: {
      techId,
      factionId,
    },
  };
}

function UnscoreObjectiveEvent(
  factionId: FactionId,
  objectiveId: ObjectiveId,
  key?: FactionId,
): UnscoreObjectiveData {
  return {
    action: "UNSCORE_OBJECTIVE",
    event: {
      faction: factionId,
      objective: objectiveId,
      key,
    },
  };
}

function UnselectActionEvent(action: Action): UnselectActionData {
  return {
    action: "UNSELECT_ACTION",
    event: {
      action,
    },
  };
}

function UpdateBreakthroughStateEvent(
  factionId: FactionId,
  state: ComponentState,
): UpdateBreakthroughStateData {
  return {
    action: "UPDATE_BREAKTHROUGH_STATE",
    event: {
      factionId,
      state,
    },
  };
}

function UpdateLeaderStateEvent(
  leaderId: LeaderId,
  state: LeaderState,
): UpdateLeaderStateData {
  return {
    action: "UPDATE_LEADER_STATE",
    event: {
      leaderId,
      state,
    },
  };
}

function UpdatePlanetStateEvent(
  planet: PlanetId,
  state: PlanetState,
): UpdatePlanetStateData {
  return {
    action: "UPDATE_PLANET_STATE",
    event: {
      planet,
      state,
    },
  };
}
