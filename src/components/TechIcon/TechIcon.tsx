import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import { responsivePixels } from "../../util/util";
import styles from "./TechIcon.module.scss";

interface TechIconProps {
  type: TechType;
  size: number;
}

interface TechIconCSS extends CSSProperties {
  "--width": string;
  "--height": string;
}

export default function TechIcon({ type, size }: TechIconProps) {
  const innerContent = useMemo(() => {
    switch (type) {
      case "RED":
      case "YELLOW":
      case "BLUE":
      case "GREEN":
        return (
          <Image
            src={`/images/${type.toLowerCase()}_tech.webp`}
            alt={`${type.toLowerCase()} tech`}
            layout="fill"
            objectFit="contain"
          />
        );
      case "UPGRADE":
        return null;
    }
  }, [type]);

  const techIconStyle: TechIconCSS = {
    "--width": responsivePixels(size + 2),
    "--height": responsivePixels(size),
  };
  return (
    <div className={styles.TechIcon} style={techIconStyle}>
      {innerContent}
    </div>
  );
}
