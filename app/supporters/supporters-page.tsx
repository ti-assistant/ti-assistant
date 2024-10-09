"use client";

import Link from "next/link";
import { FormattedMessage } from "react-intl";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import { rem } from "../../src/util/util";

export default function Supporters() {
  return (
    <div className="flexColumn" style={{ gap: rem(16) }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="SUPPORTERS" />
      <div
        className="flexColumn"
        style={{
          maxWidth: rem(800),
          height: "100dvh",
          width: "100%",
        }}
      >
        <LabeledDiv
          label={
            <FormattedMessage
              id="355TBA"
              defaultMessage="Contributors"
              description="Label for section listing out people that worked on TI Assistant."
            />
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              paddingBottom: rem(4),
              width: "100%",
              fontSize: rem(24),
            }}
          >
            <div>
              <FormattedMessage
                id="kq4/fY"
                defaultMessage="German Translation: {name}"
                description="Credit for the german translation of TI Assistant."
                values={{ name: "BuzZoiDk24" }}
              />
            </div>
          </div>
        </LabeledDiv>
        <LabeledDiv
          label={
            <FormattedMessage
              id="X3Nzbr"
              defaultMessage="Patrons"
              description="Label for section listing out people that regularly donate to TI Assistant."
            />
          }
          rightLabel={
            <a href={`https://patreon.com/TIAssistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                <FormattedMessage
                  id="wOb6Wx"
                  defaultMessage="Become a Patron"
                  description="A button that will open the Patreon page."
                />
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              paddingBottom: rem(4),
              width: "100%",
              fontSize: rem(20),
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Eric
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ilya
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Meanswell
            </div>
          </div>
        </LabeledDiv>
        <LabeledDiv
          label={
            <FormattedMessage
              id="dENKlQ"
              defaultMessage="Supporters"
              description="Label for section listing out everyone that has donated to TI Assistant."
            />
          }
          rightLabel={
            <a href={`https://www.buymeacoffee.com/tiassistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                <FormattedMessage
                  id="Alcp4i"
                  defaultMessage="Buy me a coffee"
                  description="A button that will open the Buy me a coffee page."
                />
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              paddingBottom: rem(4),
              width: "100%",
              fontSize: rem(16),
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Grant
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ha
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Michael
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Signoreliro
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Will
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Worldly-Charity-9737
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Benjamin
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Mike
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Gregory
            </div>
          </div>
        </LabeledDiv>

        <Link href={`/`} style={{ marginTop: rem(12) }}>
          <BorderedDiv>
            <div
              className="flexColumn mediumFont"
              style={{
                minWidth: rem(190),
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
