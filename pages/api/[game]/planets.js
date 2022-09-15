const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.game;
  const faction = req.query.faction;

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

  res.status(200).json(planets);
}