import Image from "next/image";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import styles from "./StrategyCardElement.module.scss";
import FactionTile from "../FactionTile/FactionTile";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionCircle from "../FactionCircle/FactionCircle";
import { useFactions } from "../../context/dataHooks";
import { rem } from "../../util/util";

interface StrategyCardProps {
  active?: boolean;
  card: StrategyCard;
  fontSize: number;
  onClick?: () => void;
}

interface StrategyCardElementCSS extends CSSProperties {
  "--color": string;
  "--text-color": "#eee" | "#555";
}

export function StrategyCardElement({
  active,
  card,
  children,
  fontSize,
  onClick,
}: PropsWithChildren<StrategyCardProps>) {
  const factions = useFactions();

  const faction = card.faction ? factions[card.faction] : undefined;

  const color = active ? card.color : "#555";
  const textColor = active ? "#eee" : "#555";

  const strategyCardElementCSS: StrategyCardElementCSS = {
    "--color": color,
    "--text-color": textColor,
    fontSize: rem(fontSize),
    cursor: onClick ? "pointer" : "auto",
    backgroundColor: active ? undefined : "#222",
  };
  return (
    <div
      className={styles.StrategyCardElement}
      onClick={onClick}
      style={strategyCardElementCSS}
    >
      <div
        className={styles.Number}
        style={{
          fontSize: rem(fontSize + 8),
        }}
      >
        {card.order}
      </div>
      <div style={{ color: textColor }}>{card.name}</div>
      {faction ? (
        <>
          <div
            className={styles.FactionTile}
            style={{
              whiteSpace: "nowrap",
              gridColumn: "3 / 5",
              paddingLeft: rem(4),
              paddingRight: rem(3),
            }}
          >
            <FactionTile faction={faction} fontSize={16} iconSize={32} />
          </div>
          <div className={styles.FactionCircle}>
            <FactionCircle
              factionId={faction.id}
              borderColor={getFactionColor(faction)}
              size={36}
            />
          </div>
        </>
      ) : (
        <React.Fragment>
          <div
            className="flexRow"
            style={{
              width: "100%",
              justifyContent: "flex-end",
              paddingRight: "0px",
            }}
          >
            {children}
          </div>
          {card.tradeGoods ? (
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-end",
                padding: `0 ${rem(16)}`,
                color: "#efe383",
                gap: rem(4),
              }}
            >
              <div className="centered" style={{ width: rem(20) }}>
                {card.tradeGoods}
              </div>
              <div
                style={{
                  width: rem(22),
                  height: rem(23),
                  position: "relative",
                }}
              >
                <Image
                  src="/images/trade_good.png"
                  alt="TGs"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          ) : (
            <div
              className="flexRow"
              style={{
                flexShrink: 0,
                height: rem(4),
                width: rem(40),
                padding: `0 ${rem(16)}`,
              }}
            ></div>
          )}
        </React.Fragment>
      )}
    </div>
    // </div>
  );
}
