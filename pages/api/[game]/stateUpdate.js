import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

import { fetchComponents, fetchStrategyCards } from '../../../server/util/fetch';
import { getOnDeckFaction } from '../../../src/util/helpers';

function getNextFaction(factions, nextorder) {
  for (const faction of Object.values(factions)) {
    if (faction.order === nextorder) {
      return faction;
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const timestampString = `updates.state.timestamp`;
  switch (data.action) {
    case "ADVANCE_PHASE":
      let nextPhase;
      let activeFaction;
      let round = gameRef.data().state.round ?? 1;
      let agendaUnlocked = gameRef.data().state.agendaUnlocked ?? false;
      switch (gameRef.data().state.phase) {
        case "SETUP":
          nextPhase = "STRATEGY";
          activeFaction = gameRef.data().factions[gameRef.data().state.speaker];
          break;
        case "STRATEGY":
          nextPhase = "ACTION";
          let minCard = {
            order: Number.MAX_SAFE_INTEGER,
          };
          const strategyCards = await fetchStrategyCards(gameid);
          for (const strategyCard of Object.values(strategyCards)) {
            if (strategyCard.faction && strategyCard.order < minCard.order) {
              minCard = strategyCard;
            }
          }
          if (!minCard.faction) {
            throw Error("Transition to ACTION phase w/o selecting cards?");
          }
          activeFaction = gameRef.data().factions[minCard.faction];
          break;
        case "ACTION":
          nextPhase = "STATUS";
          break;
        case "STATUS":
          nextPhase = data.skipAgenda ? "STRATEGY" : "AGENDA";
          agendaUnlocked = !data.skipAgenda;
          if (data.skipAgenda) {
            activeFaction = gameRef.data().factions[gameRef.data().state.speaker];
            ++round;
          }
          break;
        case "AGENDA":
          nextPhase = "STRATEGY";
          activeFaction = gameRef.data().factions[gameRef.data().state.speaker];
          ++round;
          break;
      }
      if (!nextPhase) {
        return res.status(500);
      }
      await db.collection('games').doc(gameid).update({
        "state.phase": nextPhase,
        "state.activeplayer": activeFaction ? activeFaction.name : "None",
        "state.agendaUnlocked": agendaUnlocked,
        "state.round": round,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "START_NEXT_ROUND": {
      const state = gameRef.data().state;
      const updates = {
        "state.phase": "STRATEGY",
        "state.activeplayer": state.speaker,
        "state.round": state.round + 1,
        "state.agendaNum": 1,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      // Un-exhaust all exhausted components.
      const components = await fetchComponents(gameid);
      for (const [componentName, component] of Object.entries(components ?? {})) {
        if (component.state === "exhausted") {
          updates[`components.${componentName}.state`] = FieldValue.delete();
          updates[`updates.components.timestamp`] = Timestamp.fromMillis(data.timestamp);
        }
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "ADVANCE_PLAYER":
      const factions = gameRef.data().factions;
      const strategyCards = await fetchStrategyCards(gameid);
      const onDeckFaction = getOnDeckFaction(gameRef.data().state, factions, strategyCards);
      await db.collection('games').doc(gameid).update({
        "state.activeplayer": onDeckFaction ? onDeckFaction.name : "None",
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "SET_SPEAKER": {
      const updates = {
        "state.speaker": data.speaker,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      switch (gameRef.data().state.phase) {
        case "STRATEGY":
          if (gameRef.data().state.speaker === gameRef.data().state.activeplayer) {
            updates['state.activeplayer'] = data.speaker;
          }
          break;
      }
        
      const currentOrder = gameRef.data().factions[data.speaker].order;
      for (const [name, faction] of Object.entries(gameRef.data().factions)) {
        let factionOrder = faction.order - currentOrder + 1;
        if (factionOrder < 1) {
          factionOrder += Object.keys(gameRef.data().factions).length;
        }
        const factionString = `factions.${name}.order`;
        updates[factionString] = factionOrder;
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "SET_GAME_TIMER": {
      const timer = gameRef.data().state.timer ?? 0;
      if (data.timer > timer) {
        await db.collection('games').doc(gameid).update({
          "state.timer": data.timer,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "END_GAME": {
      const state = gameRef.data().state ?? {};
      const updates = {
        "state.finalPhase": state.phase,
        "state.phase": "END",
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "CONTINUE_GAME": {
      const state = gameRef.data().state ?? {};
      const updates = {
        "state.finalPhase": FieldValue.delete(),
        "state.phase": state.finalPhase,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "SET_AGENDA_NUM": {
      const updates = {
        "state.agendaNum": data.agendaNum,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
  }

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data().state);
}