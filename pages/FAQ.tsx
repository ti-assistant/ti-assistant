import React, { PropsWithChildren } from "react";
import Head from "next/head";
import Link from "next/link";
import { responsivePixels } from "../src/util/util";

export default function FAQPage() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <Header />
      <div
        className="flexColumn"
        style={{
          width: "100%",
          height: "100svh",
        }}
      >
        <h3>Frequently Asked Questions</h3>
        Coming Soon
      </div>
    </div>
  );
}

function Sidebar({ side, children }: PropsWithChildren<{ side: string }>) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{ letterSpacing: "3px" }}>
      {children}
    </div>
  );
}

function Header() {
  return (
    <div
      className="flexRow"
      style={{
        top: 0,
        left: 0,
        position: "fixed",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <Sidebar side="left">TI ASSISTANT</Sidebar>
      <Sidebar side="right">FAQ</Sidebar>
      {/* <Link href={"/"}>
        <a className="nonMobile">
          <div
            className="extraLargeFont"
            style={{
              cursor: "pointer",
              position: "fixed",
              backgroundColor: "#222",
              textAlign: "center",
              top: `${responsivePixels(12)}`,
              // left: `${responsivePixels(150)}`,
            }}
          >
            Twilight Imperium Assistant
          </div>
        </a>
      </Link> */}
      <Link href={"/"}>
        <a
          className="flexColumn extraLargeFont"
          style={{
            cursor: "pointer",
            position: "fixed",
            textAlign: "center",
            paddingTop: `${responsivePixels(20)}`,
            width: "100%",
          }}
        >
          Twilight Imperium Assistant
        </a>
      </Link>
    </div>
  );
}
