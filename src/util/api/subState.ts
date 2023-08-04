import { GameStrategyCard, StrategyCardName } from "./cards";
import { GameState } from "./state";
import { GameFaction } from "./factions";
import { Timers } from "./timers";

export type Secondary = "PENDING" | "DONE" | "SKIPPED";

export type SubStateUpdateAction =
  | "CLEAR_SUB_STATE"
  | "SET_ACTION"
  | "SELECT_COMPONENT"
  | "SET_SPEAKER"
  | "UNDO_SPEAKER"
  | "ADD_TECH"
  | "CLEAR_ADDED_TECH"
  | "REMOVE_TECH"
  | "CLEAR_REMOVED_TECH"
  | "ADD_PLANET"
  | "REMOVE_PLANET"
  | "DESTROY_PLANET"
  | "TOGGLE_ATTACHMENT"
  | "SCORE_OBJECTIVE"
  | "UNSCORE_OBJECTIVE"
  | "CAST_VOTES"
  | "REVEAL_OBJECTIVE"
  | "HIDE_OBJECTIVE"
  | "REVEAL_AGENDA"
  | "HIDE_AGENDA"
  | "REPEAL_AGENDA"
  | "REMOVE_REPEALED_AGENDA"
  | "PICK_STRATEGY_CARD"
  | "UNDO_STRATEGY_CARD"
  | "SWAP_STRATEGY_CARDS"
  | "PLAY_RIDER"
  | "UNDO_RIDER"
  | "TOGGLE_RELIC"
  | "MARK_SECONDARY"
  | "TOGGLE_POLITICAL_SECRET"
  | "SET_OTHER_FIELD"
  | "SET_COMPONENT_DETAILS"
  | "FINALIZE_SUB_STATE";

export interface AdvancePhaseEvent {
  skipAgenda: boolean;
  // Set by server, used for Undo.
  factions?: Record<string, GameFaction>;
  state?: GameState;
  strategycards?: Record<string, GameStrategyCard>;
  timers?: Timers;
}

export interface AssignStrategyCardEvent {
  assignedTo: string;
  name: StrategyCardName;
  pickedBy: string;
}

export interface SetSpeakerEvent {
  newSpeaker: string;
  // Set by server, used for Undo.
  prevSpeaker?: string;
}

export type Action = StrategyCardName | "Tactical" | "Component" | "Pass";

export interface TurnData {
  selectedAction?: Action;
  factions?: Record<string, SubStateFaction>;
  speaker?: string;
  component?: {
    name: string;
    selectedFaction?: string;
    factions?: Record<string, SubStateFaction>;
    [key: string]: any;
  };
  destroyedPlanet?: PlanetEvent;
  attachments?: Record<string, string>;
}

export interface SubStateUpdateData {
  action?: SubStateUpdateAction;
  actionName?: Action;
  add?: boolean;
  agendaName?: string;
  attachmentName?: string;
  cardEvent?: AssignStrategyCardEvent;
  cardName?: StrategyCardName;
  cardOneName?: StrategyCardName;
  cardTwoName?: StrategyCardName;
  componentName?: string;
  factionName?: string;
  fieldName?: string;
  numVotes?: number;
  objectiveName?: string;
  outcome?: string;
  planetName?: string;
  prevOwner?: string;
  relicName?: string;
  secondary?: Secondary;
  riderName?: string;
  target?: string;
  techName?: string;
  timestamp?: number;
  value?: any;
}

export interface RelicEvent {
  name: string;
  prevOwner?: string;
}

export interface PlanetEvent {
  planet: string;
  prevOwner?: string;
}

export interface SubStateFaction {
  secondary?: Secondary;
  objectives?: string[];
  planets?: PlanetEvent[];
  relic?: RelicEvent;
  removeTechs?: string[];
  target?: string;
  techs?: string[];
  votes?: number;
  politicalSecret?: boolean;
}

export interface SubState {
  agenda?: string;
  component?: string;
  speaker?: string;
  factions?: Record<string, SubStateFaction>;
  objectives?: string[];
  tieBreak?: string;
  overwrite?: string;
  outcome?: string;
  repealedAgenda?: string;
  subAgenda?: string;
  strategyCards?: AssignStrategyCardEvent[];
  turnData?: TurnData;
  riders?: Record<
    string,
    {
      factionName?: string;
      outcome?: string;
    }
  >;
  [key: string]: any;
}
