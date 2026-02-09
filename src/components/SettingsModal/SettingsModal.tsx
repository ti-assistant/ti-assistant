import { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import ColorPicker from "../../../app/setup/components/ColorPicker";
import PlayerNameInput from "../../../app/setup/components/PlayerNameInput";
import { SettingsContext } from "../../context/contexts";
import { useGameId, useOptions, useViewOnly } from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { changeOptionAsync, updateFactionAsync } from "../../dynamic/api";
import DummyFactionSummary, {
  DummySummaryLabel,
} from "../../InnerFactionSummary";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { convertToFactionColor } from "../../util/factions";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import NumberInput from "../NumberInput/NumberInput";
import TechIcon from "../TechIcon/TechIcon";
import { DummyTechTree } from "../TechTree/TechTree";
import Toggle from "../Toggle/Toggle";

export default function SettingsModal() {
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

type SettingsTab = "DISPLAY SETTINGS" | "GAME SETTINGS";

function SettingsModalContent() {
  const gameId = useGameId();
  const viewOnly = useViewOnly();
  const { settings, updateSetting } = useContext(SettingsContext);

  const techSummarySetting = settings["fs-tech-summary-display"];

  const [selectedTab, setSelectedTab] =
    useState<SettingsTab>("DISPLAY SETTINGS");

  return (
    <>
      <div
        className="flexRow"
        style={{ fontSize: rem(24), width: "min-content" }}
      >
        <Chip
          toggleFn={() => setSelectedTab("DISPLAY SETTINGS")}
          selected={selectedTab === "DISPLAY SETTINGS"}
          style={{ fontFamily: "Myriad Pro", fontSize: rem(16) }}
        >
          Display Settings
        </Chip>
        {gameId && !viewOnly ? (
          <Chip
            toggleFn={() => setSelectedTab("GAME SETTINGS")}
            selected={selectedTab === "GAME SETTINGS"}
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
          width: "fit-content",
          backgroundColor: "var(--background-color)",
          borderRadius: rem(4),
          border: `${rem(1)} solid #eee`,
          padding: rem(8),
        }}
      >
        {selectedTab === "DISPLAY SETTINGS" ? (
          <>
            Display Settings
            <div style={{ width: "fit-content", scale: 1 }}>
              <LabeledDiv
                label={
                  <DummySummaryLabel
                    factionId="Vuil'raith Cabal"
                    label={settings["fs-left-label"]}
                  />
                }
                rightLabel={
                  <DummySummaryLabel
                    factionId="Vuil'raith Cabal"
                    label={settings["fs-right-label"]}
                  />
                }
                color="var(--neutral-border)"
              >
                <DummyFactionSummary />
              </LabeledDiv>
            </div>
            <div style={{ width: "fit-content" }}>
              <LabeledDiv
                label="Tech Summary"
                innerStyle={{
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
                    style={{ gap: rem(4), fontFamily: "var(--main-font)" }}
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
                    style={{ gap: rem(4), fontFamily: "var(--main-font)" }}
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
                    style={{ gap: rem(4), fontFamily: "var(--main-font)" }}
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
                    style={{ gap: rem(4), fontFamily: "var(--main-font)" }}
                  >
                    2
                    <DummyTechTree />
                  </div>
                </Chip>
                <Chip
                  toggleFn={() =>
                    updateSetting("fs-tech-summary-display", "TREE")
                  }
                  selected={techSummarySetting === "TREE"}
                  style={{ height: rem(32) }}
                >
                  <div
                    className="flexRow"
                    style={{ gap: rem(4), fontFamily: "var(--main-font)" }}
                  >
                    <DummyTechTree />
                  </div>
                </Chip>
              </LabeledDiv>
            </div>
            <div className="flexRow">
              <div>
                Left:
                <Chip
                  selected={settings["fs-left"] === "NONE"}
                  toggleFn={() => updateSetting("fs-left", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={settings["fs-left"] === "TECHS"}
                  toggleFn={() => updateSetting("fs-left", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={settings["fs-left"] === "OBJECTIVES"}
                  toggleFn={() => updateSetting("fs-left", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={settings["fs-left"] === "PLANETS"}
                  toggleFn={() => updateSetting("fs-left", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={settings["fs-left"] === "TIMER"}
                  toggleFn={() => updateSetting("fs-left", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Center:
                <Chip
                  selected={settings["fs-center"] === "NONE"}
                  toggleFn={() => updateSetting("fs-center", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={settings["fs-center"] === "TECHS"}
                  toggleFn={() => updateSetting("fs-center", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={settings["fs-center"] === "OBJECTIVES"}
                  toggleFn={() => updateSetting("fs-center", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={settings["fs-center"] === "PLANETS"}
                  toggleFn={() => updateSetting("fs-center", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={settings["fs-center"] === "TIMER"}
                  toggleFn={() => updateSetting("fs-center", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Right:
                <Chip
                  selected={settings["fs-right"] === "NONE"}
                  toggleFn={() => updateSetting("fs-right", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={settings["fs-right"] === "TECHS"}
                  toggleFn={() => updateSetting("fs-right", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={settings["fs-right"] === "OBJECTIVES"}
                  toggleFn={() => updateSetting("fs-right", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={settings["fs-right"] === "PLANETS"}
                  toggleFn={() => updateSetting("fs-right", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={settings["fs-right"] === "TIMER"}
                  toggleFn={() => updateSetting("fs-right", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Left Label:
                <Chip
                  selected={settings["fs-left-label"] === "NONE"}
                  toggleFn={() => updateSetting("fs-left-label", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={settings["fs-left-label"] === "NAME"}
                  toggleFn={() => updateSetting("fs-left-label", "NAME")}
                >
                  Name
                </Chip>
                <Chip
                  selected={settings["fs-left-label"] === "TIMER"}
                  toggleFn={() => updateSetting("fs-left-label", "TIMER")}
                >
                  Timer
                </Chip>
                <Chip
                  selected={settings["fs-left-label"] === "VPS"}
                  toggleFn={() => updateSetting("fs-left-label", "VPS")}
                >
                  VPs
                </Chip>
              </div>
              <div>
                Right Label:
                <Chip
                  selected={settings["fs-right-label"] === "NONE"}
                  toggleFn={() => updateSetting("fs-right-label", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={settings["fs-right-label"] === "NAME"}
                  toggleFn={() => updateSetting("fs-right-label", "NAME")}
                >
                  Name
                </Chip>
                <Chip
                  selected={settings["fs-right-label"] === "TIMER"}
                  toggleFn={() => updateSetting("fs-right-label", "TIMER")}
                >
                  Timer
                </Chip>
                <Chip
                  selected={settings["fs-right-label"] === "VPS"}
                  toggleFn={() => updateSetting("fs-right-label", "VPS")}
                >
                  VPs
                </Chip>
              </div>
            </div>
          </>
        ) : null}
        {selectedTab === "GAME SETTINGS" ? (
          <>
            <GameSettings gameId={gameId} />
          </>
        ) : null}
      </div>
    </>
  );
}

function GameSettings({ gameId }: { gameId: string }) {
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const factions = useFactions();
  const options = useOptions();

  const selectedColors = Object.values(factions).map(
    (faction) => faction.color,
  );

  return (
    <>
      <div className="flexRow">
        <FormattedMessage
          id="R06tnh"
          description="A label for a selector specifying the number of victory points required."
          defaultMessage="Victory Points"
        />
        :
        <NumberInput
          value={options["victory-points"]}
          onChange={(newVal) =>
            changeOptionAsync(gameId, "victory-points", newVal)
          }
          minValue={0}
        />
      </div>
      <LabeledDiv
        label="Factions"
        style={{
          width: "fit-content",
        }}
      >
        {orderedFactionIds.map((factionId, index) => {
          const faction = factions[factionId];
          if (!faction) {
            return null;
          }
          return (
            <div key={faction.id} className="flexRow">
              <div
                style={{
                  borderRadius: "100%",
                  border: `2px solid ${convertToFactionColor(faction.color)}`,
                  padding: rem(2),
                  boxShadow:
                    faction.color === "Black" ? BLACK_BORDER_GLOW : undefined,
                }}
              >
                <FactionIcon factionId={faction.id} size={36} />
              </div>
              <PlayerNameInput
                color={convertToFactionColor(faction.color)}
                playerName={faction.playerName}
                updatePlayerName={(name) =>
                  updateFactionAsync(gameId, factionId, { playerName: name })
                }
                tabIndex={index + 1}
              />
              <ColorPicker
                pickedColor={faction.color}
                selectedColors={selectedColors}
                updateColor={(color) => {
                  updateFactionAsync(gameId, factionId, { color });
                }}
              />
            </div>
          );
        })}
      </LabeledDiv>
    </>
  );
}
