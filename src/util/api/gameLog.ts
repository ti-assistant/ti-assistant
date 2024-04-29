import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import { AdvancePhaseHandler, RewindPhaseHandler } from "../model/advancePhase";
import {
  AssignStrategyCardHandler,
  UnassignStrategyCardHandler,
} from "../model/assignStrategyCard";
import { CastVotesHandler } from "../model/castVotes";
import {
  ChooseStartingTechHandler,
  RemoveStartingTechHandler,
} from "../model/chooseStartingTech";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import { ContinueGameHandler, EndGameHandler } from "../model/endGame";
import { EndTurnHandler, UnendTurnHandler } from "../model/endTurn";
import { GainRelicHandler, LoseRelicHandler } from "../model/gainRelic";
import { GiftOfPrescienceHandler } from "../model/giftOfPrescience";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import { MarkSecondaryHandler } from "../model/markSecondary";
import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../model/playActionCard";
import {
  PlayComponentHandler,
  UnplayComponentHandler,
} from "../model/playComponent";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";
import { PlayRelicHandler } from "../model/playRelic";
import { PlayRiderHandler, UnplayRiderHandler } from "../model/playRider";
import {
  RepealAgendaHandler,
  ResolveAgendaHandler,
} from "../model/resolveAgenda";
import { HideAgendaHandler, RevealAgendaHandler } from "../model/revealAgenda";
import {
  HideObjectiveHandler,
  RevealObjectiveHandler,
} from "../model/revealObjective";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";
import {
  SelectActionHandler,
  UnselectActionHandler,
} from "../model/selectAction";
import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import { SelectFactionHandler } from "../model/selectFaction";
import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import { SelectSubComponentHandler } from "../model/selectSubComponent";
import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import { SetSpeakerHandler } from "../model/setSpeaker";
import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";
import {
  SwapStrategyCardsHandler,
  UnswapStrategyCardsHandler,
} from "../model/swapStrategyCards";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import { getOppositeHandler } from "./opposite";

export function getHandler(gameData: StoredGameData, data: GameUpdateData) {
  switch (data.action) {
    case "ADD_ATTACHMENT":
      return new AddAttachmentHandler(gameData, data);
    case "ADD_TECH":
      return new AddTechHandler(gameData, data);
    case "ADVANCE_PHASE":
      return new AdvancePhaseHandler(gameData, data);
    case "ASSIGN_STRATEGY_CARD":
      return new AssignStrategyCardHandler(gameData, data);
    case "CAST_VOTES":
      return new CastVotesHandler(gameData, data);
    case "CHOOSE_STARTING_TECH":
      return new ChooseStartingTechHandler(gameData, data);
    case "CHOOSE_SUB_FACTION":
      return new ChooseSubFactionHandler(gameData, data);
    case "CLAIM_PLANET":
      return new ClaimPlanetHandler(gameData, data);
    case "CONTINUE_GAME":
      return new ContinueGameHandler(gameData, data);
    case "END_GAME":
      return new EndGameHandler(gameData, data);
    case "END_TURN":
      return new EndTurnHandler(gameData, data);
    case "GAIN_RELIC":
      return new GainRelicHandler(gameData, data);
    case "GIFT_OF_PRESCIENCE":
      return new GiftOfPrescienceHandler(gameData, data);
    case "HIDE_AGENDA":
      return new HideAgendaHandler(gameData, data);
    case "HIDE_OBJECTIVE":
      return new HideObjectiveHandler(gameData, data);
    case "LOSE_RELIC":
      return new LoseRelicHandler(gameData, data);
    case "MANUAL_VP_UPDATE":
      return new ManualVPUpdateHandler(gameData, data);
    case "MARK_SECONDARY":
      return new MarkSecondaryHandler(gameData, data);
    case "PLAY_ACTION_CARD":
      return new PlayActionCardHandler(gameData, data);
    case "PLAY_COMPONENT":
      return new PlayComponentHandler(gameData, data);
    case "PLAY_PROMISSORY_NOTE":
      return new PlayPromissoryNoteHandler(gameData, data);
    case "PLAY_RELIC":
      return new PlayRelicHandler(gameData, data);
    case "PLAY_RIDER":
      return new PlayRiderHandler(gameData, data);
    case "REMOVE_ATTACHMENT":
      return new RemoveAttachmentHandler(gameData, data);
    case "REMOVE_STARTING_TECH":
      return new RemoveStartingTechHandler(gameData, data);
    case "REMOVE_TECH":
      return new RemoveTechHandler(gameData, data);
    case "REPEAL_AGENDA":
      return new RepealAgendaHandler(gameData, data);
    case "RESOLVE_AGENDA":
      return new ResolveAgendaHandler(gameData, data);
    case "REVEAL_AGENDA":
      return new RevealAgendaHandler(gameData, data);
    case "REVEAL_OBJECTIVE":
      return new RevealObjectiveHandler(gameData, data);
    case "REWIND_PHASE":
      return new RewindPhaseHandler(gameData, data);
    case "SCORE_OBJECTIVE":
      return new ScoreObjectiveHandler(gameData, data);
    case "SELECT_ACTION":
      return new SelectActionHandler(gameData, data);
    case "SELECT_ELIGIBLE_OUTCOMES":
      return new SelectEligibleOutcomesHandler(gameData, data);
    case "SELECT_FACTION":
      return new SelectFactionHandler(gameData, data);
    case "SELECT_SUB_AGENDA":
      return new SelectSubAgendaHandler(gameData, data);
    case "SELECT_SUB_COMPONENT":
      return new SelectSubComponentHandler(gameData, data);
    case "SET_OBJECTIVE_POINTS":
      return new SetObjectivePointsHandler(gameData, data);
    case "SET_SPEAKER":
      return new SetSpeakerHandler(gameData, data);
    case "SPEAKER_TIE_BREAK":
      return new SpeakerTieBreakHandler(gameData, data);
    case "SWAP_STRATEGY_CARDS":
      return new SwapStrategyCardsHandler(gameData, data);
    case "UNASSIGN_STRATEGY_CARD":
      return new UnassignStrategyCardHandler(gameData, data);
    case "UNCLAIM_PLANET":
      return new UnclaimPlanetHandler(gameData, data);
    case "UNDO":
      return getOppositeHandler(gameData, data);
    case "UNEND_TURN":
      return new UnendTurnHandler(gameData, data);
    case "UNPLAY_ACTION_CARD":
      return new UnplayActionCardHandler(gameData, data);
    case "UNPLAY_COMPONENT":
      return new UnplayComponentHandler(gameData, data);
    case "UNPLAY_PROMISSORY_NOTE":
      return new UnplayPromissoryNoteHandler(gameData, data);
    case "UNPLAY_RIDER":
      return new UnplayRiderHandler(gameData, data);
    case "UNSCORE_OBJECTIVE":
      return new UnscoreObjectiveHandler(gameData, data);
    case "UNSELECT_ACTION":
      return new UnselectActionHandler(gameData, data);
    case "UNSWAP_STRATEGY_CARDS":
      return new UnswapStrategyCardsHandler(gameData, data);
    case "UPDATE_PLANET_STATE":
      return new UpdatePlanetStateHandler(gameData, data);
  }
}
