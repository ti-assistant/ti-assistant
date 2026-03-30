import { CSSProperties, useMemo } from "react";
import BlueTechSVG from "../../icons/techs/BlueTech";
import GreenTechSVG from "../../icons/techs/GreenTech";
import RedTechSVG from "../../icons/techs/RedTech";
import YellowTechSVG from "../../icons/techs/YellowTech";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import { em } from "../../util/util";
import styles from "./TechIcon.module.scss";

interface TechIconProps {
  color?: string;
  outline?: boolean;
  type: TechType;
  size: string | number;
}

interface TechIconCSS extends CSSProperties {
  "--width": string;
  "--height": string;
}

export default function TechIcon({
  color = "var(--foreground-color)",
  outline = false,
  type,
  size,
}: TechIconProps) {
  const innerContent = useMemo(() => {
    switch (type) {
      case "YELLOW":
        return <YellowTechSVG outline={outline} color={color} />;
      case "GREEN":
        return <GreenTechSVG outline={outline} color={color} />;
      case "RED":
        return <RedTechSVG outline={outline} color={color} />;
      case "BLUE":
        return <BlueTechSVG outline={outline} color={color} />;
      case "UPGRADE":
        return <UpgradeSVG />;
    }
  }, [type, outline, color]);

  const outerIconStyle: TechIconCSS = {
    "--width": typeof size === "string" ? size : em(size),
    "--height": typeof size === "string" ? size : em(size),
  };
  return (
    <div className={styles.OuterIcon} style={outerIconStyle}>
      {innerContent}
    </div>
  );
}
