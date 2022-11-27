import { fetchPlanets } from '../../../server/util/fetch';

const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

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
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: updateVal,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      }); 
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
  }
  
  const response = await fetchPlanets(gameid, data.faction);

  return res.status(200).json(response);
}