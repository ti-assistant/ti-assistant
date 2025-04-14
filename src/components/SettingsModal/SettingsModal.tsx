import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useGameId } from "../../context/dataHooks";
import DummyFactionSummary from "../../InnerFactionSummary";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import TechIcon from "../TechIcon/TechIcon";
import { DummyTechTree } from "../TechTree/TechTree";
import Toggle from "../Toggle/Toggle";
import { useSharedSettings } from "../../util/cookies";

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
        <div style={{ width: "100%", backgroundColor: "var(--light-bg)" }}>
          {gameId}
        </div>
      </div>
    </div>
  );
}

function SettingsModalContent() {
  const gameId = useGameId();
  const { settings, updateSetting } = useSharedSettings();

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
          Faction Summary
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
        }}
      >
        {selectedTab}
        <div style={{ width: "fit-content" }}>
          <LabeledDiv label="Vuil'raith Cabal" color="red">
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
                      updateSetting("fs-tech-summary-display", "ALL");
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
            }}
          >
            <Chip
              toggleFn={() => updateSetting("fs-tech-summary-display", "ALL")}
              selected={techSummarySetting === "ALL"}
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
                updateSetting("fs-tech-summary-display", "ICON+NUMBER")
              }
              selected={techSummarySetting === "ICON+NUMBER"}
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
                updateSetting("fs-tech-summary-display", "TREE+ICON")
              }
              selected={techSummarySetting === "TREE+ICON"}
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
                updateSetting("fs-tech-summary-display", "TREE+NUMBER")
              }
              selected={techSummarySetting === "TREE+NUMBER"}
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
