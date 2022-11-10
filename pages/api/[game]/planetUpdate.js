import { fetchPlanets } from '../../../server/util/fetch';

const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// async function fetchPlanets(db, gameid, faction) {
//   const planetsRef = await db.collection('planets').orderBy('name').get();

//   const gamestate = await db.collection('games').doc(gameid).get();
//   const factions = Object.keys(gamestate.data().factions);

//   // TODO(jboman): Handle Council Keleres.
//   let planets = {};
//   planetsRef.forEach(async (val) => {
//     let planet = val.data();
//     let id = val.id;

//     // Add data from the game to planets.
//     if (gamestate.data().planets && gamestate.data().planets[id]) {
//       planet = {
//         ...planet,
//         ...gamestate.data().planets[id]
//       };
//     }
//     // Update data based on faction's information.
//     if (faction && gamestate.data().factions[faction].planets[id]) {
//       planet = {
//         ...planet,
//         ...gamestate.data().factions[faction].planets[id],
//       };
//     }
//     if (factions && val.data().home && !factions.includes(val.data().faction)) {
//       return;
//     }
//     // Have to do this to avoid database issues when storing [0.0.0].
//     if (id === "000") {
//       id = "[0.0.0]";
//     }
//     planets[id] = planet;
//   });

//   return planets;
// }

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
  switch (data.action) {
    case "TOGGLE_PLANET":
      data.planets.forEach(async (planet) => {
        if (planet === "[0.0.0]") {
          planet = "000";
        }
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
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
      }); 
      break;
    case "REMOVE_PLANET":
      gamePlanetString = `planets.${data.planet}.owners`;
      playerPlanetString = `factions.${data.faction}.planets.${data.planet}`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: FieldValue.arrayRemove(data.faction),
        [playerPlanetString]: FieldValue.delete(),
      });
      break;
    case "ADD_OBJECTIVE":
      await db.collection('games').doc(gameid).update({
        objectives: FieldValue.arrayUnion(data.objective),
      });
      break;
    case "REMOVE_OBJECTIVE":
      await db.collection('games').doc(gameid).update({
        objectives: FieldValue.arrayRemove(data.objective),
      });
      break;
  }
  
  const response = await fetchPlanets(gameid, data.faction);

  return res.status(200).json(response);
}