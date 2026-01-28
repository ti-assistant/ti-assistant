import { useIntl } from "react-intl";
import { getTechs } from "../../../server/data/techs";
import { getTechTypeColor } from "../../util/techs";
import { Optional } from "../../util/types/types";
import styles from "./FormattedDescription.module.scss";
import { KEYWORDS_LIST } from "./keywords";
import { ABILITY_LIST } from "./abilities";
import { TECH_MAPPING } from "./techs";

const FULL_LIST = [
  ...KEYWORDS_LIST,
  ...ABILITY_LIST,
  ...Object.keys(TECH_MAPPING),
];

export default function FormattedDescription({
  description,
}: {
  description: Optional<string>;
}) {
  const intl = useIntl();
  const techs = getTechs(intl);
  if (!description) {
    return null;
  }
  const sections = description.split("\n\n");
  const abilityRegex = new RegExp(`(${ABILITY_LIST.join("|")})`, "g");
  const keywordRegex = new RegExp(`${KEYWORDS_LIST.join("|")}`, "g");
  const techRegex = new RegExp(`(${Object.keys(TECH_MAPPING).join("|")})`, "g");
  const fullRegex = new RegExp(`(${FULL_LIST.join("|")})`, "g");
  return (
    <>
      {sections.map((section, index) => {
        const shouldBold = section.endsWith(":");
        const chunks = section.split(fullRegex).filter((chunk) => !!chunk);
        return (
          <div
            key={index}
            style={{ fontWeight: shouldBold ? "bold" : undefined }}
          >
            {chunks.map((chunk, index) => {
              abilityRegex.lastIndex = 0;
              keywordRegex.lastIndex = 0;
              techRegex.lastIndex = 0;
              if (abilityRegex.test(chunk)) {
                return (
                  <span key={index} className={styles.Ability}>
                    {chunk}
                  </span>
                );
              } else if (keywordRegex.test(chunk)) {
                return (
                  <i key={index} className={styles.Keyword}>
                    {chunk}
                  </i>
                );
              } else if (techRegex.test(chunk)) {
                const techId = TECH_MAPPING[chunk];
                const tech = techId ? techs[techId] : undefined;
                if (!tech) {
                  return <span key={index}>{chunk}</span>;
                }
                const color = getTechTypeColor(tech.type);
                return (
                  <span key={index} className={styles.Tech} style={{ color }}>
                    {chunk}
                  </span>
                );
              }
              return <span key={index}>{chunk}</span>;
            })}
          </div>
        );
      })}
    </>
  );
}
