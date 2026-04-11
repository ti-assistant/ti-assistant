import { PropsWithChildren, ReactNode } from "react";
import styles from "./Card.module.scss";

export default function Card({
  children,
  label,
}: PropsWithChildren<{ label: ReactNode }>) {
  return (
    <div className={styles.Card}>
      <label>{label}</label>
      {children}
    </div>
  );
}
