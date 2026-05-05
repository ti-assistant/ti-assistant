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
  innerStyle,
}: PropsWithChildren<{
  icon?: ReactNode;
  label: ReactNode;
  innerStyle?: CSSProperties;
  style?: CSSProperties;
}>) {
  return (
    <div className={styles.Card} style={style}>
      <label>
        {label}
        {icon ? <div className={styles.Icon}>{icon}</div> : null}
      </label>
      <div className={styles.CardBody} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}

export function FactionCard({
  children,
  label,
  factionId,
  style,
  innerStyle,
}: PropsWithChildren<{
  factionId: FactionId;
  label?: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
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
      innerStyle={innerStyle}
    >
      {children}
    </Card>
  );
}
