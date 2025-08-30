import { CSSProperties } from "react";
import styles from "./ResourcesIcon.module.scss";
import { rem } from "../../util/util";
import ResourcesSVG from "../../icons/planets/Resources";
import InfluenceSVG from "../../icons/planets/Influence";

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
      <div className={styles.ResourceSymbol}>
        <ResourcesSVG resources={resources} />
      </div>
      {/* <div className={styles.ResourceValue}>{resources}</div> */}
      <div className={styles.InfluenceSymbol}>
        <InfluenceSVG influence={influence} />
      </div>
      {/* <div className={styles.InfluenceValue}>{influence}</div> */}
    </div>
  );
}
