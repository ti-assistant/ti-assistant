import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { createIntl } from "react-intl";
import { getFactions } from "../../../server/data/factions";
import { getPlanets } from "../../../server/data/planets";
import { getSession, TIASession } from "../../../server/util/fetch";
import {
  getSessionIdFromCookie,
  hashPassword,
  setSessionIdCookie,
} from "../../../src/util/server";
import { Optional } from "../../../src/util/types/types";
import { objectEntries } from "../../../src/util/util";

function makeid(length: number) {
  var result = "";
  var characters = "BCDEFGHJKLMNPQRSTVWXYZbcdfghjkmnpqrstvwxyz23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function POST(req: Request) {
  const json = await req.json();
  let factions: SetupFaction[] = json.factions;
  let speaker: number = json.speaker;

  let options: Options = json.options;

  const db = getFirestore();

  const intl = createIntl({
    locale: "en",
  });
  const BASE_FACTIONS = getFactions(intl);

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
    const homeBasePlanets = Object.values(getPlanets(intl)).filter(
      (planet) => planet.faction === faction.id && planet.home
    );
    const homePlanets: Partial<Record<PlanetId, { ready: boolean }>> = {};
    homeBasePlanets.forEach((planet) => {
      homePlanets[planet.id] = {
        ready: true,
      };
    });

    // Get starting techs for each faction.
    const baseFaction = BASE_FACTIONS[faction.id];
    const startingTechs: Partial<Record<TechId, GameTech>> = {};
    (baseFaction.startswith?.techs ?? []).forEach((tech) => {
      startingTechs[tech] = {
        state: "ready",
        ready: true,
      };
    });

    const events = options.events ?? [];
    if (events.includes("Advent of the War Sun")) {
      if (faction.id !== "Embers of Muaat") {
        startingTechs["War Sun"] = {
          ready: true,
          state: "ready",
        };
      }
    }
    if (events.includes("Age of Fighters")) {
      if (faction.id === "Naalu Collective") {
        startingTechs["Hybrid Crystal Fighter II"] = {
          ready: true,
          state: "ready",
        };
      } else {
        startingTechs["Fighter II"] = {
          ready: true,
          state: "ready",
        };
      }
    }

    const gameFaction: GameFaction = {
      // Client specified values
      id: faction.id,
      color: faction.color,
      order: order,
      mapPosition: index,
      // Faction specific values
      planets: homePlanets,
      techs: startingTechs,
      // State values
      hero: "locked",
      commander: options["game-variant"].includes("alliance")
        ? "readied"
        : "locked",
    };
    if (baseFaction.startswith) {
      gameFaction.startswith = baseFaction.startswith;
    }

    if (faction.id === "Crimson Rebellion") {
      gameFaction.breakthrough = {
        state: "readied",
      };
    }

    if (events.includes("Rapid Mobilization")) {
      gameFaction.breakthrough = {
        state: "readied",
      };
    }

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
  let speakerName: Optional<FactionId>;
  gameFactions.forEach((faction, index) => {
    const baseFaction = BASE_FACTIONS[faction.id];
    if (index === speaker) {
      speakerName = baseFaction.id;
    }
    const localFaction = { ...faction };
    if (faction.id === "Winnu" && !options.expansions.includes("POK")) {
      const startsWith = localFaction.startswith ?? {
        units: {},
      };
      startsWith.choice = {
        description: intl.formatMessage({
          id: "Winnu.Tech Choice",
          description: "Text of Winnu's tech choice.",
          defaultMessage: "Choose any 1 technology that has no prerequisites.",
        }),
        select: 1,
        options: [
          "Neural Motivator",
          "Sarween Tools",
          "Antimass Deflectors",
          "Plasma Scoring",
        ],
      };
      localFaction.startswith = startsWith;
    }
    baseFactions[faction.id] = localFaction;
    objectEntries(faction.planets).forEach(([name, planet]) => {
      const basePlanet: GamePlanet = { ...planet, owner: baseFaction.id };
      if (baseFaction.id === "Last Bastion" && name === "Ordinian") {
        basePlanet.spaceDock = true;
      }
      basePlanets[name] = basePlanet;
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

  const deleteDate = new Date();
  deleteDate.setDate(deleteDate.getDate() + 30);

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
    deleteAt: Timestamp.fromDate(deleteDate),
    sequenceNum: 1,
  };

  let gameid = makeid(6);

  let game = await db.collection("games").doc(gameid).get();
  let archive = await db.collection("archive").doc(gameid).get();
  while (game.exists || archive.exists) {
    gameid = makeid(6);
    game = await db.collection("games").doc(gameid).get();
    archive = await db.collection("archive").doc(gameid).get();
  }

  if (json.password) {
    const sessionDeleteDate = new Date();
    sessionDeleteDate.setDate(sessionDeleteDate.getDate() + 14);

    const hashedPassword = hashPassword(json.password);
    await db.collection("passwords").doc(gameid).set({
      password: hashedPassword,
      deleteAt: deleteDate,
    });

    let sessionId = await getSessionIdFromCookie();
    let session: Optional<TIASession>;
    if (sessionId) {
      session = await getSession(sessionId);
    }
    if (!sessionId || !session) {
      const result = await db.collection("sessions").add({
        deleteAt: sessionDeleteDate,
      });
      sessionId = result.id;
      setSessionIdCookie(sessionId);
    }
    await db
      .collection("sessions")
      .doc(sessionId)
      .update({
        games: FieldValue.arrayUnion(gameid),
        deleteAt: sessionDeleteDate,
      });
  }

  await db.collection("games").doc(gameid).set(gameState);
  await db
    .collection("timers")
    .doc(gameid)
    .set({
      deleteAt: Timestamp.fromDate(deleteDate),
    });

  return NextResponse.json({ gameid });
}
