import jsSHA from "jssha";
import { cookies } from "next/headers";
import { DEFAULT_SETTINGS, Settings } from "./settings";

export async function getMessages(
  locale: string,
): Promise<Record<string, string>> {
  const messages = await import(`../../server/compiled-lang/${locale}.json`);

  return JSON.parse(JSON.stringify(messages));
}

export async function getSettings() {
  const cookieValues = await cookies();
  let settings = cookieValues.get("settings");

  if (!settings) {
    return DEFAULT_SETTINGS;
  }
  return {
    ...DEFAULT_SETTINGS,
    ...(JSON.parse(settings.value) as Settings),
  };
}

export async function getSessionIdFromCookie() {
  const cookieValues = await cookies();
  const sessionIdCookie = cookieValues.get("session");
  if (!sessionIdCookie) {
    return;
  }
  return sessionIdCookie.value;
}

export async function setSessionIdCookie(sessionId: string) {
  const cookieValues = await cookies();
  cookieValues.set("session", sessionId);
}

export function hashPassword(password: string) {
  const sha = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  sha.update(password);
  return sha.getHash("HEX");
}
