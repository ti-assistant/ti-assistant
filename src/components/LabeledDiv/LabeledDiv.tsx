import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW, BLACK_TEXT_GLOW } from "../../util/borderGlow";
import styles from "./LabeledDiv.module.scss";
import { rem } from "../../util/util";

interface LabeledDivProps {
  label: ReactNode;
  noBlur?: boolean;
  onClick?: () => void;
  rightLabel?: ReactNode;
  style?: CSSProperties;
  color?: string;
  opts?: LabeledDivOpts;
  className?: string;
}

interface LabeledDivOpts {
  fixedWidth?: boolean;
}

interface LabeledDivCSS extends CSSProperties {
  "--color": string;
}

export default function LabeledDiv({
  label,
  rightLabel,
  children,
  noBlur,
  onClick,
  style = {},
  color = "var(--neutral-border)",
  opts = {},
  className,
}: PropsWithChildren<LabeledDivProps>) {
  const padding = `${!!label ? rem(10) : rem(6)} ${rem(6)} ${rem(6)} ${rem(6)}`;
  const divStyle: LabeledDivCSS = {
    "--color": color,
    padding: `${padding}`,
    cursor: onClick ? "pointer" : "cursor",
    marginTop: !!label ? rem(4) : 0,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    ...style,
  };
  return (
    <div
      className={`${styles.LabeledDiv} ${className ?? ""}`}
      style={divStyle}
      onClick={onClick}
    >
      {noBlur ? null : <div className={styles.blurBox}></div>}
      {!!label ? (
        <div
          className={`${styles.label} ${styles.left}`}
          style={{
            maxWidth: opts.fixedWidth ? `calc(100% - ${rem(14)})` : undefined,
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          <div>{label}</div>
        </div>
      ) : null}
      {!!rightLabel ? (
        <div
          className={`${styles.label} ${styles.right}`}
          style={{
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {rightLabel}
        </div>
      ) : null}
      <div
        className="flexRow"
        style={{
          height: 0,
          visibility: "hidden",
          zIndex: -1,
          gap: rem(8),
          whiteSpace: "nowrap",
        }}
      >
        <div>{label}</div>
        <div>{rightLabel}</div>
      </div>
      {children}
    </div>
  );
}
