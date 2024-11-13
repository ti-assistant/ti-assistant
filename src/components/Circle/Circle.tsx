import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import styles from "./Circle.module.scss";
import { rem } from "../../util/util";

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
    "--size": rem(size),
    backgroundColor: blur ? undefined : "var(--light-bg)",
    backdropFilter: blur ? `blur(${rem(4)})` : undefined,
    boxShadow: borderColor === "Black" ? BLACK_BORDER_GLOW : undefined,
    cursor: onClick ? "pointer" : undefined,
    fontSize: rem(size - 8),
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
          width: rem(size - 4),
          height: rem(size - 4),
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: rem(size - 10),
            height: rem(size - 10),
            opacity: fade ? 0.5 : undefined,
          }}
        >
          {children}
        </div>
        {tag ? (
          <div
            className={`flexRow ${styles.tag}`}
            style={{
              border: `1px solid ${tagBorderColor}`,
              boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
              width: rem(size / 2),
              height: rem(size / 2),
            }}
          >
            {tag}
          </div>
        ) : null}
      </div>
    </div>
  );
}
