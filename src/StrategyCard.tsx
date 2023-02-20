import { useRouter } from "next/router";
import useSWR from "swr";
import { BasicFactionTile, MenuButton } from "./FactionTile";
import { LabeledDiv } from "./LabeledDiv";
import { StrategyCard } from "./util/api/cards";
import { Faction } from "./util/api/factions";
import { GameState } from "./util/api/state";

import { fetcher } from "./util/api/util";
import { getFactionColor, getFactionName } from "./util/factions";
import { responsivePixels } from "./util/util";

export interface StrategyCardOpts {
  fontSize?: string;
  hideName?: boolean;
  noColor?: boolean;
}

export interface StrategyCardProps {
  active?: boolean;
  card: StrategyCard;
  factionActions?: MenuButton[];
  onClick?: () => void;
  opts?: StrategyCardOpts;
}

export function StrategyCardElement({
  active,
  card,
  factionActions,
  onClick,
  opts = {},
}: StrategyCardProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );

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
        fontSize: opts.fontSize ?? responsivePixels(24),
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
            minWidth: responsivePixels(32),
            fontSize: responsivePixels(32),
            display: "flex",
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
        ) : null}
      </div>
    </div>
  );
}

export interface SmallStrategyCardProps {
  card: StrategyCard;
  active?: boolean;
}

export function SmallStrategyCard({ card, active }: SmallStrategyCardProps) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );

  const faction = card.faction && factions ? factions[card.faction] : undefined;

  const borderColor = !faction?.passed ? getFactionColor(faction) : "#555";
  const textColor = active ? "#eee" : "#555";
  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={borderColor}
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: responsivePixels(24),
        height: responsivePixels(54),
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
            color: textColor,
          }}
        >
          {card.order}
        </div>
        <div style={{ flexBasis: "40%", color: textColor }}>{card.name}</div>
      </div>
    </LabeledDiv>
  );
}
