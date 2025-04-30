import { FormattedMessage } from "react-intl";
import { rem } from "../../util/util";

export default function QRCodeModal({
  gameId,
  qrCode,
}: {
  gameId: string;
  qrCode: string;
}) {
  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "center",
        height: `calc(100dvh - ${rem(36)})`,
      }}
    >
      <div
        className="flexRow centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          border: "1px solid var(--neutral-border)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
          width: "fit-content",
        }}
      >
        <FormattedMessage
          id="+XKsgE"
          description="Text used to identify the current game."
          defaultMessage="Game"
        />
        : {gameId}
      </div>
      <img src={qrCode} alt="QR Code for joining game" />
    </div>
  );
}
