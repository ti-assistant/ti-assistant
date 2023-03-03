import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import {
  fetchAttachments,
  fetchComponents,
  fetchObjectives,
  fetchPlanets,
} from "../../../server/util/fetch";
import { Component } from "../../../src/util/api/components";
import { SubStateUpdateData } from "../../../src/util/api/subState";
import { GameData } from "../../../src/util/api/util";
import { shouldUnlockXxchaCommander } from "./planetUpdate";

function usedComponentState(component: Component) {
  switch (component.type) {
    case "card":
      return "used";
    case "leader":
      return component.leader === "hero" ? "purged" : "exhausted";
    case "tech":
      return "exhausted";
    case "relic":
      if (component.name === "Gain Relic") {
        return "active";
      }
      if (component.name === "JR-XS455-O") {
        return "exhausted";
      }
      if (component.name === "Enigmatic Device") {
        if (component.state === "one-left") {
          return "purged";
        }
        return "one-left";
      }
      return "purged";
  }
  return "active";
}

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
    res.status(422).send({ message: "Game ID required" });
    return;
  }
  const db = getFirestore();

  const gameRef = await db.collection("games").doc(gameId).get();

  if (!gameRef.exists) {
    res.status(404).send({ message: "Valid Game ID required" });
    return;
  }

  const gameData = gameRef.data() as GameData;

  const data = req.body as SubStateUpdateData;

  if (!data.action || !data.timestamp) {
    res.status(422).send({ message: "Missing Action" });
    return;
  }

  let updates: UpdateData<any> = {};
  const timestampString = `updates.substate.timestamp`;
  const timestamp = Timestamp.fromMillis(data.timestamp);
  switch (data.action) {
    case "CLEAR_SUB_STATE": {
      updates = {
        subState: FieldValue.delete(),
      };
      break;
    }
    case "SET_ACTION": {
      if (!data.actionName) {
        res.status(422).send({ message: "Missing Action Name" });
        return;
      }
      updates = {
        subState: {
          selectedAction: data.actionName,
        },
        [timestampString]: timestamp,
      };
      break;
    }
    case "SET_SPEAKER": {
      if (!data.factionName) {
        res.status(422).send({ message: "Missing Faction Name" });
        return;
      }
      updates = {
        "subState.speaker": data.factionName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNDO_SPEAKER": {
      updates = {
        "subState.speaker": FieldValue.delete(),
        [timestampString]: timestamp,
      };
      break;
    }
    case "ADD_TECH": {
      if (!data.factionName || !data.techName) {
        res.status(422).send({ message: "Missing Faction Name or Tech Name" });
        return;
      }
      const tech = data.techName
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const techString = `subState.factions.${data.factionName}.techs`;
      updates = {
        [techString]: FieldValue.arrayUnion(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CLEAR_ADDED_TECH": {
      if (!data.factionName || !data.techName) {
        res.status(422).send({ message: "Missing Faction Name or Tech Name" });
        return;
      }
      const tech = data.techName
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const techString = `subState.factions.${data.factionName}.techs`;
      updates = {
        [techString]: FieldValue.arrayRemove(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_TECH": {
      if (!data.factionName || !data.techName) {
        res.status(422).send({ message: "Missing Faction Name or Tech Name" });
        return;
      }
      const tech = data.techName
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const techString = `subState.factions.${data.factionName}.removeTechs`;
      updates = {
        [techString]: FieldValue.arrayUnion(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CLEAR_REMOVED_TECH": {
      if (!data.factionName || !data.techName) {
        res.status(422).send({ message: "Missing Faction Name or Tech Name" });
        return;
      }
      const tech = data.techName
        .replace(/\//g, "")
        .replace(/\./g, "")
        .replace(" Ω", "");
      const techString = `subState.factions.${data.factionName}.removeTechs`;
      updates = {
        [techString]: FieldValue.arrayRemove(tech),
        [timestampString]: timestamp,
      };
      break;
    }
    case "ADD_PLANET": {
      if (!data.factionName || !data.planetName) {
        res
          .status(422)
          .send({ message: "Missing Faction Name or Planet Name" });
        return;
      }
      const planetString = `subState.factions.${data.factionName}.planets`;
      updates = {
        [planetString]: FieldValue.arrayUnion(data.planetName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_PLANET": {
      if (!data.factionName || !data.planetName) {
        res
          .status(422)
          .send({ message: "Missing Faction Name or Planet Name" });
        return;
      }
      const planetString = `subState.factions.${data.factionName}.planets`;
      updates = {
        [planetString]: FieldValue.arrayRemove(data.planetName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "SCORE_OBJECTIVE": {
      if (!data.factionName || !data.objectiveName) {
        res
          .status(422)
          .send({ message: "Missing Faction Name or Objective Name" });
        return;
      }
      const objectiveString = `subState.factions.${data.factionName}.objectives`;
      updates = {
        [objectiveString]: FieldValue.arrayUnion(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNSCORE_OBJECTIVE": {
      if (!data.factionName || !data.objectiveName) {
        res
          .status(422)
          .send({ message: "Missing Faction Name or Objective Name" });
        return;
      }
      const objectiveString = `subState.factions.${data.factionName}.objectives`;
      updates = {
        [objectiveString]: FieldValue.arrayRemove(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "CAST_VOTES": {
      if (!data.factionName || data.numVotes == undefined) {
        res.status(422).send({ message: "Missing Faction Name or Num Votes" });
        return;
      }
      const voteString = `subState.factions.${data.factionName}.votes`;
      const targetString = `subState.factions.${data.factionName}.target`;
      updates = {
        [voteString]: data.numVotes,
        [targetString]: data.target ?? FieldValue.delete(),
        [timestampString]: timestamp,
        "subState.tieBreak": FieldValue.delete(),
      };
      break;
    }
    case "REVEAL_OBJECTIVE": {
      if (!data.objectiveName) {
        res.status(422).send({ message: "Missing Objective Name" });
        return;
      }
      updates = {
        "subState.objectives": FieldValue.arrayUnion(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "HIDE_OBJECTIVE": {
      if (!data.objectiveName) {
        res.status(422).send({ message: "Missing Objective Name" });
        return;
      }
      updates = {
        "subState.objectives": FieldValue.arrayRemove(data.objectiveName),
        [timestampString]: timestamp,
      };
      break;
    }
    case "REVEAL_AGENDA": {
      if (!data.agendaName) {
        res.status(422).send({ message: "Missing Agenda Name" });
        return;
      }
      updates = {
        "subState.agenda": data.agendaName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "HIDE_AGENDA": {
      updates = {
        "subState.agenda": FieldValue.delete(),
        [timestampString]: timestamp,
        "subState.tieBreak": FieldValue.delete(),
        "subState.outcome": FieldValue.delete(),
        "subState.riders": FieldValue.delete(),
        "subState.Assassinate Representative": FieldValue.delete(),
        "subState.Hack Election": FieldValue.delete(),
      };
      Object.keys(gameData.factions).forEach((factionName) => {
        const voteString = `subState.factions.${factionName}.votes`;
        const targetString = `subState.factions.${factionName}.target`;
        updates[voteString] = FieldValue.delete();
        updates[targetString] = FieldValue.delete();
      });
      break;
    }
    case "REPEAL_AGENDA": {
      if (!data.agendaName) {
        res.status(422).send({ message: "Missing Agenda Name" });
        return;
      }
      updates = {
        "subState.repealedAgenda": data.agendaName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "REMOVE_REPEALED_AGENDA": {
      updates = {
        "subState.repealedAgenda": FieldValue.delete(),
        [timestampString]: timestamp,
      };
      break;
    }
    case "PICK_STRATEGY_CARD": {
      if (!data.cardName || !data.factionName) {
        res.status(422).send({ message: "Missing Faction Name or Card Name" });
        return;
      }
      const strategyCards = gameData.subState?.strategyCards ?? [];
      // Make sure we don't assign too many cards to the same faction.
      const numSelected = strategyCards.reduce((count, card) => {
        if (card.factionName === data.factionName) {
          return count + 1;
        }
        return count;
      }, 0);
      const numFactions = Object.keys(gameData.factions).length;
      if (numSelected > 0 && numFactions > 4) {
        break;
      }
      if (numSelected > 1) {
        break;
      }
      strategyCards.push({
        cardName: data.cardName,
        factionName: data.factionName,
      });
      updates = {
        "subState.strategyCards": strategyCards,
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNDO_STRATEGY_CARD": {
      const strategyCards = gameData.subState?.strategyCards ?? [];
      strategyCards.pop();
      updates = {
        "subState.strategyCards": strategyCards,
        [timestampString]: timestamp,
      };
      break;
    }
    case "SWAP_STRATEGY_CARDS": {
      if (!data.cardOneName || !data.cardTwoName) {
        res
          .status(422)
          .send({ message: "Missing Card Name or Other Card Name" });
        return;
      }
      const strategyCards = gameData.subState?.strategyCards ?? [];
      // let factionOne: string | undefined;
      // let factionTwo: string | undefined;
      strategyCards.forEach((card) => {
        if (!data.cardOneName || !data.cardTwoName) {
          return;
        }
        if (card.cardName === data.cardOneName) {
          card.cardName = data.cardTwoName;
        } else if (card.cardName === data.cardTwoName) {
          card.cardName = data.cardOneName;
        }
      });

      // if (!factionOne || !factionTwo) {
      //   res.status(422);
      //   return;
      // }

      // strategyCards.forEach((card) => {
      //   if (factionTwo && card.cardName === data.cardOneName) {
      //     card.factionName = factionTwo;
      //   }
      //   if (factionOne && card.cardName === data.cardTwoName) {
      //     card.factionName = factionOne;
      //   }
      // });
      updates = {
        "subState.strategyCards": strategyCards,
        [timestampString]: timestamp,
      };
      break;
    }
    case "PLAY_RIDER": {
      if (!data.riderName) {
        res
          .status(422)
          .send({ message: "Missing Faction Name or Rider Name or Outcome" });
        return;
      }

      const rider: { factionName?: string; outcome?: string } = {};
      if (data.factionName) {
        rider.factionName = data.factionName;
      }
      if (data.outcome) {
        rider.outcome = data.outcome;
      }

      updates = {
        [`subState.riders.${data.riderName}`]: rider,
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNDO_RIDER": {
      if (!data.riderName) {
        res.status(422).send({ message: "Missing Rider Name" });
        return;
      }
      updates = {
        [`subState.riders.${data.riderName}`]: FieldValue.delete(),
        [timestampString]: timestamp,
      };
      break;
    }
    case "MARK_SECONDARY": {
      if (!data.factionName || !data.secondary) {
        res.status(422).send({ message: "Missing values" });
        return;
      }
      updates = {
        [`subState.factions.${data.factionName}.secondary`]: data.secondary,
        [timestampString]: timestamp,
      };
      break;
    }
    case "SET_OTHER_FIELD": {
      if (!data.fieldName) {
        res.status(422).send({ message: "Missing Field Name " });
      }
      const newFieldString = `subState.${data.fieldName}`;
      updates = {
        [newFieldString]: data.value ?? FieldValue.delete(),
        [timestampString]: timestamp,
      };
      break;
    }
    case "FINALIZE_SUB_STATE":
      {
        const subState = gameData.subState ?? {};
        const gameLog = gameData.gameLog ?? [];
        gameLog.push(subState);
        const gameObjectives = await fetchObjectives(
          gameId,
          req.cookies.secret ?? ""
        );
        const gamePlanets = await fetchPlanets(gameId);
        const attachments = await fetchAttachments(gameId);
        const components = await fetchComponents(gameId);
        updates = {
          subState: FieldValue.delete(),
          gameLog: gameLog,
          [timestampString]: timestamp,
        };
        if (subState.component) {
          const component = components[subState.component];
          if (component) {
            const futureState = usedComponentState(component);
            if (futureState !== "active") {
              updates[`components.${subState.component}.state`] = futureState;
              updates[`updates.components.timestamp`] = timestamp;
            }
            if (component.type === "leader" && component.leader === "hero") {
              updates[`factions.${component.faction}.hero`] = "purged";
              updates[`updates.factions.timestamp`] = timestamp;
            }
          }
        }
        for (const [factionName, value] of Object.entries(
          subState.factions ?? {}
        )) {
          // NOTE: Pretty sure this won't actually work properly...
          for (const planet of value.planets ?? []) {
            const planetName = planet === "[0.0.0]" ? "000" : planet;
            if (factionName === "Xxcha Kingdom") {
              if (
                await shouldUnlockXxchaCommander(
                  {
                    action: "ADD_PLANET",
                    planet: planetName,
                  },
                  gameData,
                  gamePlanets,
                  attachments
                )
              ) {
                updates[`factions.Xxcha Kingdom.commander`] = "unlocked";
                updates[`updates.factions.timestamp`] = timestamp;
              }
            }
          }
          if (
            (value.objectives ?? []).length > 0 &&
            gameData.factions[factionName]?.hero === "locked"
          ) {
            const scoredObjectives = Object.entries(gameObjectives).filter(
              ([objectiveID, objective]) => {
                return (
                  objective.type !== "other" &&
                  ((objective.scorers ?? []).includes(factionName) ||
                    (value.objectives ?? []).includes(objectiveID))
                );
              }
            ).length;
            if (scoredObjectives >= 3) {
              updates[`factions.${factionName}.hero`] = "unlocked";
              updates[`updates.factions.timestamp`] = timestamp;
            }
          }
        }
      }
      break;
  }
  await db.collection("games").doc(gameId).update(updates);

  const responseRef = await db.collection("games").doc(gameId).get();

  const responseData = responseRef.data() as GameData;

  return res.status(200).json(responseData.subState ?? {});
}
