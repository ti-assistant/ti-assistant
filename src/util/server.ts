import { cookies } from "next/headers";
import { DEFAULT_SETTINGS, Settings } from "./settings";
import jsSHA from "jssha";

export async function getMessages(
  locale: string
): Promise<Record<string, string>> {
  const messages = await import(`../../server/compiled-lang/${locale}.json`);

  return JSON.parse(JSON.stringify(messages));
}

export function getLocale(): string {
  return cookies().get("TI_LOCALE")?.value ?? "en";
}

export function getSettings() {
  let settings = cookies().get("settings");

  if (!settings) {
    return DEFAULT_SETTINGS;
  }
  return {
    ...DEFAULT_SETTINGS,
    ...(JSON.parse(settings.value) as Settings),
  };
}

export function getSessionIdFromCookie() {
  const sessionIdCookie = cookies().get("session");
  if (!sessionIdCookie) {
    return;
  }
  return sessionIdCookie.value;
}

export function setSessionIdCookie(sessionId: string) {
  cookies().set("session", sessionId);
}

export function hashPassword(password: string) {
  const sha = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  sha.update(password);
  return sha.getHash("HEX");
}
