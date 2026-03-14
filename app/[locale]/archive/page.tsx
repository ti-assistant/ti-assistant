import "server-only";
import { getEvents } from "../../../server/data/events";
import { getIntl } from "../../../src/util/server";
import ArchivePage from "./archive-page";

export default async function Page({ params }: PageProps<"/[locale]/archive">) {
  const locale = (await params).locale;
  const intl = await getIntl(locale);

  const events = Object.values(getEvents(intl)).sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  return <ArchivePage baseEvents={events} />;
}
