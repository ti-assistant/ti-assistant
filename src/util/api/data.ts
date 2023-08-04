import { mutate } from "swr";
import { GameUpdateData, SetSpeakerData } from "./state";
import { ActionLogEntry, StoredGameData, poster } from "./util";
import {
  AdvancePhaseHandler,
  RewindPhaseData,
  RewindPhaseHandler,
} from "../model/advancePhase";
import {
  AssignStrategyCardHandler,
  UnassignStrategyCardData,
  UnassignStrategyCardHandler,
} from "../model/assignStrategyCard";
import { TURN_BOUNDARIES, getCurrentTurnLogEntries } from "./actionLog";
import {
  SelectActionData,
  SelectActionHandler,
  UnselectActionData,
  UnselectActionHandler,
} from "../model/selectAction";
import {
  AddTechData,
  AddTechHandler,
  RemoveTechData,
  RemoveTechHandler,
} from "../model/addTech";
import {
  HideObjectiveData,
  HideObjectiveHandler,
  RevealObjectiveData,
  RevealObjectiveHandler,
} from "../model/revealObjective";
import {
  ClaimPlanetData,
  ClaimPlanetHandler,
  UnclaimPlanetData,
  UnclaimPlanetHandler,
} from "../model/claimPlanet";
import {
  EndTurnHandler,
  UnendTurnData,
  UnendTurnHandler,
} from "../model/endTurn";
import { SetSpeakerHandler } from "../model/setSpeaker";
import {
  MarkSecondaryData,
  MarkSecondaryHandler,
} from "../model/markSecondary";
import {
  ScoreObjectiveData,
  ScoreObjectiveHandler,
  UnscoreObjectiveData,
  UnscoreObjectiveHandler,
} from "../model/scoreObjective";
import {
  GiftOfPrescienceData,
  GiftOfPrescienceHandler,
} from "../model/giftOfPrescience";
import {
  SwapStrategyCardsHandler,
  UnswapStrategyCardsData,
  UnswapStrategyCardsHandler,
} from "../model/swapStrategyCards";
import {
  AddAttachmentData,
  AddAttachmentHandler,
  RemoveAttachmentData,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { isSetSpeakerData } from "../actionLog";
import {
  ContinueGameData,
  ContinueGameHandler,
  EndGameHandler,
} from "../model/endGame";
import {
  ManualVPUpdateData,
  ManualVPUpdateHandler,
} from "../model/manualVPUpdate";
import {
  HideAgendaData,
  HideAgendaHandler,
  RevealAgendaData,
  RevealAgendaHandler,
} from "../model/revealAgenda";
import { CastVotesData, CastVotesHandler } from "../model/castVotes";
import {
  RepealAgendaData,
  RepealAgendaHandler,
  ResolveAgendaData,
  ResolveAgendaHandler,
} from "../model/resolveAgenda";
import {
  ChooseStartingTechHandler,
  RemoveStartingTechData,
  RemoveStartingTechHandler,
} from "../model/chooseStartingTech";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../model/playActionCard";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../model/playPromissoryNote";
import {
  PlayComponentHandler,
  UnplayComponentHandler,
} from "../model/playComponent";
import { GainRelicHandler, LoseRelicHandler } from "../model/gainRelic";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";
import { SelectFactionHandler } from "../model/selectFaction";
import { SelectSubComponentHandler } from "../model/selectSubComponent";
import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import { PlayRiderHandler, UnplayRiderHandler } from "../model/playRider";
import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";

export type ActionLogAction =
  | "REPLACE"
  | "DELETE"
  | "IGNORE"
  | "REWIND_AND_DELETE"
  | "REWIND_AND_REPLACE";

export interface Handler {
  gameData: StoredGameData;
  data: GameUpdateData;
  validate(): boolean;
  getUpdates(): Record<string, any>;
  getActionLogAction(entry: ActionLogEntry): ActionLogAction;
  getLogEntry(): ActionLogEntry;
}

export function undo(gameId: string) {
  const data: GameUpdateData = {
    action: "UNDO",
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (storedGameData: StoredGameData) => {
        const actionLog = storedGameData.actionLog ?? [];
        let actionToUndo = actionLog[0];
        if (!actionToUndo) {
          return storedGameData;
        }

        const handler = getOppositeHandler(storedGameData, actionToUndo.data);
        if (!handler) {
          return storedGameData;
        }

        updateGameData(storedGameData, handler.getUpdates());

        updateActionLog(storedGameData, handler);

        return structuredClone(storedGameData);
      },
      revalidate: false,
    }
  );
}

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

export function getOppositeHandler(
  gameData: StoredGameData,
  data: GameUpdateData
) {
  switch (data.action) {
    case "ADD_TECH": {
      const removeTechData: RemoveTechData = {
        action: "REMOVE_TECH",
        event: data.event,
      };
      return new RemoveTechHandler(gameData, removeTechData);
    }
    case "REMOVE_TECH": {
      const addTechData: AddTechData = {
        action: "ADD_TECH",
        event: data.event,
      };
      return new AddTechHandler(gameData, addTechData);
    }
    case "REVEAL_OBJECTIVE": {
      const hideObjectiveData: HideObjectiveData = {
        action: "HIDE_OBJECTIVE",
        event: data.event,
      };
      return new HideObjectiveHandler(gameData, hideObjectiveData);
    }
    case "HIDE_OBJECTIVE": {
      const revealObjectiveData: RevealObjectiveData = {
        action: "REVEAL_OBJECTIVE",
        event: data.event,
      };
      return new RevealObjectiveHandler(gameData, revealObjectiveData);
    }
    case "ADVANCE_PHASE": {
      const rewindPhaseData: RewindPhaseData = {
        action: "REWIND_PHASE",
        event: data.event,
      };
      return new RewindPhaseHandler(gameData, rewindPhaseData);
    }
    case "REWIND_PHASE": {
      throw new Error("Somehow a REWIND_PHASE action wound up in the log.");
    }
    case "ASSIGN_STRATEGY_CARD": {
      const unassignStrategyCardData: UnassignStrategyCardData = {
        action: "UNASSIGN_STRATEGY_CARD",
        event: data.event,
      };
      return new UnassignStrategyCardHandler(
        gameData,
        unassignStrategyCardData
      );
    }
    case "UNASSIGN_STRATEGY_CARD": {
      throw new Error(
        "Somehow a UNASSIGN_STRATEGY_CARD action wound up in the log."
      );
    }
    case "CLAIM_PLANET": {
      const unclaimPlanetData: UnclaimPlanetData = {
        action: "UNCLAIM_PLANET",
        event: data.event,
      };
      return new UnclaimPlanetHandler(gameData, unclaimPlanetData);
    }
    case "UNCLAIM_PLANET": {
      const claimPlanetData: ClaimPlanetData = {
        action: "CLAIM_PLANET",
        event: data.event,
      };
      return new ClaimPlanetHandler(gameData, claimPlanetData);
    }
    case "SELECT_ACTION": {
      const unselectActionData: UnselectActionData = {
        action: "UNSELECT_ACTION",
        event: data.event,
      };
      return new UnselectActionHandler(gameData, unselectActionData);
    }
    case "UNSELECT_ACTION": {
      throw new Error("Somehow a UNSELECT_ACTION action wound up in the log.");
    }
    case "END_TURN": {
      const unendTurnData: UnendTurnData = {
        action: "UNEND_TURN",
        event: data.event,
      };
      return new UnendTurnHandler(gameData, unendTurnData);
    }
    case "UNEND_TURN": {
      throw new Error("Somehow a UNEND_TURN action wound up in the log.");
    }
    case "SET_SPEAKER": {
      if (!data.event.prevSpeaker) {
        throw new Error("prevSpeaker not set");
      }
      const setSpeakerData: SetSpeakerData = {
        action: "SET_SPEAKER",
        event: {
          newSpeaker: data.event.prevSpeaker,
        },
      };
      return new SetSpeakerHandler(gameData, setSpeakerData);
    }
    case "MARK_SECONDARY": {
      const markSecondaryData: MarkSecondaryData = {
        action: "MARK_SECONDARY",
        event: {
          faction: data.event.faction,
          state: "PENDING",
        },
      };
      return new MarkSecondaryHandler(gameData, markSecondaryData);
    }
    case "SCORE_OBJECTIVE": {
      const unscoreObjectiveData: UnscoreObjectiveData = {
        action: "UNSCORE_OBJECTIVE",
        event: data.event,
      };
      return new UnscoreObjectiveHandler(gameData, unscoreObjectiveData);
    }
    case "UNSCORE_OBJECTIVE": {
      const scoreObjectiveData: ScoreObjectiveData = {
        action: "SCORE_OBJECTIVE",
        event: data.event,
      };
      return new ScoreObjectiveHandler(gameData, scoreObjectiveData);
    }
    case "GIFT_OF_PRESCIENCE": {
      const giftData: GiftOfPrescienceData = {
        action: "GIFT_OF_PRESCIENCE",
        event: {
          faction: "Naalu Collective",
        },
      };
      return new GiftOfPrescienceHandler(gameData, giftData);
    }
    case "SWAP_STRATEGY_CARDS": {
      const unswapData: UnswapStrategyCardsData = {
        action: "UNSWAP_STRATEGY_CARDS",
        event: data.event,
      };
      return new UnswapStrategyCardsHandler(gameData, unswapData);
    }
    case "UNSWAP_STRATEGY_CARDS": {
      throw new Error("UNSWAP_STRATEGY_CARDS should never be in log");
    }
    case "ADD_ATTACHMENT": {
      const removeData: RemoveAttachmentData = {
        action: "REMOVE_ATTACHMENT",
        event: data.event,
      };
      return new RemoveAttachmentHandler(gameData, removeData);
    }
    case "REMOVE_ATTACHMENT": {
      const addData: AddAttachmentData = {
        action: "ADD_ATTACHMENT",
        event: data.event,
      };
      return new AddAttachmentHandler(gameData, addData);
    }
    case "END_GAME": {
      const continueData: ContinueGameData = {
        action: "CONTINUE_GAME",
        event: data.event,
      };
      return new ContinueGameHandler(gameData, continueData);
    }
    case "CONTINUE_GAME": {
      throw new Error("CONTINUE_GAME should never be in log");
    }
    case "MANUAL_VP_UPDATE": {
      const updateData: ManualVPUpdateData = {
        action: "MANUAL_VP_UPDATE",
        event: {
          faction: data.event.faction,
          vps: 0 - data.event.vps,
        },
      };
      return new ManualVPUpdateHandler(gameData, updateData);
    }
    case "REVEAL_AGENDA": {
      const hideData: HideAgendaData = {
        action: "HIDE_AGENDA",
        event: data.event,
      };
      return new HideAgendaHandler(gameData, hideData);
    }
    case "HIDE_AGENDA": {
      const revealData: RevealAgendaData = {
        action: "REVEAL_AGENDA",
        event: data.event,
      };
      return new RevealAgendaHandler(gameData, revealData);
    }
    case "CAST_VOTES": {
      const voteData: CastVotesData = {
        action: "CAST_VOTES",
        event: {
          faction: data.event.faction,
          target: undefined,
          votes: data.event.votes,
        },
      };
      return new CastVotesHandler(gameData, voteData);
    }
    case "RESOLVE_AGENDA": {
      const repealData: RepealAgendaData = {
        action: "REPEAL_AGENDA",
        event: {
          agenda: data.event.agenda,
          target: data.event.target,
          repealedBy: "UNDO",
          prevSpeaker: data.event.prevSpeaker,
        },
      };
      return new RepealAgendaHandler(gameData, repealData);
    }
    case "REPEAL_AGENDA": {
      const resolveData: ResolveAgendaData = {
        action: "RESOLVE_AGENDA",
        event: data.event,
      };
      return new ResolveAgendaHandler(gameData, resolveData);
    }
    case "CHOOSE_STARTING_TECH": {
      const removeData: RemoveStartingTechData = {
        action: "REMOVE_STARTING_TECH",
        event: data.event,
      };
      return new RemoveStartingTechHandler(gameData, removeData);
    }
    case "REMOVE_STARTING_TECH": {
      throw new Error("REMOVE_STARTING_TECH should not be in log");
    }
    case "CHOOSE_SUB_FACTION": {
      return new ChooseSubFactionHandler(gameData, {
        action: "CHOOSE_SUB_FACTION",
        event: data.event,
      });
    }
    case "PLAY_ACTION_CARD": {
      return new UnplayActionCardHandler(gameData, {
        action: "UNPLAY_ACTION_CARD",
        event: data.event,
      });
    }
    case "UNPLAY_ACTION_CARD": {
      throw new Error("UNPLAY_ACTION_CARD should not be in log");
    }
    case "PLAY_PROMISSORY_NOTE": {
      return new UnplayPromissoryNoteHandler(gameData, {
        action: "UNPLAY_PROMISSORY_NOTE",
        event: data.event,
      });
    }
    case "UNPLAY_PROMISSORY_NOTE": {
      throw new Error("UNPLAY_PROMISSORY_NOTE should not be in log");
    }
    case "PLAY_COMPONENT": {
      return new UnplayComponentHandler(gameData, {
        action: "UNPLAY_COMPONENT",
        event: data.event,
      });
    }
    case "UNPLAY_COMPONENT": {
      throw new Error("UNPLAY_COMPONENT should not be in log");
    }
    case "GAIN_RELIC": {
      return new LoseRelicHandler(gameData, {
        action: "LOSE_RELIC",
        event: data.event,
      });
    }
    case "LOSE_RELIC": {
      throw new Error("LOSE_RELIC should not be in log");
    }
    case "UPDATE_PLANET_STATE": {
      return new UpdatePlanetStateHandler(gameData, {
        action: "UPDATE_PLANET_STATE",
        event: {
          planet: data.event.planet,
          state: "READIED",
        },
      });
    }
    case "SELECT_FACTION": {
      return new SelectFactionHandler(gameData, {
        action: "SELECT_FACTION",
        event: {
          faction: "None",
        },
      });
    }
    case "SELECT_SUB_COMPONENT": {
      return new SelectSubComponentHandler(gameData, {
        action: "SELECT_SUB_COMPONENT",
        event: {
          subComponent: "None",
        },
      });
    }
    case "SELECT_ELIGIBLE_OUTCOMES": {
      return new SelectEligibleOutcomesHandler(gameData, {
        action: "SELECT_ELIGIBLE_OUTCOMES",
        event: {
          outcomes: "None",
        },
      });
    }
    case "PLAY_RIDER": {
      return new UnplayRiderHandler(gameData, {
        action: "UNPLAY_RIDER",
        event: data.event,
      });
    }
    case "UNPLAY_RIDER": {
      throw new Error("UNPLAY_RIDER should not be in log");
    }
    case "SELECT_SUB_AGENDA": {
      return new SelectSubAgendaHandler(gameData, {
        action: "SELECT_SUB_AGENDA",
        event: {
          subAgenda: "None",
        },
      });
    }
    case "SET_OBJECTIVE_POINTS": {
      return new SetObjectivePointsHandler(gameData, {
        action: "SET_OBJECTIVE_POINTS",
        event: {
          objective: "Mutiny",
          points: 0 - data.event.points,
        },
      });
    }
    case "SPEAKER_TIE_BREAK": {
      return new SpeakerTieBreakHandler(gameData, {
        action: "SPEAKER_TIE_BREAK",
        event: {
          tieBreak: "None",
        },
      });
    }
  }
}

export function updateGameData(
  storedGameData: StoredGameData,
  updates: Record<string, any>
) {
  for (const [path, value] of Object.entries(updates)) {
    const pathSections = path.split(".");
    const key = pathSections.pop();
    if (!key) {
      return;
    }
    let dataRef = storedGameData;
    for (const section of pathSections) {
      if (!dataRef[section]) {
        dataRef[section] = {};
      }
      dataRef = dataRef[section];
    }

    if (value === "DELETE") {
      delete dataRef[key];
    } else if (value === "INCREMENT") {
      dataRef[key] = (dataRef[key] ?? 0) + 1;
    } else {
      dataRef[key] = value;
    }
  }
}

export function updateActionLog(
  storedGameData: StoredGameData,
  handler: Handler
) {
  const actionLog = storedGameData.actionLog ?? [];
  let lastCheck = false;
  for (let i = 0; i < actionLog.length; ++i) {
    if (lastCheck) {
      break;
    }
    const logEntry = actionLog[i];
    if (!logEntry) {
      continue;
    }

    if (TURN_BOUNDARIES.includes(logEntry.data.action)) {
      lastCheck = true;
    }

    const action = handler.getActionLogAction(logEntry);
    switch (action) {
      case "DELETE":
        actionLog.splice(i, 1);
        return;
      case "REPLACE":
        actionLog.splice(i, 1, handler.getLogEntry());
        return;
      case "REWIND_AND_DELETE":
        for (let j = 0; j < i; ++j) {
          const entry = actionLog[j];
          if (!entry) {
            continue;
          }
          const undoHandler = getOppositeHandler(handler.gameData, entry.data);
          if (!undoHandler) {
            continue;
          }
          updateGameData(storedGameData, undoHandler.getUpdates());
        }
        actionLog.splice(0, i + 1);
        return;
      case "REWIND_AND_REPLACE":
        for (let j = 0; j < i; ++j) {
          const entry = actionLog[j];
          if (!entry) {
            continue;
          }
          const undoHandler = getOppositeHandler(handler.gameData, entry.data);
          if (!undoHandler) {
            continue;
          }
          updateGameData(storedGameData, undoHandler.getUpdates());
        }
        actionLog.splice(0, i + 1, handler.getLogEntry());
        return;
    }
  }

  actionLog.unshift(handler.getLogEntry());

  return;
}

export function getLogEntry(actionLog: ActionLogEntry[], action: string) {
  for (const logEntry of actionLog) {
    if (logEntry.data.action === action) {
      return logEntry;
    }
  }
  return null;
}

function isSelectActionData(data: GameUpdateData): data is SelectActionData {
  return data.action === "SELECT_ACTION";
}

export function getSelectedAction(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SELECT_ACTION");

  if (!entry || !isSelectActionData(entry.data)) {
    return undefined;
  }

  return entry.data.event.action;
}

export function getNewSpeaker(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SET_SPEAKER");

  if (!entry || !isSetSpeakerData(entry.data)) {
    return undefined;
  }

  return entry.data.event.newSpeaker;
}

export function getNewSpeakerEvent(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SET_SPEAKER");

  if (!entry || !isSetSpeakerData(entry.data)) {
    return undefined;
  }

  return entry.data.event;
}
