"use client";

import Link from "next/link";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
import LabeledLine from "../../src/components/LabeledLine/LabeledLine";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import { responsivePixels } from "../../src/util/util";

export default function FAQPage() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="FAQ" />
      <div
        className="flexColumn"
        style={{
          maxWidth: responsivePixels(800),
          height: "100dvh",
          width: "100%",
        }}
      >
        <div className="flexRow largeFont">Frequently Asked Questions</div>
        <div className="flexColumn" style={{ gap: responsivePixels(16) }}>
          <div
            className="flexColumn"
            style={{
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <LabeledLine leftLabel="Q: I have a question that isn't answered here." />
            <div
              style={{
                fontFamily: "Myriad Pro",
                marginLeft: responsivePixels(8),
              }}
            >
              Post the question on{" "}
              <a
                href="https://github.com/ti-assistant/issues/issues"
                style={{ textDecoration: "underline", fontWeight: "bold" }}
              >
                GitHub
              </a>{" "}
              or send me a message on{" "}
              <a
                href="https://www.reddit.com/message/compose/?to=ti-assistant"
                style={{ textDecoration: "underline", fontWeight: "bold" }}
              >
                Reddit
              </a>{" "}
              and I&apos;ll get back to you as soon as I can.
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <LabeledLine leftLabel="Q: How do I use this app ?" />
            <div
              style={{
                fontFamily: "Myriad Pro",
                marginLeft: responsivePixels(8),
              }}
            >
              Display the Main Screen or Objective View on a larger screen that
              everyone at the table can view. All the players can join the game
              by using the game ID or scanning the QR code.
              <br />
              <br />
              Play the game, tracking information as you go. All information can
              be input using the main screen, and players can input their
              information on the various faction pages.
            </div>
          </div>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <LabeledLine leftLabel="Q: Do I have to record everything during a game ?" />
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
              leftLabel={
                'Q: Why can\'t I click the "Advance to Phase" button ?'
              }
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
            bug report or ask a question on{" "}
            <a
              href="https://github.com/ti-assistant/issues/issues"
              style={{ textDecoration: "underline", fontWeight: "bold" }}
            >
              GitHub
            </a>
            , and I&apos;ll get back to you as soon as I can.
          </div>
        </div>
        <Link href={`/`} style={{ marginTop: responsivePixels(12) }}>
          <BorderedDiv style={{ minWidth: responsivePixels(190) }}>
            <div
              className="flexColumn"
              style={{
                minWidth: responsivePixels(190),
              }}
            >
              Back
            </div>
          </BorderedDiv>
        </Link>
      </div>
    </div>
  );
}
