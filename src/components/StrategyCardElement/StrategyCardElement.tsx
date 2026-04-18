import React, { CSSProperties, PropsWithChildren } from "react";
import { useFactionColors } from "../../context/factionDataHooks";
import TradeGoodSVG from "../../icons/ui/TradeGood";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionTile from "../FactionTile/FactionTile";
import styles from "./StrategyCardElement.module.scss";

interface StrategyCardProps {
  active?: boolean;
  card: StrategyCard;
  fontSize: number;
  onClick?: () => void;
}

interface StrategyCardElementCSS extends CSSProperties {
  "--color": string;
  "--text-color": "var(--foreground-color)" | "var(--passed-text)";
}

export function StrategyCardElement({
  active,
  card,
  children,
  fontSize,
  onClick,
}: PropsWithChildren<StrategyCardProps>) {
  const color = active ? card.color : "var(--passed-text)";
  const textColor = active ? "var(--foreground-color)" : "var(--passed-text)";
  const colors = useFactionColors(card.faction ?? "Vuil'raith Cabal");

  const strategyCardElementCSS: StrategyCardElementCSS = {
    "--color": color,
    "--text-color": textColor,
    fontSize: rem(fontSize),
    fontFamily: "var(--main-font)",

    cursor: onClick ? "pointer" : "auto",
    backgroundColor: active && onClick ? undefined : "var(--disabled-bg)",
  };

  const innerContent = (
    <>
      <div
        className={styles.Number}
        style={{
          fontSize: rem(fontSize + 8),
        }}
      >
        {card.order}
      </div>
      <div style={{ color: textColor }}>{card.name}</div>
      {card.faction ? (
        <>
          <div
            className={styles.FactionTile}
            style={{
              whiteSpace: "nowrap",
              gridColumn: "3 / 5",
              paddingLeft: rem(4),
              paddingRight: rem(3),
              color: "var(--foreground-color)",
            }}
          >
            <FactionTile factionId={card.faction} fontSize={16} iconSize={32} />
          </div>
          <div className={styles.FactionCircle}>
            <FactionCircle
              factionId={card.faction}
              borderColor={colors.border}
              size={24}
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
                <TradeGoodSVG />
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
    </>
  );

  if (onClick) {
    return (
      <button
        className={`${styles.StrategyCardElement} outline`}
        onClick={onClick}
        style={
          {
            ...strategyCardElementCSS,
            padding: "unset",
            "--border-color": card.color,
            "--hover-color": card.color,
          } as CSSProperties
        }
      >
        {innerContent}
      </button>
    );
  } else {
    return (
      <button
        className={`${styles.StrategyCardElement} outline`}
        onClick={onClick}
        disabled
        style={
          {
            ...strategyCardElementCSS,
            padding: "unset",
            "--border-color": card.color,
            "--hover-color": card.color,
          } as CSSProperties
        }
      >
        {innerContent}
      </button>
    );
  }

  return (
    <div
      className={styles.StrategyCardElement}
      onClick={onClick}
      style={strategyCardElementCSS}
    >
      {innerContent}
    </div>
    // </div>
  );
}
