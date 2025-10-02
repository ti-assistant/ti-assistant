import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import styles from "./IconDiv.module.scss";
import { rem } from "../../util/util";

interface IconDivProps {
  icon: Exclude<ReactNode, null | undefined>;
  iconSize?: number;
  blur?: boolean;
  className?: string;
  innerClass?: string;
  color?: string;
  innerStyle?: CSSProperties;
  opts?: IconDivOpts;
  style?: CSSProperties;
}

interface IconDivOpts {
  fixedWidth?: boolean;
}

interface IconDivCSS extends CSSProperties {
  "--color": string;
  "--icon-size": string;
}

// Div with an icon on the left side. Icon must be 1rem (16px).
export default function IconDiv({
  icon,
  iconSize = 16,
  blur,
  children,
  className,
  innerClass,
  color = "var(--neutral-border)",
  style = {},
  innerStyle = {},
}: PropsWithChildren<IconDivProps>) {
  const divStyle: IconDivCSS = {
    "--color": color,
    "--icon-size": rem(iconSize),
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    ...style,
  };
  return (
    <div className={`${styles.IconDiv} ${className ?? ""}`} style={divStyle}>
      <div className={`${styles.icon}`}>{icon}</div>
      {blur ? <div className={styles.blurBox}></div> : null}
      <div
        className={`${styles.innerDiv} ${innerClass ?? ""}`}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
