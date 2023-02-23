import { fetchStrategyCards } from "../../../server/util/fetch";

import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { GameData } from "../../../src/util/api/util";
import { StrategyCardUpdateData } from "../../../src/util/api/cards";

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
  const data = req.body as StrategyCardUpdateData;

  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404);
    return;
  }

  const gameData = gameRef.data() as GameData;

  if (!data.timestamp || !data.action) {
    res.status(422);
    return;
  }

  const timestampString = `updates.strategycards.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "ASSIGN_STRATEGY_CARD": {
      if (!data.card || !data.faction) {
        res.status(422);
        return;
      }
      const factionString = `strategycards.${data.card}.faction`;
      const updates: UpdateData<any> = {
        [factionString]: data.faction,
        [timestampString]: timestamp,
      };
      for (const [name, card] of Object.entries(gameData.strategycards ?? {})) {
        if (card.invalid) {
          const invalidString = `strategycards.${name}.invalid`;
          updates[invalidString] = FieldValue.delete();
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "SWAP_STRATEGY_CARDS": {
      if (!data.cardOne || !data.cardTwo) {
        res.status(422);
        return;
      }
      const factionOneString = `strategycards.${data.cardOne}.faction`;
      const factionTwoString = `strategycards.${data.cardTwo}.faction`;
      const cardOne = (gameData.strategycards ?? {})[data.cardOne];
      const cardTwo = (gameData.strategycards ?? {})[data.cardTwo];
      const factionOne = cardOne?.faction;
      const factionTwo = cardTwo?.faction;

      if (!factionOne || !factionTwo) {
        res.status(422);
        return;
      }

      const updates: UpdateData<any> = {
        [factionOneString]: factionTwo,
        [factionTwoString]: factionOne,
        [timestampString]: timestamp,
      };

      const cardOneOrder = `strategycards.${data.cardOne}.order`;
      const cardTwoOrder = `strategycards.${data.cardTwo}.order`;
      if (cardOne.order === 0) {
        updates[cardOneOrder] = FieldValue.delete();
        updates[cardTwoOrder] = 0;
      } else if (cardTwo.order === 0) {
        updates[cardTwoOrder] = FieldValue.delete();
        updates[cardOneOrder] = 0;
      }

      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "PUBLIC_DISGRACE": {
      if (!data.card) {
        res.status(422);
        return;
      }
      const factionString = `strategycards.${data.card}.faction`;
      const currentFaction = (gameData.strategycards ?? {})[data.card]?.faction;
      if (!currentFaction) {
        res.status(422);
        return;
      }
      const updates = {
        [factionString]: FieldValue.delete(),
        "state.activeplayer": currentFaction,
        [timestampString]: timestamp,
        [`updates.state.timestamp`]: timestamp,
      };
      let numPickedCards = 0;
      for (const [name, card] of Object.entries(gameData.strategycards ?? {})) {
        if (card.invalid && name !== data.card) {
          const invalidString = `strategycards.${name}.invalid`;
          updates[invalidString] = FieldValue.delete();
        }
        if (card.faction) {
          numPickedCards++;
        }
      }

      const orderString = `strategycards.${data.card}.order`;
      updates[orderString] = FieldValue.delete();
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "GIFT_OF_PRESCIENCE": {
      if (!data.card) {
        res.status(422);
        return;
      }
      const orderString = `strategycards.${data.card}.order`;
      const updates: UpdateData<any> = {
        [orderString]: 0,
        [timestampString]: timestamp,
      };
      for (const [name, card] of Object.entries(gameData.strategycards ?? {})) {
        if (card.order === 0) {
          const orderString = `strategycards.${name}.order`;
          updates[orderString] = FieldValue.delete();
        }
      }
      await db.collection("games").doc(gameId).update(updates);
      break;
    }
    case "USE_STRATEGY_CARD": {
      if (!data.card) {
        res.status(422);
        return;
      }
      const usedString = `strategycards.${data.card}.used`;
      await db
        .collection("games")
        .doc(gameId)
        .update({
          [usedString]: true,
          [timestampString]: timestamp,
        });
      break;
    }
    case "CLEAR_STRATEGY_CARDS": {
      for (const card of Object.keys(gameData.strategycards ?? {})) {
        const usedString = `strategycards.${card}.used`;
        const cardString = `strategycards.${card}.faction`;
        const orderString = `strategycards.${card}.order`;
        await db
          .collection("games")
          .doc(gameId)
          .update({
            [cardString]: FieldValue.delete(),
            [orderString]: FieldValue.delete(),
            [usedString]: FieldValue.delete(),
            [timestampString]: timestamp,
          });
      }
      break;
    }
  }

  const strategyCards = await fetchStrategyCards(gameId);

  res.status(200).json(strategyCards);
}
