const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.game;

  const gamestate = await db.collection('games').doc(gameid).get();

  if (!gamestate.data().factions) {
    res.status(404);
  }

  res.status(200).json(gamestate.data().factions);

  // const factions = Object.keys(gamestate.data().factions);

  // // TODO(jboman): Handle Council Keleres.
  // let planets = [];
  // planetsRef.forEach(async (val) => {
  //   const planet = val.data();
  //   if (gamestate.data().planets[val.id]) {
  //     planets.push({
  //       ...planet,
  //       ...gamestate.data().planets[val.id]
  //     });
  //     return;
  //   }
  //   if (factions && val.data().home && !factions.includes(val.data().faction)) {
  //     return;
  //   }
  //   planets.push(val.data());
  // });

  // res.status(200).json(planets);
}