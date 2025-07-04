import { BASE_COLORS } from "../../server/data/colors";
import { getFactions } from "../../server/data/factions";
import SetupPage from "./setup-page";
import { createIntl } from "react-intl";

export default function Page({}) {
  const intl = createIntl({
    locale: "en",
  });
  const factions = getFactions(intl);
  const colors = BASE_COLORS;
  return <SetupPage factions={factions} colors={colors} />;
}
