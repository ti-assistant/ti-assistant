import React, { PropsWithChildren } from "react";
import Head from "next/head";
import Link from "next/link";
import { responsivePixels } from "../src/util/util";
import Image from "next/image";
import { NonGameHeader } from "../src/Header";
import { LabeledDiv } from "../src/LabeledDiv";

export default function HelpPage() {
  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="HELP" />
      <div
        className="flexColumn"
        style={{
          width: "100%",
          height: "100svh",
        }}
      >
        <h3>Help</h3>
        Coming Soon
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
