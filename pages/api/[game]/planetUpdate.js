const { getFirestore, FieldValue } = require('firebase-admin/firestore');

async function fetchPlanets(db, gameid, faction) {
  const planetsRef = await db.collection('planets').orderBy('name').get();

  const gamestate = await db.collection('games').doc(gameid).get();
  const factions = Object.keys(gamestate.data().factions);

  // TODO(jboman): Handle Council Keleres.
  let planets = {};
  planetsRef.forEach(async (val) => {
    let planet = val.data();

    // Add data from the game to planets.
    if (gamestate.data().planets && gamestate.data().planets[val.id]) {
      planet = {
        ...planet,
        ...gamestate.data().planets[val.id]
      };
    }
    // Update data based on faction's information.
    if (faction && gamestate.data().factions[faction].planets[val.id]) {
      planet = {
        ...planet,
        ...gamestate.data().factions[faction].planets[val.id]
      };
    }
    if (factions && val.data().home && !factions.includes(val.data().faction)) {
      return;
    }
    planets[val.id] = planet;
  });

  return planets;
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

  let gamePlanetString;
  let playerPlanetString;
  let readyString;
  switch (data.action) {
    case "TOGGLE_PLANET":
      data.planets.forEach(async (planet) => {
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
        });
      });
      break;
    case "ADD_PLANET":
      gamePlanetString = `planets.${data.planet}.owner`;
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      playerPlanetString = `factions.${data.faction}.planets.${data.planet}.owner`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: data.faction,
        [readyString]: false,
        [playerPlanetString]: data.faction,
      });
      break;
    case "REMOVE_PLANET":
      gamePlanetString = `planets.${data.planet}.owner`;
      playerPlanetString = `factions.${data.faction}.planets.${data.planet}`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: null,
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
  
  const response = await fetchPlanets(db, gameid, data.faction);

  return res.status(200).json(response);
}