import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import { AddTechHandler, RemoveTechHandler } from "../model/addTech";
import { RewindPhaseHandler } from "../model/advancePhase";
import { UnassignStrategyCardHandler } from "../model/assignStrategyCard";
import { CastVotesHandler } from "../model/castVotes";
import { RemoveStartingTechHandler } from "../model/chooseStartingTech";
import { ChooseSubFactionHandler } from "../model/chooseSubFaction";
import { ChooseTFFactionHandler } from "../model/chooseTFFaction";
import { ClaimPlanetHandler, UnclaimPlanetHandler } from "../model/claimPlanet";
import { CommitToExpeditionHandler } from "../model/commitToExpedition";
import { ContinueGameHandler } from "../model/endGame";
import { UnendTurnHandler } from "../model/endTurn";
import {
  GainAllianceHandler,
  LoseAllianceHandler,
} from "../model/gainAlliance";
import { GainRelicHandler, LoseRelicHandler } from "../model/gainRelic";
import { GainTFCardHandler, LoseTFCardHandler } from "../model/gainTFCard";
import { GiftOfPrescienceHandler } from "../model/giftOfPrescience";
import { ManualCCUpdateHandler } from "../model/manualCCUpdate";
import { ManualVoteUpdateHandler } from "../model/manualVoteUpdate";
import { ManualVPUpdateHandler } from "../model/manualVPUpdate";
import {
  MarkPrimaryHandler,
  MarkSecondaryHandler,
} from "../model/markSecondary";
import { UnplayActionCardHandler } from "../model/playActionCard";
import { UndoAdjudicatorBaalHandler } from "../model/playAdjudicatorBaal";
import { UnplayComponentHandler } from "../model/playComponent";
import { UnplayPromissoryNoteHandler } from "../model/playPromissoryNote";
import { UnplayRelicHandler } from "../model/playRelic";
import { UnplayRiderHandler } from "../model/playRider";
import { PurgeSystemHandler, UnpurgeSystemHandler } from "../model/purgeSystem";
import { PurgeTechHandler, UnpurgeTechHandler } from "../model/purgeTech";
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
import { UnselectActionHandler } from "../model/selectAction";
import { SelectEligibleOutcomesHandler } from "../model/selectEligibleOutcomes";
import { SelectFactionHandler } from "../model/selectFaction";
import { SelectSubAgendaHandler } from "../model/selectSubAgenda";
import { SelectSubComponentHandler } from "../model/selectSubComponent";
import { SetObjectivePointsHandler } from "../model/setObjectivePoints";
import { SetSpeakerHandler } from "../model/setSpeaker";
import { SetTyrantHandler } from "../model/setTyrant";
import { SpeakerTieBreakHandler } from "../model/speakerTieBreak";
import { UnstartVotingHandler } from "../model/startVoting";
import { SwapMapTilesHandler } from "../model/swapMapTiles";
import { UnswapStrategyCardsHandler } from "../model/swapStrategyCards";
import { ToggleStructureHandler } from "../model/toggleStructure";
import { PassHandler, UnpassHandler } from "../model/unpass";
import { UpdateBreakthroughStateHandler } from "../model/updateBreakthroughState";
import { UpdateLeaderStateHandler } from "../model/updateLeaderState";
import { UpdatePlanetStateHandler } from "../model/updatePlanetState";

export function getOppositeHandler(
  gameData: StoredGameData,
  data: GameUpdateData,
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
        unassignStrategyCardData,
      );
    }
    case "UNASSIGN_STRATEGY_CARD": {
      throw new Error(
        "Somehow a UNASSIGN_STRATEGY_CARD action wound up in the log.",
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
    case "SET_TYRANT": {
      const setTyrantData: SetTyrantData = {
        action: "SET_TYRANT",
        event: {
          newTyrant: data.event.prevTyrant,
        },
      };
      return new SetTyrantHandler(gameData, setTyrantData);
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
    case "MARK_PRIMARY": {
      const markPrimaryData: MarkPrimaryData = {
        action: "MARK_PRIMARY",
        event: {
          completed: !data.event.completed,
        },
      };
      return new MarkPrimaryHandler(gameData, markPrimaryData);
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
    case "MANUAL_CC_UPDATE": {
      const updateData: ManualCCUpdateData = {
        action: "MANUAL_CC_UPDATE",
        event: {
          faction: data.event.faction,
          commandCounters: 0 - data.event.commandCounters,
        },
      };
      return new ManualCCUpdateHandler(gameData, updateData);
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
          extraVotes: data.event.extraVotes,
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
    case "CHOOSE_TF_FACTION": {
      return new ChooseTFFactionHandler(gameData, {
        action: "CHOOSE_TF_FACTION",
        event: {
          factionId: data.event.factionId,
          type: data.event.type,
        },
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
      return new GainRelicHandler(gameData, {
        action: "GAIN_RELIC",
        event: data.event,
      });
    }
    case "GAIN_ALLIANCE": {
      if (data.event.prevFaction) {
        return new GainAllianceHandler(gameData, {
          action: "GAIN_ALLIANCE",
          event: {
            faction: data.event.prevFaction,
            fromFaction: data.event.fromFaction,
          },
        });
      }
      return new LoseAllianceHandler(gameData, {
        action: "LOSE_ALLIANCE",
        event: {
          faction: data.event.faction,
          fromFaction: data.event.fromFaction,
        },
      });
    }
    case "LOSE_ALLIANCE": {
      return new GainAllianceHandler(gameData, {
        action: "GAIN_ALLIANCE",
        event: {
          faction: data.event.faction,
          fromFaction: data.event.fromFaction,
        },
      });
    }
    case "UPDATE_BREAKTHROUGH_STATE": {
      return new UpdateBreakthroughStateHandler(gameData, {
        action: "UPDATE_BREAKTHROUGH_STATE",
        event: {
          factionId: data.event.factionId,
          state: data.event.prevState ?? "locked",
          prevState: data.event.state,
        },
      });
    }
    case "UPDATE_LEADER_STATE": {
      return new UpdateLeaderStateHandler(gameData, {
        action: "UPDATE_LEADER_STATE",
        event: {
          leaderId: data.event.leaderId,
          state: data.event.prevState ?? "locked",
          prevState: data.event.state,
        },
      });
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
    case "START_VOTING": {
      return new UnstartVotingHandler(gameData, data);
    }
    case "PLAY_RELIC": {
      return new UnplayRelicHandler(gameData, {
        action: "UNPLAY_RELIC",
        event: data.event,
      });
    }
    case "UNPLAY_RELIC": {
      throw new Error("UNPLAY_RELIC should not be in log");
    }
    case "PLAY_ADJUDICATOR_BAAL":
      return new UndoAdjudicatorBaalHandler(gameData, {
        action: "UNDO_ADJUDICATOR_BAAL",
        event: data.event,
      });
    case "UNDO_ADJUDICATOR_BAAL":
      throw new Error("UNDO_ADJUDICATOR_BAAL should not be in log");
    case "SWAP_MAP_TILES":
      return new SwapMapTilesHandler(gameData, {
        action: "SWAP_MAP_TILES",
        event: {
          oldItem: {
            systemNumber: data.event.newItem.systemNumber,
            index: data.event.oldItem.index,
          },
          newItem: {
            systemNumber: data.event.oldItem.systemNumber,
            index: data.event.newItem.index,
          },
        },
      });
    case "COMMIT_TO_EXPEDITION":
      return new CommitToExpeditionHandler(gameData, {
        action: "COMMIT_TO_EXPEDITION",
        event: {
          factionId: data.event.prevFaction,
          expedition: data.event.expedition,
        },
      });
    case "PURGE_TECH":
      return new UnpurgeTechHandler(gameData, {
        action: "UNPURGE_TECH",
        event: data.event,
      });
    case "UNPURGE_TECH":
      return new PurgeTechHandler(gameData, {
        action: "PURGE_TECH",
        event: data.event,
      });
    case "UNPASS":
      return new PassHandler(gameData, {
        action: "PASS",
        event: data.event,
      });
    case "PASS":
      return new UnpassHandler(gameData, {
        action: "UNPASS",
        event: data.event,
      });
    case "PURGE_SYSTEM":
      return new UnpurgeSystemHandler(gameData, {
        action: "UNPURGE_SYSTEM",
        event: data.event,
      });
    case "UNPURGE_SYSTEM":
      return new PurgeSystemHandler(gameData, {
        action: "PURGE_SYSTEM",
        event: data.event,
      });
    case "TOGGLE_STRUCTURE":
      const change = data.event.change === "Add" ? "Remove" : "Add";
      return new ToggleStructureHandler(gameData, {
        action: "TOGGLE_STRUCTURE",
        event: {
          ...data.event,
          change,
        },
      });
    case "GAIN_TF_CARD":
      return new LoseTFCardHandler(gameData, {
        action: "LOSE_TF_CARD",
        event: data.event,
      });
    case "LOSE_TF_CARD":
      return new GainTFCardHandler(gameData, {
        action: "GAIN_TF_CARD",
        event: data.event,
      });
    case "MANUAL_VOTE_UPDATE":
      return new ManualVoteUpdateHandler(gameData, {
        action: "MANUAL_VOTE_UPDATE",
        event: {
          faction: data.event.faction,
          votes: 0 - data.event.votes,
        },
      });
  }
}
