import { cookies } from "next/headers";

export async function getMessages(
  locale: string
): Promise<Record<string, string>> {
  const messages = await import(`../../server/compiled-lang/${locale}.json`);

  return JSON.parse(JSON.stringify(messages));
}

export function getLocale(): string {
  return cookies().get("TI_LOCALE")?.value ?? "en";
}
