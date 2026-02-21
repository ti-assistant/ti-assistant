import { getBaseData } from "../../../src/data/baseData";
import { getIntl } from "../../../src/util/server";
import StatsPage from "./stats-page";

export default async function Loading({
  params,
}: PageProps<"/[locale]/stats">) {
  const locale = (await params).locale;

  const intl = await getIntl(locale);

  const baseData = getBaseData(intl);

  return <StatsPage processedGames={{}} baseData={baseData} loading />;
}
