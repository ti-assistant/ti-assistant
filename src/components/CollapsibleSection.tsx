import { CSSProperties, PropsWithChildren, ReactNode, useState } from "react";
import styles from "./CollapsibleSection.module.scss";

export function CollapsibleSection({
  children,
  title,
  openedByDefault = false,
  style = {},
}: PropsWithChildren<{
  title: ReactNode;
  openedByDefault?: boolean;
  style?: CSSProperties;
}>) {
  const [collapsed, setCollapsed] = useState(!openedByDefault);

  return (
    <div className={styles.collapsibleContainer} style={style}>
      <div className={styles.title} onClick={() => setCollapsed(!collapsed)}>
        {title}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.contentContainer}>{children}</div>
      </div>
    </div>
  );
}
