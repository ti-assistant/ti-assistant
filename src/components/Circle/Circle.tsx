import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import styles from "./Circle.module.scss";

interface CircleProps {
  blur?: boolean;
  borderColor?: string;
  fade?: boolean;
  onClick?: () => void;
  size?: number;
  style?: CSSProperties;
  tag?: ReactNode;
  tagBorderColor?: string;
}

interface CircleCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

export default function Circle({
  blur,
  borderColor = "#444",
  children,
  fade = false,
  onClick,
  size = 44,
  style = {},
  tag,
  tagBorderColor = "#444",
}: PropsWithChildren<CircleProps>) {
  const factionCircleStyle: CircleCSS = {
    "--border-color": borderColor,
    "--size": `${size}px`,
    backgroundColor: blur ? undefined : "#222",
    backdropFilter: blur ? "blur(4px)" : undefined,
    boxShadow: borderColor === "Black" ? BLACK_BORDER_GLOW : undefined,
    cursor: onClick ? "pointer" : undefined,
    fontSize: `${size - 8}px`,
    ...style,
  };

  return (
    <div
      className={`flexRow ${styles.Circle}`}
      style={factionCircleStyle}
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
          {children}
        </div>
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
