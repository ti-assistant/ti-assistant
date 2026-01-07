import { useState } from "react";
import { FormattedMessage } from "react-intl";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import { FactionSummary } from "../../../../../../src/FactionSummary";
import { Tab, TabBody } from "../../../../../../src/Tab";
import { rem } from "../../../../../../src/util/util";
import ObjectiveTab from "./ObjectiveTab";
import PhaseSection from "./PhaseSection";
import PlanetTab from "./PlanetTab";
import TechTab from "./TechTab";
import Conditional from "../../../../../../src/components/Conditional/Conditional";

export default function FactionContent({
  factionId,
}: {
  factionId: FactionId;
}) {
  const [tabShown, setTabShown] = useState<string>("");

  function toggleTabShown(tab: string) {
    if (tabShown === tab) {
      setTabShown("");
    } else {
      setTabShown(tab);
    }
  }

  return (
    <div className="flexColumn" style={{ gap: rem(8), width: "100%" }}>
      <FactionSummary factionId={factionId} />
      <div
        style={{
          width: "100%",
          maxWidth: rem(800),
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexBasis: "100%",
          }}
        >
          <div
            className="flexColumn"
            style={{
              width: "100%",
              alignItems: "stretch",
              padding: `0 ${rem(8)}`,
            }}
          >
            <PhaseSection factionId={factionId} />
            <LabeledLine
              label={
                <FormattedMessage
                  id="NUNF0C"
                  defaultMessage="Faction Details"
                  description="Label for a section of faction details."
                />
              }
            />
            <div
              className="flexColumn"
              style={{ gap: 0, alignItems: "stretch" }}
            >
              {/* Tabs */}
              <div
                className="flexRow"
                style={{ width: "100%", margin: `0 ${rem(4)}` }}
              >
                <Conditional appSection="TECHS">
                  <Tab
                    selectTab={toggleTabShown}
                    id="techs"
                    selectedId={tabShown}
                  >
                    <FormattedMessage
                      id="ys7uwX"
                      description="Shortened version of technologies."
                      defaultMessage="Techs"
                    />
                  </Tab>
                </Conditional>
                <Conditional appSection="PLANETS">
                  <Tab
                    selectTab={toggleTabShown}
                    id="planets"
                    selectedId={tabShown}
                  >
                    <FormattedMessage
                      id="1fNqTf"
                      description="Planets."
                      defaultMessage="Planets"
                    />
                  </Tab>
                </Conditional>
                <Conditional appSection="OBJECTIVES">
                  <Tab
                    selectTab={toggleTabShown}
                    id="objectives"
                    selectedId={tabShown}
                  >
                    <FormattedMessage
                      id="5Bl4Ek"
                      description="Cards that define how to score victory points."
                      defaultMessage="Objectives"
                    />
                  </Tab>
                </Conditional>
              </div>
              <Conditional appSection="TECHS">
                <TabBody id="techs" selectedId={tabShown}>
                  <LabeledLine />
                  <TechTab factionId={factionId} />
                </TabBody>
              </Conditional>
              <Conditional appSection="PLANETS">
                <TabBody id="planets" selectedId={tabShown}>
                  <LabeledLine />
                  <PlanetTab factionId={factionId} />
                </TabBody>
              </Conditional>

              <Conditional appSection="OBJECTIVES">
                <TabBody id="objectives" selectedId={tabShown}>
                  <LabeledLine />
                  <ObjectiveTab factionId={factionId} />
                </TabBody>
              </Conditional>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
