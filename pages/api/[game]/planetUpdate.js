import { fetchAttachments, fetchPlanets } from '../../../server/util/fetch';
import { applyPlanetAttachments } from '../../../src/util/planets';

const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

async function shouldUnlockXxchaCommander(data, gameRef, gamePlanets, attachments) {
  const factionName = "Xxcha Kingdom";
  if (gameRef.data().factions[factionName].commander === "unlocked") {
    return false;
  }
  const totalInfluence = Object.values(gamePlanets).reduce((count, planet) => {
    if (data.planet === planet.name && data.action === "ADD_PLANET") {
      const updatedPlanet = applyPlanetAttachments(planet, attachments);
      return count + updatedPlanet.influence;
    }
    if (data.planet === planet.name && data.action === "ADD_ATTACHMENT") {
      planet.attachments.push(data.attachment);
    }
    if ((planet.owners ?? []).includes(factionName)) {
      const updatedPlanet = applyPlanetAttachments(planet, attachments);
      return count + updatedPlanet.influence;
    }
    return count;
  }, 0);
  return totalInfluence >= 12;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;
  if (data.planet === "[0.0.0]") {
    data.planet = "000";
  }

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  const gamePlanets = await fetchPlanets(gameid);

  const options = gameRef.data().options;

  let gamePlanetString;
  let playerPlanetString;
  let readyString;
  const timestampString = `updates.planets.timestamp`;
  switch (data.action) {
    case "TOGGLE_PLANET":
      data.planets.forEach(async (planet) => {
        if (planet === "[0.0.0]") {
          planet = "000";
        }
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      });
      break;
    case "ADD_PLANET":
      gamePlanetString = `planets.${data.planet}.owners`;
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      let updateVal = [data.faction];
      if (options['multiple-planet-owners']) {
        updateVal = FieldValue.arrayUnion(data.faction);
      }
      const updates = {
        [gamePlanetString]: updateVal,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      const attachments = await fetchAttachments(gameid);
      if (await shouldUnlockXxchaCommander(data, gameRef, gamePlanets, attachments)) {
        updates[`factions.${data.faction}.commander`] = "unlocked";
        updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
      }
      await db.collection('games').doc(gameid).update(updates); 
      break;
    case "REMOVE_PLANET":
      gamePlanetString = `planets.${data.planet}.owners`;
      playerPlanetString = `factions.${data.faction}.planets.${data.planet}`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: FieldValue.arrayRemove(data.faction),
        [playerPlanetString]: FieldValue.delete(),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "ADD_ATTACHMENT": {
      const planetAttachmentString = `planets.${data.planet}.attachments`;
      const updates = {
        [planetAttachmentString]: FieldValue.arrayUnion(data.attachment),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      Object.values(gamePlanets).forEach((planet) => {
        const planetRemoveString = `planets.${planet.name}.attachments`;
        if ((planet.attachments ?? []).includes(data.attachment)) {
          updates[planetRemoveString] = FieldValue.arrayRemove(data.attachment);
        }
      });
      const attachments = await fetchAttachments(gameid);
      if (await shouldUnlockXxchaCommander(data, gameRef, gamePlanets, attachments)) {
        updates[`factions.Xxcha Kingdom.commander`] = "unlocked";
        updates[`updates.factions.timestamp`] = Timestamp.fromMillis(data.timestamp);
      }
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "REMOVE_ATTACHMENT": {
      const planetAttachmentString = `planets.${data.planet}.attachments`;
      await db.collection('games').doc(gameid).update({
        [planetAttachmentString]: FieldValue.arrayRemove(data.attachment),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
  }
  
  const response = await fetchPlanets(gameid, data.faction);

  return res.status(200).json(response);
}