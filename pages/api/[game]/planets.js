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
    let id = val.id;

    // Add data from the game to planets.
    if (gamestate.data().planets && gamestate.data().planets[id]) {
      planet = {
        ...planet,
        ...gamestate.data().planets[id]
      };
    }
    // Update data based on faction's information.
    if (faction && gamestate.data().factions[faction].planets[id]) {
      planet = {
        ...planet,
        ...gamestate.data().factions[faction].planets[id],
      };
    }
    if (factions && val.data().home && !factions.includes(val.data().faction)) {
      // TODO: Make Council select this so that this can be avoided.
      if (gamestate.data().factions['Council Keleres']) {
        if (val.data().faction !== "Mentak" && val.data().faction !== "Xxcha Kingdom" && val.data().faction !== "Argent Flight") {
          return;
        }
      } else {
        return;
      }
    }
    // Have to do this to avoid database issues when storing [0.0.0].
    if (id === "000") {
      id = "[0.0.0]";
    }
    planets[id] = planet;
  });

  res.status(200).json(planets);
}