import { CSSProperties } from "react";
import InfluenceSVG from "../../icons/planets/Influence";
import ResourcesSVG from "../../icons/planets/Resources";
import { rem } from "../../util/util";
import styles from "./ResourcesIcon.module.scss";

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
      <div className={styles.InfluenceSymbol}>
        <InfluenceSVG influence={influence} />
      </div>
    </div>
  );
}
