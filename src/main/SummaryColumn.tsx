import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { FactionSummary } from "../FactionSummary";
import { StaticFactionTimer } from "../Timer";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import {
  useFactions,
  useGameState,
  useObjectives,
  useOptions,
  useStrategyCards,
} from "../context/dataHooks";
import { computeVPs, getFactionColor, getFactionName } from "../util/factions";
import { getInitiativeForFaction } from "../util/helpers";
import styles from "./SummaryColumn.module.scss";
import { rem } from "../util/util";

const FactionPanel = dynamic(() => import("../components/FactionPanel"), {
  loading: () => <div className="popupIcon">&#x24D8;</div>,
  ssr: false,
});

function sortByOrder(a: Faction, b: Faction) {
  if (a.order > b.order) {
    return 1;
  } else {
    return -1;
  }
}

interface SummaryColumnProps {
  order?: "VICTORY_POINTS" | "SPEAKER";
  subOrder?: "INITIATIVE" | "SPEAKER";
}

export default function SummaryColumn({ order, subOrder }: SummaryColumnProps) {
  const factions = useFactions();
  const objectives = useObjectives();
  const options = useOptions();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  let sortFunction = sortByOrder;
  let title = (
    <FormattedMessage
      id="L4UH+0"
      description="An ordering of factions based on the speaker."
      defaultMessage="Speaker Order"
    />
  );
  switch (order) {
    case "VICTORY_POINTS":
      sortFunction = (a, b) => {
        const aVPs = computeVPs(factions, a.id, objectives);
        const bVPs = computeVPs(factions, b.id, objectives);
        switch (options["game-variant"]) {
          case "alliance-combined":
          case "alliance-separate": {
            const aPartner = a.alliancePartner;
            const bPartner = b.alliancePartner;
            if (aPartner === b.id || !aPartner || !bPartner) {
              break;
            }
            const aPartnerVPs = computeVPs(factions, aPartner, objectives);
            const bPartnerVPs = computeVPs(factions, bPartner, objectives);

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
            const aInitiative = getInitiativeForFaction(strategyCards, a.id);
            const bInitiative = getInitiativeForFaction(strategyCards, b.id);
            if (aInitiative > bInitiative) {
              return 1;
            }
            return -1;
          case "SPEAKER":
            if (a.order > b.order) {
              return 1;
            }
            return -1;
        }
        if (a.order > b.order) {
          return 1;
        }
        return -1;
      };
      title = (
        <FormattedMessage
          id="KiioBO"
          description="An ordering of factions based on end game scoring."
          defaultMessage="Final Score"
        />
      );
      break;
  }

  let orderedFactions = Object.values(factions).sort(sortFunction);

  const showTechs = options["faction-summary-show-techs"] ?? true;
  const showPlanets = options["faction-summary-show-planets"] ?? true;

  const factionSummaryOptions = {
    showIcon: true,
    hidePlanets: !showPlanets,
    hideTechs: !showTechs,
  };

  const numFactions = Object.keys(factions).length;

  return (
    <div
      className={styles.SummaryColumn}
      style={{
        gap: numFactions < 8 ? rem(12) : rem(4),
      }}
    >
      {numFactions < 8 ? <div className="flexRow">{title}</div> : null}

      {orderedFactions.map((faction, index) => {
        const fadeFaction = state.phase !== "END" && faction.passed;
        return (
          <div key={faction.id}>
            <LabeledDiv
              label={
                faction ? (
                  <div className="flexRow" style={{ gap: 0 }}>
                    {getFactionName(faction)}
                    <FactionPanel faction={faction} options={options} />
                  </div>
                ) : (
                  <div className="flexRow" style={{ gap: 0 }}>
                    Loading Faction
                    <div className="popupIcon">&#x24D8;</div>
                  </div>
                )
              }
              rightLabel={
                <StaticFactionTimer
                  factionId={faction?.id ?? "Unknown"}
                  width={84}
                />
              }
              color={fadeFaction ? "#555" : getFactionColor(faction)}
            >
              <div
                style={{
                  filter: fadeFaction ? "brightness(0.6)" : "unset",
                }}
              >
                <FactionSummary
                  factionId={faction.id}
                  options={factionSummaryOptions}
                />
              </div>
            </LabeledDiv>
          </div>
        );
      })}
    </div>
  );
}
