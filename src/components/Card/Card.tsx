import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import styles from "./Card.module.scss";
import FactionIcon from "../FactionIcon/FactionIcon";
import { useFactionColors } from "../../context/factionDataHooks";

export default function Card({
  children,
  label,
  style,
}: PropsWithChildren<{ label: ReactNode; style?: CSSProperties }>) {
  return (
    <div className={styles.Card} style={style}>
      <label>{label}</label>
      <div className={styles.CardBody}>{children}</div>
    </div>
  );
}

export function FactionCard({
  children,
  label,
  factionId,
  style,
}: PropsWithChildren<{
  factionId: FactionId;
  label: ReactNode;
  style?: CSSProperties;
}>) {
  const factionColor = useFactionColors(factionId);
  return (
    <div
      className={styles.Card}
      style={{
        ...style,
        border: `1px solid ${factionColor.border}`,
      }}
    >
      <label>{label}</label>
      <div className={styles.Icon}>
        <FactionIcon factionId={factionId} size={16} />
      </div>
      <div className={styles.CardBody}>{children}</div>
    </div>
  );
}
