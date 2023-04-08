import {
  getFirestore,
  FieldValue,
  Timestamp,
  UpdateData,
} from "firebase-admin/firestore";
import { defaultAppStore } from "firebase-admin/lib/app/lifecycle";
import { NextApiRequest, NextApiResponse } from "next";

import {
  fetchAttachments,
  fetchComponents,
  fetchObjectives,
  fetchPlanets,
} from "../../../server/util/fetch";
import { writeLogEntry } from "../../../server/util/write";
import { Component } from "../../../src/util/api/components";
import {
  PlanetEvent,
  RelicEvent,
  SubStateUpdateData,
} from "../../../src/util/api/subState";
import { GameData } from "../../../src/util/api/util";
import { shouldUnlockXxchaCommander } from "./planetUpdate";

function usedComponentState(component: Component) {
  switch (component.type) {
    case "CARD":
      return "used";
    case "LEADER":
      return component.leader === "HERO" ? "purged" : "exhausted";
    case "TECH":
      return "exhausted";
    case "RELIC":
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
    case "PROMISSORY":
      if (component.name === "Terraform") {
        return "purged";
      }
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
        "subState.turnData": {
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
        "subState.turnData.speaker": data.factionName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "SELECT_COMPONENT": {
      if (!data.componentName) {
        res.status(422).send({ message: "Missing Component Name" });
        return;
      }
      updates = {
        "subState.turnData.component.name": data.componentName,
        [timestampString]: timestamp,
      };
      break;
    }
    case "UNDO_SPEAKER": {
      updates = {
        "subState.turnData.speaker": FieldValue.delete(),
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
      const techString = `subState.turnData.factions.${data.factionName}.techs`;
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
      const techString = `subState.turnData.factions.${data.factionName}.techs`;
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
      const techString = `subState.turnData.factions.${data.factionName}.removeTechs`;
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
      const techString = `subState.turnData.factions.${data.factionName}.removeTechs`;
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
      const planetString = `subState.turnData.factions.${data.factionName}.planets`;
      const updateValue: PlanetEvent = {
        name: data.planetName,
      };
      if (data.prevOwner) {
        updateValue.prevOwner = data.prevOwner;
      }
      updates = {
        [planetString]: FieldValue.arrayUnion(updateValue),
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
      const planets = (gameData.subState?.turnData?.factions ?? {})[
        data.factionName
      ]?.planets;
      if (!planets) {
        break;
      }
      const planetString = `subState.turnData.factions.${data.factionName}.planets`;
      updates = {
        [planetString]: planets.filter(
          (planet) => planet.name !== data.planetName
        ),
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
      const objectiveString = `subState.turnData.factions.${data.factionName}.objectives`;
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
      const objectiveString = `subState.turnData.factions.${data.factionName}.objectives`;
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
      if (!data.cardEvent) {
        res.status(422).send({ message: "Missing card event" });
        return;
      }
      const strategyCards = gameData.subState?.strategyCards ?? [];
      // Make sure we don't assign too many cards to the same faction.
      const numSelected = strategyCards.reduce((count, card) => {
        if (card.assignedTo === data.cardEvent?.assignedTo) {
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
      strategyCards.push(data.cardEvent);
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
        if (card.name === data.cardOneName) {
          card.name = data.cardTwoName;
        } else if (card.name === data.cardTwoName) {
          card.name = data.cardOneName;
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
    case "TOGGLE_RELIC": {
      if (!data.factionName) {
        res.status(422).send({ message: "Missing faction name" });
        return;
      }
      const relicString = `subState.turnData.factions.${data.factionName}.relic`;
      let updateValue: FieldValue | RelicEvent = FieldValue.delete();
      if (data.relicName) {
        const prevOwner = (gameData.relics ?? {})[data.relicName]?.owner;
        updateValue = {
          name: data.relicName,
        };
        if (prevOwner) {
          updateValue.prevOwner = prevOwner;
        }
      }
      updates = {
        [relicString]: updateValue,
        [timestampString]: timestamp,
      };
      break;
    }
    case "DESTROY_PLANET": {
      const planetString = `subState.turnData.destroyedPlanet`;
      let updateValue: FieldValue | PlanetEvent = FieldValue.delete();
      if (data.planetName) {
        updateValue = {
          name: data.planetName,
        };
        if (data.factionName) {
          updateValue.prevOwner = data.factionName;
        }
      }
      updates = {
        [planetString]: updateValue,
        [timestampString]: timestamp,
      };
      break;
    }
    case "TOGGLE_ATTACHMENT": {
      if (!data.attachmentName) {
        res.status(422).send({ message: "Missing attachment name" });
        return;
      }
      const attachmentString = `subState.turnData.attachments.${data.attachmentName}`;
      let updateValue: FieldValue | string = FieldValue.delete();
      if (data.planetName) {
        updateValue = data.planetName;
      }
      updates = {
        [attachmentString]: updateValue,
        [timestampString]: timestamp,
      };
      break;
    }
    case "TOGGLE_POLITICAL_SECRET": {
      if (!data.factionName) {
        res.status(422).send({ message: "Missing faction name" });
        return;
      }
      const attachmentString = `subState.turnData.factions.${data.factionName}.politicalSecret`;
      let updateValue: FieldValue | boolean = FieldValue.delete();
      if (data.add) {
        updateValue = true;
      }
      updates = {
        [attachmentString]: updateValue,
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
        [`subState.turnData.factions.${data.factionName}.secondary`]:
          data.secondary,
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
        writeLogEntry(gameId, subState);

        const gameObjectives = await fetchObjectives(
          gameId,
          req.cookies.secret ?? ""
        );
        const gamePlanets = await fetchPlanets(gameId);
        const attachments = await fetchAttachments(gameId);
        const components = await fetchComponents(gameId);
        updates = {
          subState: FieldValue.delete(),
          [timestampString]: timestamp,
        };
        if (subState.turnData?.component?.name) {
          const component = components[subState.turnData?.component?.name];
          if (component) {
            const futureState = usedComponentState(component);
            if (futureState !== "active") {
              updates[
                `components.${subState.turnData?.component?.name}.state`
              ] = futureState;
              updates[`updates.components.timestamp`] = timestamp;
            }
            if (component.type === "LEADER" && component.leader === "HERO") {
              updates[`factions.${component.faction}.hero`] = "purged";
              updates[`updates.factions.timestamp`] = timestamp;
            }
          }
        }
        for (const [factionName, value] of Object.entries(
          subState.turnData?.factions ?? {}
        )) {
          // NOTE: Pretty sure this won't actually work properly...
          // for (const planet of value.planets ?? []) {
          //   const planetName = planet === "[0.0.0]" ? "000" : planet;
          //   if (factionName === "Xxcha Kingdom") {
          //     if (
          //       await shouldUnlockXxchaCommander(
          //         {
          //           action: "ADD_PLANET",
          //           planet: planetName,
          //         },
          //         gameData,
          //         gamePlanets,
          //         attachments
          //       )
          //     ) {
          //       updates[`factions.Xxcha Kingdom.commander`] = "unlocked";
          //       updates[`updates.factions.timestamp`] = timestamp;
          //     }
          //   }
          // }
          if (
            (value.objectives ?? []).length > 0 &&
            gameData.factions[factionName]?.hero === "locked"
          ) {
            const scoredObjectives = Object.entries(gameObjectives).filter(
              ([objectiveID, objective]) => {
                return (
                  objective.type !== "OTHER" &&
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
