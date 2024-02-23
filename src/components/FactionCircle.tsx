import { PropsWithChildren, ReactNode } from "react";
import { SymbolX } from "../icons/svgs";
import { BLACK_BORDER_GLOW } from "../util/borderGlow";
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
        border: `${"2px"} solid ${borderColor}`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size - 8}px`,
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
          width: `${size - 4}px`,
          height: `${size - 4}px`,
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: `${size - 10}px`,
            height: `${size - 10}px`,
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
              border: `${"1px"} solid ${tagBorderColor}`,
              boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
              width: "24px",
              height: "24px",
            }}
          >
            {tag}
          </div>
        ) : null}
      </div>
    </div>
  );
}
