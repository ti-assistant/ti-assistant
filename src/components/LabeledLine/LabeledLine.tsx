import { CSSProperties, ReactNode } from "react";
import { BLACK_LINE_GLOW, BLACK_TEXT_GLOW } from "../../util/borderGlow";
import styles from "./LabeledLine.module.scss";

interface LabeledLineProps {
  className?: string;
  color?: string;
  leftLabel?: ReactNode;
  label?: ReactNode;
  rightLabel?: ReactNode;
  style?: CSSProperties;
}

interface LabeledLineCSS extends CSSProperties {
  "--color": string;
}

export default function LabeledLine({
  className,
  leftLabel,
  label,
  rightLabel,
  style = {},
  color = "var(--neutral-border)",
}: LabeledLineProps) {
  const labeledLineStyle: LabeledLineCSS = {
    "--color": color,
    ...style,
  };
  return (
    <div
      className={`flexColumn ${styles.LabeledLine} ${className}`}
      style={labeledLineStyle}
    >
      <hr
        style={{
          boxShadow: color === "Black" ? BLACK_LINE_GLOW : undefined,
        }}
      />
      {leftLabel ? (
        <div
          className={`${styles.label} ${styles.left}`}
          style={{
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {leftLabel}
        </div>
      ) : null}

      {label ? (
        <div className="flexRow" style={{ width: "100%" }}>
          <div
            className={`${styles.label} ${styles.center}`}
            style={{
              textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
      {rightLabel ? (
        <div
          className={`${styles.label} ${styles.right}`}
          style={{
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {rightLabel}
        </div>
      ) : null}
    </div>
  );
}
