import Cookies from "js-cookie";

import { GameAgenda } from "./agendas";
import { GameAttachment } from "./attachments";
import { GameComponent } from "./components";
import { GameFaction } from "./factions";
import { GameObjective } from "./objectives";
import { Options } from "./options";
import { GamePlanet } from "./planets";
import { GameStrategyCard } from "./cards";
import { AssignStrategyCardEvent, SetSpeakerEvent } from "./subState";
import { GameState, GameUpdateData } from "./state";
import { Timestamp } from "firebase-admin/firestore";
import { GameRelic } from "./relics";

export type ActionLogEvent = AssignStrategyCardEvent | SetSpeakerEvent;

export interface ActionLogEntry {
  timestampMillis: number;
  gameSeconds?: number;
  data: GameUpdateData;
}

export interface StoredGameData {
  actionLog?: ActionLogEntry[];
  agendas?: Record<string, GameAgenda>;
  attachments?: Record<string, GameAttachment>;
  components?: Record<string, GameComponent>;
  factions: Record<string, GameFaction>;
  objectives?: Record<string, GameObjective>;
  options: Options;
  planets: Record<string, GamePlanet>;
  relics?: Record<string, GameRelic>;
  state: GameState;
  strategycards?: Record<string, GameStrategyCard>;
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

export function arrayUnion<Type>(array: Type[], value: Type) {
  const set = new Set(array);
  set.add(value);
  return Array.from(set);
}

export function arrayRemove<Type>(array: Type[], value: Type) {
  const set = new Set(array);
  set.delete(value);
  return Array.from(set);
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

export async function poster(url: string, data: any): Promise<any> {
  data.timestamp = Date.now();
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
