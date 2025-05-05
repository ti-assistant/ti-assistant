import { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { BASE_COLORS } from "../../../server/data/colors";
import { SettingsContext } from "../../context/contexts";
import { useGameId, useOptions } from "../../context/dataHooks";
import { useFaction, useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { changeOptionAsync, updateFactionAsync } from "../../dynamic/api";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import DummyFactionSummary from "../../InnerFactionSummary";
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
import PlayerNameInput from "../../../app/setup/components/PlayerNameInput";

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
        {gameId ? (
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
                  toggleFn={() =>
                    updateSetting("fs-tech-summary-display", "TREE")
                  }
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
    (faction) => faction.color
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
              <PlayerNameInputWrapper
                factionId={factionId}
                gameId={gameId}
                index={index}
              />
              <ColorPicker
                gameId={gameId}
                colors={BASE_COLORS}
                selectedColors={selectedColors}
                faction={faction}
              />
            </div>
          );
        })}
      </LabeledDiv>
    </>
  );
}

function PlayerNameInputWrapper({
  factionId,
  gameId,
  index,
}: {
  factionId: FactionId;
  gameId: string;
  index: number;
}) {
  const faction = useFaction(factionId);

  if (!faction) {
    return null;
  }

  const factionColor = convertToFactionColor(faction.color);

  return (
    <PlayerNameInput
      color={factionColor === "#555" ? undefined : factionColor}
      playerName={faction.playerName}
      updatePlayerName={(name) =>
        updateFactionAsync(gameId, factionId, { playerName: name })
      }
      tabIndex={index + 1}
    />
  );
}

function ColorPicker({
  gameId,
  colors,
  selectedColors,
  faction,
}: {
  gameId: string;
  colors: string[];
  selectedColors: string[];
  faction: Faction;
}) {
  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="Lm8L7/"
          description="Text on a hover menu for picking a player's color."
          defaultMessage="Color"
        />
      }
      renderProps={(closeFn) => {
        return (
          <div
            className="flexRow"
            style={{
              padding: `${rem(8)}`,
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(3, auto)",
              overflowX: "auto",
              gap: `${rem(4)}`,
              justifyContent: "flex-start",
            }}
          >
            {colors.map((color) => {
              const factionColor = convertToFactionColor(color);
              const alreadySelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  style={{
                    backgroundColor: factionColor,
                    color: factionColor,
                    height: rem(22),
                    width: rem(18),
                    opacity:
                      faction.color !== color && alreadySelected
                        ? 0.25
                        : undefined,
                  }}
                  className={faction.color === color ? "selected" : ""}
                  onClick={() => {
                    closeFn();
                    updateFactionAsync(gameId, faction.id, { color });
                  }}
                ></button>
              );
            })}
          </div>
        );
      }}
    ></ClientOnlyHoverMenu>
  );
}
