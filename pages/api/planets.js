const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.gameid;

  const planetsRef = await db.collection('planets').orderBy('name').get();

  let factions = null;
  if (gameid) {
    const gamestate = await db.collection('games').doc(gameid).get();
    factions = Object.keys(gamestate.data().factions);
  }

  // TODO(jboman): Handle Council Keleres.
  let planets = [];
  planetsRef.forEach((val) => {
    if (factions && val.data().home && !factions.includes(val.data().faction)) {
      return;
    }
    planets.push(val.data());
  });

  res.status(200).json(planets);
}