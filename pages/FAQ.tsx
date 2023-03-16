import React from "react";
import Link from "next/link";
import { responsivePixels } from "../src/util/util";
import { LabeledDiv, LabeledLine } from "../src/LabeledDiv";
import { NonGameHeader } from "../src/Header";

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
