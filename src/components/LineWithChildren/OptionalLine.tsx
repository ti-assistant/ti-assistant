import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import LabeledLine from "../LabeledLine/LabeledLine";
import styles from "./OptionalLine.module.scss";

export default function OptionalLine({
  children,
  label,
  style = {},
}: PropsWithChildren<{ label: ReactNode; style?: CSSProperties }>) {
  return (
    <div
      className={styles.OptionalLineContainer}
      style={{ width: "100%", ...style }}
    >
      <LabeledLine className={styles.OptionalLine} leftLabel={label} />
      {children}
    </div>
  );
}
