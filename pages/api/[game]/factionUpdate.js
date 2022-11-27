const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

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
  if (tech) {
    tech = tech.replace(" Ω", "");
    if (tech === "Light/Wave Deflector") {
      tech = "LightWave Deflector";
    }
  }

  let gamePlanetString;
  let playerPlanetString;
  let playerTechString;
  let readyString;
  let factionChoiceString;
  let factionStartingTechString;
  const timestampString = `updates.factions.timestamp`;
  switch (data.action) {
    case "ADD_TECH":
      readyString = `factions.${data.faction}.techs.${tech}.ready`;
      await db.collection('games').doc(gameid).update({
        [readyString]: true,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "REMOVE_TECH":
      playerTechString = `factions.${data.faction}.techs.${tech}`;
      await db.collection('games').doc(gameid).update({
        [playerTechString]: FieldValue.delete(),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "TOGGLE_PLANET":
      for (const planet of data.planets) {
        readyString = `factions.${data.faction}.planets.${planet}.ready`;
        await db.collection('games').doc(gameid).update({
          [readyString]: data.ready,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    case "CHOOSE_STARTING_TECH":
      readyString = `factions.${data.faction}.techs.${data.tech}.ready`;
      factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db.collection('games').doc(gameid).update({
        [readyString]: true,
        [factionStartingTechString]: FieldValue.arrayUnion(data.tech),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "REMOVE_STARTING_TECH":
      playerTechString = `factions.${data.faction}.techs.${data.tech}`;
      factionStartingTechString = `factions.${data.faction}.startswith.techs`;
      await db.collection('games').doc(gameid).update({
        [playerTechString]: FieldValue.delete(),
        [factionStartingTechString]: FieldValue.arrayRemove(data.tech),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "CHOOSE_SUB_FACTION": {
      const planetsString = `factions.${data.faction}.planets`;
      await db.collection('games').doc(gameid).update({
        [planetsString]: {},
      });
      let planets = [];
      switch (data.subFaction) {
        case "Argent Flight":
          planets = [
            "Avar",
            "Valk",
            "Ylir",
          ];
          break;
        case "Mentak Coalition":
          planets = [
            "Moll Primus",
          ];
          break;
        case "Xxcha Kingdom":
          planets = [
            "Archon Ren",
            "Archon Tau",
          ];
          break;
      }
      const playerSubFactionString = `factions.${data.faction}.startswith.faction`;
      const startingPlanetsString = `factions.${data.faction}.startswith.planets`;
      const updates = {
        [playerSubFactionString]: data.subFaction,
        [startingPlanetsString]: planets,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "ADD_PLANET":
      gamePlanetString = `planets.${data.planet}.owner`;
      readyString = `factions.${data.faction}.planets.${data.planet}.ready`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: data.faction,
        [readyString]: false,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "REMOVE_PLANET":
      gamePlanetString = `planets.${data.planet}.owner`;
      playerPlanetString = `factions.${data.faction}.planets.${data.planet}`;
      await db.collection('games').doc(gameid).update({
        [gamePlanetString]: null,
        [playerPlanetString]: FieldValue.delete(),
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    case "PASS": {
      const factionPassString = `factions.${data.faction}.passed`;
      await db.collection('games').doc(gameid).update({
        [factionPassString]: true,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
      break;
    }
    case "READY_ALL": {
      const updateVal = {
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      for (const factionName of Object.keys(gameRef.data().factions)) {
        const factionPassString = `factions.${factionName}.passed`;
        updateVal[factionPassString] = false;
      }
      await db.collection('games').doc(gameid).update(updateVal);
      break;
    }
    case "SAVE_FACTION_TIMER": {
      const timer = gameRef.data().factions[data.faction].timer ?? 0;
      if (data.timer > timer) {
        const factionString = `factions.${data.faction}.timer`;
        await db.collection('games').doc(gameid).update({
          [factionString]: data.timer,
          [timestampString]: Timestamp.fromMillis(data.timestamp),
        });
      }
      break;
    }
    case "MANUAL_VP_ADJUST": {
      const vps = gameRef.data().factions[data.faction].vps ?? 0;
      const factionString = `factions.${data.faction}.vps`;
      await db.collection('games').doc(gameid).update({
        [factionString]: vps + data.vps,
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      });
    }
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