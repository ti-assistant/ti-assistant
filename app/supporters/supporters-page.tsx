"use client";

import Link from "next/link";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import { responsivePixels } from "../../src/util/util";

export default function Supporters() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="SUPPORTERS" />
      <div
        className="flexColumn"
        style={{
          maxWidth: responsivePixels(800),
          height: "100dvh",
          width: "100%",
        }}
      >
        <LabeledDiv
          label="Patrons"
          rightLabel={
            <a href={`https://patreon.com/TIAssistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                Become one here!
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              paddingBottom: responsivePixels(4),
              width: "100%",
              fontSize: responsivePixels(24),
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Signoreliro
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Grant
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ilya
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Benjamin
            </div>
          </div>
        </LabeledDiv>
        <LabeledDiv
          label="Supporters"
          rightLabel={
            <a href={`https://www.buymeacoffee.com/tiassistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                Buy me a coffee here!
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              paddingBottom: responsivePixels(4),
              width: "100%",
              fontSize: responsivePixels(24),
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Worldly-Charity-9737
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ha
            </div>
          </div>
        </LabeledDiv>

        <Link href={`/`} style={{ marginTop: responsivePixels(12) }}>
          <BorderedDiv>
            <div
              className="flexColumn mediumFont"
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
