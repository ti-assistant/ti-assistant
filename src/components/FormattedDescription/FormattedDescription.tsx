import { Optional } from "../../util/types/types";
import styles from "./FormattedDescription.module.scss";

const KEYWORDS_REGEX_LIST = [
  // ACTION
  /ACTION:/gi,
  /AKTION:/gi,
  // DEPLOY
  /DEPLOY:/gi,
  /EINSATZ:/gi,
  // UNLOCK
  /UNLOCK:/gi,
  // For
  // Against
  /For:/gi,
  /Against:/gi,
];

const ABILITY_REGEX_LIST = [
  // PRODUCTION
  /PRODUCTION(?: [1-9]| X)?/gi,
  /PRODUKTION(?: [1-9]| X)?/gi,
  // ANTI-FIGHTER BARRAGE
  /ANTI-FIGHTER BARRAGE(?: [1-9] \(x[1-9]\))?/gi,
  // BOMBARDMENT
  /BOMBARDMENT(?: [1-9] \(x[1-9]\))?/,
  /BOMBARDEMENT(?: [1-9] \(x[1-9]\))?/gi,
  // SPACE CANNON
  /SPACE CANNON(?: [1-9](?: \(x[1-9]\))?)?/gi,
  /WELTRAUMKANONE(?: [1-9](?: \(x[1-9]\))?)?/gi,
  // SUSTAIN DAMAGE
  /SUSTAIN DAMAGE/gi,
  /SCHADENSRESISTENZ/gi,
  // PLANETARY SHIELD
  /PLANETARY SHIELD/gi,
  /PLANETARER SCHILD/gi,
  // Faction specific keywords
  /MITOSIS/gi,
  /ZELLTEILUNG/gi,
  /AWAKEN/gi,
  /ERWECKEN/gi,
  /STAR FORGE/gi,
  /STERNENSCHMIEDE/gi,
  /ORBITAL DROP/gi,
  /ORBITALE LANDUNG/gi,
  /PILLAGE/gi,
  /PLÜNDERN/gi,
  /TELEPATHIC/gi,
  /TELEPATHIE/gi,
  /TECHNOLOGICAL SINGULARITY/gi,
  /TECHNOLOGISCHE SINGULARITÄT/gi,
  /FRAGILE/gi,
  /ZERBRECHLICH/gi,
  /INDOCTRINATION/gi,
  /MISSIONIEREN/gi,
  /STALL TACTICS/gi,
  /VERZÖGERUNGSTAKTIK/gi,
  // DS Faction specific keywords
  /RALLY TO THE CAUSE/gi,
  /RECYCLED MATERIALS/gi,
  /AUTONETIC MEMORY/gi,
];

const FULL_REGEX_LIST = [...KEYWORDS_REGEX_LIST, ...ABILITY_REGEX_LIST];

export default function FormattedDescription({
  description,
}: {
  description: Optional<string>;
}) {
  if (!description) {
    return null;
  }
  const sections = description.split("\n\n");
  const abilityRegex = new RegExp(
    `(${ABILITY_REGEX_LIST.map((exp) => exp.source).join("|")})`,
    "g"
  );
  const keywordRegex = new RegExp(
    `${KEYWORDS_REGEX_LIST.map((exp) => exp.source).join("|")}`,
    "g"
  );
  const fullRegex = new RegExp(
    `(${FULL_REGEX_LIST.map((exp) => exp.source).join("|")})`,
    "g"
  );
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
              }
              return <span key={index}>{chunk}</span>;
            })}
          </div>
        );
      })}
    </>
  );
}
