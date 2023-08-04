import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import { BasicFactionTile, MenuButton } from "./FactionTile";
import { LabeledDiv } from "./LabeledDiv";
import { useGameData } from "./data/GameData";
import { StrategyCard } from "./util/api/cards";
import { getFactionColor, getFactionName } from "./util/factions";
import { pluralize, responsivePixels } from "./util/util";
import Image from "next/image";

export interface StrategyCardOpts {
  fontSize?: string;
  hideName?: boolean;
  noColor?: boolean;
}

export interface StrategyCardProps {
  active?: boolean;
  card: StrategyCard;
  factionActions?: MenuButton[];
  fontSize: number;
  onClick?: () => void;
  opts?: StrategyCardOpts;
}

export function StrategyCardElement({
  active,
  card,
  children,
  factionActions,
  fontSize,
  onClick,
  opts = {},
}: PropsWithChildren<StrategyCardProps>) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions"]);
  const factions = gameData.factions;

  const faction = card.faction && factions ? factions[card.faction] : undefined;

  const color = active && !opts.noColor ? card.color : "#555";
  const textColor = active ? "#eee" : "#555";
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: responsivePixels(5),
        display: "flex",
        flexDirection: "column",
        border: `${responsivePixels(3)} solid ${color}`,
        fontSize: responsivePixels(fontSize),
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: responsivePixels(48),
        justifyContent: "center",
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
            minWidth: responsivePixels(fontSize + 8),
            fontSize: responsivePixels(fontSize + 8),
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
            <BasicFactionTile
              faction={faction}
              menuButtons={factionActions}
              opts={{ fontSize: responsivePixels(16), iconSize: 32 }}
            />
          </div>
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
                <div
                  className="centered"
                  style={{ width: responsivePixels(20) }}
                >
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
                  width: responsivePixels(78),
                  padding: `0 ${responsivePixels(16)}`,
                }}
              ></div>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export interface SmallStrategyCardProps {
  // card: StrategyCard;
  cards: StrategyCard[];
  // active?: boolean;
}

export function SmallStrategyCard({ cards }: SmallStrategyCardProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions"]);
  const factions = gameData.factions;

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
              <div key={card.name} style={{ color: textColor }}>
                {card.name}
              </div>
            );
          })}
        </div>
      </div>
    </LabeledDiv>
  );
}
