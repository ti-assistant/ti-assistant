import Link from "next/link";
import QRCode from "qrcode";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";
import { createIntlCache, createIntl, IntlShape } from "react-intl";
import { getLocale, getMessages } from "../../../src/util/server";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default async function GameCode({
  gameId,
  intlPromise,
}: {
  gameId: string;
  intlPromise: Promise<IntlShape>;
}) {
  const qrCode = await new Promise<string>((resolve) => {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: 172,
        margin: 2,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        resolve(url);
      }
    );
  });

  const intl = await intlPromise;

  return (
    <ClientOnlyHoverMenu
      label={`${intl.formatMessage({
        id: "+XKsgE",
        description: "Text used to identify the current game.",
        defaultMessage: "Game",
      })}: ${gameId}`}
    >
      <div className="flexColumn">
        <Link href={`/game/${gameId}`}>
          <img src={qrCode} alt="QR Code for joining game" />
        </Link>
      </div>
    </ClientOnlyHoverMenu>
  );
}
