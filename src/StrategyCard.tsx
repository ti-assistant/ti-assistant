import LabeledDiv from "./components/LabeledDiv/LabeledDiv";
import { useFactions } from "./context/dataHooks";
import { getFactionColor, getFactionName } from "./util/factions";
import { rem } from "./util/util";

interface SmallStrategyCardProps {
  cards: StrategyCard[];
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
    height = rem(44);
  } else if (cards.length === 1) {
    height = rem(50);
  }

  const borderColor = !faction?.passed ? getFactionColor(faction) : "#555";
  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={borderColor}
      style={{
        height: height,
      }}
    >
      <div className="flexColumn" style={{ height: "100%", width: "100%" }}>
        <div
          className="flexRow"
          style={{
            padding: `${rem(4)} ${rem(4)} ${rem(4)} 0`,
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              flexBasis: "14%",
              minWidth: rem(32),
              fontSize: numFactions > 7 ? rem(28) : rem(32),
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
            style={{
              flexBasis: "40%",
              alignItems: "flex-start",
              fontSize: numFactions > 7 ? rem(20) : rem(24),
            }}
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
      </div>
    </LabeledDiv>
  );
}
