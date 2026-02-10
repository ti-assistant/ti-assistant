import Cookies from "js-cookie";
import { DataStore } from "../../context/dataStore";

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

export function updateArray<Type>(array: Type[], add: Type[], remove: Type[]) {
  const set = new Set(array);
  for (const value of add) {
    set.add(value);
  }
  for (const value of remove) {
    set.delete(value);
  }
  return Array.from(set);
}

export async function poster(
  url: string,
  data: any,
  timestamp: number,
): Promise<any> {
  data.gameTime = DataStore.getValue("timers.game") ?? 0;
  data.timestamp = timestamp;
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

export function hasScoredObjective(factionId: FactionId, objective: Objective) {
  return (objective.scorers ?? []).includes(factionId);
}
