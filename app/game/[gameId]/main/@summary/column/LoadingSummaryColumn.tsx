"use client";

import { FormattedMessage } from "react-intl";
import LoadingFactionSummary from "../../../../../../src/LoadingFactionSummary";
import { StaticFactionTimer } from "../../../../../../src/Timer";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import { rem } from "../../../../../../src/util/util";
import styles from "./SummaryColumn.module.scss";

export default function LoadingSummaryColumn() {
  const factions = [1, 2, 3, 4, 5, 6];

  return (
    <div
      className={styles.SummaryColumn}
      style={{
        gap: rem(12),
      }}
    >
      <div className="flexRow">
        <FormattedMessage
          id="L4UH+0"
          description="An ordering of factions based on the speaker."
          defaultMessage="Speaker Order"
        />
      </div>

      {factions.map((faction) => {
        return (
          <div key={faction}>
            <LabeledDiv
              label={
                <div className="flexRow" style={{ gap: 0 }}>
                  Loading Faction
                  <div className="popupIcon">&#x24D8;</div>
                </div>
              }
              rightLabel={
                <StaticFactionTimer
                  active={false}
                  factionId={"Unknown"}
                  width={84}
                />
              }
              color={"var(--neutral-border)"}
            >
              <div>
                <LoadingFactionSummary />
              </div>
            </LabeledDiv>
          </div>
        );
      })}
    </div>
  );
}
