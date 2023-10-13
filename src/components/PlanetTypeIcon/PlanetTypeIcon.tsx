import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import { responsivePixels } from "../../util/util";
import styles from "./PlanetTypeIcon.module.scss";

type Size = `${number}%` | number;

interface PlanetTypeIconProps {
  type: PlanetType;
  size: Size;
}

interface PlanetTypeIconCSS extends CSSProperties {
  "--size": string;
}

export default function PlanetTypeIcon({ type, size }: PlanetTypeIconProps) {
  let image = useMemo(() => {
    switch (type) {
      case "NONE":
        return null;
      case "CULTURAL":
      case "HAZARDOUS":
      case "INDUSTRIAL":
        return (
          <Image
            src={`/images/${type.toLowerCase()}_icon.svg`}
            alt={`${type.toLowerCase()} planet icon`}
            layout="fill"
            objectFit="contain"
          />
        );
      case "ALL":
        return (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              gap: "1px",
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                gap: "1px",
              }}
            >
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src="/images/cultural_icon.svg"
                  alt="Cultural Planet Icon"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <Image
                  src="/images/hazardous_icon.svg"
                  alt="Hazardous Planet Icon"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="/images/industrial_icon.svg"
                alt="Industrial Planet Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        );
    }
  }, [type]);

  const planetTypeIconStyle: PlanetTypeIconCSS = {
    "--size": typeof size === "string" ? size : responsivePixels(size),
  };
  return (
    <div className={styles.PlanetTypeIcon} style={planetTypeIconStyle}>
      {image}
    </div>
  );
}
