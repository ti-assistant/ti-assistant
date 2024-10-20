import { CSSProperties } from "react";
import styles from "./ResourcesIcon.module.scss";
import { rem } from "../../util/util";

interface ResourcesProps {
  resources: number;
  influence: number;
  height: number;
}

interface ResourcesIconCSS extends CSSProperties {
  "--height": `${number}rem`;
}

export default function ResourcesIcon({
  resources,
  influence,
  height,
}: ResourcesProps) {
  const resourcesIconCSS: ResourcesIconCSS = {
    "--height": rem(height),
  };

  return (
    <div className={styles.ResourcesIcon} style={resourcesIconCSS}>
      <div className={styles.ResourceSymbol}>&#9711;</div>
      <div className={styles.ResourceValue}>{resources}</div>
      <div className={styles.InfluenceSymbol}>&#x2B21;</div>
      <div className={styles.InfluenceValue}>{influence}</div>
    </div>
  );
}
