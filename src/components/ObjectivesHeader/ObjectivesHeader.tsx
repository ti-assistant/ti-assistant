import Head from "next/head";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { responsivePixels } from "../../util/util";
import ResponsiveLogo from "../ResponsiveLogo/ResponsiveLogo";
import styles from "./ObjectivesHeader.module.scss";
import Sidebars from "../Sidebars/Sidebars";
import LanguageSelectRadialMenu from "../LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
  const router = useRouter();
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
          <Sidebars left={leftSidebar} right={rightSidebar} />

          <Link
            href={"/"}
            className={`flexRow extraLargeFont nonMobile ${styles.HomeLink} ${styles.desktop}`}
          >
            <ResponsiveLogo size={32} />
            Twilight Imperium Assistant
          </Link>
          <Link
            href={"/"}
            className={`flexRow hugeFont mobileOnly ${styles.HomeLink} ${styles.mobile}`}
          >
            <ResponsiveLogo size={28} />
            Twilight Imperium Assistant
          </Link>
          <div className={styles.LangSelect}>
            <LanguageSelectRadialMenu
              selectedLocale={router.locale ?? "en"}
              locales={["en"]}
              invalidLocales={[router.locale ?? "en"]}
              onSelect={(locale) => {
                if (!locale) {
                  return;
                }
                Cookies.set("NEXT_LOCALE", locale);
                router.push(
                  { pathname: router.pathname, query: router.query },
                  router.asPath,
                  {
                    locale: locale,
                  }
                );
              }}
              size={28}
            />
          </div>

          {gameId ? (
            <Link href={`/game/${gameId}`}>
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
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
