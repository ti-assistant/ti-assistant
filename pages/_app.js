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
  const { locale } = router;
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
      <Component {...pageProps} />
    </IntlProvider>
  );
}
