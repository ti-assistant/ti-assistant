import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW, BLACK_TEXT_GLOW } from "../../util/borderGlow";
import styles from "./LabeledDiv.module.scss";
import { rem } from "../../util/util";

interface LabeledDivProps {
  label: Exclude<ReactNode, null | undefined>;
  blur?: boolean;
  className?: string;
  innerClass?: string;
  rightLabel?: ReactNode;
  color?: string;
  innerStyle?: CSSProperties;
  opts?: LabeledDivOpts;
  style?: CSSProperties;
}

interface LabeledDivOpts {
  fixedWidth?: boolean;
}

interface LabeledDivCSS extends CSSProperties {
  "--color": string;
}

export default function LabeledDiv({
  label,
  blur,
  children,
  className,
  innerClass,
  rightLabel,
  color = "var(--neutral-border)",
  opts = {},
  style = {},
  innerStyle = {},
}: PropsWithChildren<LabeledDivProps>) {
  const divStyle: LabeledDivCSS = {
    "--color": color,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    ...style,
  };
  return (
    <div className={`${styles.LabeledDiv} ${className ?? ""}`} style={divStyle}>
      {blur ? <div className={styles.blurBox}></div> : null}
      <div
        className={`${styles.label} ${styles.left}`}
        style={{
          maxWidth: opts.fixedWidth ? `calc(100% - ${rem(14)})` : undefined,
          textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
        }}
      >
        <div>{label}</div>
      </div>
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
      <div className={styles.hiddenLabel}>
        <div>{label}</div>
        <div>{rightLabel}</div>
      </div>
      <div
        className={`${styles.innerDiv} ${innerClass ?? ""}`}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
