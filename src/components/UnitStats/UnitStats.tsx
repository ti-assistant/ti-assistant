import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import HitSVG from "../../icons/ui/Hit";
import { Optional } from "../../util/types/types";
import UnitIcon from "../Units/Icons";
import styles from "./UnitStats.module.scss";

export default function UnitStats({
  className,
  stats,
  type,
}: {
  className?: string;
  stats: UnitStats;
  type: UnitType;
}) {
  return (
    <div className={`${className ?? ""} flexRow`} style={{ width: "100%" }}>
      <div className={styles.UnitStatsGrid}>
        <UnitStat
          name={
            <FormattedMessage
              id="Unit.Stats.Cost"
              defaultMessage="COST"
              description="Label for unit stat block - cost of the unit."
            />
          }
          stat={stats.cost}
          statType="cost"
          unitType={type}
        />
        <UnitStat
          name={
            <FormattedMessage
              id="Unit.Stats.Combat"
              defaultMessage="COMBAT"
              description="Label for unit stat block - combat value of the unit."
            />
          }
          stat={stats.combat}
          statType="combat"
          unitType={type}
        />
        <UnitStat
          name={
            <FormattedMessage
              id="Unit.Stats.Move"
              defaultMessage="MOVE"
              description="Label for unit stat block - move value of the unit."
            />
          }
          stat={stats.move}
          statType="move"
          unitType={type}
        />
        <UnitStat
          name={
            <FormattedMessage
              id="Unit.Stats.Capacity"
              defaultMessage="CAPACITY"
              description="Label for unit stat block - capacity value of the unit."
            />
          }
          stat={stats.capacity}
          statType="capacity"
          unitType={type}
        />
      </div>
    </div>
  );
}

function UnitStat({
  name,
  statType,
  unitType,
  stat,
}: {
  name: ReactNode;
  statType: keyof UnitStats;
  unitType: UnitType;
  stat: Optional<number | string>;
}) {
  if (!stat) {
    return <div></div>;
  }

  return (
    <div className={styles.UnitStat}>
      <div
        style={{
          fontSize: "calc(1em / 3)",
          borderBottom: "1px solid #eee",
        }}
      >
        <FormattedStat stat={stat} statType={statType} unitType={unitType} />
      </div>
      <div
        style={{
          fontSize: "calc(1em / 6)",
          padding: `calc(1em / 12)`,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function FormattedStat({
  stat,
  statType,
  unitType,
}: {
  stat: string | number;
  statType: keyof UnitStats;
  unitType: UnitType;
}) {
  if (typeof stat === "number") {
    return stat;
  }
  if (stat.includes("(x2)")) {
    return (
      <div
        className="flexRow"
        style={{ gap: "0.25em", justifyContent: "center" }}
      >
        {stat.replace("(x2)", "")}
        <div className="flexColumn" style={{ gap: 0 }}>
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
        </div>
      </div>
    );
  }
  if (stat.includes("(x3)")) {
    return (
      <div
        className="flexRow"
        style={{ gap: "0.125em", justifyContent: "center" }}
      >
        {stat.replace("(x3)", "")}
        <div
          className="flexColumn"
          style={{
            gap: 0,
            width: "1em",
            flexWrap: "wrap",
            height: "1em",
          }}
        >
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
        </div>
      </div>
    );
  }

  if (stat.includes("(x4)")) {
    return (
      <div
        className="flexRow"
        style={{ gap: "0.125em", justifyContent: "center" }}
      >
        {stat.replace("(x4)", "")}
        <div
          className="flexColumn"
          style={{
            gap: 0,
            width: "1em",
            flexWrap: "wrap",
            height: "1em",
          }}
        >
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
          <StatIcon size={"0.5em"} statType={statType} unitType={unitType} />
        </div>
      </div>
    );
  }
  return stat;
}

function StatIcon({
  size,
  statType,
  unitType,
}: {
  size: string;
  statType: keyof UnitStats;
  unitType: UnitType;
}) {
  switch (statType) {
    case "combat":
      return (
        <span style={{ width: size }}>
          <HitSVG />
        </span>
      );
    case "cost":
      return (
        <span style={{ width: size }}>
          <UnitIcon type={unitType} size={size} />
        </span>
      );
  }
}
