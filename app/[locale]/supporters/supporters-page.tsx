import Link from "next/link";
import { IntlShape } from "react-intl";
import BorderedDiv from "../../../src/components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../../../src/components/NonGameHeader/NonGameHeader";
import { rem } from "../../../src/util/util";

export default function Supporters({ intl }: { intl: IntlShape }) {
  return (
    <div
      className="flexColumn"
      style={{ gap: rem(16), justifyContent: "flex-start" }}
    >
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="SUPPORTERS" />
      <div
        className="flexColumn"
        style={{
          maxWidth: rem(800),
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginBlockStart: "3.5rem",
          minHeight: "calc(100dvh - 7rem)",
        }}
      >
        <LabeledDiv
          label={intl.formatMessage({
            id: "355TBA",
            defaultMessage: "Contributors",
            description:
              "Label for section listing out people that worked on TI Assistant.",
          })}
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
              {intl.formatMessage(
                {
                  id: "VZ+RJH",
                  defaultMessage: "Programming: {name}",
                  description: "Credit for helping to program TI Assistant.",
                },
                { name: "NoahPeres" },
              )}
            </div>
            <div>
              {intl.formatMessage(
                {
                  id: "kq4/fY",
                  defaultMessage: "German (de) Translation: {name}",
                  description:
                    "Credit for the german translation of TI Assistant.",
                },
                { name: "BuzZoiDk24" },
              )}
            </div>
            <div>
              {intl.formatMessage(
                {
                  id: "LCVmZp",
                  defaultMessage: "French (fr) Translation: {name}",
                  description:
                    "Credit for the french translation of TI Assistant.",
                },
                { name: "Bibox" },
              )}
            </div>
            <div>
              {intl.formatMessage(
                {
                  id: "0pQtUL",
                  defaultMessage: "Polish (pl) Translation: {name}",
                  description:
                    "Credit for the polish translation of TI Assistant.",
                },
                { name: "Battis" },
              )}
            </div>
            <div>
              {intl.formatMessage(
                {
                  id: "KeMh1j",
                  defaultMessage: "Portuguese (pt-BR) Translation: {name}",
                  description:
                    "Credit for the portuguese (pt-BR) translation of TI Assistant.",
                },
                { name: "Luis Redigolo" },
              )}
            </div>
          </div>
        </LabeledDiv>
        <LabeledDiv
          label={intl.formatMessage({
            id: "X3Nzbr",
            defaultMessage: "Patrons",
            description:
              "Label for section listing out people that regularly donate to TI Assistant.",
          })}
          rightLabel={
            <a href={`https://patreon.com/TIAssistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                {intl.formatMessage({
                  id: "wOb6Wx",
                  defaultMessage: "Become a Patron",
                  description: "A button that will open the Patreon page.",
                })}
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
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
            <div className="flexRow centered" style={{ width: "100%" }}>
              Justin
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Michael J.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ian W.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Scott P.
            </div>
          </div>
        </LabeledDiv>
        <LabeledDiv
          label={intl.formatMessage({
            id: "dENKlQ",
            defaultMessage: "Supporters",
            description:
              "Label for section listing out everyone that has donated to TI Assistant.",
          })}
          rightLabel={
            <a href={`https://www.buymeacoffee.com/tiassistant`}>
              <div
                className="flexColumn mediumFont"
                style={{
                  width: "100%",
                }}
              >
                {intl.formatMessage({
                  id: "Alcp4i",
                  defaultMessage: "Buy me a coffee",
                  description:
                    "A button that will open the Buy me a coffee page.",
                })}
              </div>
            </a>
          }
        >
          <div
            className="flexColumn largeFont"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              paddingBottom: rem(4),
              width: "100%",
              fontSize: rem(16),
            }}
          >
            <div className="flexRow centered" style={{ width: "100%" }}>
              Grant W.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ha N.
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
              Benjamin H.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Mike
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Gregory L.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              John H.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Ben G.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Gregory B.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Joe M.
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              TJ
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Froggy
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Luke
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              CasaAugusto
            </div>
            <div className="flexRow centered" style={{ width: "100%" }}>
              Trang H.
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
              {intl.formatMessage({
                id: "LNmymU",
                defaultMessage: "Back",
                description:
                  "Text on a button that goes back to the previous page.",
              })}
            </div>
          </BorderedDiv>
        </Link>
      </div>
    </div>
  );
}
