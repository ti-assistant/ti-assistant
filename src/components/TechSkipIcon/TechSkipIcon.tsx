import { CSSProperties } from "react";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TechSkipIcon.module.scss";
import { em, rem } from "../../util/util";

interface TechSkipIconCSS extends CSSProperties {
  "--size": string;
}

export default function TechSkipIcon({
  size,
  color = "var(--foreground-color)",
  outline,
}: {
  size: number;
  color?: string;
  outline?: boolean;
}) {
  const techSkipIconCSS: TechSkipIconCSS = {
    "--size": em(size),
  };

  return (
    <div className={styles.TechSkipIcon} style={techSkipIconCSS}>
      <TechIcon type="RED" size={size / 2} outline={outline} color={color} />
      <TechIcon type="GREEN" size={size / 2} outline={outline} color={color} />
      <TechIcon type="BLUE" size={size / 2} outline={outline} color={color} />
      <TechIcon type="YELLOW" size={size / 2} outline={outline} color={color} />
    </div>
  );
}
