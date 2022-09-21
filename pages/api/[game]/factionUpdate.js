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
      data.planets.forEach(async (planet) => {
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
        });
      });
      break;
    case "CHOOSE_STARTING_TECHS":
      data.techs.forEach(async (tech) => {
        readyString = `factions.${data.faction}.techs.${tech}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: true,
        });
      })
      factionChoiceString = `factions.${data.faction}.startswith.choice`;
      factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db.collection('games').doc(gameid).update({
        [factionChoiceString]: FieldValue.delete(),
        [factionStartingTechString]: data.techs,
      });
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
  if (data.returnAll) {
    return res.status(200).json(responseRef.data().factions);
  }
  const response = responseRef.data().factions[data.faction];

  return res.status(200).json(response);
}