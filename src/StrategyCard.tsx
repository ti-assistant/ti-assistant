import Image from "next/image";
import React, { PropsWithChildren, useContext } from "react";
import FactionTile from "./components/FactionTile/FactionTile";
import LabeledDiv from "./components/LabeledDiv/LabeledDiv";
import { FactionContext } from "./context/Context";
import { getFactionColor, getFactionName } from "./util/factions";

interface StrategyCardOpts {
  fontSize?: string;
  hideName?: boolean;
  noColor?: boolean;
}

interface StrategyCardProps {
  active?: boolean;
  card: StrategyCard;
  fontSize: number;
  onClick?: () => void;
  opts?: StrategyCardOpts;
}

function StrategyCardElement({
  active,
  card,
  children,
  fontSize,
  onClick,
  opts = {},
}: PropsWithChildren<StrategyCardProps>) {
  const factions = useContext(FactionContext);

  const faction = card.faction && factions ? factions[card.faction] : undefined;

  const color = active && !opts.noColor ? card.color : "#555";
  const textColor = active ? "#eee" : "#555";
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        border: `${"3px"} solid ${color}`,
        fontSize: `${fontSize}px`,
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: "48px",
        justifyContent: "center",
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
            minWidth: `${fontSize + 8}px`,
            fontSize: `${fontSize + 8}px`,
            display: "flex",
            flexShrink: 0,
            justifyContent: "center",
            color: textColor,
          }}
        >
          {card.order}
        </div>
        {opts.hideName ? null : (
          <div style={{ flexBasis: "40%", color: textColor }}>{card.name}</div>
        )}
        {faction ? (
          <div style={{ flexGrow: 4, whiteSpace: "nowrap" }}>
            <FactionTile faction={faction} fontSize={16} iconSize={32} />
          </div>
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
                  width: "78px",
                  padding: `0 ${"16px"}`,
                }}
              ></div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
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

  const numFactions = Object.keys(factions).length;

  let height = "auto";
  if (numFactions > 7) {
    height = "44px";
  } else if (cards.length === 1) {
    height = "50px";
  }

  const borderColor = !faction?.passed ? getFactionColor(faction) : "#555";
  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={borderColor}
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: numFactions > 7 ? "20px" : "24px",
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
            fontSize: numFactions > 7 ? "28px" : "32px",
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
