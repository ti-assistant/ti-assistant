import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Chip.module.scss";

export default function ChipGroup({
  children,
  style = {},
}: PropsWithChildren<{ style?: CSSProperties }>) {
  return (
    <div className={styles.ChipGroup} style={style}>
      {children}
    </div>
  );
}
