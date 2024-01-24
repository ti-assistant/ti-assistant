import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getBaseFactions } from "../../server/data/factions";
import { BASE_PLANETS } from "../../server/data/planets";
import { createIntl } from "react-intl";

function makeid(length: number) {
  var result = "";
  var characters = "BCDEFGHJKLMNPQRSTVWXYZbcdfghjkmnpqrstvwxyz23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let factions: SetupFaction[] = req.body.factions;
  let speaker: number = req.body.speaker;

  let options: Options = req.body.options;

  const db = getFirestore();

  const intl = createIntl({
    locale: "en",
  });
  const BASE_FACTIONS = getBaseFactions(intl);

  const gameFactions = factions.map((faction, index) => {
    if (!faction.name || !faction.color || !faction.id) {
      throw new Error("Faction missing name or color.");
    }
    // Determine speaker order for each faction.
    let order: number;
    if (index >= speaker) {
      order = index - speaker + 1;
    } else {
      order = index + factions.length - speaker + 1;
    }

    // Get home planets for each faction.
    // TODO(jboman): Handle Council Keleres choosing between Mentak, Xxcha, and Argent Flight.
    const homeBasePlanets = Object.values(BASE_PLANETS).filter(
      (planet) => planet.faction === faction.name && planet.home
    );
    const homePlanets: Partial<Record<PlanetId, { ready: boolean }>> = {};
    homeBasePlanets.forEach((planet) => {
      homePlanets[planet.id] = {
        ready: true,
      };
    });

    // Get starting techs for each faction.
    const baseFaction = BASE_FACTIONS[faction.id];
    const startingTechs: Partial<Record<TechId, { ready: boolean }>> = {};
    (baseFaction.startswith.techs ?? []).forEach((tech) => {
      startingTechs[tech] = {
        ready: true,
      };
    });

    const gameFaction: GameFaction = {
      // Client specified values
      name: faction.name,
      color: faction.color,
      order: order,
      mapPosition: index,
      // Faction specific values
      planets: homePlanets,
      techs: startingTechs,
      startswith: baseFaction.startswith,
      // State values
      hero: "locked",
      commander: options["game-variant"].includes("alliance")
        ? "readied"
        : "locked",
    };

    if (faction.playerName) {
      gameFaction.playerName = faction.playerName;
    }

    if (options["game-variant"].startsWith("alliance")) {
      if (faction.alliancePartner == undefined) {
        throw new Error("Creating alliance game w/o all alliance partners");
      }
      gameFaction.alliancePartner = factions[faction.alliancePartner]?.id;
    }

    return gameFaction;
  });

  let baseFactions: Partial<Record<FactionId, GameFaction>> = {};
  let basePlanets: Partial<Record<PlanetId, GamePlanet>> = {};
  let speakerName: FactionId | undefined;
  gameFactions.forEach((faction, index) => {
    const baseFaction = BASE_FACTIONS[faction.name as FactionId];
    if (index === req.body.speaker) {
      speakerName = baseFaction.id;
    }
    const localFaction = { ...faction };
    if (faction.name === "Winnu" && !options.expansions.includes("POK")) {
      localFaction.startswith.choice = {
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
    }
    baseFactions[faction.name as FactionId] = localFaction;
    Object.entries(faction.planets).forEach(([name, planet]) => {
      basePlanets[name as PlanetId] = {
        ...planet,
        owner: baseFaction.id,
      };
    });
  });

  let baseObjectives: Partial<Record<ObjectiveId, GameObjective>> = {
    "Custodians Token": {
      selected: true,
    },
    "Imperial Point": {
      selected: true,
    },
    "Support for the Throne": {
      selected: true,
    },
  };

  if (!speakerName) {
    throw new Error("No speaker selected.");
  }

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 30);

  const gameState: StoredGameData = {
    state: {
      speaker: speakerName,
      phase: "SETUP",
      round: 1,
    },
    factions: baseFactions,
    planets: basePlanets,
    options: options,
    objectives: baseObjectives,
    deleteAt: Timestamp.fromDate(currentDate),
  };

  let gameid = makeid(6);

  let game = await db.collection("games").doc(gameid).get();
  while (game.exists) {
    gameid = makeid(6);
    game = await db.collection("games").doc(gameid).get();
  }

  await db.collection("games").doc(gameid).set(gameState);
  await db.collection("timers").doc(gameid).set({});

  res.status(200).json({ gameid: gameid });
}
