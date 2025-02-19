import Image from "next/image";
import { CSSProperties } from "react";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./PlanetIcon.module.scss";
import { rem } from "../../util/util";
import CulturalPlanetSVG from "../../icons/planets/CulturalPlanet";
import HazardousPlanetSVG from "../../icons/planets/HazardousPlanet";
import IndustrialPlanetSVG from "../../icons/planets/IndustrialPlanet";

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
          <IndustrialPlanetSVG />
        </div>
        <div>
          <CulturalPlanetSVG />
        </div>
        <div>
          <HazardousPlanetSVG />
        </div>
      </div>
    );
  }

  let svg = null;
  switch (type) {
    case "CULTURAL":
      svg = <CulturalPlanetSVG />;
      break;
    case "HAZARDOUS":
      svg = <HazardousPlanetSVG />;
      break;
    case "INDUSTRIAL":
      svg = <IndustrialPlanetSVG />;
      break;
  }

  return (
    <div className={styles.PlanetIcon} style={planetIconStyle}>
      {svg}
    </div>
  );
}
