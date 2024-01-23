import { useRouter } from "next/router";
import { useMemo } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import "../public/FactionSummary.css";
import "../public/game.css";
import "../public/loader.css";
import "../public/planet_row.css";
import "../public/resources.css";
import "../public/site.css";
import English from "../server/compiled-lang/en.json";
import French from "../server/compiled-lang/fr.json";
import Cookies from "js-cookie";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname, locale, query, asPath } = router;

  const messages = useMemo(() => {
    switch (locale) {
      case "en":
        return English;
      case "fr":
        return French;
    }
    return English;
  });

  return (
    <IntlProvider locale={locale} messages={messages}>
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
      {/* {Cookies.get("NEXT_LOCALE")} */}
      <FormattedMessage defaultMessage={"Test string"} id="93G7sJ" />
      <Component {...pageProps} />
    </IntlProvider>
  );
}
