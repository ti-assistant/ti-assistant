import dynamic from "next/dynamic";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { FactionSummary } from "../FactionSummary";
import { Loader } from "../Loader";
import { StaticFactionTimer } from "../Timer";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import {
  FactionContext,
  ObjectiveContext,
  OptionContext,
  StrategyCardContext,
} from "../context/Context";
import { computeVPs, getFactionColor, getFactionName } from "../util/factions";
import { getInitiativeForFaction } from "../util/helpers";
import styles from "./SummaryColumn.module.scss";

const FactionPanel = dynamic(() => import("../components/FactionPanel"), {
  loading: () => (
    <div
      className="popupIcon"
      style={{
        fontSize: "16px",
      }}
    >
      &#x24D8;
    </div>
  ),
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
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const strategyCards = useContext(StrategyCardContext);

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
        gap: numFactions < 8 ? "12px" : "4px",
      }}
    >
      {numFactions < 8 ? <div className="flexRow">{title}</div> : null}

      {orderedFactions.map((faction, index) => {
        return (
          <div key={index}>
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
                    <div
                      className="popupIcon"
                      style={{
                        fontSize: "16px",
                      }}
                    >
                      &#x24D8;
                    </div>
                  </div>
                )
              }
              rightLabel={
                <StaticFactionTimer
                  factionId={faction?.id ?? "Unknown"}
                  style={{
                    fontSize: "16px",
                  }}
                  width={84}
                />
              }
              color={faction.passed ? "#555" : getFactionColor(faction)}
            >
              <div
                style={{
                  filter: faction?.passed ? "brightness(0.6)" : "unset",
                }}
              >
                <FactionSummary
                  factionId={faction?.id}
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
