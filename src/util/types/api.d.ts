type ActionLogAction =
  | "REPLACE"
  | "DELETE"
  | "IGNORE"
  | "REWIND_AND_DELETE"
  | "REWIND_AND_REPLACE";

interface Handler {
  gameData: StoredGameData;
  data: GameUpdateData;
  validate(): boolean;
  getUpdates(): Record<string, any>;
  getActionLogAction(entry: ActionLogEntry): ActionLogAction;
  getLogEntry(): ActionLogEntry;
}

type GameUpdateData =
  | (AddTechData | RemoveTechData)
  | (RevealObjectiveData | HideObjectiveData)
  | (AdvancePhaseData | RewindPhaseData)
  | (AssignStrategyCardData | UnassignStrategyCardData)
  | (ClaimPlanetData | UnclaimPlanetData)
  | (SelectActionData | UnselectActionData)
  | (EndTurnData | UnendTurnData)
  | SetSpeakerData
  | MarkSecondaryData
  | (ScoreObjectiveData | UnscoreObjectiveData)
  | (SwapStrategyCardsData | UnswapStrategyCardsData)
  | GiftOfPrescienceData
  | (AddAttachmentData | RemoveAttachmentData)
  | (EndGameData | ContinueGameData)
  | ManualVPUpdateData
  | (RevealAgendaData | HideAgendaData)
  | CastVotesData
  | (ResolveAgendaData | RepealAgendaData)
  | (ChooseStartingTechData | RemoveStartingTechData)
  | ChooseSubFactionData
  | (PlayActionCardData | UnplayActionCardData)
  | (PlayPromissoryNoteData | UnplayPromissoryNoteData)
  | (PlayComponentData | UnplayComponentData)
  | (GainRelicData | LoseRelicData)
  | UpdatePlanetStateData
  | UpdateLeaderStateData
  | SelectFactionData
  | SelectSubComponentData
  | SelectEligibleOutcomesData
  | (PlayRiderData | UnplayRiderData)
  | SelectSubAgendaData
  | SetObjectivePointsData
  | SpeakerTieBreakData
  | StartVotingData
  // TODO
  | UndoData;

type Secondary = "PENDING" | "DONE" | "SKIPPED";

interface ActionLogEntry {
  timestampMillis: number;
  gameSeconds?: number;
  data: GameUpdateData;
}

interface BaseData {
  agendas: Record<AgendaId, BaseAgenda>;
  attachments: Record<AttachmentId, BaseAttachment>;
  components: Record<ComponentId, BaseComponent | BaseTechComponent>;
  factions: Record<FactionId, BaseFaction>;
  leaders: Record<LeaderId, BaseLeader>;
  objectives: Record<ObjectiveId, BaseObjective>;
  planets: Record<PlanetId, BasePlanet>;
  relics: Record<RelicId, BaseRelic>;
  strategycards: Record<StrategyCardId, StrategyCard>;
  systems: Record<SystemId, BaseSystem>;
  techs: Record<TechId, BaseTech>;
}

interface GameData {
  actionLog?: ActionLogEntry[];
  agendas?: Partial<Record<AgendaId, Agenda>>;
  attachments?: Partial<Record<AttachmentId, Attachment>>;
  components?: Record<string, Component>;
  factions: Partial<Record<FactionId, Faction>>;
  objectives?: Partial<Record<ObjectiveId, Objective>>;
  options: Options;
  planets: Partial<Record<PlanetId, Planet>>;
  relics?: Partial<Record<RelicId, Relic>>;
  state: GameState;
  strategycards?: Partial<Record<StrategyCardId, StrategyCard>>;
  systems?: Partial<Record<SystemId, System>>;
  techs?: Partial<Record<TechId, Tech>>;
}

interface StoredGameData {
  actionLog?: ActionLogEntry[];
  agendas?: Record<string, GameAgenda>;
  attachments?: Partial<Record<AttachmentId, GameAttachment>>;
  components?: Record<string, GameComponent>;
  factions: Partial<Record<FactionId, GameFaction>>;
  objectives?: Record<string, GameObjective>;
  options: Options;
  planets: Partial<Record<PlanetId, GamePlanet>>;
  relics?: Partial<Record<RelicId, GameRelic>>;
  state: GameState;
  strategycards?: Partial<Record<StrategyCardId, GameStrategyCard>>;
  systems?: Partial<Record<SystemId, GameSystem>>;
  updates?: Record<string, { timestamp: Timestamp }>;
  // Secrets
  [key: string]: any;
}

interface AddAttachmentEvent {
  attachment: AttachmentId;
  planet: PlanetId;
  // Set by server
  prevPlanet?: PlanetId;
}

interface AddAttachmentData {
  action: "ADD_ATTACHMENT";
  event: AddAttachmentEvent;
}

interface RemoveAttachmentData {
  action: "REMOVE_ATTACHMENT";
  event: AddAttachmentEvent;
}

interface AddTechEvent {
  faction: FactionId;
  tech: TechId;
}

interface AddTechData {
  action: "ADD_TECH";
  event: AddTechEvent;
}

interface RemoveTechData {
  action: "REMOVE_TECH";
  event: AddTechEvent;
}

interface AdvancePhaseEvent {
  skipAgenda: boolean;
  // Set by server, used for Undo.
  factions?: Record<string, GameFaction>;
  state?: GameState;
  strategycards?: Record<string, GameStrategyCard>;
  timers?: Timers;
}

interface AdvancePhaseData {
  action: "ADVANCE_PHASE";
  event: AdvancePhaseEvent;
}

interface RewindPhaseData {
  action: "REWIND_PHASE";
  event: AdvancePhaseEvent;
}

interface AssignStrategyCardEvent {
  assignedTo: FactionId;
  id: StrategyCardId;
  pickedBy: FactionId;
}

interface AssignStrategyCardData {
  action: "ASSIGN_STRATEGY_CARD";
  event: AssignStrategyCardEvent;
}

interface UnassignStrategyCardData {
  action: "UNASSIGN_STRATEGY_CARD";
  event: AssignStrategyCardEvent;
}

interface CastVotesEvent {
  faction: FactionId;
  target?: string;
  votes: number;
}

interface CastVotesData {
  action: "CAST_VOTES";
  event: CastVotesEvent;
}

interface ChooseStartingTechEvent {
  faction: FactionId;
  tech: TechId;
}

interface ChooseStartingTechData {
  action: "CHOOSE_STARTING_TECH";
  event: ChooseStartingTechEvent;
}

interface RemoveStartingTechData {
  action: "REMOVE_STARTING_TECH";
  event: ChooseStartingTechEvent;
}

interface ChooseSubFactionEvent {
  faction: "Council Keleres";
  subFaction: SubFaction;
}

interface ChooseSubFactionData {
  action: "CHOOSE_SUB_FACTION";
  event: ChooseSubFactionEvent;
}

interface ClaimPlanetEvent {
  faction: FactionId;
  planet: PlanetId;
  // Set by server
  prevOwner?: FactionId;
}

interface ClaimPlanetData {
  action: "CLAIM_PLANET";
  event: ClaimPlanetEvent;
}

interface UnclaimPlanetData {
  action: "UNCLAIM_PLANET";
  event: ClaimPlanetEvent;
}

interface EndGameEvent {}

interface EndGameData {
  action: "END_GAME";
  event: EndGameEvent;
}

interface ContinueGameData {
  action: "CONTINUE_GAME";
  event: EndGameEvent;
}

interface EndTurnEvent {
  samePlayer?: boolean;
  // Set by server
  prevFaction?: string;
  selectedAction?: string;
  secondaries?: Record<string, Secondary>;
}

interface EndTurnData {
  action: "END_TURN";
  event: EndTurnEvent;
}

interface UnendTurnData {
  action: "UNEND_TURN";
  event: EndTurnEvent;
}

interface GainRelicEvent {
  faction: FactionId;
  relic: RelicId;
}

interface GainRelicData {
  action: "GAIN_RELIC";
  event: GainRelicEvent;
}

interface LoseRelicData {
  action: "LOSE_RELIC";
  event: GainRelicEvent;
}

interface GiftOfPrescienceEvent {
  faction: FactionId;
}

interface GiftOfPrescienceData {
  action: "GIFT_OF_PRESCIENCE";
  event: GiftOfPrescienceEvent;
}

interface ManualVPUpdateEvent {
  faction: FactionId;
  vps: number;
}

interface ManualVPUpdateData {
  action: "MANUAL_VP_UPDATE";
  event: ManualVPUpdateEvent;
}

interface MarkSecondaryEvent {
  faction: FactionId;
  state: Secondary;
}

interface MarkSecondaryData {
  action: "MARK_SECONDARY";
  event: MarkSecondaryEvent;
}

interface PlayActionCardEvent {
  card: string;
  // The player that played the card, or the target of the card.
  target: FactionId | "None";
}

interface PlayActionCardData {
  action: "PLAY_ACTION_CARD";
  event: PlayActionCardEvent;
}

interface UnplayActionCardData {
  action: "UNPLAY_ACTION_CARD";
  event: PlayActionCardEvent;
}

interface PlayComponentEvent {
  name: string;
}

interface PlayComponentData {
  action: "PLAY_COMPONENT";
  event: PlayComponentEvent;
}

interface UnplayComponentData {
  action: "UNPLAY_COMPONENT";
  event: PlayComponentEvent;
}

interface PlayPromissoryNoteEvent {
  card: string;
  // The player that played the card, or the target of the card.
  target: FactionId;
}

interface PlayPromissoryNoteData {
  action: "PLAY_PROMISSORY_NOTE";
  event: PlayPromissoryNoteEvent;
}

interface UnplayPromissoryNoteData {
  action: "UNPLAY_PROMISSORY_NOTE";
  event: PlayPromissoryNoteEvent;
}

interface PlayRiderEvent {
  rider: string;

  faction?: FactionId;
  outcome?: string;
}

interface PlayRiderData {
  action: "PLAY_RIDER";
  event: PlayRiderEvent;
}

interface UnplayRiderData {
  action: "UNPLAY_RIDER";
  event: PlayRiderEvent;
}

interface ResolveAgendaEvent {
  agenda: AgendaId;
  target: string; // Consider computing this?
  resolvedBy?: string;

  // Set by server, used to undo Politics Rider.
  prevSpeaker?: FactionId;
}

interface RepealAgendaEvent {
  agenda: AgendaId;
  target: string; // Consider computing this?
  repealedBy?: string;
  prevSpeaker?: FactionId;
}

interface ResolveAgendaData {
  action: "RESOLVE_AGENDA";
  event: ResolveAgendaEvent;
}

interface RepealAgendaData {
  action: "REPEAL_AGENDA";
  event: RepealAgendaEvent;
}

interface RevealAgendaEvent {
  agenda: AgendaId;
  veto?: boolean;
}

interface RevealAgendaData {
  action: "REVEAL_AGENDA";
  event: RevealAgendaEvent;
}

interface HideAgendaData {
  action: "HIDE_AGENDA";
  event: RevealAgendaEvent;
}

interface RevealObjectiveEvent {
  objective: ObjectiveId;
}

interface RevealObjectiveData {
  action: "REVEAL_OBJECTIVE";
  event: RevealObjectiveEvent;
}

interface HideObjectiveData {
  action: "HIDE_OBJECTIVE";
  event: RevealObjectiveEvent;
}

interface ScoreObjectiveEvent {
  faction: FactionId;
  objective: ObjectiveId;
  key?: FactionId;
}

interface ScoreObjectiveData {
  action: "SCORE_OBJECTIVE";
  event: ScoreObjectiveEvent;
}

interface UnscoreObjectiveData {
  action: "UNSCORE_OBJECTIVE";
  event: ScoreObjectiveEvent;
}

type Action = StrategyCardName | "Tactical" | "Component" | "Pass";

interface SelectActionEvent {
  action: Action;
}

interface SelectActionData {
  action: "SELECT_ACTION";
  event: SelectActionEvent;
}

interface UnselectActionData {
  action: "UNSELECT_ACTION";
  event: SelectActionEvent;
}

interface SelectEligibleOutcomesEvent {
  outcomes: OutcomeType | "None";
}

interface SelectEligibleOutcomesData {
  action: "SELECT_ELIGIBLE_OUTCOMES";
  event: SelectEligibleOutcomesEvent;
}

interface SelectFactionEvent {
  faction: FactionId | "None";
}

interface SelectFactionData {
  action: "SELECT_FACTION";
  event: SelectFactionEvent;
}

interface SelectSubAgendaEvent {
  subAgenda: AgendaId | "None";
}

interface SelectSubAgendaData {
  action: "SELECT_SUB_AGENDA";
  event: SelectSubAgendaEvent;
}

interface SelectSubComponentEvent {
  subComponent: string;
}

interface SelectSubComponentData {
  action: "SELECT_SUB_COMPONENT";
  event: SelectSubComponentEvent;
}

interface SetObjectivePointsEvent {
  objective: string;
  points: number;
}

interface SetObjectivePointsData {
  action: "SET_OBJECTIVE_POINTS";
  event: SetObjectivePointsEvent;
}

interface SetSpeakerEvent {
  newSpeaker: FactionId;
  // Set by server, used for undo.
  prevSpeaker?: FactionId;
}

interface SetSpeakerData {
  action: "SET_SPEAKER";
  event: SetSpeakerEvent;
}

interface SpeakerTieBreakEvent {
  tieBreak: string;
}

interface SpeakerTieBreakData {
  action: "SPEAKER_TIE_BREAK";
  event: SpeakerTieBreakEvent;
}

interface SwapStrategyCardsEvent {
  cardOne: StrategyCardId;
  cardTwo: StrategyCardId;
  imperialArbiter?: boolean;
}

interface SwapStrategyCardsData {
  action: "SWAP_STRATEGY_CARDS";
  event: SwapStrategyCardsEvent;
}

interface UnswapStrategyCardsData {
  action: "UNSWAP_STRATEGY_CARDS";
  event: SwapStrategyCardsEvent;
}

interface UpdateLeaderStateEvent {
  factionId: FactionId;
  leaderType: LeaderType;
  state: LeaderState;
}

interface UpdateLeaderStateData {
  action: "UPDATE_LEADER_STATE";
  event: UpdateLeaderStateEvent;
}

type PlanetState = "READIED" | "EXHAUSTED" | "PURGED";

interface UpdatePlanetStateEvent {
  planet: PlanetId;
  state: PlanetState;
}

interface UpdatePlanetStateData {
  action: "UPDATE_PLANET_STATE";
  event: UpdatePlanetStateEvent;
}

interface StartVotingEvent {}

interface StartVotingData {
  action: "START_VOTING";
  event: StartVotingEvent;
}
