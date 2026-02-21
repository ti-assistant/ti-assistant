import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import ColorPicker from "../../../app/[locale]/setup/components/ColorPicker";
import PlayerNameInput from "../../../app/[locale]/setup/components/PlayerNameInput";
import { SettingsContext } from "../../context/contexts";
import { useGameId, useOptions, useViewOnly } from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import DummyFactionSummary, {
  DummySummaryLabel,
} from "../../InnerFactionSummary";
import { useChangeOption } from "../../util/api/changeOption";
import { useUpdateFaction } from "../../util/api/updateFaction";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { getSettings } from "../../util/client";
import { convertToFactionColor } from "../../util/factions";
import { Settings } from "../../util/settings";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import NumberInput from "../NumberInput/NumberInput";
import TechIcon from "../TechIcon/TechIcon";
import { DummyTechTree } from "../TechTree/TechTree";

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
  let { settings, updateSetting } = useContext(SettingsContext);
  const [localSettings, updateLocalSettings] = useState(getSettings());

  const updateLocalSetting = <T extends keyof Settings>(
    setting: T,
    value: Settings[T],
  ) => {
    updateSetting(setting, value);
    const newSettings: Settings = {
      ...settings,
      [setting]: value,
    };
    Cookies.set("settings", JSON.stringify(newSettings));
    updateLocalSettings(newSettings);
  };

  const techSummarySetting = localSettings["fs-tech-summary-display"];

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
                    label={localSettings["fs-left-label"]}
                  />
                }
                rightLabel={
                  <DummySummaryLabel
                    factionId="Vuil'raith Cabal"
                    label={localSettings["fs-right-label"]}
                  />
                }
                color="var(--neutral-border)"
              >
                <DummyFactionSummary settings={localSettings} />
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
                    updateLocalSetting(
                      "fs-tech-summary-display",
                      "NUMBER+ICON+TREE",
                    )
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
                    updateLocalSetting("fs-tech-summary-display", "NUMBER+ICON")
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
                    updateLocalSetting("fs-tech-summary-display", "ICON+TREE")
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
                    updateLocalSetting("fs-tech-summary-display", "NUMBER+TREE")
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
                    updateLocalSetting("fs-tech-summary-display", "TREE")
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
                  selected={localSettings["fs-left"] === "NONE"}
                  toggleFn={() => updateLocalSetting("fs-left", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={localSettings["fs-left"] === "TECHS"}
                  toggleFn={() => updateLocalSetting("fs-left", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={localSettings["fs-left"] === "OBJECTIVES"}
                  toggleFn={() => updateLocalSetting("fs-left", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={localSettings["fs-left"] === "PLANETS"}
                  toggleFn={() => updateLocalSetting("fs-left", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={localSettings["fs-left"] === "TIMER"}
                  toggleFn={() => updateLocalSetting("fs-left", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Center:
                <Chip
                  selected={localSettings["fs-center"] === "NONE"}
                  toggleFn={() => updateLocalSetting("fs-center", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={localSettings["fs-center"] === "TECHS"}
                  toggleFn={() => updateLocalSetting("fs-center", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={localSettings["fs-center"] === "OBJECTIVES"}
                  toggleFn={() => updateLocalSetting("fs-center", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={localSettings["fs-center"] === "PLANETS"}
                  toggleFn={() => updateLocalSetting("fs-center", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={localSettings["fs-center"] === "TIMER"}
                  toggleFn={() => updateLocalSetting("fs-center", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Right:
                <Chip
                  selected={localSettings["fs-right"] === "NONE"}
                  toggleFn={() => updateLocalSetting("fs-right", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={localSettings["fs-right"] === "TECHS"}
                  toggleFn={() => updateLocalSetting("fs-right", "TECHS")}
                >
                  Techs
                </Chip>
                <Chip
                  selected={localSettings["fs-right"] === "OBJECTIVES"}
                  toggleFn={() => updateLocalSetting("fs-right", "OBJECTIVES")}
                >
                  Objectives
                </Chip>
                <Chip
                  selected={localSettings["fs-right"] === "PLANETS"}
                  toggleFn={() => updateLocalSetting("fs-right", "PLANETS")}
                >
                  Planets
                </Chip>
                <Chip
                  selected={localSettings["fs-right"] === "TIMER"}
                  toggleFn={() => updateLocalSetting("fs-right", "TIMER")}
                >
                  Timer
                </Chip>
              </div>
              <div>
                Left Label:
                <Chip
                  selected={localSettings["fs-left-label"] === "NONE"}
                  toggleFn={() => updateLocalSetting("fs-left-label", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={localSettings["fs-left-label"] === "NAME"}
                  toggleFn={() => updateLocalSetting("fs-left-label", "NAME")}
                >
                  Name
                </Chip>
                <Chip
                  selected={localSettings["fs-left-label"] === "TIMER"}
                  toggleFn={() => updateLocalSetting("fs-left-label", "TIMER")}
                >
                  Timer
                </Chip>
                <Chip
                  selected={localSettings["fs-left-label"] === "VPS"}
                  toggleFn={() => updateLocalSetting("fs-left-label", "VPS")}
                >
                  VPs
                </Chip>
              </div>
              <div>
                Right Label:
                <Chip
                  selected={localSettings["fs-right-label"] === "NONE"}
                  toggleFn={() => updateLocalSetting("fs-right-label", "NONE")}
                >
                  None
                </Chip>
                <Chip
                  selected={localSettings["fs-right-label"] === "NAME"}
                  toggleFn={() => updateLocalSetting("fs-right-label", "NAME")}
                >
                  Name
                </Chip>
                <Chip
                  selected={localSettings["fs-right-label"] === "TIMER"}
                  toggleFn={() => updateLocalSetting("fs-right-label", "TIMER")}
                >
                  Timer
                </Chip>
                <Chip
                  selected={localSettings["fs-right-label"] === "VPS"}
                  toggleFn={() => updateLocalSetting("fs-right-label", "VPS")}
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
  const changeOption = useChangeOption();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const factions = useFactions();
  const options = useOptions();
  const updateFaction = useUpdateFaction();

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
          onChange={(newVal) => changeOption(gameId, "victory-points", newVal)}
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
                  updateFaction(gameId, factionId, { playerName: name })
                }
                tabIndex={index + 1}
              />
              <ColorPicker
                pickedColor={faction.color}
                selectedColors={selectedColors}
                updateColor={(color) => {
                  updateFaction(gameId, factionId, { color });
                }}
              />
            </div>
          );
        })}
      </LabeledDiv>
    </>
  );
}
