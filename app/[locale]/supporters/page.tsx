import { getIntl } from "../../../src/util/server";
import Supporters from "./supporters-page";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale;

  const intl = await getIntl(locale);
  return <Supporters intl={intl} />;
}
