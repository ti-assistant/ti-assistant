const { getFirestore, FieldValue } = require('firebase-admin/firestore');

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

  let tech = data.tech;
  if (tech === "Light/Wave Deflector") {
    tech = "LightWave Deflector";
  }

  let gamePlanetString;
  let playerPlanetString;
  let playerTechString;
  let readyString;
  let factionChoiceString;
  let factionStartingTechString;
  switch (data.action) {
    case "ADD_TECH":
      readyString = `factions.${data.faction}.techs.${tech}.ready`;
      await db.collection('games').doc(gameid).update({
        [readyString]: true,
      });
      break;
    case "REMOVE_TECH":
      playerTechString = `factions.${data.faction}.techs.${tech}`;
      await db.collection('games').doc(gameid).update({
        [playerTechString]: FieldValue.delete(),
      });
      break;
    case "TOGGLE_PLANET":
      for (const planet of data.planets) {
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
        });
      }
      break;
    case "CHOOSE_STARTING_TECH":
      readyString = `factions.${data.faction}.techs.${data.tech}.ready`;
      factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db.collection('games').doc(gameid).update({
        [readyString]: true,
        [factionStartingTechString]: FieldValue.arrayUnion(data.tech),
      });
      break;
    case "REMOVE_STARTING_TECH":
      playerTechString = `factions.${data.faction}.techs.${data.tech}`;
      factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db.collection('games').doc(gameid).update({
        [playerTechString]: FieldValue.delete(),
        [factionStartingTechString]: FieldValue.arrayRemove(data.tech),
      });
      break;
    case "ADD_PLANET":
      gamePlanetString = `planets.${data.planet}.owner`;
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: data.faction,
        [readyString]: false,
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
    case "PASS": {
      const factionPassString = `factions.${data.faction}.passed`;
      await db.collection('games').doc(gameid).update({
        [factionPassString]: true,
      });
      break;
    }
    case "READY_ALL": {
      const updateVal = {};
      for (const factionName of Object.keys(gameRef.data().factions)) {
        const factionPassString = `factions.${factionName}.passed`;
        updateVal[factionPassString] = false;
      }
      await db.collection('games').doc(gameid).update(updateVal);
      break;
    }
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
  const factions = {...responseRef.data().factions};

  if (Object.keys(factions).includes("Council Keleres")) {
    const councilChoice = new Set();
    for (const [name, faction] of Object.entries(factions)) {
      if (name === "Council Keleres") {
        continue;
      }
      (faction.startswith.techs ?? []).forEach((tech) => {
        councilChoice.add(tech);
      });
    }
    factions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
    // Remove techs that are no longer available for Keleres.
    if (data.action === "REMOVE_STARTING_TECH") {
      for (const [index, tech] of (factions["Council Keleres"].startswith.techs ?? []).entries()) {
        if (!councilChoice.has(tech)) {
          playerTechString = `factions.Council Keleres.techs.${tech}`;
          factionStartingTechString = `factions.Council Keleres.startswith.techs`;
          await db.collection('games').doc(gameid).update({
            [playerTechString]: FieldValue.delete(),
            [factionStartingTechString]: FieldValue.arrayRemove(tech),
          });
          delete factions["Council Keleres"].techs[tech];
          factions["Council Keleres"].startswith.techs.splice(index, 1);
        }
      }
    }
  }

  if (data.returnAll) {
    return res.status(200).json(factions);
  }
  const response = factions[data.faction];

  return res.status(200).json(response);
}