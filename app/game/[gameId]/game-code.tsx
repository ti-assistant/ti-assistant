import Link from "next/link";
import { IntlShape } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../src/HoverMenu";

export default async function GameCode({
  gameId,
  intlPromise,
  qrCode,
}: {
  gameId: string;
  intlPromise: Promise<IntlShape>;
  qrCode: string;
}) {
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
