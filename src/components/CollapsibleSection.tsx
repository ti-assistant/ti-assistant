import { CSSProperties, PropsWithChildren, ReactNode, useState } from "react";
import { Optional } from "../util/types/types";
import styles from "./CollapsibleSection.module.scss";

interface CollapsibleSectionCSS extends CSSProperties {
  "--color": Optional<string>;
}

export function CollapsibleSection({
  children,
  color = "var(--neutral-border)",
  title,
  openedByDefault = false,
  style = {},
}: PropsWithChildren<{
  title: ReactNode;
  color?: string;
  openedByDefault?: boolean;
  style?: CSSProperties;
}>) {
  const [collapsed, setCollapsed] = useState(!openedByDefault);
  const [overflow, setOverflow] = useState(openedByDefault);

  const collapsibleSectionCSS: CollapsibleSectionCSS = {
    "--color": color,
    ...style,
  };

  return (
    <div className={styles.collapsibleContainer} style={collapsibleSectionCSS}>
      <div
        className={styles.title}
        onClick={() => {
          setCollapsed(!collapsed);
          if (collapsed) {
            setTimeout(() => {
              setOverflow(collapsed);
            }, 500);
          } else {
            setOverflow(collapsed);
          }
        }}
      >
        {title}
      </div>
      <div
        className={`${styles.collapsible} ${
          collapsed ? styles.collapsed : ""
        } ${overflow ? styles.overflow : ""}`}
      >
        <div className={styles.contentContainer}>{children}</div>
      </div>
    </div>
  );
}
