"use client";

import { useSharedModal } from "../../data/SharedModal";
import QRCodeSVG from "../../icons/ui/QRCode";
import { rem } from "../../util/util";
import QRCodeModal from "./QRCodeModal";

export default function QRCodeButton({
  gameId,
  qrCode,
}: {
  gameId: string;
  qrCode: string;
}) {
  const { openModal } = useSharedModal();

  return (
    <button
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        padding: "unset",
      }}
      onClick={() => {
        openModal(<QRCodeModal gameId={gameId} qrCode={qrCode} />);
      }}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        <QRCodeSVG />
      </div>
    </button>
  );
}
