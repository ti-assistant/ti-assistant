import Head from "next/head";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import ResponsiveLogo from "./components/ResponsiveLogo/ResponsiveLogo";
import Sidebar from "./components/Sidebar/Sidebar";
import { responsivePixels } from "./util/util";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export function MobileHeader({
  leftSidebar,
  rightSidebar,
  gameId,
}: {
  leftSidebar?: string;
  rightSidebar?: string;
  gameId?: string;
}) {
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
    <div
      className="flexRow"
      style={{
        top: 0,
        position: "fixed",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 1,
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div
        className="flex"
        style={{
          top: 0,
          width: "100vw",
          position: "fixed",
          justifyContent: "space-between",
        }}
      >
        {leftSidebar ? <Sidebar side="left">{leftSidebar}</Sidebar> : null}
        {rightSidebar ? <Sidebar side="right">{rightSidebar}</Sidebar> : null}

        <Link href={"/"}>
          <a
            className="flexRow extraLargeFont nonMobile"
            style={{
              cursor: "pointer",
              position: "fixed",
              justifyContent: "center",
              top: responsivePixels(16),
              left: responsivePixels(96),
            }}
          >
            <ResponsiveLogo size={32} />
            {/* <Image src={Logo} alt="" width="32px" height="32px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
        <Link href={"/"}>
          <a
            className="flexRow hugeFont mobileOnly"
            style={{
              cursor: "pointer",
              position: "fixed",
              textAlign: "center",
              justifyContent: "center",
              zIndex: 4,
              paddingTop: responsivePixels(12),
              paddingBottom: responsivePixels(12),
              width: "100%",
              left: 0,
              backgroundColor: "#222",
              boxSizing: "border-box",
            }}
          >
            <ResponsiveLogo size={28} />
            {/* <Image src={Logo} alt="" width="28px" height="28px" /> */}
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
  );
}
