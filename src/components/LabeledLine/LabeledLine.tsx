import { CSSProperties, ReactNode } from "react";
import { BLACK_LINE_GLOW, BLACK_TEXT_GLOW } from "../../util/borderGlow";
import styles from "./LabeledLine.module.scss";

interface LabeledLineProps {
  className?: string;
  color?: string;
  borderColor?: string;
  leftLabel?: ReactNode;
  label?: ReactNode;
  rightLabel?: ReactNode;
  style?: CSSProperties;
}

interface LabeledLineCSS extends CSSProperties {
  "--border-color": string;
  "--color": string;
}

export default function LabeledLine({
  className,
  leftLabel,
  label,
  rightLabel,
  style = {},
  color = "var(--foreground-color)",
  borderColor = "var(--hidden-border)",
}: LabeledLineProps) {
  const labeledLineStyle: LabeledLineCSS = {
    "--border-color": borderColor ?? color,
    "--color": color,
    ...style,
  };
  return (
    <div
      className={`flexColumn ${styles.LabeledLine} ${className}`}
      style={labeledLineStyle}
    >
      <hr />
      {leftLabel ? (
        <div className={`${styles.label} ${styles.left}`}>{leftLabel}</div>
      ) : null}

      {label ? (
        <div className="flexRow" style={{ width: "100%" }}>
          <div className={`${styles.label} ${styles.center}`}>{label}</div>
        </div>
      ) : null}
      {rightLabel ? (
        <div className={`${styles.label} ${styles.right}`}>{rightLabel}</div>
      ) : null}
      <div className={styles.hiddenLabel}>
        {leftLabel ? <div>{leftLabel}</div> : null}
        {label ? <div>{label}</div> : null}
        {rightLabel ? <div>{rightLabel}</div> : null}
      </div>
    </div>
  );
}
