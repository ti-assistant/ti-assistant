import { PropsWithChildren } from "react";
import { getBaseData } from "../data/baseData";
import { getIntl } from "../util/server";
import DataStore from "./DataStore";

export default async function DataStoreWrapper({
  locale,
  children,
}: PropsWithChildren<{ locale: string }>) {
  const intl = await getIntl(locale);

  const baseData = getBaseData(intl);

  return <DataStore baseData={baseData}>{children}</DataStore>;
}
