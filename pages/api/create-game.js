const { getFirestore } = require('firebase-admin/firestore');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  let factions = req.body.factions;
  let speaker = req.body.speaker;

  let options = req.body.options;
  console.log(options);

  const db = getFirestore();

  const factionPromises = factions.map(async (faction, index) => {
    // Determine speaker order for each faction.
    let order;
    if (index >= speaker) {
      order = index - speaker + 1;
    } else {
      order = index + factions.length - speaker + 1;
    }

    // Get home planets for each faction.
    // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
    const homePlanetsRef = await db.collection('planets').where('faction', '==', faction.name).get();
    const homePlanets = {};
    homePlanetsRef.forEach((planet) => {
      homePlanets[planet.id] = {
        ready: true,
      };
    });

    // Get starting techs for each faction.
    // TODO(jboman): Handle factions that have a choice in starting techs.
    const factionRef = await db.collection('factions').doc(faction.name).get();
    const factionData = factionRef.data();
    const startingTechs = {};
    (factionData.startswith.techs ?? []).forEach((tech) => {
      startingTechs[tech] = {
        ready: true,
      };
    });

    const prompts = [];
    if (factionData.startswith.choice) {
      prompts.push({
        title: "Choose Starting Tech",
        type: "STARTING_TECH",
      });
    }

    return {
      ...faction,
      planets: homePlanets,
      techs: startingTechs,
      order: order,
      startswith: factionData.startswith,
      prompts: prompts,
    };
  });

  factions = await Promise.all(factionPromises);

  let baseFactions = {};
  let basePlanets = {};
  speaker = "";
  factions.forEach((faction, index) => {
    if (index === req.body.speaker) {
      speaker = faction.name;
    }
    baseFactions[faction.name] = faction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name] = {
        ...planet,
        owners: [faction.name],
      };
    });
  });

  const gameState = {
    state: {
      speaker: speaker,
      phase: "SETUP",
    },
    speaker: req.body.speaker,
    factions: baseFactions,
    planets: basePlanets,
    options: options,
  };

  let gameid = makeid(6);

  let game = await db.collection('games').doc(gameid).get();
  while (game.exists) {
    gameid = makeid(6);
    game = await db.collection('games').doc(gameid).get();
  }

  const result = await db.collection('games').doc(gameid).set(gameState);

  // console.log(req.body);
  res.status(200).json({gameid: gameid});
}