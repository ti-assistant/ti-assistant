import Image from "next/image";
import { CSSProperties } from "react";
import { responsivePixels } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./PlanetIcon.module.scss";

type Size = `${number}%` | number;

interface PlanetIconProps {
  type: PlanetType;
  factionId?: FactionId;
  size: Size;
}

interface PlanetIconCSS extends CSSProperties {
  "--size": string;
}

export default function PlanetIcon({ type, factionId, size }: PlanetIconProps) {
  if (type === "NONE") {
    return factionId ? <FactionIcon factionId={factionId} size={size} /> : null;
  }

  if (type === "ALL") {
    return (
      <div className={styles.TripleIcon}>
        <Image
          src="/images/industrial_icon.svg"
          alt="Industrial Planet Icon"
          width={18}
          height={18}
        />
        <Image
          src="/images/cultural_icon.svg"
          alt="Cultural Planet Icon"
          width={18}
          height={18}
        />
        <Image
          src="/images/hazardous_icon.svg"
          alt="Hazardous Planet Icon"
          width={18}
          height={18}
        />
      </div>
    );
  }

  const planetIconStyle: PlanetIconCSS = {
    "--size": typeof size === "string" ? size : responsivePixels(size),
  };
  return (
    <div className={styles.PlanetIcon} style={planetIconStyle}>
      <Image
        src={`/images/${type.toLowerCase()}_icon.svg`}
        alt={`${type.toLowerCase()} planet icon`}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}
