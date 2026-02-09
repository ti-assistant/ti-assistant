import { createIntl } from "react-intl";
import { BASE_COLORS } from "../../server/data/colors";
import { getEvents } from "../../server/data/events";
import { getFactions } from "../../server/data/factions";
import SetupPage from "./setup-page";
import { intlErrorFn } from "../../src/util/util";

export default function Page({}) {
  const intl = createIntl({
    locale: "en",
    onError: intlErrorFn as any,
  });
  const factions = getFactions(intl);
  const colors = BASE_COLORS;
  const events = getEvents(intl);
  return <SetupPage factions={factions} colors={colors} events={events} />;
}
