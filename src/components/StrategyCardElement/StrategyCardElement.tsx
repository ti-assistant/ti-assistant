import Image from "next/image";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import styles from "./StrategyCardElement.module.scss";
import { FactionContext } from "../../context/Context";
import { responsivePixels } from "../../util/util";
import FactionTile from "../FactionTile/FactionTile";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionCircle from "../FactionCircle/FactionCircle";

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
  const factions = useContext(FactionContext);

  const faction = card.faction && factions ? factions[card.faction] : undefined;

  const color = active ? card.color : "#555";
  const textColor = active ? "#eee" : "#555";

  const strategyCardElementCSS: StrategyCardElementCSS = {
    "--color": color,
    "--text-color": textColor,
    fontSize: responsivePixels(fontSize),
    cursor: onClick ? "pointer" : "auto",
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
          padding: `${responsivePixels(4)} ${responsivePixels(
            4
          )} ${responsivePixels(4)} 0`,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      > */}
      <div
        className={styles.Number}
        style={{
          fontSize: responsivePixels(fontSize + 8),
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
              paddingLeft: responsivePixels(4),
              paddingRight: responsivePixels(3),
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
              paddingRight: responsivePixels(0),
            }}
          >
            {children}
          </div>
          {card.tradeGoods ? (
            <div
              className="flexRow"
              style={{
                justifyContent: "flex-end",
                padding: `0 ${responsivePixels(16)}`,
                color: "#efe383",
                gap: responsivePixels(4),
              }}
            >
              <div className="centered" style={{ width: responsivePixels(20) }}>
                {card.tradeGoods}
              </div>
              <div
                style={{
                  width: responsivePixels(22),
                  height: responsivePixels(23),
                  position: "relative",
                }}
              >
                <Image
                  src="/images/trade_good.png"
                  alt="TGs"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          ) : (
            <div
              className="flexRow"
              style={{
                flexShrink: 0,
                height: responsivePixels(4),
                width: responsivePixels(40),
                padding: `0 ${responsivePixels(16)}`,
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
  const factions = useContext(FactionContext);

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

  const height = cards.length === 1 ? responsivePixels(54) : "auto";

  const borderColor = !faction?.passed ? getFactionColor(faction) : "#555";
  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={borderColor}
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: responsivePixels(24),
        height: height,
      }}
    >
      <div
        className="flexRow"
        style={{
          padding: `${responsivePixels(4)} ${responsivePixels(
            4
          )} ${responsivePixels(4)} 0`,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flexBasis: "14%",
            minWidth: responsivePixels(32),
            fontSize: responsivePixels(32),
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
