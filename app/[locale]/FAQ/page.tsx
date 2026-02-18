import { createIntl } from "react-intl";
import FAQPage from "./faq-page";
import { getMessages } from "../../../src/util/server";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale;
  const messages = await getMessages(locale);
  const intl = createIntl({ locale, messages });
  return <FAQPage intl={intl} />;
}
