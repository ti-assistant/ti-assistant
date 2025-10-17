import { CSSProperties } from "react";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TechSkipIcon.module.scss";
import { rem } from "../../util/util";

interface TechSkipIconCSS extends CSSProperties {
  "--size": string;
}

export default function TechSkipIcon({
  size,
  color = "#eee",
  outline,
}: {
  size: number;
  color?: string;
  outline?: boolean;
}) {
  const techSkipIconCSS: TechSkipIconCSS = {
    "--size": rem(size),
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
