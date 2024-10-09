import Image from "next/image";
import { CSSProperties } from "react";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./PlanetIcon.module.scss";
import { rem } from "../../util/util";

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

  const planetIconStyle: PlanetIconCSS = {
    "--size": typeof size === "string" ? size : rem(size),
  };

  if (type === "ALL") {
    return (
      <div className={styles.TripleIcon} style={planetIconStyle}>
        <div>
          <Image
            src="/images/industrial_icon.svg"
            alt="Industrial Planet Icon"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div>
          <Image
            src="/images/cultural_icon.svg"
            alt="Cultural Planet Icon"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div>
          <Image
            src="/images/hazardous_icon.svg"
            alt="Hazardous Planet Icon"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PlanetIcon} style={planetIconStyle}>
      <Image
        src={`/images/${type.toLowerCase()}_icon.svg`}
        alt={`${type.toLowerCase()} planet icon`}
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
