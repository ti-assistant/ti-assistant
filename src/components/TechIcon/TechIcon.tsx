import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import styles from "./TechIcon.module.scss";
import { rem } from "../../util/util";
import RedTechSVG from "../../icons/techs/RedTech";
import YellowTechSVG from "../../icons/techs/YellowTech";
import BlueTechSVG from "../../icons/techs/BlueTech";
import GreenTechSVG from "../../icons/techs/GreenTech";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";

const RED_RATIO = 61 / 61;
const GREEN_RATIO = 58 / 58;
const BLUE_RATIO = 58 / 58;
const YELLOW_RATIO = 50 / 50;

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
  color = "#eee",
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
    "--width": typeof size === "string" ? size : rem(size),
    "--height": typeof size === "string" ? size : rem(size),
  };
  return (
    <div className={styles.OuterIcon} style={outerIconStyle}>
      {innerContent}
    </div>
  );
}
