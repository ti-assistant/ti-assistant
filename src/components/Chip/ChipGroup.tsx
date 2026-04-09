import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import styles from "./Chip.module.scss";

export default function ChipGroup({
  children,
  label,
  style = {},
}: PropsWithChildren<{ label?: ReactNode; style?: CSSProperties }>) {
  if (label) {
    return (
      <div className={styles.ChipGroupOuter}>
        {label}
        <div className={styles.ChipGroup} style={style}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.ChipGroup} style={style}>
      {children}
    </div>
  );
}
