import { FormattedMessage } from "react-intl";
import LabeledDiv from "../../../../src/components/LabeledDiv/LabeledDiv";
import { objectEntries, rem } from "../../../../src/util/util";
import { ProcessedGame } from "../processor";
import styles from "./StrategyCardSection.module.scss";

interface StrategyCardInfo {
  rounds: Record<
    number,
    {
      pickCount: number;
      winCount: number;
      points: number;
    }
  >[];
}

function getColorForNum(num: number) {
  if (num === 0) {
    return "#444";
  }
  if (num < 10) {
    return "#666";
  }
  if (num < 20) {
    return "#888";
  }
  if (num < 30) {
    return "#aaa";
  }
  if (num < 40) {
    return "#ccc";
  }
  if (num < 50) {
    return "#eee";
  }
  return "#fff";
}

const CARD_ORDER: Record<StrategyCardId, number> = {
  Leadership: 1,
  Diplomacy: 2,
  Politics: 3,
  Construction: 4,
  Trade: 5,
  Warfare: 6,
  Technology: 7,
  Imperial: 8,
  Lux: 9,
  Noctis: 10,
  Tyrannus: 11,
  Civitas: 12,
  Amicus: 13,
  Calamitas: 14,
  Magus: 15,
  Aeterna: 16,
} as const;

export default function StrategyCardSection({
  games,
  playerCounts,
}: {
  games: Record<string, ProcessedGame>;
  playerCounts: Set<number>;
}) {
  const strategyCardInfo: Partial<Record<StrategyCardId, StrategyCardInfo>> =
    {};
  const numRounds: Record<number, number> = {};
  Object.values(games).forEach((game) => {
    const winner = game.winner;

    let roundNum = 1;
    for (const round of game.rounds) {
      let roundCount = numRounds[roundNum] ?? 0;
      roundCount++;
      let pickOrder = 1;
      for (const card of round.cardPicks) {
        if (!card.card) {
          roundCount--;
          break;
        }
        const info = strategyCardInfo[card.card] ?? { rounds: [] };
        const roundInfo = info.rounds[roundNum] ?? [];
        const pickRate = roundInfo[pickOrder] ?? {
          pickCount: 0,
          winCount: 0,
          points: 0,
        };

        const points = game.factions[card.faction]?.points ?? 0;
        pickRate.points += points;

        pickRate.pickCount++;
        if (card.faction === winner) {
          pickRate.winCount++;
        }
        roundInfo[pickOrder] = pickRate;
        info.rounds[roundNum] = roundInfo;
        strategyCardInfo[card.card] = info;
        pickOrder++;
      }
      numRounds[roundNum] = roundCount;
      roundNum++;
    }
  });

  const factionIndexes: number[] = [];
  let numCards = Array.from(playerCounts).reduce((cards, count) => {
    switch (count) {
      case 3:
      case 6:
        return Math.max(6, cards);
      case 4:
      case 8:
        return Math.max(8, cards);
      case 5:
        return Math.max(5, cards);
      case 7:
        return Math.max(7, cards);
    }
    return cards;
  }, 0);
  if (numCards === 0) {
    numCards = 8;
  }
  for (let i = 1; i <= numCards; i++) {
    factionIndexes.push(i);
  }

  const orderedCards = objectEntries(strategyCardInfo).sort(
    ([aCard, _], [bCard, __]) => {
      return CARD_ORDER[aCard] - CARD_ORDER[bCard];
    },
  );

  return (
    <div className={styles.StrategyCardSection}>
      {orderedCards.map(([card, info]) => {
        return (
          <LabeledDiv key={card} label={card}>
            <table className={styles.Table} style={{ borderSpacing: rem(6) }}>
              <thead>
                <tr>
                  <th style={{ fontWeight: "normal" }}></th>
                  {factionIndexes.map((index) => {
                    return (
                      <th key={index}>
                        <FormattedMessage
                          id="+L4gCQ"
                          defaultMessage={
                            "{num, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}"
                          }
                          description="Table header showing the order of a given player."
                          values={{ num: index }}
                        />
                      </th>
                    );
                  })}
                  <th>-</th>
                  <th>
                    <FormattedMessage
                      id="8ntyP0"
                      defaultMessage="Win Rate"
                      description="Label for a section describing the win rate."
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="+zFNH+"
                      defaultMessage="Average VPs"
                      description="Label for a section describing the average number of VPs."
                    />
                  </th>
                </tr>
              </thead>
              {info.rounds.map((round, index) => {
                let totalRounds = numRounds[index] ?? 0;
                if (totalRounds < 5) {
                  return null;
                }
                let remainingRounds = numRounds[index] ?? 0;
                let winRounds = 0;
                let totalPoints = 0;
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: "bold" }}>
                      <FormattedMessage
                        id="hhm3kX"
                        defaultMessage="Round {value}"
                        description="The current round of the game."
                        values={{ value: index }}
                      />
                    </td>
                    {factionIndexes.map((index) => {
                      const pickRate = round[index];
                      winRounds += pickRate?.winCount ?? 0;
                      remainingRounds -= pickRate?.pickCount ?? 0;
                      totalPoints += pickRate?.points ?? 0;
                      if (!pickRate) {
                        return (
                          <td
                            key={index}
                            style={{
                              textAlign: "right",
                              fontFamily: "Source Sans",
                              color: getColorForNum(0),
                            }}
                          >
                            0%
                          </td>
                        );
                      }
                      return (
                        <td
                          key={index}
                          style={{
                            textAlign: "right",
                            fontFamily: "Source Sans",
                            color: getColorForNum(
                              (pickRate.pickCount / totalRounds) * 100,
                            ),
                          }}
                        >
                          {Math.round((pickRate.pickCount / totalRounds) * 100)}
                          %
                        </td>
                      );
                    })}
                    <td
                      style={{
                        textAlign: "center",
                        fontFamily: "Source Sans",
                        color: getColorForNum(
                          (remainingRounds / totalRounds) * 100,
                        ),
                      }}
                    >
                      {Math.round((remainingRounds / totalRounds) * 100)}%
                    </td>
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
                    >
                      {Math.round((winRounds / totalRounds) * 100)}%
                    </td>
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
                    >
                      {Math.round(
                        (totalPoints / (totalRounds - remainingRounds)) * 100,
                      ) / 100}
                    </td>
                  </tr>
                );
              })}
            </table>
          </LabeledDiv>
        );
      })}
    </div>
  );
}
