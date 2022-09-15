const { getFirestore, FieldValue } = require('firebase-admin/firestore');

async function fetchPlanets(db, gameid) {
  const planetsRef = await db.collection('planets').orderBy('name').get();

  const gamestate = await db.collection('games').doc(gameid).get();
  const factions = Object.keys(gamestate.data().factions);

  // TODO(jboman): Handle Council Keleres.
  let planets = [];
  planetsRef.forEach(async (val) => {
    const planet = val.data();
    if (gamestate.data().planets[val.id]) {
      planets.push({
        ...planet,
        ...gamestate.data().planets[val.id]
      });
      return;
    }
    if (factions && val.data().home && !factions.includes(val.data().faction)) {
      return;
    }
    planets.push(val.data());
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

  let claimedString;
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
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      claimedString = `factions.${data.faction}.planets.${data.planet}.claimed`;
      await db.collection('games').doc(gameid).update({
        [readyString]: false,
        [claimedString]: true,
      });
      break;
    case "REMOVE_PLANET":
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      claimedString = `factions.${data.faction}.planets.${data.planet}.claimed`;
      await db.collection('games').doc(gameid).update({
        [readyString]: true,
        [claimedString]: false,
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
  
  const responseRef = await db.collection('games').doc(gameid).get();
  const response = responseRef.data();

  return res.status(200).json(response);
}