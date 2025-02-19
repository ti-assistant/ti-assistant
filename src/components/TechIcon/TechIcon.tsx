import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import styles from "./TechIcon.module.scss";
import { rem } from "../../util/util";
import RedTechSVG from "../../icons/techs/RedTech";
import YellowTechSVG from "../../icons/techs/YellowTech";
import BlueTechSVG from "../../icons/techs/BlueTech";
import GreenTechSVG from "../../icons/techs/GreenTech";

const RED_RATIO = 61 / 50;
const GREEN_RATIO = 58 / 50;
const BLUE_RATIO = 58 / 50;
const YELLOW_RATIO = 50 / 50;

interface TechIconProps {
  outline?: boolean;
  type: TechType;
  size: string | number;
}

interface TechIconCSS extends CSSProperties {
  "--width": string;
  "--height": string;
}

export default function TechIcon({
  outline = false,
  type,
  size,
}: TechIconProps) {
  const ratio = useMemo(() => {
    switch (type) {
      case "RED":
        return RED_RATIO;
      case "YELLOW":
        return YELLOW_RATIO;
      case "BLUE":
        return BLUE_RATIO;
      case "GREEN":
        return GREEN_RATIO;
      case "UPGRADE":
        return 1;
    }
  }, [type]);
  const innerContent = useMemo(() => {
    switch (type) {
      case "RED":
        if (outline) {
          return <RedTechSVG />;
        }
      case "YELLOW":
        if (outline) {
          return <YellowTechSVG />;
        }
      case "BLUE":
        if (outline) {
          return <BlueTechSVG />;
        }
      case "GREEN":
        if (outline) {
          return <GreenTechSVG />;
        }
        return (
          <Image
            src={`/images/${type.toLowerCase()}_tech.webp`}
            alt={`${type.toLowerCase()} tech`}
            sizes={rem(20)}
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "UPGRADE":
        return null;
    }
  }, [type, outline]);

  const outerIconStyle: TechIconCSS = {
    "--width": typeof size === "string" ? size : rem(size),
    "--height": typeof size === "string" ? size : rem(size),
  };
  const techIconStyle: TechIconCSS = {
    "--width": typeof size === "string" ? size : rem(size / ratio),
    "--height": typeof size === "string" ? size : rem(size),
  };
  return (
    <div className={styles.OuterIcon} style={outerIconStyle}>
      <div className={styles.TechIcon} style={techIconStyle}>
        {innerContent}
      </div>
    </div>
  );
}
