const { getFirestore } = require('firebase-admin/firestore');

/**
 * Fetches the strategy cards associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} strategy cards keyed by name.
 */
export async function fetchStrategyCards(gameid) {
  const db = getFirestore();

  const strategiesRef = await db.collection('strategycards').orderBy('order').get();

  if (!gameid) {
    return strategiesRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();
  const strategyCards = gameState.data().strategycards ?? {};

  let cards = {};
  strategiesRef.forEach(async (val) => {
    if (!strategyCards[val.id]) {
      cards[val.id] = val.data();
      return;
    }

    cards[val.id] = {
      ...val.data(),
      ...strategyCards[val.id],
    };
  });

  return cards;
}

/**
 * Fetches the objectives associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} objectives keyed by name.
 */
export async function fetchObjectives(gameid, secret) {
  const db = getFirestore();

  const objectivesRef = await db.collection('objectives').get();

  if (!gameid) {
    return objectivesRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();
  const gameObjectives = gameState.data().objectives ?? {};
  const secretObjectives = (gameState.data()[secret] ?? {}).objectives ?? {};
  const options = gameState.data().options;

  let objectives = {};
  objectivesRef.forEach(async (val) => {
    let objective = val.data();

    // Maybe filter out PoK objectives.
    if (!options.expansions.includes("pok") && objective.game === "pok") {
      return;
    }
    // Filter out objectives that are removed by PoK.
    if (options.expansions.includes("pok") && objective.game === "non-pok") {
      return;
    }

    if (objective.omega && options.expansions.includes(objective.omega.expansion)) {
      objective.description = objective.omega.description;
    }

    objectives[val.id] = {
      ...objective,
      ...(gameObjectives[val.id] ?? {}),
      ...(secretObjectives[val.id] ?? {}),
    };
  });

  return objectives;
}

/**
 * Fetches the attachments associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} attachments keyed by name.
 */
export async function fetchAttachments(gameid) {
  const db = getFirestore();

  const attachmentsRef = await db.collection('attachments').get();

  if (!gameid) {
    return attachmentsRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();
  const gameAttachments = gameState.data().attachments ?? {};
  const options = gameState.data().options;

  let attachments = {};
  attachmentsRef.forEach(async (val) => {
    let attachment = val.data();

    // Maybe filter out PoK objectives.
    if (attachment.game !== "base" && !options.expansions.includes(attachment.game)) {
      return;
    }
    // Filter out objectives that are removed by PoK.
    if (options.expansions.includes("pok") && attachment.game === "non-pok") {
      return;
    }


    attachments[val.id] = {
      planets: [],
      ...attachment,
      ...(gameAttachments[val.id] ?? {}),
    };
  });

  Object.values(attachments).forEach((attachment) => {
    if (attachment.replaces) {
      delete attachments[attachment.replaces];
    }
  })

  // Remove faction specific attachments if those factions are not in the game.
  const gameFactions = gameState.data().factions;

  if (!gameFactions['Titans of Ul']) {
    delete attachments['Elysium'];
    delete attachments['Terraform'];
  }

  return attachments;
}

function isCouncilPlanet(planet) {
  return planet.faction === "Mentak Coalition" || planet.faction === "Xxcha Kingdom" || planet.faction === "Argent Flight";
}

/**
 * Fetches the planets associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} planets keyed by name.
 */
 export async function fetchPlanets(gameid, faction) {
  const db = getFirestore();

  const planetsRef = await db.collection('planets').get();

  if (!gameid) {
    return planetsRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();

  const gamePlanets = gameState.data().planets ?? {};
  const gameFactions = gameState.data().factions ?? {};
  const factionPlanets = (gameFactions[faction] ?? {}).planets ?? {};

  let planets = {};
  planetsRef.forEach(async (val) => {
    let planet = val.data();
    let id = val.id;

    if (planet.home && gameFactions && !gameFactions[planet.faction]) {
      if (!gameFactions['Council Keleres'] || !(gameFactions['Council Keleres'].startswith.planets ?? []).includes(planet.name)) {
        return;
      }
    }

    planet = {
      ...planet,
      ...gamePlanets[id] ?? {},
      ...factionPlanets[id] ?? {},
    };

    if (id === "000") {
      id = "[0.0.0]";
    }
    planets[id] = planet;
  });

  return planets;
}

/**
 * Fetches the agendas associated with a game.
 * @param {string} gameid The game id. If not present, the default list will be fetched.
 * @returns {Promise} agendas keyed by name.
 */
 export async function fetchAgendas(gameid) {
  const db = getFirestore();

  const agendasRef = await db.collection('agendas').get();

  if (!gameid) {
    return agendasRef.data();
  }

  const gameState = await db.collection('games').doc(gameid).get();

  const gameAgendas = gameState.data().agendas ?? {};
  const options = gameState.data().options;

  let agendas = {};
  agendasRef.forEach(async (val) => {
    let agenda = val.data();

    // Remove POK from Representative Government
    let id = val.id.replace(" POK", "");

    // Maybe filter out PoK agendas.
    if (agenda.expansion !== "base" && !options.expansions.includes(agenda.expansion)) {
      return;
    }
    // Filter out agendas that are removed by PoK.
    if (options.expansions.includes("pok") && agenda.expansion === "nonpok") {
      return;
    }

    agenda = {
      ...agenda,
      ...gameAgendas[id] ?? {},
    };

    agendas[id] = agenda;
  });

  return agendas;
}