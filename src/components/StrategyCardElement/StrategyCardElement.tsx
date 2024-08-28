import Image from "next/image";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import styles from "./StrategyCardElement.module.scss";
import FactionTile from "../FactionTile/FactionTile";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionCircle from "../FactionCircle/FactionCircle";
import { useFactions } from "../../context/dataHooks";

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
    fontSize: `${fontSize}px`,
    cursor: onClick ? "pointer" : "auto",
    backgroundColor: active ? undefined : "#222",
  };
  return (
    <div
      className={styles.StrategyCardElement}
      onClick={onClick}
      style={strategyCardElementCSS}
    >
      {/* <div
        className="flexRow"
        style={{
          width: "100%",
          padding: `${"4px"} $["4px"} ${"4px"} 0`,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      > */}
      <div
        className={styles.Number}
        style={{
          fontSize: `${fontSize + 8}px`,
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
              paddingLeft: "4px",
              paddingRight: "3px",
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
                padding: `0 ${"16px"}`,
                color: "#efe383",
                gap: "4px",
              }}
            >
              <div className="centered" style={{ width: "20px" }}>
                {card.tradeGoods}
              </div>
              <div
                style={{
                  width: "22px",
                  height: "23px",
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
                height: "4px",
                width: "40px",
                padding: `0 ${"16px"}`,
              }}
            ></div>
          )}
        </React.Fragment>
      )}
    </div>
    // </div>
  );
}

interface SmallStrategyCardProps {
  // card: StrategyCard;
  cards: StrategyCard[];
  // active?: boolean;
}

export function SmallStrategyCard({ cards }: SmallStrategyCardProps) {
  const factions = useFactions();

  if (!cards[0]) {
    return null;
  }

  const initiative = cards.reduce(
    (lowestInitiative, card) => Math.min(lowestInitiative, card.order),
    Number.MAX_SAFE_INTEGER
  );

  const faction =
    cards[0] && cards[0].faction && factions
      ? factions[cards[0].faction]
      : undefined;

  const height = cards.length === 1 ? "54px" : "auto";

  const borderColor = !faction?.passed ? getFactionColor(faction) : "#555";
  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={borderColor}
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "24px",
        height: height,
      }}
    >
      <div
        className="flexRow"
        style={{
          padding: `${"4px"} ${"4px"} ${"4px"} 0`,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flexBasis: "14%",
            minWidth: "32px",
            fontSize: "32px",
            display: "flex",
            justifyContent: "center",
            color: faction?.passed ? "#555" : "#eee",
          }}
        >
          {initiative}
        </div>
        <div
          className="flexColumn"
          style={{ flexBasis: "40%", alignItems: "flex-start" }}
        >
          {cards.map((card) => {
            const textColor = !card.used ? "#eee" : "#555";
            return (
              <div key={card.id} style={{ color: textColor }}>
                {card.name}
              </div>
            );
          })}
        </div>
      </div>
    </LabeledDiv>
  );
}
