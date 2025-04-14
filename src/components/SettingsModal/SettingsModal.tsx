import { FormattedMessage } from "react-intl";
import { rem } from "../../util/util";
import { useGameId } from "../../context/dataHooks";
import { useState } from "react";
import Chip from "../Chip/Chip";

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

  const [selectedTab, setSelectedTab] = useState<string>("POTATO");

  return (
    <div>
      <div
        className="flexRow"
        style={{
          backgroundColor: "var(--background-color)",
          border: "1px solid #eee",
          borderRadius: "0.25rem",
          padding: rem(4),
        }}
      >
        <Chip
          toggleFn={() => setSelectedTab("TEST")}
          selected={selectedTab === "TEST"}
        >
          Test
        </Chip>
        {gameId ? (
          <Chip
            toggleFn={() => setSelectedTab("GAME")}
            selected={selectedTab === "GAME"}
          >
            {gameId}
          </Chip>
        ) : null}
      </div>
    </div>
  );
}
