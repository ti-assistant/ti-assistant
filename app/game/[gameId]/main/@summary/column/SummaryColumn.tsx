"use client";

import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { FactionSummary } from "../../../../../../src/FactionSummary";
import { StaticFactionTimer } from "../../../../../../src/Timer";
import FactionComponents from "../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useOptions } from "../../../../../../src/context/dataHooks";
import {
  useFactionColor,
  useIsFactionPassed,
  useNumFactions,
} from "../../../../../../src/context/factionDataHooks";
import {
  FactionOrdering,
  useCompleteOrderedFactionIds,
  useOrderedFactionIds,
} from "../../../../../../src/context/gameDataHooks";
import {
  useFinalPhase,
  usePhase,
} from "../../../../../../src/context/stateDataHooks";
import { rem } from "../../../../../../src/util/util";
import styles from "./SummaryColumn.module.scss";
import { use } from "react";
import { SettingsContext } from "../../../../../../src/context/contexts";
import { SummaryLabel } from "../../../../../../src/util/settings";

const FactionPanel = dynamic(
  () => import("../../../../../../src/components/FactionPanel"),
  {
    loading: () => <div className="popupIcon">&#x24D8;</div>,
    ssr: false,
  }
);

export default function SummaryColumn() {
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

  const orderedFactionIds = useCompleteOrderedFactionIds(order, tieBreak);

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
        return <FactionDiv key={factionId} factionId={factionId} />;
      })}
    </div>
  );
}

function FactionDiv({ factionId }: { factionId: FactionId }) {
  const factionColor = useFactionColor(factionId);
  const isPassed = useIsFactionPassed(factionId);
  const options = useOptions();
  const phase = usePhase();
  const { settings } = use(SettingsContext);

  const factionSummaryOptions = {
    showIcon: true,
  };

  const fadeFaction = phase !== "END" && isPassed;

  return (
    <LabeledDiv
      label={
        <FactionSummaryLabel
          factionId={factionId}
          options={options}
          label={settings["fs-left-label"]}
        />
      }
      rightLabel={
        <FactionSummaryLabel
          factionId={factionId}
          options={options}
          label={settings["fs-right-label"]}
        />
      }
      color={fadeFaction ? "#555" : factionColor}
      innerStyle={{
        filter: fadeFaction ? "brightness(0.6)" : "unset",
      }}
    >
      <FactionSummary factionId={factionId} />
    </LabeledDiv>
  );
}

function FactionSummaryLabel({
  factionId,
  options,
  label,
}: {
  factionId: FactionId;
  options: Options;
  label: SummaryLabel;
}) {
  switch (label) {
    case "NONE":
      return null;
    case "NAME":
      return (
        <div className="flexRow" style={{ gap: 0 }}>
          <FactionComponents.Name factionId={factionId} />
          <FactionPanel factionId={factionId} options={options} />
        </div>
      );
    case "TIMER":
      return (
        <StaticFactionTimer active={false} factionId={factionId} width={84} />
      );
    case "VPS":
      return (
        <>
          <FactionComponents.VPs factionId={factionId} /> VPs
        </>
      );
  }
}
