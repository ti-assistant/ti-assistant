import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { useFactionColors } from "../../context/factionDataHooks";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./Card.module.scss";
import FactionName from "../FactionComponents/FactionName";

export default function Card({
  children,
  label,
  icon,
  style,
}: PropsWithChildren<{
  icon?: ReactNode;
  label: ReactNode;
  style?: CSSProperties;
}>) {
  return (
    <div className={styles.Card} style={style}>
      <label>{label}</label>
      {icon ? <div className={styles.Icon}>{icon}</div> : null}
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
  label?: ReactNode;
  style?: CSSProperties;
}>) {
  const factionColor = useFactionColors(factionId);

  return (
    <Card
      label={
        label ?? (
          <span style={{ color: factionColor.color }}>
            <FactionName factionId={factionId} />
          </span>
        )
      }
      icon={<FactionIcon factionId={factionId} size={20} />}
      style={{
        border: `1px solid ${factionColor.border}`,
        ...style,
      }}
    >
      {children}
    </Card>
  );
}
