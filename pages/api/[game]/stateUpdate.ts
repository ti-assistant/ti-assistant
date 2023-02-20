import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { fetchFactions, fetchStrategyCards } from "../../../server/util/fetch";
import { StateUpdateData } from "../../../src/util/api/state";
import { GameData } from "../../../src/util/api/util";
import { getOnDeckFaction } from "../../../src/util/helpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const gameId = req.query.game;

  if (typeof gameId !== "string") {
    res.status(422);
    return;
  }
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  const data = req.body as StateUpdateData;

  if (!data.timestamp) {
    res.status(422);
    return;
  }

  const timestampString = `updates.state.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "ADVANCE_PHASE": {
      const updates: UpdateData<any> = {
        [timestampString]: timestamp,
      };
      switch (gameData.state.phase) {
        case "SETUP": {
          updates["state.phase"] = "STRATEGY";
          updates["state.activeplayer"] = gameData.state.speaker;
          break;
        }
        case "STRATEGY": {
          updates["state.phase"] = "ACTION";
          let minCard = Number.MAX_SAFE_INTEGER;
          let minFaction: string | undefined;
          const strategyCards = await fetchStrategyCards(gameId);
          for (const strategyCard of Object.values(strategyCards)) {
            if (strategyCard.faction && strategyCard.order < minCard) {
              minCard = strategyCard.order;
              minFaction = strategyCard.faction;
            }
          }
          if (!minFaction) {
            throw Error("Transition to ACTION phase w/o selecting cards?");
          }
          updates["state.activeplayer"] = minFaction;
          break;
        }
        case "ACTION": {
          updates["state.phase"] = "STATUS";
          let minCard = Number.MAX_SAFE_INTEGER;
          let minFaction: string | undefined;
          const strategyCards = await fetchStrategyCards(gameId);
          for (const strategyCard of Object.values(strategyCards)) {
            if (strategyCard.faction && strategyCard.order < minCard) {
              minCard = strategyCard.order;
              minFaction = strategyCard.faction;
            }
          }
          if (minFaction) {
            updates["state.activeplayer"] = minFaction;
          } else {
            updates["state.activeplayer"] = gameData.state.speaker;
          }
          break;
        }
        case "STATUS": {
          updates["state.activeplayer"] = gameData.state.speaker;
          if (data.skipAgenda) {
            updates["state.phase"] = "STRATEGY";
            updates["state.round"] = gameData.state.round + 1;
          } else {
            updates["state.phase"] = "AGENDA";
            updates["state.agendaNum"] = 1;
            updates["state.agendaUnlocked"] = true;
          }
          break;
        }
        case "AGENDA": {
          updates["state.phase"] = "STRATEGY";
          updates["state.round"] = gameData.state.round + 1;
          updates["state.activeplayer"] = gameData.state.speaker;
          updates["state.agendaNum"] = 1;
          break;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "START_NEXT_ROUND": {
      const updates: UpdateData<any> = {
        "state.phase": "STRATEGY",
        "state.activeplayer": gameData.state.speaker,
        "state.round": gameData.state.round + 1,
        "state.agendaNum": 1,
        [timestampString]: timestamp,
      };
      // Un-exhaust all exhausted components.
      for (const [componentName, component] of Object.entries(
        gameData.components ?? {}
      )) {
        if (component.state === "exhausted") {
          updates[`components.${componentName}.state`] = FieldValue.delete();
          updates[`updates.components.timestamp`] = timestamp;
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "ADVANCE_PLAYER": {
      const factions = await fetchFactions(gameId);
      const strategyCards = await fetchStrategyCards(gameId);
      const onDeckFaction = getOnDeckFaction(
        gameData.state,
        factions,
        strategyCards
      );
      await db
        .collection("games")
        .doc(gameId)
        .update({
          "state.activeplayer": onDeckFaction ? onDeckFaction.name : "None",
          [timestampString]: timestamp,
        });
      break;
    }
    case "SET_SPEAKER": {
      if (!data.speaker) {
        res.status(422);
        return;
      }
      const updates: UpdateData<any> = {
        "state.speaker": data.speaker,
        [timestampString]: timestamp,
      };

      // Update current player if in strategy phase.
      switch (gameData.state.phase) {
        case "STRATEGY":
          if (gameData.state.speaker === gameData.state.activeplayer) {
            updates["state.activeplayer"] = data.speaker;
          }
          break;
      }

      const currentOrder = gameData.factions[data.speaker]?.order ?? 1;
      for (const [name, faction] of Object.entries(gameData.factions)) {
        let factionOrder = faction.order - currentOrder + 1;
        if (factionOrder < 1) {
          factionOrder += Object.keys(gameData.factions).length;
        }
        const factionString = `factions.${name}.order`;
        updates[factionString] = factionOrder;
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "END_GAME": {
      const updates = {
        "state.finalPhase": gameData.state.phase,
        "state.phase": "END",
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "CONTINUE_GAME": {
      const updates = {
        "state.finalPhase": FieldValue.delete(),
        "state.phase": gameData.state.finalPhase,
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "SET_AGENDA_NUM": {
      if (!data.agendaNum) {
        res.status(422);
        return;
      }
      const updates = {
        "state.agendaNum": data.agendaNum,
        [timestampString]: timestamp,
      };
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
  }

  const responseRef = await db.collection("games").doc(gameId).get();

  const responseData = responseRef.data() as GameData;

  return res.status(200).json(responseData.state);
}
