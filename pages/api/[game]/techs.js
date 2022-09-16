const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const gameid = req.query.game;
  const faction = req.query.faction;

  const techsRef = await db.collection('techs').orderBy('name').get();

  const gamestate = await db.collection('games').doc(gameid).get();
  const factions = Object.keys(gamestate.data().factions);

  let techs = {};
  techsRef.forEach(async (val) => {
    let tech = val.data();
    let id = val.id;

    // Filter out other faction technologies.
    if (tech.faction) {
      if (faction === "Nekro Virus") {
        if (!factions.includes(tech.faction)) {
          return;
        }
      } else if (tech.faction !== faction) {
        return;
      }
    }

    techs[id] = tech;
  });

  if (faction !== "Nekro Virus") {
    Object.values(techs).forEach((tech) => {
      if (tech.replaces) {
        delete techs[tech.replaces];
      }
    });
  }

  res.status(200).json(techs);
}