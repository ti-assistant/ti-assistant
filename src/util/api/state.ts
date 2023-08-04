import { StrategyCard } from "./cards";
import { Faction } from "./factions";
import { AdvancePhaseEvent, SetSpeakerEvent } from "./subState";
import { ActionLogEntry } from "./util";
import { Agenda } from "./agendas";
import { Attachment } from "./attachments";
import { Component } from "./components";
import { Objective } from "./objectives";
import { Options } from "./options";
import { Planet } from "./planets";
import { Relic } from "./relics";
import { Tech } from "./techs";
import { AddTechData, RemoveTechData } from "../model/addTech";
import { SelectActionData, UnselectActionData } from "../model/selectAction";
import { ClaimPlanetData, UnclaimPlanetData } from "../model/claimPlanet";
import { GiftOfPrescienceData } from "../model/giftOfPrescience";
import {
  SwapStrategyCardsData,
  UnswapStrategyCardsData,
} from "../model/swapStrategyCards";
import { EndTurnData, UnendTurnData } from "../model/endTurn";
import { MarkSecondaryData } from "../model/markSecondary";
import {
  ScoreObjectiveData,
  UnscoreObjectiveData,
} from "../model/scoreObjective";
import {
  HideObjectiveData,
  RevealObjectiveData,
} from "../model/revealObjective";
import { RewindPhaseData } from "../model/advancePhase";
import {
  AssignStrategyCardData,
  UnassignStrategyCardData,
} from "../model/assignStrategyCard";
import {
  AddAttachmentData,
  RemoveAttachmentData,
} from "../model/addAttachment";
import { ContinueGameData, EndGameData } from "../model/endGame";
import { ManualVPUpdateData } from "../model/manualVPUpdate";
import { HideAgendaData, RevealAgendaData } from "../model/revealAgenda";
import { CastVotesData } from "../model/castVotes";
import { RepealAgendaData, ResolveAgendaData } from "../model/resolveAgenda";
import {
  ChooseStartingTechData,
  RemoveStartingTechData,
} from "../model/chooseStartingTech";
import { ChooseSubFactionData } from "../model/chooseSubFaction";
import {
  PlayActionCardData,
  UnplayActionCardData,
} from "../model/playActionCard";
import {
  PlayPromissoryNoteData,
  UnplayPromissoryNoteData,
} from "../model/playPromissoryNote";
import { PlayComponentData, UnplayComponentData } from "../model/playComponent";
import { GainRelicData, LoseRelicData } from "../model/gainRelic";
import { UpdatePlanetStateData } from "../model/updatePlanetState";
import { SelectFactionData } from "../model/selectFaction";
import { SelectSubComponentData } from "../model/selectSubComponent";
import { SelectEligibleOutcomesData } from "../model/selectEligibleOutcomes";
import { PlayRiderData, UnplayRiderData } from "../model/playRider";
import { SelectSubAgendaData } from "../model/selectSubAgenda";
import { SetObjectivePointsData } from "../model/setObjectivePoints";
import { SpeakerTieBreakData } from "../model/speakerTieBreak";

export type Phase =
  | "UNKNOWN"
  | "SETUP"
  | "STRATEGY"
  | "ACTION"
  | "STATUS"
  | "AGENDA"
  | "END";

export type StateUpdateAction =
  | "ADVANCE_PHASE"
  | "START_NEXT_ROUND"
  | "JUMP_TO_PLAYER"
  | "ADVANCE_PLAYER"
  | "PREVIOUS_PLAYER"
  | "SET_SPEAKER"
  | "END_GAME"
  | "CONTINUE_GAME"
  | "SET_AGENDA_NUM"
  | "ANCIENT_BURIAL_SITES" // Probably a better way to do this...
  | "SET_GLOBAL_PAUSE";

export interface StateUpdateData {
  action?: StateUpdateAction;
  agendaNum?: number;
  factionName?: string;
  paused?: boolean;
  skipAgenda?: boolean;
  speaker?: string;
  timestamp?: number;
}

export type GameAction = "ASSIGN_STRATEGY_CARD" | "SET_SPEAKER";

export interface AdvancePhaseData {
  action: "ADVANCE_PHASE";
  event: AdvancePhaseEvent;
}

export interface SetSpeakerData {
  action: "SET_SPEAKER";
  event: SetSpeakerEvent;
}

export interface UndoData {
  action: "UNDO";
}

export type GameUpdateData =
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
  | SelectFactionData
  | SelectSubComponentData
  | SelectEligibleOutcomesData
  | (PlayRiderData | UnplayRiderData)
  | SelectSubAgendaData
  | SetObjectivePointsData
  | SpeakerTieBreakData
  // TODO
  | UndoData;

export interface GameState {
  activeplayer?: string;
  ancientBurialSites?: string;
  agendaNum?: number;
  agendaUnlocked?: boolean;
  finalPhase?: Phase;
  paused?: boolean;
  phase: Phase;
  round: number;
  speaker: string;
}

export interface GameData {
  actionLog?: ActionLogEntry[];
  agendas?: Record<string, Agenda>;
  attachments?: Record<string, Attachment>;
  components?: Record<string, Component>;
  factions: Record<string, Faction>;
  objectives?: Record<string, Objective>;
  options: Options;
  planets: Record<string, Planet>;
  relics?: Record<string, Relic>;
  state: GameState;
  strategycards?: Record<string, StrategyCard>;
  techs?: Record<string, Tech>;
}
