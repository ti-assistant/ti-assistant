import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
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

const CARD_ORDER: Record<StrategyCardId, number> = {
  Leadership: 1,
  Diplomacy: 2,
  Politics: 3,
  Construction: 4,
  Trade: 5,
  Warfare: 6,
  Technology: 7,
  Imperial: 8,
} as const;

export default function StrategyCardSection({
  games,
  playerCount,
}: {
  games: Record<string, ProcessedGame>;
  playerCount: number;
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
  const numCards =
    playerCount === 3 || playerCount === 4 ? playerCount * 2 : playerCount;
  for (let i = 1; i <= numCards; i++) {
    factionIndexes.push(i);
  }

  const orderedCards = Object.entries(strategyCardInfo).sort(
    ([aCard, _], [bCard, __]) => {
      return (
        CARD_ORDER[aCard as StrategyCardId] -
        CARD_ORDER[bCard as StrategyCardId]
      );
    }
  );

  return (
    <div className={styles.StrategyCardSection}>
      {orderedCards.map(([card, info]) => {
        return (
          <LabeledDiv key={card} label={card}>
            <table className={styles.Table} style={{ borderSpacing: "6px" }}>
              <thead>
                <tr>
                  <th style={{ fontWeight: "normal" }}></th>
                  {factionIndexes.map((index) => {
                    return (
                      <th key={index}>
                        {index === 1
                          ? "1st"
                          : index === 2
                          ? "2nd"
                          : index === 3
                          ? "3rd"
                          : `${index}th`}
                      </th>
                    );
                  })}
                  <th>Unpicked</th>
                  <th>Win Rate</th>
                  <th>Avg Points</th>
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
                    <td style={{ fontWeight: "bold" }}>Round {index}</td>
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
                          }}
                        >
                          {Math.round((pickRate.pickCount / totalRounds) * 100)}
                          %
                        </td>
                      );
                    })}
                    <td
                      style={{ textAlign: "center", fontFamily: "Source Sans" }}
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
                        (totalPoints / (totalRounds - remainingRounds)) * 100
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
