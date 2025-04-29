import { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SettingsContext } from "../../context/contexts";
import { useGameId } from "../../context/dataHooks";
import DummyFactionSummary from "../../InnerFactionSummary";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import TechIcon from "../TechIcon/TechIcon";
import { DummyTechTree } from "../TechTree/TechTree";
import Toggle from "../Toggle/Toggle";

export default function SettingsModal() {
  const gameId = useGameId();

  return (
    <div
      className="flexColumn"
      style={{
        justifyContent: "flex-start",
        maxHeight: `calc(100dvh - ${rem(24)})`,
      }}
    >
      <div className="flexRow centered extraLargeFont">
        <div
          style={{
            backgroundColor: "var(--background-color)",
            border: "1px solid var(--neutral-border)",
            padding: `${rem(4)} ${rem(8)}`,
            borderRadius: rem(4),
            width: "min-content",
          }}
        >
          <FormattedMessage
            id="iL4f7y"
            description="Title for a section about changing settings."
            defaultMessage="Settings"
          />
        </div>
      </div>
      <div
        className="flexColumn largeFont"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `clamp(80vw, 70rem, calc(100vw - 1.5rem))`,
          justifyContent: "flex-start",
        }}
      >
        <SettingsModalContent />
      </div>
    </div>
  );
}

function SettingsModalContent() {
  const gameId = useGameId();
  const { settings, updateSetting } = useContext(SettingsContext);

  const techSummarySetting = settings["fs-tech-summary-display"];

  const [selectedTab, setSelectedTab] = useState<string>("POTATO");

  return (
    <>
      <div
        className="flexRow"
        style={{ fontSize: rem(24), width: "min-content" }}
      >
        <Chip
          toggleFn={() => setSelectedTab("TEST")}
          selected={selectedTab === "TEST"}
          style={{ fontFamily: "Myriad Pro", fontSize: rem(16) }}
        >
          Display Settings
        </Chip>
        {gameId ? (
          <Chip
            toggleFn={() => setSelectedTab("GAME")}
            selected={selectedTab === "GAME"}
            style={{ fontFamily: "Myriad Pro", fontSize: rem(16) }}
          >
            Game: {gameId}
          </Chip>
        ) : null}
      </div>

      <div
        className="flexColumn"
        style={{
          zIndex: 1,
          width: "100%",
          backgroundColor: "var(--background-color)",
          borderRadius: rem(4),
          border: `${rem(1)} solid #eee`,
          padding: rem(8),
        }}
      >
        Display Settings
        <div style={{ width: "fit-content", scale: 1 }}>
          <LabeledDiv label="Faction Summary" color="var(--neutral-border)">
            <DummyFactionSummary />
          </LabeledDiv>
        </div>
        <div style={{ width: "fit-content" }}>
          <LabeledDiv
            label={
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: "#eee",
                  fontFamily: "Myriad Pro",
                }}
              >
                <Toggle
                  toggleFn={(prev) => {
                    if (prev) {
                      updateSetting("fs-tech-summary-display", "NONE");
                    } else {
                      updateSetting(
                        "fs-tech-summary-display",
                        "NUMBER+ICON+TREE"
                      );
                    }
                  }}
                  selected={techSummarySetting !== "NONE"}
                >
                  Tech Summary
                </Toggle>
              </span>
            }
            innerStyle={{
              paddingTop: rem(24),
              fontFamily: "Myriad Pro",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: rem(4),
            }}
          >
            <Chip
              toggleFn={() =>
                updateSetting("fs-tech-summary-display", "NUMBER+ICON+TREE")
              }
              selected={techSummarySetting === "NUMBER+ICON+TREE"}
              style={{ height: rem(32) }}
            >
              <div
                className="flexRow"
                style={{ gap: rem(4), fontFamily: "Slider" }}
              >
                2<TechIcon type="GREEN" size={16} />
                <DummyTechTree />
              </div>
            </Chip>
            <Chip
              toggleFn={() =>
                updateSetting("fs-tech-summary-display", "NUMBER+ICON")
              }
              selected={techSummarySetting === "NUMBER+ICON"}
              style={{ height: rem(32) }}
            >
              <div
                className="flexRow"
                style={{ gap: rem(4), fontFamily: "Slider" }}
              >
                2<TechIcon type="GREEN" size={16} />
              </div>
            </Chip>
            <Chip
              toggleFn={() =>
                updateSetting("fs-tech-summary-display", "ICON+TREE")
              }
              selected={techSummarySetting === "ICON+TREE"}
              style={{ height: rem(32) }}
            >
              <div
                className="flexRow"
                style={{ gap: rem(4), fontFamily: "Slider" }}
              >
                <TechIcon type="GREEN" size={16} />
                <DummyTechTree />
              </div>
            </Chip>
            <Chip
              toggleFn={() =>
                updateSetting("fs-tech-summary-display", "NUMBER+TREE")
              }
              selected={techSummarySetting === "NUMBER+TREE"}
              style={{ height: rem(32) }}
            >
              <div
                className="flexRow"
                style={{ gap: rem(4), fontFamily: "Slider" }}
              >
                2
                <DummyTechTree />
              </div>
            </Chip>
            <Chip
              toggleFn={() => updateSetting("fs-tech-summary-display", "TREE")}
              selected={techSummarySetting === "TREE"}
              style={{ height: rem(32) }}
            >
              <div
                className="flexRow"
                style={{ gap: rem(4), fontFamily: "Slider" }}
              >
                <DummyTechTree />
              </div>
            </Chip>
          </LabeledDiv>
        </div>
      </div>
    </>
  );
}
