import React, { PropsWithChildren } from "react";
import Head from "next/head";
import Link from "next/link";
import { responsivePixels } from "../src/util/util";
import { LabeledDiv, LabeledLine } from "../src/LabeledDiv";
import Image from "next/image";
import { NonGameHeader, ResponsiveLogo } from "../src/Header";

export default function FAQPage() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="FAQ" />
      <div
        className="flexColumn"
        style={{
          maxWidth: responsivePixels(800),
          marginTop: responsivePixels(60),
          width: "100%",
        }}
      >
        <div className="flexRow largeFont">Frequently Asked Questions</div>
        <div className="flexColumn">
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <LabeledLine leftLabel="Q: Do I have to record everything during a game?" />
            <div
              style={{
                fontFamily: "Myriad Pro",
                marginLeft: responsivePixels(8),
              }}
            >
              Nope! There&apos;s a couple bits of information that are required
              to run the assistant, but everything else is optional. The more
              information you put in, the more helpful the assistant will be and
              the more information will be present in the game log.
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <LabeledLine
              leftLabel={'Q: Why can\'t I click the "Advance to Phase" button?'}
            />

            <div
              style={{
                fontFamily: "Myriad Pro",
                marginLeft: responsivePixels(8),
              }}
            >
              The assistant locks the button to prevent accidental clicks before
              the phase is completed. If you&apos;d like to move on without
              recording what happened, click the &#128274; to unlock the button.
            </div>
          </div>
        </div>
        <div className="flexColumn" style={{ alignItems: "flex-start" }}>
          <LabeledLine
            leftLabel={"Q: Something is broken/wrong/didn't do what I expected"}
          />

          <div
            style={{
              fontFamily: "Myriad Pro",
              marginLeft: responsivePixels(8),
            }}
          >
            If you&apos;re in the middle of a game, try refreshing the page to
            see if that fixes it. Regardless of whether it does or not, file a
            bug report or ask a question on GitHub - TODO: Add working link, and
            I&apos;ll get back to you as soon as I can.
          </div>
        </div>
        More Coming Soon
        <Link href={`/`}>
          <a style={{ marginTop: responsivePixels(12) }}>
            <LabeledDiv>
              <div
                className="flexColumn mediumFont"
                style={{
                  minWidth: responsivePixels(190),
                }}
              >
                Back
              </div>
            </LabeledDiv>
          </a>
        </Link>
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
      <Link href={"/"}>
        <a
          className="nonMobile flexRow extraLargeFont"
          style={{
            cursor: "pointer",
            position: "fixed",
            textAlign: "center",
            justifyContent: "center",
            marginTop: `${responsivePixels(20)}`,
            width: "100%",
          }}
        >
          <ResponsiveLogo size={32} />
          Twilight Imperium Assistant
        </a>
      </Link>
      <Link href={"/"}>
        <a
          className="mobileOnly flexRow hugeFont"
          style={{
            cursor: "pointer",
            position: "fixed",
            textAlign: "center",
            justifyContent: "center",
            marginTop: `${responsivePixels(20)}`,
            width: "100%",
          }}
        >
          <ResponsiveLogo size={28} />
          Twilight Imperium Assistant
        </a>
      </Link>
      <div
        className="flexRow largeFont"
        style={{
          position: "fixed",
          textAlign: "center",
          justifyContent: "center",
          marginTop: `${responsivePixels(100)}`,
          width: "100%",
        }}
      >
        Frequently Asked Questions
      </div>
    </div>
  );
}
