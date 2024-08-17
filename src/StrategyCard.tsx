import Image from "next/image";
import React, { PropsWithChildren, useContext } from "react";
import FactionTile from "./components/FactionTile/FactionTile";
import LabeledDiv from "./components/LabeledDiv/LabeledDiv";
import { getFactionColor, getFactionName } from "./util/factions";
import LabeledLine from "./components/LabeledLine/LabeledLine";
import { useFaction, useFactions } from "./context/dataHooks";

interface StrategyCardOpts {
  fontSize?: string;
  hideName?: boolean;
  noColor?: boolean;
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
    cards[0] && cards[0].faction ? factions[cards[0].faction] : undefined;

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
            transition: "color 120ms",
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
