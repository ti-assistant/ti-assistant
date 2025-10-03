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
  types: PlanetType[];
  factionId?: FactionId;
  size: Size;
}

interface PlanetIconCSS extends CSSProperties {
  "--size": string;
}

function PlanetIconSVG({ type }: { type: PlanetType }) {
  switch (type) {
    case "CULTURAL":
      return <CulturalPlanetSVG />;
    case "HAZARDOUS":
      return <HazardousPlanetSVG />;
    case "INDUSTRIAL":
      return <IndustrialPlanetSVG />;
  }
}

export default function PlanetIcon({
  types,
  factionId,
  size,
}: PlanetIconProps) {
  if (types.length === 0) {
    return factionId ? <FactionIcon factionId={factionId} size={size} /> : null;
  }

  const planetIconStyle: PlanetIconCSS = {
    "--size": typeof size === "string" ? size : rem(size),
  };

  switch (types.length) {
    case 0:
      return factionId ? (
        <FactionIcon factionId={factionId} size={size} />
      ) : null;
    case 1:
      const type = types[0];
      if (!type) {
        return null;
      }

      return (
        <div className={styles.PlanetIcon} style={planetIconStyle}>
          <PlanetIconSVG type={type} />
        </div>
      );
    case 2:
      return (
        <div className={styles.DoubleIcon} style={planetIconStyle}>
          {types.map((type) => {
            return (
              <div key={type}>
                <PlanetIconSVG type={type} />
              </div>
            );
          })}
        </div>
      );

    default:
      return (
        <div className={styles.TripleIcon} style={planetIconStyle}>
          {types.map((type) => {
            return (
              <div key={type}>
                <PlanetIconSVG type={type} />
              </div>
            );
          })}
        </div>
      );
  }
}
