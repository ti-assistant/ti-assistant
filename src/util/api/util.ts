import Cookies from "js-cookie";

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
  gameTime: number,
): Promise<any> {
  data.gameTime = gameTime;
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
