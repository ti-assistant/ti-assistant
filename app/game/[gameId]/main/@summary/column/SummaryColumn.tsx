"use client";

import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { FactionSummary } from "../../../../../../src/FactionSummary";
import { StaticFactionTimer } from "../../../../../../src/Timer";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useOptions } from "../../../../../../src/context/dataHooks";
import {
  useFaction,
  useNumFactions,
} from "../../../../../../src/context/factionDataHooks";
import {
  FactionOrdering,
  useOrderedFactionIds,
} from "../../../../../../src/context/gameDataHooks";
import {
  useFinalPhase,
  usePhase,
} from "../../../../../../src/context/stateDataHooks";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../src/util/factions";
import { rem } from "../../../../../../src/util/util";
import styles from "./SummaryColumn.module.scss";

const FactionPanel = dynamic(
  () => import("../../../../../../src/components/FactionPanel"),
  {
    loading: () => <div className="popupIcon">&#x24D8;</div>,
    ssr: false,
  }
);

function sortByOrder(a: Faction, b: Faction) {
  if (a.order > b.order) {
    return 1;
  } else {
    return -1;
  }
}

export default function SummaryColumn({ viewOnly }: { viewOnly?: boolean }) {
  const phase = usePhase();
  const numFactions = useNumFactions();
  const finalPhase = useFinalPhase();

  let order: FactionOrdering = "SPEAKER";
  let tieBreak: FactionOrdering = "SPEAKER";
  if (phase === "END") {
    order = "VICTORY_POINTS";
    tieBreak =
      finalPhase === "ACTION" || finalPhase === "STATUS"
        ? "INITIATIVE"
        : "SPEAKER";
  }

  const orderedFactionIds = useOrderedFactionIds(order, tieBreak);

  let title = (
    <FormattedMessage
      id="L4UH+0"
      description="An ordering of factions based on the speaker."
      defaultMessage="Speaker Order"
    />
  );
  switch (order) {
    case "VICTORY_POINTS":
      title = (
        <FormattedMessage
          id="KiioBO"
          description="An ordering of factions based on end game scoring."
          defaultMessage="Final Score"
        />
      );
      break;
  }

  return (
    <div
      className={styles.SummaryColumn}
      style={{
        gap: numFactions < 8 ? rem(12) : 0,
        paddingTop: numFactions === 8 ? rem(48) : undefined,
      }}
    >
      {numFactions < 8 ? <div className="flexRow">{title}</div> : null}

      {orderedFactionIds.map((factionId) => {
        return (
          <FactionDiv
            key={factionId}
            factionId={factionId}
            viewOnly={viewOnly}
          />
        );
      })}
    </div>
  );
}

function FactionDiv({
  factionId,
  viewOnly,
}: {
  factionId: FactionId;
  viewOnly?: boolean;
}) {
  const faction = useFaction(factionId);
  const options = useOptions();
  const phase = usePhase();

  if (!faction) {
    return null;
  }

  const factionSummaryOptions = {
    showIcon: true,
  };

  const fadeFaction = phase !== "END" && faction.passed;

  return (
    <LabeledDiv
      label={
        faction ? (
          <div className="flexRow" style={{ gap: 0 }}>
            {getFactionName(faction)}
            <FactionPanel factionId={factionId} options={options} />
          </div>
        ) : (
          <div className="flexRow" style={{ gap: 0 }}>
            Loading Faction
            <div className="popupIcon">&#x24D8;</div>
          </div>
        )
      }
      rightLabel={
        <StaticFactionTimer active={false} factionId={factionId} width={84} />
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
  );
}
