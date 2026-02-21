import { getIntl } from "../../../src/util/server";
import FAQPage from "./faq-page";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale;

  const intl = await getIntl(locale);
  return <FAQPage intl={intl} />;
}
