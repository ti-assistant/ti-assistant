const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.game;

  const gamestate = await db.collection('games').doc(gameid).get();

  if (!gamestate.data()) {
    res.status(404);
    return;
  }

  if (!gamestate.data().factions) {
    res.status(404);
    return;
  }

  const factions = gamestate.data().factions;

  const factionsRef = await db.collection('factions').get();
  const baseFactions = {};
  factionsRef.forEach((val) => {
    baseFactions[val.id] = val.data();
  });

  const factionsToReturn = {};
  Object.entries(factions).forEach(([id, faction]) => {
    factionsToReturn[id] = {
      ...baseFactions[id],
      ...faction,
    };
  });

  if (Object.keys(factionsToReturn).includes("Council Keleres")) {
    const councilChoice = new Set();
    Object.values(factionsToReturn).forEach((faction) => {
      (faction.startswith.techs ?? []).forEach((tech) => {
        councilChoice.add(tech);
      });
    });
    factionsToReturn["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
  }

  res.status(200).json(factionsToReturn);

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