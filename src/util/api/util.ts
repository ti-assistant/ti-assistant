import Cookies from "js-cookie";
import { getSharedUpdateTimes } from "../../Updater";

import { GameAgenda } from "./agendas";
import { GameAttachment } from "./attachments";
import { GameComponent } from "./components";
import { GameFaction } from "./factions";
import { GameObjective } from "./objectives";
import { Options } from "./options";
import { GamePlanet } from "./planets";
import { GameStrategyCard } from "./cards";
import { SubState } from "./subState";
import { GameState } from "./state";
import { Timestamp } from "firebase-admin/firestore";

export interface GameData {
  agendas?: Record<string, GameAgenda>;
  attachments?: Record<string, GameAttachment>;
  components?: Record<string, GameComponent>;
  factions: Record<string, GameFaction>;
  objectives?: Record<string, GameObjective>;
  options: Options;
  planets: Record<string, GamePlanet>;
  state: GameState;
  strategycards?: Record<string, GameStrategyCard>;
  subState?: SubState;
  timers?: Record<string, number>;
  updates?: Record<string, { timestamp: Timestamp }>;
  // Secrets
  [key: string]: any;
}

function genCookie(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function setGameId(gameId: string) {
  if (!Cookies.get("gameid") || Cookies.get("gameid") !== gameId) {
    Cookies.set("gameid", gameId);
  }
}

export function getGameId() {
  return Cookies.get("gameid");
}

export async function fetcher(url: string) {
  if (!Cookies.get("secret")) {
    Cookies.set("secret", genCookie(16));
  }
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
}

function getUpdatedEndpoint(url: string): string {
  const update = url.substring(url.lastIndexOf("/") + 1);
  switch (update) {
    case "agendaUpdate":
      return "agendas";
    case "attachmentUpdate":
      return "attachments";
    case "componentUpdate":
      return "components";
    case "cardUpdate":
      return "strategycards";
    case "factionUpdate":
      return "factions";
    case "objectiveUpdate":
      return "objectives";
    case "optionUpdate":
      return "options";
    case "planetUpdate":
      return "planets";
    case "subStateUpdate":
      return "subState";
    case "stateUpdate":
      return "state";
    case "timerUpdate":
      return "timers";
  }
  console.log("Error");
  return "";
}

export async function poster(url: string, data: any): Promise<any> {
  data.timestamp = Date.now();
  const { setUpdateTime } = getSharedUpdateTimes();
  setUpdateTime(getUpdatedEndpoint(url), data.timestamp);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const val = await res.json();

  if (res.status !== 200) {
    throw new Error(val.message);
  }
  return val;
}
