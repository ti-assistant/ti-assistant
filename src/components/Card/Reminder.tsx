import { CSSProperties } from "react";
import ActionCardsSVG from "../../icons/expedition/ActionCards";
import RelicMenuSVG from "../../icons/ui/RelicMenu";
import { Optional } from "../../util/types/types";
import LegendaryPlanetIcon from "../PlanetIcons/LegendaryPlanetIcon";
import TechIcon from "../TechIcon/TechIcon";
import UnitIcon from "../Units/Icons";
import styles from "./Reminder.module.scss";
import LeaderSVG from "../../icons/ui/Leader";
import AbilitySVG from "../../icons/twilightsfall/ability";

export type ReminderType =
  | "ABILITY"
  | "AGENDA"
  | "LEGENDARY"
  | "RELIC"
  | "TECH"
  | "LEADER"
  | "ACTION CARD"
  | "UNIT";

export default function Reminder({
  onClick,
  subType,
  text,
  type,
  used,
}: {
  onClick?: () => void;
  subType?: UnitType | TechType | LeaderType;
  text: string;
  type: ReminderType;
  used?: boolean;
}) {
  function getIcon() {
    switch (type) {
      case "ABILITY":
        return <AbilitySVG />;
      case "LEGENDARY":
        return <LegendaryPlanetIcon />;
      case "RELIC":
        return <RelicMenuSVG color="var(--relic-color)" />;
      case "TECH":
        switch (subType) {
          case "RED":
          case "GREEN":
          case "YELLOW":
          case "BLUE":
            return <TechIcon type={subType} size="1em" />;
        }
        return <TechIcon type="UPGRADE" size="1em" />;
      case "ACTION CARD":
        return <ActionCardsSVG />;
      case "UNIT":
        switch (subType) {
          case "Carrier":
          case "Cruiser":
          case "Dreadnought":
          case "Flagship":
          case "Fighter":
          case "Infantry":
          case "Mech":
          case "PDS":
          case "Space Dock":
          case "War Sun":
          case "Destroyer":
            return <UnitIcon type={subType} />;
        }
        return <UnitIcon type="Flagship" />;
      case "LEADER":
        return <LeaderSVG color="var(--color)" />;
    }
  }

  function getIconStyle(): Optional<CSSProperties> {
    if (type === "UNIT") {
      switch (subType) {
        case "Carrier":
        case "Cruiser":
        case "Dreadnought":
        case "Flagship":
          return { width: "2em" };
      }
    }
  }

  return (
    <div
      className={`${styles.Reminder} ${!used && onClick ? styles.Used : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {text}
      <div className={styles.Icon} style={getIconStyle()}>
        {getIcon()}
      </div>
    </div>
  );
}
