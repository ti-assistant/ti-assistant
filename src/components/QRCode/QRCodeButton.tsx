"use client";

import { use } from "react";
import { ModalContext } from "../../context/contexts";
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
  const { openModal } = use(ModalContext);

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
