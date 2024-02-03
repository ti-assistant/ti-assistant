"use client";

import Head from "next/head";
import Sidebars from "../Sidebars/Sidebars";
import styles from "./NonGameHeader.module.scss";

export default function NonGameHeader({
  leftSidebar,
  rightSidebar,
}: {
  leftSidebar: string;
  rightSidebar: string;
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
          <div className="nonMobile">
            <Sidebars left={leftSidebar} right={rightSidebar} />
          </div>
        </div>
      </div>
    </>
  );
}
