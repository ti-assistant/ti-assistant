import { CSSProperties } from "react";
import { responsivePixels } from "../../util/util";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TechSkipIcon.module.scss";

interface TechSkipIconCSS extends CSSProperties {
  "--size": string;
}

export default function TechSkipIcon({ size }: { size: number }) {
  const techSkipIconCSS: TechSkipIconCSS = {
    "--size": responsivePixels(size),
  };

  return (
    <div className={styles.TechSkipIcon} style={techSkipIconCSS}>
      <TechIcon type="RED" size={size / 2 - 2} />
      <TechIcon type="GREEN" size={size / 2 - 2} />
      <TechIcon type="BLUE" size={size / 2 - 2} />
      <TechIcon type="YELLOW" size={size / 2 - 2} />
    </div>
  );
}
