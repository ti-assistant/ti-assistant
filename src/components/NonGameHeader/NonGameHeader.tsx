import Head from "next/head";
import Link from "next/link";
import { responsivePixels } from "../../util/util";
import ResponsiveLogo from "../ResponsiveLogo/ResponsiveLogo";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./NonGameHeader.module.scss";

export default function NonGameHeader({
  leftSidebar,
  rightSidebar,
}: {
  leftSidebar?: string;
  rightSidebar?: string;
}) {
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
              Twilight Imperium Assistant
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
