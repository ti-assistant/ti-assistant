import Head from "next/head";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { responsivePixels } from "../../util/util";
import ResponsiveLogo from "../ResponsiveLogo/ResponsiveLogo";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./ObjectivesHeader.module.scss";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

interface ObjectivesHeaderProps {
  leftSidebar: string;
  rightSidebar: string;
  gameId?: string;
}

export default function ObjectivesHeader({
  leftSidebar,
  rightSidebar,
  gameId,
}: ObjectivesHeaderProps) {
  const [qrCode, setQrCode] = useState<string>();
  const [qrCodeSize, setQrCodeSize] = useState(164);

  useEffect(() => {
    setQrCodeSize(
      Math.max(
        164 + (328 - 164) * ((window.innerWidth - 1280) / (2560 - 1280)),
        164
      )
    );
  }, []);

  if (!qrCode && gameId) {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: qrCodeSize,
        margin: 4,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }
  return (
    <>
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div className={`flexRow ${styles.ObjectivesHeader}`}>
        <div className={styles.InnerObjectivesHeader}>
          <Sidebar side="left">{leftSidebar}</Sidebar>
          <Sidebar side="right">{rightSidebar}</Sidebar>

          <Link href={"/"}>
            <a
              className={`flexRow extraLargeFont nonMobile ${styles.HomeLink} ${styles.desktop}`}
            >
              <ResponsiveLogo size={32} />
              Twilight Imperium Assistant
            </a>
          </Link>
          <Link href={"/"}>
            <a
              className={`flexRow hugeFont mobileOnly ${styles.HomeLink} ${styles.mobile}`}
            >
              <ResponsiveLogo size={28} />
              Twilight Imperium Assistant
            </a>
          </Link>

          {gameId ? (
            <Link href={`/game/${gameId}`}>
              <a>
                <ClientOnlyHoverMenu
                  label={`Game: ${gameId}`}
                  buttonStyle={{
                    position: "fixed",
                    top: responsivePixels(24),
                    right: responsivePixels(120),
                  }}
                >
                  <div
                    className="flexColumn"
                    style={{
                      position: "relative",
                      marginTop: responsivePixels(8),
                    }}
                  >
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code for joining game" />
                    ) : null}
                  </div>
                </ClientOnlyHoverMenu>
              </a>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
