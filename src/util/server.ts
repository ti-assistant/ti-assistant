import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import jsSHA from "jssha";
import { cookies } from "next/headers";
import { createIntl, createIntlCache, IntlShape } from "react-intl";
import "server-only";
import { intlErrorFn } from "./util";

export const SCHEMA_VERSION = "2.0.0" as const;

export async function getMessages(
  locale: string,
): Promise<Record<string, string>> {
  const messages = await import(`../../server/compiled-lang/${locale}.json`);

  return JSON.parse(JSON.stringify(messages));
}

export async function getIntl(locale: string): Promise<IntlShape> {
  const intlCache = createIntlCache();
  const messages = await getMessages(locale);

  return createIntl({ locale, messages, onError: intlErrorFn }, intlCache);
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

export async function getFirestoreAdmin() {
  const serviceAccount =
    await import("../../server/twilight-imperium-360307-ea7cce25efeb.json");
  const apps = getApps();
  if (apps.length > 0) {
    return getFirestore();
  }
  const env = process.env.NODE_ENV;
  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const projectId = process.env.NEXT_PUBLIC_TI_PROJECT;
  if (env === "production" || !emulator) {
    initializeApp({
      credential: cert(serviceAccount as any),
    });
  } else {
    initializeApp({ projectId });
  }

  return getFirestore();
}
