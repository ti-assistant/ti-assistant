import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import "../public/FactionSummary.css";
import "../public/game.css";
import "../public/loader.css";
import "../public/planet_row.css";
import "../public/resources.css";
import "../public/site.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname, locale, query, asPath } = router;
  const [messages, setMessages] = useState({});

  useEffect(() => {
    async function fetchMessages() {
      const loaded = await import(`../server/compiled-lang/${locale}.json`);
      setMessages(loaded);
    }
    fetchMessages();
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} onError={() => {}}>
      {/* TODO: Remove this when adding in an actual way to switch locale. */}
      <button
        onClick={() => {
          Cookies.set("NEXT_LOCALE", locale === "en" ? "fr" : "en");
          router.push({ pathname, query }, asPath, {
            locale: locale === "en" ? "fr" : "en",
          });
        }}
      >
        Switch lang
      </button>
      <FormattedMessage defaultMessage={"Test string"} id="93G7sJ" />
      <Component {...pageProps} />
    </IntlProvider>
  );
}
