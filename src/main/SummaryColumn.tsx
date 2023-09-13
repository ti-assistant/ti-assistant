import { useRouter } from "next/router";
import { computeVPs, FactionSummary } from "../FactionSummary";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { StaticFactionTimer } from "../Timer";
import { getInitiativeForFaction } from "../util/helpers";
import { Faction } from "../util/api/factions";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { useGameData } from "../data/GameData";
import { FactionPanel } from "../components/FactionPanel";

function sortByOrder(a: [string, Faction], b: [string, Faction]) {
  if (a[1].order > b[1].order) {
    return 1;
  } else {
    return -1;
  }
}

export interface SummaryColumnProps {
  order?: "VICTORY_POINTS" | "SPEAKER";
  subOrder?: "INITIATIVE" | "SPEAKER";
}

export default function SummaryColumn({ order, subOrder }: SummaryColumnProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "factions",
    "objectives",
    "options",
    "state",
    "strategycards",
  ]);
  const factions = gameData.factions;
  const objectives = gameData.objectives ?? {};
  const options = gameData.options;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  if (!options || !factions) {
    return <div>Loading...</div>;
  }

  let sortFunction = sortByOrder;
  let title = "Speaker Order";
  switch (order) {
    case "VICTORY_POINTS":
      sortFunction = (a, b) => {
        const aVPs = computeVPs(factions, a[0], objectives);
        const bVPs = computeVPs(factions, b[0], objectives);
        switch (options["game-variant"]) {
          case "alliance-combined":
          case "alliance-separate": {
            if (a[1].alliancePartner === b[0]) {
              break;
            }
            const aPartnerVPs = computeVPs(
              factions,
              a[1].alliancePartner ?? "",
              objectives
            );
            const bPartnerVPs = computeVPs(
              factions,
              b[1].alliancePartner ?? "",
              objectives
            );

            if (aVPs + aPartnerVPs > bVPs + bPartnerVPs) {
              return -1;
            }
            return 1;
          }
          case "normal":
          default:
            break;
        }
        if (aVPs !== bVPs) {
          if (bVPs > aVPs) {
            return 1;
          }
          return -1;
        }
        switch (subOrder) {
          case "INITIATIVE":
            const aInitiative = getInitiativeForFaction(strategyCards, a[0]);
            const bInitiative = getInitiativeForFaction(strategyCards, b[0]);
            if (aInitiative > bInitiative) {
              return 1;
            }
            return -1;
          case "SPEAKER":
            if (a[1].order > b[1].order) {
              return 1;
            }
            return -1;
        }
        if (a[1].order > b[1].order) {
          return 1;
        }
        return -1;
      };
      title = "Final Score";
      break;
  }

  const orderedFactions = Object.entries(factions).sort(sortFunction);

  const showTechs = options["faction-summary-show-techs"] ?? true;
  const showPlanets = options["faction-summary-show-planets"] ?? true;

  const factionSummaryOptions = {
    showIcon: true,
    hidePlanets: !showPlanets,
    hideTechs: !showTechs,
  };

  const numFactions = Object.keys(factions).length;

  function isActiveFaction(factionName: string) {
    switch (state?.phase) {
      case "STRATEGY":
      case "ACTION":
        return state?.activeplayer === factionName;
    }
    return false;
  }

  return (
    <div
      className="summaryColumn"
      style={{
        gap: numFactions < 8 ? responsivePixels(12) : responsivePixels(4),
      }}
    >
      {numFactions < 8 ? <div className="flexRow">{title}</div> : null}

      {orderedFactions.map(([name, faction]) => {
        return (
          <div key={name}>
            <LabeledDiv
              label={
                <div className="flexRow" style={{ gap: 0 }}>
                  {getFactionName(faction)}
                  <FactionPanel factionName={faction.name} options={options} />
                </div>
              }
              rightLabel={
                <StaticFactionTimer
                  factionName={name}
                  style={{
                    fontSize: responsivePixels(16),
                  }}
                  width={84}
                />
              }
              color={getFactionColor(faction)}
            >
              <FactionSummary
                factionName={name}
                options={factionSummaryOptions}
              />
            </LabeledDiv>
          </div>
        );
      })}
    </div>
  );
}
