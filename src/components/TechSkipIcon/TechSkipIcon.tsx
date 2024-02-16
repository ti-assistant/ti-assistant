import { CSSProperties } from "react";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TechSkipIcon.module.scss";

interface TechSkipIconCSS extends CSSProperties {
  "--size": string;
}

export default function TechSkipIcon({
  size,
  outline,
}: {
  size: number;
  outline?: boolean;
}) {
  const techSkipIconCSS: TechSkipIconCSS = {
    "--size": `${size}px`,
  };

  return (
    <div className={styles.TechSkipIcon} style={techSkipIconCSS}>
      <TechIcon type="RED" size={size / 2} outline={outline} />
      <TechIcon type="GREEN" size={size / 2} outline={outline} />
      <TechIcon type="BLUE" size={size / 2} outline={outline} />
      <TechIcon type="YELLOW" size={size / 2} outline={outline} />
    </div>
  );
}
