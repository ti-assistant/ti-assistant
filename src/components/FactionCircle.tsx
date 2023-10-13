import { PropsWithChildren, ReactNode } from "react";
import { SymbolX } from "../icons/svgs";
import { BLACK_BORDER_GLOW } from "../util/borderGlow";
import { responsivePixels } from "../util/util";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionSelect.module.scss";

function FactionCircle({
  blur = false,
  borderColor = "#444",
  children,
  factionId,
  fade = false,
  onClick,
  size = 44,
  tag,
  tagBorderColor = "#444",
}: PropsWithChildren<{
  blur?: boolean;
  borderColor?: string;
  factionId?: FactionId;
  fade?: boolean;
  onClick?: () => void;
  size?: number;
  tag?: ReactNode;
  tagBorderColor?: string;
}>) {
  return (
    <div
      className="flexRow"
      style={{
        backgroundColor: blur ? undefined : "#222",
        backdropFilter: blur ? "blur(4px)" : undefined,
        borderRadius: "100%",
        border: `${responsivePixels(2)} solid ${borderColor}`,
        width: responsivePixels(size),
        height: responsivePixels(size),
        fontSize: responsivePixels(size - 8),
        color: "#777",
        cursor: onClick ? "pointer" : undefined,
        boxShadow: borderColor === "Black" ? BLACK_BORDER_GLOW : undefined,
      }}
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
