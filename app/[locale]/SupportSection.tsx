import { IntlShape } from "react-intl";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../../src/components/LabeledDiv/LabeledDiv";
import BuyMeACoffeeSVG from "../../src/icons/ui/BuyMeACoffee";
import GitHubSVG from "../../src/icons/ui/GitHub";
import PatreonSVG from "../../src/icons/ui/Patreon";
import { rem } from "../../src/util/util";
import styles from "./home-page.module.scss";

export default function SupportSection({ intl }: { intl: IntlShape }) {
  return (
    <LabeledDiv
      label={intl.formatMessage({
        id: "X7zR7a",
        defaultMessage: "Help support TI Assistant",
        description: "Label for a section about helping TI Assistant",
      })}
      style={{ gridColumn: "span 2" }}
      innerClass={styles.SupportSection}
    >
      <a href={`https://patreon.com/TIAssistant`}>
        <BorderedDiv>
          <div
            style={{
              position: "relative",
              height: rem(18),
              flexBasis: "20%",
            }}
          >
            <PatreonSVG />
          </div>
          {intl.formatMessage({
            id: "wOb6Wx",
            defaultMessage: "Become a Patron",
            description: "A button that will open the Patreon page.",
          })}
        </BorderedDiv>
      </a>
      <a href={`https://www.buymeacoffee.com/tiassistant`}>
        <BorderedDiv>
          <div
            style={{
              position: "relative",
              height: rem(18),
              flexBasis: "20%",
            }}
          >
            <BuyMeACoffeeSVG />
          </div>
          {intl.formatMessage({
            id: "Alcp4i",
            defaultMessage: "Buy me a coffee",
            description: "A button that will open the Buy me a coffee page.",
          })}
        </BorderedDiv>
      </a>
      <a href={`https://github.com/ti-assistant/issues/issues`}>
        <BorderedDiv>
          <div
            style={{
              position: "relative",
              height: rem(18),
            }}
          >
            <GitHubSVG />
          </div>
          {intl.formatMessage({
            id: "A5p5qF",
            defaultMessage: "Report Issue",
            description: "A button that will open the Github issues page.",
          })}
        </BorderedDiv>
      </a>
    </LabeledDiv>
  );
}
