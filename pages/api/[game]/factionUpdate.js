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
      break;
    }
    case "UPDATE_CAST_VOTES": {
      const updates = {
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      Object.entries(data.factions).forEach(([factionName, votes]) => {
        const factionString = `factions.${factionName}.votes`;
        const value = (gameRef.data().factions[factionName].votes ?? 0) + votes.votes;
        updates[factionString] = value;
      });
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
    case "RESET_CAST_VOTES": {
      const updates = {
        [timestampString]: Timestamp.fromMillis(data.timestamp),
      };
      Object.keys(gameRef.data().factions).forEach((factionName) => {
        const factionString = `factions.${factionName}.castVotes`;
        updates[factionString] = FieldValue.delete();
      });
      await db.collection('games').doc(gameid).update(updates);
      break;
    }
  }
  
  const responseRef = await db.collection('games').doc(gameid).get();
  const factions = {...responseRef.data().factions};

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
}