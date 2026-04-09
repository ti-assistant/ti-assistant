import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { em, rem } from "../../util/util";
import styles from "./Circle.module.scss";

interface CircleProps {
  blur?: boolean;
  backgroundColor?: string;
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
  backgroundColor = "var(--light-bg)",
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
    "--size": em(size),
    backgroundColor: blur ? undefined : backgroundColor,
    backdropFilter: blur ? `blur(${rem(4)})` : undefined,
    cursor: onClick ? "pointer" : undefined,
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
          width: em(size - 4),
          height: em(size - 4),
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: em(size - 10),
            height: em(size - 10),
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
              fontSize: em(size / 2),
              width: "1em",
              height: "1em",
            }}
          >
            {tag}
          </div>
        ) : null}
      </div>
    </div>
  );
}
