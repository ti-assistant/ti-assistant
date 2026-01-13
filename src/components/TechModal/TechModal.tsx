import { use } from "react";
import { FormattedMessage } from "react-intl";
import { SettingsContext } from "../../context/contexts";
import { useOptions } from "../../context/dataHooks";
import Chip from "../Chip/Chip";
import styles from "./TechModal.module.scss";
import TechPanel from "./TechPanel";

export default function TechModalContent() {
  const { settings, updateSetting } = use(SettingsContext);
  const options = useOptions();

  const groupTechsByFaction =
    settings["group-techs-by-faction"] ||
    options.expansions.includes("TWILIGHTS FALL");

  return (
    <div className={styles.TechModal}>
      <div className={styles.TechModalTitleSection}>
        <div className={styles.TechModalTitle}>
          {options.expansions.includes("TWILIGHTS FALL") ? (
            "Cards"
          ) : (
            <FormattedMessage
              id="ys7uwX"
              description="Shortened version of technologies."
              defaultMessage="Techs"
            />
          )}
        </div>
        {options.expansions.includes("TWILIGHTS FALL") ? null : (
          <div
            className={`${styles.TechModalTitle} ${styles.TechModalSettings}`}
            onClick={(e) => e.stopPropagation()}
          >
            <FormattedMessage
              id="WvbM4Q"
              description="Label for a group of buttons for selecting which option to group by."
              defaultMessage="Group by"
            />
            :
            <Chip
              selected={!groupTechsByFaction}
              toggleFn={() => updateSetting("group-techs-by-faction", false)}
              fontSize={12}
            >
              <FormattedMessage
                id="ys7uwX"
                description="Shortened version of technologies."
                defaultMessage="Techs"
              />
            </Chip>
            <Chip
              selected={groupTechsByFaction}
              toggleFn={() => updateSetting("group-techs-by-faction", true)}
              fontSize={12}
            >
              <FormattedMessage
                id="r2htpd"
                description="Text on a button that will randomize factions."
                defaultMessage="Factions"
              />
            </Chip>
          </div>
        )}
      </div>
      <div
        className={styles.TechModalBody}
        onClick={(e) => e.stopPropagation()}
      >
        <TechPanel byFaction={groupTechsByFaction} />
      </div>
    </div>
  );
}
