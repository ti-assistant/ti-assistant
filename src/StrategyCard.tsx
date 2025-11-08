import FactionComponents from "./components/FactionComponents/FactionComponents";
import LabeledDiv from "./components/LabeledDiv/LabeledDiv";
import {
  useFactionColor,
  useIsFactionPassed,
  useNumFactions,
} from "./context/factionDataHooks";
import { rem } from "./util/util";

interface SmallStrategyCardProps {
  cards: StrategyCard[];
}

export function SmallStrategyCard({ cards }: SmallStrategyCardProps) {
  const numFactions = useNumFactions();

  const factionId = cards[0]?.faction ?? "Vuil'raith Cabal";

  const isFactionPassed = useIsFactionPassed(factionId);
  const factionColor = useFactionColor(factionId);

  const initiative = cards.reduce(
    (lowestInitiative, card) => Math.min(lowestInitiative, card.order),
    Number.MAX_SAFE_INTEGER
  );

  let height = "auto";
  if (numFactions > 7) {
    height = rem(44);
  } else if (cards.length === 1) {
    height = rem(50);
  }

  const borderColor = !isFactionPassed ? factionColor : "#555";
  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={factionId} />}
      color={borderColor}
      style={{
        height,
      }}
    >
      <div
        className="flexRow"
        style={{
          padding: `${rem(4)} ${rem(4)} ${rem(4)} 0`,
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            flexBasis: "14%",
            minWidth: rem(32),
            fontSize: numFactions > 7 ? rem(28) : rem(32),
            display: "flex",
            justifyContent: "center",
            color: isFactionPassed ? "#555" : "#eee",
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
    </LabeledDiv>
  );
}
