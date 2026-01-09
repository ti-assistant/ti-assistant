type ActionLogAction =
  | "REPLACE"
  | "DELETE"
  | "IGNORE"
  | "REWIND_AND_DELETE"
  | "REWIND_AND_REPLACE";

interface IHandler<DataType> {
  new (gameData: StoredGameData, data: DataType): Handler;
}

interface Handler {
  gameData: StoredGameData;
  data: GameUpdateData;
  validate(): boolean;
  getUpdates(): Record<string, any>;
  getActionLogAction(entry: ActionLogEntry<GameUpdateData>): ActionLogAction;
  getLogEntry(): ActionLogEntry<GameUpdateData>;
}

type GameUpdateData =
  | (AddTechData | RemoveTechData)
  | (PurgeTechData | UnpurgeTechData)
  | (RevealObjectiveData | HideObjectiveData)
  | (AdvancePhaseData | RewindPhaseData)
  | (AssignStrategyCardData | UnassignStrategyCardData)
  | (ClaimPlanetData | UnclaimPlanetData)
  | (SelectActionData | UnselectActionData)
  | (EndTurnData | UnendTurnData)
  | SetSpeakerData
  | SetTyrantData
  | (MarkSecondaryData | MarkPrimaryData)
  | (ScoreObjectiveData | UnscoreObjectiveData)
  | (SwapStrategyCardsData | UnswapStrategyCardsData)
  | GiftOfPrescienceData
  | (AddAttachmentData | RemoveAttachmentData)
  | (EndGameData | ContinueGameData)
  | ManualVPUpdateData
  | ManualVoteUpdateData
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
  | UpdateBreakthroughStateData
  | SelectFactionData
  | SelectSubComponentData
  | SelectEligibleOutcomesData
  | (PlayRiderData | UnplayRiderData)
  | SelectSubAgendaData
  | SetObjectivePointsData
  | SpeakerTieBreakData
  | StartVotingData
  | (PlayRelicData | UnplayRelicData)
  | (PlayAdjudicatorBaalData | UndoAdjudicatorBaalData)
  | SwapMapTilesData
  | CommitToExpeditionData
  | (GainAllianceData | LoseAllianceData)
  | (PassData | UnpassData)
  | (PurgeSystemData | UnpurgeSystemData)
  | ToggleStructureData
  | (GainTFCardData | LoseTFCardData)
  | ChooseTFFactionData
  | UndoData;

type Secondary = "PENDING" | "DONE" | "SKIPPED";

interface ActionLogEntry<DataType extends GameUpdateData> {
  timestampMillis: number;
  gameSeconds?: number;
  data: DataType;
}

interface BaseData {
  actionCards: Record<ActionCardId, BaseActionCard>;
  agendas: Record<AgendaId, BaseAgenda>;
  attachments: Record<AttachmentId, BaseAttachment>;
  components: Record<ComponentId, BaseComponent | BaseTechComponent>;
  events: Record<EventId, TIEvent>;
  factions: Record<FactionId, BaseFaction>;
  leaders: Record<LeaderId, BaseLeader>;
  objectives: Record<ObjectiveId, BaseObjective>;
  planets: Record<PlanetId, BasePlanet>;
  relics: Record<RelicId, BaseRelic>;
  strategycards: Record<StrategyCardId, StrategyCard>;
  systems: Record<SystemId, BaseSystem>;
  techs: Record<TechId, BaseTech>;

  // Twilight's Fall Specific
  abilities: Record<TFAbilityId, TFBaseAbility>;
  genomes: Record<TFGenomeId, TFBaseGenome>;
  paradigms: Record<TFParadigmId, TFBaseParadigm>;
  upgrades: Record<TFUnitUpgradeId, TFBaseUnitUpgrade>;
}

interface GameData {
  actionCards?: Partial<Record<ActionCardId, ActionCard>>;
  actionLog?: ActionLog;
  agendas?: Partial<Record<AgendaId, Agenda>>;
  attachments?: Partial<Record<AttachmentId, Attachment>>;
  components?: Record<string, Component>;
  expedition?: Expedition;
  factions: Partial<Record<FactionId, Faction>>;
  gameId?: string;
  leaders: Partial<Record<LeaderId, Leader>>;
  objectives?: Partial<Record<ObjectiveId, Objective>>;
  options: Options;
  planets: Partial<Record<PlanetId, Planet>>;
  relics?: Partial<Record<RelicId, Relic>>;
  sequenceNum: number;
  state: GameState;
  strategycards?: Partial<Record<StrategyCardId, StrategyCard>>;
  systems?: Partial<Record<SystemId, System>>;
  techs?: Partial<Record<TechId, Tech>>;
  timers?: Timers;

  // Twilight's Fall Specific
  abilities?: Partial<Record<TFAbilityId, TFAbility>>;
  genomes?: Partial<Record<TFGenomeId, TFGenome>>;
  paradigms?: Partial<Record<TFParadigmId, TFParadigm>>;
  upgrades?: Partial<Record<TFUnitUpgradeId, TFUnitUpgrade>>;

  // If set, prevent the user from making changes.
  viewOnly?: boolean;

  // Synthetic values used for specific use cases.
  allPlanets?: Partial<Record<PlanetId, Planet>>;
}

type ExpeditionId =
  | "actionCards"
  | "influence"
  | "secrets"
  | "techSkip"
  | "tradeGoods"
  | "resources";

type Expedition = Partial<Record<ExpeditionId, FactionId>>;

interface StoredGameData {
  actionCards?: Partial<Record<ActionCardId, GameActionCard>>;
  actionLog?: ActionLog;
  agendas?: Record<string, GameAgenda>;
  attachments?: Partial<Record<AttachmentId, GameAttachment>>;
  components?: Record<string, GameComponent>;
  expedition?: Expedition;
  factions: Partial<Record<FactionId, GameFaction>>;
  leaders?: Partial<Record<LeaderId, GameLeader>>;
  objectives?: Partial<Record<ObjectiveId, GameObjective>>;
  options: Options;
  planets: Partial<Record<PlanetId, GamePlanet>>;
  relics?: Partial<Record<RelicId, GameRelic>>;
  state: GameState;
  strategycards?: Partial<Record<StrategyCardId, GameStrategyCard>>;
  systems?: Partial<Record<SystemId, GameSystem>>;
  techs?: Partial<Record<TechId, GameTech>>;
  timers?: Timers;
  updates?: Record<string, { timestamp: Timestamp }>;
  // Twilight's Fall Specific
  abilities?: Partial<Record<TFAbilityId, TFGameAbility>>;
  genomes?: Partial<Record<TFGenomeId, TFGameGenome>>;
  paradigms?: Partial<Record<TFParadigmId, TFGameParadigm>>;
  upgrades?: Partial<Record<TFUnitUpgradeId, TFGameUnitUpgrade>>;
  // Secrets
  [key: string]: any;
  // Metadata
  lastUpdate?: number;
  sequenceNum: number;
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
  additionalFactions?: FactionId[];
  researchAgreement?: boolean;
  // Tech gained with Share Knowledge is lost at the end of the status phase.
  shareKnowledge?: boolean;
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

interface PurgeTechEvent {
  techId: TechId;
  factionId?: FactionId;
}

interface PurgeTechData {
  action: "PURGE_TECH";
  event: PurgeTechEvent;
}

interface UnpurgeTechData {
  action: "UNPURGE_TECH";
  event: PurgeTechEvent;
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
  extraVotes: number;
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

interface ChooseTFFactionEvent {
  factionId: FactionId;
  subFaction?: FactionId;
  type: "Planet" | "Unit";
}

interface ChooseTFFactionData {
  action: "CHOOSE_TF_FACTION";
  event: ChooseTFFactionEvent;
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
  jumpToPlayer?: FactionId;
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

interface UnpassEvent {
  factionId: FactionId;
}

interface UnpassData {
  action: "UNPASS";
  event: UnpassEvent;
}

interface PassData {
  action: "PASS";
  event: UnpassEvent;
}

interface PurgeSystemEvent {
  systemId: SystemId;
}

interface PurgeSystemData {
  action: "PURGE_SYSTEM";
  event: PurgeSystemEvent;
}

interface UnpurgeSystemData {
  action: "UNPURGE_SYSTEM";
  event: PurgeSystemEvent;
}

interface ToggleStructureEvent {
  planetId: PlanetId;
  structure: "Space Dock" | "PDS";
  change: "Add" | "Remove";
}

interface ToggleStructureData {
  action: "TOGGLE_STRUCTURE";
  event: ToggleStructureEvent;
}

interface GainRelicEvent {
  faction: FactionId;
  relic: RelicId;
  // Used to differentiate when selecting from planets.
  planet?: PlanetId;
}

interface GainRelicData {
  action: "GAIN_RELIC";
  event: GainRelicEvent;
}

type TFCardType = "GENOME" | "PARADIGM" | "UNIT_UPGRADE" | "ABILITY";

interface AbilityEvent {
  type: "ABILITY";
  ability: TFAbilityId;
}

interface GenomeEvent {
  type: "GENOME";
  genome: TFGenomeId;
}

interface ParadigmEvent {
  type: "PARADIGM";
  paradigm: TFParadigmId;
}

interface UpgradeEvent {
  type: "UNIT_UPGRADE";
  upgrade: TFUnitUpgradeId;
}

interface TFCardEvent {
  faction: FactionId;
  prevFaction?: FactionId;
}

interface GainTFCardData {
  action: "GAIN_TF_CARD";
  event: TFCardEvent &
    (AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent);
}

interface LoseTFCardData {
  action: "LOSE_TF_CARD";
  event: TFCardEvent &
    (AbilityEvent | GenomeEvent | ParadigmEvent | UpgradeEvent);
}

interface GainAllianceEvent {
  faction: FactionId;
  fromFaction: FactionId;
  prevFaction?: FactionId;
}

interface LoseAllianceEvent {
  faction: FactionId;
  fromFaction: FactionId;
  prevFaction?: FactionId;
}

interface GainAllianceData {
  action: "GAIN_ALLIANCE";
  event: GainAllianceEvent;
}

interface LoseAllianceData {
  action: "LOSE_ALLIANCE";
  event: LoseAllianceEvent;
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

interface ManualVoteUpdateEvent {
  faction: FactionId;
  votes: number;
}

interface ManualVoteUpdateData {
  action: "MANUAL_VOTE_UPDATE";
  event: ManualVoteUpdateEvent;
}

interface MarkPrimaryEvent {
  completed: boolean;
}

interface MarkPrimaryData {
  action: "MARK_PRIMARY";
  event: MarkPrimaryEvent;
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
  factionId: FactionId;

  // Used in cases that certain actions need to be undone.
  prevFaction?: FactionId;
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
  // Set by server, used to determine turn end information.
  phase?: Phase;
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

type Action = StrategyCardId | "Tactical" | "Component" | "Pass";

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

interface SetTyrantEvent {
  newTyrant?: FactionId;
  // Set by server, used for undo.
  prevTyrant?: FactionId;
}

interface SetTyrantData {
  action: "SET_TYRANT";
  event: SetTyrantEvent;
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

interface UpdateBreakthroughStateEvent {
  factionId: FactionId;
  state: ComponentState;
  prevState?: ComponentState;
}

interface UpdateBreakthroughStateData {
  action: "UPDATE_BREAKTHROUGH_STATE";
  event: UpdateBreakthroughStateEvent;
}

interface UpdateLeaderStateEvent {
  leaderId: LeaderId;
  state: LeaderState;
  prevState?: LeaderState;
}

interface UpdateLeaderStateData {
  action: "UPDATE_LEADER_STATE";
  event: UpdateLeaderStateEvent;
}

type PlanetState = "READIED" | "EXHAUSTED" | "PURGED";

interface UpdatePlanetStateEvent {
  planet: PlanetId;
  state: PlanetState;
  prevState?: PlanetState;
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

type PlayRelicEvent =
  | MawOfWorldsEvent
  | {
      relic: Exclude<RelicId, "Maw of Worlds">;
    };

interface MawOfWorldsEvent {
  relic: "Maw of Worlds";
  tech: TechId;
}

interface PlayRelicData {
  action: "PLAY_RELIC";
  event: PlayRelicEvent;
}

interface UnplayRelicData {
  action: "UNPLAY_RELIC";
  event: PlayRelicEvent;
}

interface AdjudicatorBaalEvent {
  systemId: SystemId;
}

interface PlayAdjudicatorBaalData {
  action: "PLAY_ADJUDICATOR_BAAL";
  event: AdjudicatorBaalEvent;
}

interface UndoAdjudicatorBaalData {
  action: "UNDO_ADJUDICATOR_BAAL";
  event: AdjudicatorBaalEvent;
}

interface SwapMapTilesEvent {
  oldItem: {
    systemNumber: string;
    index: number;
  };
  newItem: {
    systemNumber: string;
    index: number;
  };
}

interface SwapMapTilesData {
  action: "SWAP_MAP_TILES";
  event: SwapMapTilesEvent;
}

interface CommitToExpeditionEvent {
  factionId?: FactionId;
  expedition: keyof Expedition;
  prevFaction?: FactionId; // Used to undo.
}

interface CommitToExpeditionData {
  action: "COMMIT_TO_EXPEDITION";
  event: CommitToExpeditionEvent;
}
