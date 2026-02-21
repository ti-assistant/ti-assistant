import { BASE_COLORS } from "../../../server/data/colors";
import { getEvents } from "../../../server/data/events";
import { getFactions } from "../../../server/data/factions";
import Sidebars from "../../../src/components/Sidebars/Sidebars";
import { getIntl } from "../../../src/util/server";
import SetupPage from "./setup-page";

export default async function Page({ params }: PageProps<"/[locale]/setup">) {
  const locale = (await params).locale;

  const intl = await getIntl(locale);

  const factions = getFactions(intl);
  const colors = BASE_COLORS;
  const events = getEvents(intl);
  return (
    <>
      <Sidebars
        left={intl
          .formatMessage({
            id: "9DZz2w",
            description: "Text identifying that this is the setup step.",
            defaultMessage: "Setup Game",
          })
          .toUpperCase()}
        right={intl
          .formatMessage({
            id: "9DZz2w",
            description: "Text identifying that this is the setup step.",
            defaultMessage: "Setup Game",
          })
          .toUpperCase()}
      />
      <SetupPage factions={factions} colors={colors} events={events} />
    </>
  );
}
