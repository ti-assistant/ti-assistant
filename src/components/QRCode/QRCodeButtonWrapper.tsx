"use client";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useGameId } from "../../context/dataHooks";
import QRCodeButton from "./QRCodeButton";
import { usePathname } from "next/navigation";
import UndoButton from "../UndoButton/UndoButton";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev.ti-assistant.com"
    : "https://ti-assistant.com";

function getQRCode(gameId: string, size: number): Promise<string> {
  return new Promise<string>((resolve) => {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
      {
        color: {
          dark: "#cecece",
          light: "#030303",
        },
        width: size,
        margin: 2,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        resolve(url);
      },
    );
  });
}

export default function QRCodeButtonWrapper() {
  const pathname = usePathname();
  const gameId = useGameId();
  const [qrCode, setCode] = useState<string>("");

  useEffect(() => {
    const makeQRCode = async (gameId: string) => {
      const qrCodePromise = getQRCode(gameId, 280);

      setCode(await qrCodePromise);
    };

    makeQRCode(gameId);
  }, [gameId]);

  if (!gameId || gameId === "") {
    return null;
  }
  if (!pathname.includes("/game/") && !pathname.includes("/archive/")) {
    return null;
  }

  return <QRCodeButton gameId={gameId} qrCode={qrCode} />;
}

export function UndoButtonWrapper() {
  const pathname = usePathname();
  const gameId = useGameId();

  if (!gameId || gameId === "") {
    return null;
  }
  if (!pathname.includes("/game/") && !pathname.includes("/archive/")) {
    return null;
  }

  return <UndoButton gameId={gameId} />;
}
