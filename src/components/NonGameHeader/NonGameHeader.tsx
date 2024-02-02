// import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { responsivePixels } from "../../util/util";
// import LanguageSelectRadialMenu from "../LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import ResponsiveLogo from "../ResponsiveLogo/ResponsiveLogo";
import Sidebars from "../Sidebars/Sidebars";
import styles from "./NonGameHeader.module.scss";
import LanguageSelectRadialMenu from "../LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import Cookies from "js-cookie";
import { useIntl } from "react-intl";

export default function NonGameHeader({
  leftSidebar,
  rightSidebar,
}: {
  leftSidebar: string;
  rightSidebar: string;
}) {
  const intl = useIntl();
  // const router = useRouter();
  // const pathname = usePathname();
  // const query = useSearchParams();
  return (
    <>
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div className={`flexRow ${styles.NonGameHeader}`}>
        <div
          className="flex"
          style={{
            top: 0,
            width: "100vw",
            position: "fixed",
            justifyContent: "space-between",
          }}
        >
          <div className="nonMobile">
            <Sidebars left={leftSidebar} right={rightSidebar} />
          </div>
          {/* <Link
            href={"/"}
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
            Twilight Imperium Assistant
          </Link> */}
          {/* TODO: Add localization menu */}
          {/* <div className={styles.LangSelect}>
            <LanguageSelectRadialMenu
              selectedLocale={intl.locale}
              locales={["en", "fr"]}
              invalidLocales={[]}
              onSelect={(locale) => {
                if (!locale) {
                  return;
                }
                Cookies.set("TI_LOCALE", locale);
                window.location.reload();
              }}
              size={28}
            />
          </div> */}
          {/* <Link
            href={"/"}
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
            Twilight Imperium Assistant
          </Link> */}
        </div>
      </div>
    </>
  );
}
