import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { SymbolX } from "../../icons/svgs";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { responsivePixels } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./FactionCircle.module.scss";

interface FactionCircleProps {
  blur?: boolean;
  borderColor?: string;
  factionId?: FactionId;
  fade?: boolean;
  onClick?: () => void;
  size?: number;
  tag?: ReactNode;
  tagBorderColor?: string;
}

interface FactionCircleCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

export default function FactionCircle({
  blur,
  borderColor = "#444",
  children,
  factionId,
  fade = false,
  onClick,
  size = 44,
  tag,
  tagBorderColor = "#444",
}: PropsWithChildren<FactionCircleProps>) {
  const factionCircleStyle: FactionCircleCSS = {
    "--border-color": borderColor,
    "--size": responsivePixels(size),
    backgroundColor: blur ? undefined : "#222",
    backdropFilter: blur ? "blur(4px)" : undefined,
    boxShadow: borderColor === "Black" ? BLACK_BORDER_GLOW : undefined,
    cursor: onClick ? "pointer" : undefined,
    fontSize: responsivePixels(size - 8),
  };

  return (
    <div
      className={`flexRow ${styles.FactionCircle}`}
      style={factionCircleStyle}
      onClick={onClick}
    >
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: responsivePixels(size - 4),
          height: responsivePixels(size - 4),
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: responsivePixels(size - 10),
            height: responsivePixels(size - 10),
            opacity: fade ? 0.5 : undefined,
          }}
        >
          {factionId ? (
            <FactionIcon factionId={factionId} size="100%" />
          ) : (
            <SymbolX />
          )}
        </div>
        {children}
        {tag ? (
          <div
            className={`flexRow ${styles.tag}`}
            style={{
              border: `${responsivePixels(1)} solid ${tagBorderColor}`,
              boxShadow: `${responsivePixels(1)} ${responsivePixels(
                1
              )} ${responsivePixels(4)} black`,
              width: responsivePixels(24),
              height: responsivePixels(24),
            }}
          >
            {tag}
          </div>
        ) : null}
      </div>
    </div>
  );
}
