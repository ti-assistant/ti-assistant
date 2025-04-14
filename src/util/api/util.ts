import Cookies from "js-cookie";

export interface Settings {
  "display-objective-description": boolean;
  "group-techs-by-faction": boolean;
  "show-turn-timer": boolean;
  "fs-tech-summary-display": TechSummaryDisplay;
}

export type TechSummaryDisplay =
  | "NONE"
  | "ALL"
  | "TREE"
  | "TREE+NUMBER"
  | "TREE+ICON"
  | "ICON+NUMBER";

const DEFAULT_SETTINGS: Settings = {
  "display-objective-description": false,
  "group-techs-by-faction": false,
  "show-turn-timer": true,
  // Faction Summary Settings
  "fs-tech-summary-display": "ALL",
} as const;

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

export function getSettings() {
  const settings = Cookies.get("settings");
  if (!settings) {
    return DEFAULT_SETTINGS;
  }
  return {
    ...DEFAULT_SETTINGS,
    ...(JSON.parse(settings) as Settings),
  };
}

export function updateSetting<T extends keyof Settings>(
  setting: T,
  value: Settings[T]
) {
  const settings = getSettings();
  settings[setting] = value;
  Cookies.set("settings", JSON.stringify(settings));
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

export async function poster(
  url: string,
  data: any,
  timestamp: number
): Promise<any> {
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
