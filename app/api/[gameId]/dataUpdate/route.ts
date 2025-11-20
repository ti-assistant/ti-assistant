import {
  DocumentData,
  DocumentReference,
  FieldValue,
  Firestore,
  Transaction,
  getFirestore,
} from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  canEditGame,
  getCurrentTurnLogEntriesInTransaction,
  getGameData,
  getGameDataInTransaction,
  getTimersInTransaction,
} from "../../../../server/util/fetch";
import { TURN_BOUNDARIES } from "../../../../src/util/api/actionLog";
import { getOppositeHandler } from "../../../../src/util/api/opposite";
import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../../../../src/util/model/addAttachment";
import {
  AddTechHandler,
  RemoveTechHandler,
} from "../../../../src/util/model/addTech";
import { AdvancePhaseHandler } from "../../../../src/util/model/advancePhase";
import { AssignStrategyCardHandler } from "../../../../src/util/model/assignStrategyCard";
import { CastVotesHandler } from "../../../../src/util/model/castVotes";
import {
  ChooseStartingTechHandler,
  RemoveStartingTechHandler,
} from "../../../../src/util/model/chooseStartingTech";
import { ChooseSubFactionHandler } from "../../../../src/util/model/chooseSubFaction";
import { ChooseTFFactionHandler } from "../../../../src/util/model/chooseTFFaction";
import {
  ClaimPlanetHandler,
  UnclaimPlanetHandler,
} from "../../../../src/util/model/claimPlanet";
import { CommitToExpeditionHandler } from "../../../../src/util/model/commitToExpedition";
import {
  ContinueGameHandler,
  EndGameHandler,
} from "../../../../src/util/model/endGame";
import { EndTurnHandler } from "../../../../src/util/model/endTurn";
import {
  GainAllianceHandler,
  LoseAllianceHandler,
} from "../../../../src/util/model/gainAlliance";
import {
  GainRelicHandler,
  LoseRelicHandler,
} from "../../../../src/util/model/gainRelic";
import {
  GainTFCardHandler,
  LoseTFCardHandler,
} from "../../../../src/util/model/gainTFCard";
import { GiftOfPrescienceHandler } from "../../../../src/util/model/giftOfPrescience";
import { ManualVoteUpdateHandler } from "../../../../src/util/model/manualVoteUpdate";
import { ManualVPUpdateHandler } from "../../../../src/util/model/manualVPUpdate";
import {
  MarkPrimaryHandler,
  MarkSecondaryHandler,
} from "../../../../src/util/model/markSecondary";
import {
  PlayActionCardHandler,
  UnplayActionCardHandler,
} from "../../../../src/util/model/playActionCard";
import {
  PlayAdjudicatorBaalHandler,
  UndoAdjudicatorBaalHandler,
} from "../../../../src/util/model/playAdjudicatorBaal";
import {
  PlayComponentHandler,
  UnplayComponentHandler,
} from "../../../../src/util/model/playComponent";
import {
  PlayPromissoryNoteHandler,
  UnplayPromissoryNoteHandler,
} from "../../../../src/util/model/playPromissoryNote";
import {
  PlayRelicHandler,
  UnplayRelicHandler,
} from "../../../../src/util/model/playRelic";
import {
  PlayRiderHandler,
  UnplayRiderHandler,
} from "../../../../src/util/model/playRider";
import {
  PurgeSystemHandler,
  UnpurgeSystemHandler,
} from "../../../../src/util/model/purgeSystem";
import {
  PurgeTechHandler,
  UnpurgeTechHandler,
} from "../../../../src/util/model/purgeTech";
import {
  RepealAgendaHandler,
  ResolveAgendaHandler,
} from "../../../../src/util/model/resolveAgenda";
import {
  HideAgendaHandler,
  RevealAgendaHandler,
} from "../../../../src/util/model/revealAgenda";
import {
  HideObjectiveHandler,
  RevealObjectiveHandler,
} from "../../../../src/util/model/revealObjective";
import {
  ScoreObjectiveHandler,
  UnscoreObjectiveHandler,
} from "../../../../src/util/model/scoreObjective";
import {
  SelectActionHandler,
  UnselectActionHandler,
} from "../../../../src/util/model/selectAction";
import { SelectEligibleOutcomesHandler } from "../../../../src/util/model/selectEligibleOutcomes";
import { SelectFactionHandler } from "../../../../src/util/model/selectFaction";
import { SelectSubAgendaHandler } from "../../../../src/util/model/selectSubAgenda";
import { SelectSubComponentHandler } from "../../../../src/util/model/selectSubComponent";
import { SetObjectivePointsHandler } from "../../../../src/util/model/setObjectivePoints";
import { SetSpeakerHandler } from "../../../../src/util/model/setSpeaker";
import { SetTyrantHandler } from "../../../../src/util/model/setTyrant";
import { SpeakerTieBreakHandler } from "../../../../src/util/model/speakerTieBreak";
import { StartVotingHandler } from "../../../../src/util/model/startVoting";
import { SwapMapTilesHandler } from "../../../../src/util/model/swapMapTiles";
import { SwapStrategyCardsHandler } from "../../../../src/util/model/swapStrategyCards";
import { ToggleStructureHandler } from "../../../../src/util/model/toggleSpaceDock";
import { PassHandler, UnpassHandler } from "../../../../src/util/model/unpass";
import { UpdateBreakthroughStateHandler } from "../../../../src/util/model/updateBreakthroughState";
import { UpdateLeaderStateHandler } from "../../../../src/util/model/updateLeaderState";
import { UpdatePlanetStateHandler } from "../../../../src/util/model/updatePlanetState";
import { Optional } from "../../../../src/util/types/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const canEdit = await canEditGame(gameId);
  if (!canEdit) {
    return new Response("Not authorized", {
      status: 403,
    });
  }

  const db = getFirestore();

  // Uncomment to simulate latency.
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(1000);

  const timerRef = db.collection("timers").doc(gameId);
  const timerDoc = await timerRef.get();

  const timers = timerDoc.data() as Record<string, number>;

  const serverGameTime = timers.game ?? 0;

  const gameRef = db.collection("games").doc(gameId);

  const data = (await req.json()) as GameUpdateData & {
    timestamp: number;
    gameTime: number;
  };

  let gameTime = data.gameTime;
  // Use the later time, unless the passed in time is more than 20 seconds after the server time.
  if (gameTime < serverGameTime || gameTime - 20 > serverGameTime) {
    gameTime = serverGameTime;
  }

  try {
    let numAttempts = 3;
    let shouldRetry = true;
    while (shouldRetry && numAttempts > 0) {
      if (!data.action) {
        return new Response("Missing info", {
          status: 422,
        });
      }

      shouldRetry = await updateInTransaction(
        db,
        gameRef,
        timerRef,
        data,
        gameTime
      );
      if (shouldRetry) {
        // Backoff after failures to potentially allow other updates to complete.
        await new Promise((r) => setTimeout(r, 100));
      }
      numAttempts--;
    }
    if (shouldRetry && numAttempts === 0) {
      throw new Error("Could not complete transaction.");
    }
  } catch (e) {
    console.log("Transaction failed", e);
    return NextResponse.error();
  }

  const gameData = await getGameData(gameId);

  return NextResponse.json(gameData);
}

function convertToServerUpdates(updates: Record<string, any>) {
  const serverUpdates: Record<string, any> = {};
  for (const [key, value] of Object.entries(updates)) {
    serverUpdates[key] = value;
    if (value === "DELETE") {
      serverUpdates[key] = FieldValue.delete();
    }
    if (value === "INCREMENT") {
      serverUpdates[key] = FieldValue.increment(1);
    }
  }
  return serverUpdates;
}

async function updateActionLog(
  gameRef: DocumentReference<DocumentData>,
  t: Transaction,
  handler: Handler,
  gameTime: number
) {
  const currentTimestampMillis = Date.now();
  const turnBoundary = await t.get(
    gameRef
      .collection("actionLog")
      .orderBy("timestampMillis", "desc")
      .where("data.action", "in", TURN_BOUNDARIES)
      .limit(1)
  );

  let timestamp = 0;
  turnBoundary.forEach((logEntry) => {
    timestamp = (logEntry.data() as ActionLogEntry<GameUpdateData>)
      .timestampMillis;
  });

  const actionLog = await t.get(
    gameRef
      .collection("actionLog")
      .orderBy("timestampMillis", "desc")
      .where("timestampMillis", ">=", timestamp)
  );

  let foundLogEntry = false;
  let endOfTurn = false;
  // Used for rewinding
  const orderedEntries: Record<string, ActionLogEntry<GameUpdateData>> = {};
  actionLog.forEach((storedLogEntry) => {
    if (foundLogEntry || endOfTurn) {
      return;
    }

    const logEntry = storedLogEntry.data() as ActionLogEntry<GameUpdateData>;

    if (TURN_BOUNDARIES.includes(logEntry.data.action)) {
      endOfTurn = true;
    }

    const action = handler.getActionLogAction(logEntry);

    switch (action) {
      case "DELETE": {
        t.delete(gameRef.collection("actionLog").doc(storedLogEntry.id));
        foundLogEntry = true;
        return;
      }
      case "REPLACE": {
        const logEntry = handler.getLogEntry();
        logEntry.gameSeconds = gameTime;
        logEntry.timestampMillis = currentTimestampMillis;
        t.update(
          gameRef.collection("actionLog").doc(storedLogEntry.id),
          logEntry as Record<string, any>
        );
        foundLogEntry = true;
        return;
      }
      case "REWIND_AND_DELETE": {
        for (const [entryId, entry] of Object.entries(orderedEntries)) {
          t.delete(gameRef.collection("actionLog").doc(entryId));
          const undoHandler = getOppositeHandler(handler.gameData, entry.data);
          if (!undoHandler) {
            continue;
          }
          t.update(gameRef, convertToServerUpdates(undoHandler.getUpdates()));
        }
        t.delete(gameRef.collection("actionLog").doc(storedLogEntry.id));
        foundLogEntry = true;
        return;
      }
      case "REWIND_AND_REPLACE": {
        for (const [entryId, entry] of Object.entries(orderedEntries)) {
          t.delete(gameRef.collection("actionLog").doc(entryId));
          const undoHandler = getOppositeHandler(handler.gameData, entry.data);
          if (!undoHandler) {
            continue;
          }
          t.update(gameRef, convertToServerUpdates(undoHandler.getUpdates()));
        }
        const logEntry = handler.getLogEntry();
        logEntry.gameSeconds = gameTime;
        logEntry.timestampMillis = currentTimestampMillis;
        t.update(
          gameRef.collection("actionLog").doc(storedLogEntry.id),
          logEntry as Record<string, any>
        );
        foundLogEntry = true;
        return;
      }
    }

    orderedEntries[storedLogEntry.id] = logEntry;
  });

  if (foundLogEntry) {
    return;
  }

  insertLogEntry(gameRef, t, handler, gameTime, currentTimestampMillis);
}

function insertLogEntry(
  gameRef: DocumentReference<DocumentData>,
  t: Transaction,
  handler: Handler,
  gameTime: number,
  timestampMillis: number
) {
  const logEntry = handler.getLogEntry();
  logEntry.gameSeconds = gameTime;
  logEntry.timestampMillis = timestampMillis;

  t.create(gameRef.collection("actionLog").doc(), logEntry);
}

function updateInTransaction(
  db: Firestore,
  gameRef: DocumentReference<DocumentData>,
  timerRef: DocumentReference<DocumentData>,
  data: GameUpdateData & { timestamp: number },
  gameTime: number
) {
  return db.runTransaction(async (t) => {
    const gameData = await getGameDataInTransaction(gameRef, t);
    gameData.actionLog = await getCurrentTurnLogEntriesInTransaction(
      gameRef,
      t
    );
    const timers = await getTimersInTransaction(timerRef, t);

    // TODO: Validate actions.
    let handler: Optional<Handler>;
    // let updates: UpdateData<any> = {};
    switch (data.action) {
      case "ADD_TECH": {
        handler = new AddTechHandler(gameData, data);
        break;
      }
      case "REMOVE_TECH": {
        handler = new RemoveTechHandler(gameData, data);
        break;
      }
      case "REVEAL_OBJECTIVE": {
        handler = new RevealObjectiveHandler(gameData, data);
        break;
      }
      case "HIDE_OBJECTIVE": {
        handler = new HideObjectiveHandler(gameData, data);
        break;
      }
      case "ADVANCE_PHASE": {
        // Set values for ability to Undo
        data.event.factions = gameData.factions;
        data.event.state = gameData.state;
        data.event.strategycards = gameData.strategycards ?? {};
        handler = new AdvancePhaseHandler(gameData, data);
        break;
      }
      case "ASSIGN_STRATEGY_CARD": {
        handler = new AssignStrategyCardHandler(gameData, data);
        break;
      }
      case "CLAIM_PLANET": {
        handler = new ClaimPlanetHandler(gameData, data);
        break;
      }
      case "UNCLAIM_PLANET": {
        handler = new UnclaimPlanetHandler(gameData, data);
        break;
      }
      case "SELECT_ACTION": {
        handler = new SelectActionHandler(gameData, data);
        break;
      }
      case "END_TURN": {
        handler = new EndTurnHandler(gameData, data);
        break;
      }
      case "SET_SPEAKER": {
        data.event.prevSpeaker = gameData.state.speaker;
        handler = new SetSpeakerHandler(gameData, data);
        break;
      }
      case "SET_TYRANT": {
        if (gameData.state.tyrant) {
          data.event.prevTyrant = gameData.state.tyrant;
        }
        handler = new SetTyrantHandler(gameData, data);
        break;
      }
      case "MARK_SECONDARY": {
        handler = new MarkSecondaryHandler(gameData, data);
        break;
      }
      case "MARK_PRIMARY": {
        handler = new MarkPrimaryHandler(gameData, data);
        break;
      }
      case "SCORE_OBJECTIVE": {
        handler = new ScoreObjectiveHandler(gameData, data);
        break;
      }
      case "UNSCORE_OBJECTIVE": {
        handler = new UnscoreObjectiveHandler(gameData, data);
        break;
      }
      case "GIFT_OF_PRESCIENCE": {
        handler = new GiftOfPrescienceHandler(gameData, data);
        break;
      }
      case "SWAP_STRATEGY_CARDS": {
        handler = new SwapStrategyCardsHandler(gameData, data);
        break;
      }
      case "ADD_ATTACHMENT": {
        handler = new AddAttachmentHandler(gameData, data);
        break;
      }
      case "REMOVE_ATTACHMENT": {
        handler = new RemoveAttachmentHandler(gameData, data);
        break;
      }
      case "UNSELECT_ACTION": {
        handler = new UnselectActionHandler(gameData, data);
        break;
      }
      case "END_GAME": {
        handler = new EndGameHandler(gameData, data);
        break;
      }
      case "CONTINUE_GAME": {
        handler = new ContinueGameHandler(gameData, data);
        break;
      }
      case "MANUAL_VP_UPDATE": {
        handler = new ManualVPUpdateHandler(gameData, data);
        break;
      }
      case "MANUAL_VOTE_UPDATE": {
        handler = new ManualVoteUpdateHandler(gameData, data);
        break;
      }
      case "REVEAL_AGENDA": {
        handler = new RevealAgendaHandler(gameData, data);
        break;
      }
      case "HIDE_AGENDA": {
        handler = new HideAgendaHandler(gameData, data);
        break;
      }
      case "CAST_VOTES": {
        handler = new CastVotesHandler(gameData, data);
        break;
      }
      case "RESOLVE_AGENDA": {
        handler = new ResolveAgendaHandler(gameData, data);
        break;
      }
      case "REPEAL_AGENDA": {
        handler = new RepealAgendaHandler(gameData, data);
        break;
      }
      case "CHOOSE_STARTING_TECH": {
        handler = new ChooseStartingTechHandler(gameData, data);
        break;
      }
      case "REMOVE_STARTING_TECH": {
        handler = new RemoveStartingTechHandler(gameData, data);
        break;
      }
      case "CHOOSE_SUB_FACTION": {
        handler = new ChooseSubFactionHandler(gameData, data);
        break;
      }
      case "CHOOSE_TF_FACTION": {
        handler = new ChooseTFFactionHandler(gameData, data);
        break;
      }
      case "PLAY_ACTION_CARD": {
        handler = new PlayActionCardHandler(gameData, data);
        break;
      }
      case "UNPLAY_ACTION_CARD": {
        handler = new UnplayActionCardHandler(gameData, data);
        break;
      }
      case "PLAY_PROMISSORY_NOTE": {
        handler = new PlayPromissoryNoteHandler(gameData, data);
        break;
      }
      case "UNPLAY_PROMISSORY_NOTE": {
        handler = new UnplayPromissoryNoteHandler(gameData, data);
        break;
      }
      case "PLAY_COMPONENT": {
        handler = new PlayComponentHandler(gameData, data);
        break;
      }
      case "UNPLAY_COMPONENT": {
        handler = new UnplayComponentHandler(gameData, data);
        break;
      }
      case "GAIN_RELIC": {
        handler = new GainRelicHandler(gameData, data);
        break;
      }
      case "LOSE_RELIC": {
        handler = new LoseRelicHandler(gameData, data);
        break;
      }
      case "GAIN_ALLIANCE": {
        handler = new GainAllianceHandler(gameData, data);
        break;
      }
      case "LOSE_ALLIANCE": {
        handler = new LoseAllianceHandler(gameData, data);
        break;
      }
      case "UPDATE_PLANET_STATE": {
        handler = new UpdatePlanetStateHandler(gameData, data);
        break;
      }
      case "SELECT_FACTION": {
        handler = new SelectFactionHandler(gameData, data);
        break;
      }
      case "SELECT_SUB_COMPONENT": {
        handler = new SelectSubComponentHandler(gameData, data);
        break;
      }
      case "SELECT_ELIGIBLE_OUTCOMES": {
        handler = new SelectEligibleOutcomesHandler(gameData, data);
        break;
      }
      case "PLAY_RIDER": {
        handler = new PlayRiderHandler(gameData, data);
        break;
      }
      case "UNPLAY_RIDER": {
        handler = new UnplayRiderHandler(gameData, data);
        break;
      }
      case "SELECT_SUB_AGENDA": {
        handler = new SelectSubAgendaHandler(gameData, data);
        break;
      }
      case "SET_OBJECTIVE_POINTS": {
        handler = new SetObjectivePointsHandler(gameData, data);
        break;
      }
      case "SPEAKER_TIE_BREAK": {
        handler = new SpeakerTieBreakHandler(gameData, data);
        break;
      }
      case "UPDATE_LEADER_STATE": {
        handler = new UpdateLeaderStateHandler(gameData, data);
        break;
      }
      case "START_VOTING": {
        handler = new StartVotingHandler(gameData, data);
        break;
      }
      case "PLAY_RELIC": {
        handler = new PlayRelicHandler(gameData, data);
        break;
      }
      case "UNPLAY_RELIC": {
        handler = new UnplayRelicHandler(gameData, data);
        break;
      }
      case "PLAY_ADJUDICATOR_BAAL":
        handler = new PlayAdjudicatorBaalHandler(gameData, data);
        break;
      case "UNDO_ADJUDICATOR_BAAL":
        handler = new UndoAdjudicatorBaalHandler(gameData, data);
        break;
      case "SWAP_MAP_TILES":
        handler = new SwapMapTilesHandler(gameData, data);
        break;
      case "UPDATE_BREAKTHROUGH_STATE":
        handler = new UpdateBreakthroughStateHandler(gameData, data);
        break;
      case "COMMIT_TO_EXPEDITION":
        handler = new CommitToExpeditionHandler(gameData, data);
        break;
      case "PURGE_TECH":
        handler = new PurgeTechHandler(gameData, data);
        break;
      case "UNPURGE_TECH":
        handler = new UnpurgeTechHandler(gameData, data);
        break;
      case "UNPASS":
        handler = new UnpassHandler(gameData, data);
        break;
      case "PASS":
        handler = new PassHandler(gameData, data);
        break;
      case "PURGE_SYSTEM":
        handler = new PurgeSystemHandler(gameData, data);
        break;
      case "UNPURGE_SYSTEM":
        handler = new UnpurgeSystemHandler(gameData, data);
        break;
      case "TOGGLE_STRUCTURE":
        handler = new ToggleStructureHandler(gameData, data);
        break;
      case "GAIN_TF_CARD":
        handler = new GainTFCardHandler(gameData, data);
        break;
      case "LOSE_TF_CARD":
        handler = new LoseTFCardHandler(gameData, data);
        break;

      case "UNDO": {
        const actionToUndo = (gameData.actionLog ?? [])[0];

        if (!actionToUndo) {
          return true;
        }

        handler = getOppositeHandler(gameData, actionToUndo.data);
        break;
      }
    }

    if (!handler) {
      throw new Error(`Action ${data.action} not implemented`);
    }

    if (!handler.validate()) {
      console.log(`Action ${data.action} failed to validate`);
      return true;
    }

    let updates = convertToServerUpdates(handler.getUpdates());

    updates[`lastUpdate`] = data.timestamp;
    // Needs to happen after handler.getUpdates();
    await updateActionLog(gameRef, t, handler, gameTime);

    if (Object.keys(updates).length > 0) {
      t.update(gameRef, updates);
    }
    const timerUpdates: Record<string, any> = {
      paused: "DELETE",
    };
    if (
      data.action === "PLAY_COMPONENT" &&
      data.event.name === "Puppets of the Blade"
    ) {
      timerUpdates["Obsidian"] = timers["Firmament"] ?? 0;
      timerUpdates["Obsidian-secondary"] = timers["Firmament-secondary"] ?? 0;
      timerUpdates["Firmament"] = "DELETE";
      timerUpdates["Firmament-secondary"] = "DELETE";
    }
    if (
      data.action === "UNPLAY_COMPONENT" &&
      data.event.name === "Puppets of the Blade"
    ) {
      timerUpdates["Firmament"] = timers["Obsidian"] ?? 0;
      timerUpdates["Firmament-secondary"] = timers["Obsidian-secondary"] ?? 0;
      timerUpdates["Obsidian"] = "DELETE";
      timerUpdates["Obsidian-secondary"] = "DELETE";
    }
    t.update(timerRef, convertToServerUpdates(timerUpdates));

    return false;
  });
}
