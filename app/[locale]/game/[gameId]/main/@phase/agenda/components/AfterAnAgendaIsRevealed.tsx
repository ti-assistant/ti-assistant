import { FormattedMessage } from "react-intl";
import FactionSelectRadialMenu from "../../../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { useGameState } from "../../../../../../../../src/context/stateDataHooks";
import {
  playActionCardAsync,
  unplayActionCardAsync,
} from "../../../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../../../src/HoverMenu";
import {
  getActionCardTargets,
  getActiveAgenda,
} from "../../../../../../../../src/util/actionLog";
import { rem } from "../../../../../../../../src/util/util";

export default function AfterAnAgendaIsRevealed() {
  const currentTurn = useCurrentTurn();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const gameId = useGameId();
  const state = useGameState();
  const viewOnly = useViewOnly();

  const currentAgenda = getActiveAgenda(currentTurn);

  if (!currentAgenda || state.votingStarted) {
    return null;
  }

  let assassinatedRep = getActionCardTargets(
    currentTurn,
    "Assassinate Representative",
  )[0];
  assassinatedRep = assassinatedRep === "None" ? undefined : assassinatedRep;
  const electionHacked =
    getActionCardTargets(currentTurn, "Hack Election").length > 0;

  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="++U8Ff"
          description="Label on hover menu for actions that happen after an agenda is revealed."
          defaultMessage="After an Agenda is Revealed"
        />
      }
      style={{ minWidth: "100%" }}
    >
      <div
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          padding: rem(8),
          paddingTop: 0,
        }}
      >
        <button
          className={electionHacked ? "selected" : ""}
          onClick={() => {
            if (electionHacked) {
              unplayActionCardAsync(gameId, "Hack Election", "None");
            } else {
              playActionCardAsync(gameId, "Hack Election", "None");
            }
          }}
          disabled={viewOnly}
        >
          <FormattedMessage
            id="Action Cards.Hack Election.Name"
            description="Name of action card: Hack Election"
            defaultMessage="Hack Election"
          />
        </button>
        <div className="flexRow">
          <FormattedMessage
            id="Action Cards.Assassinate Representative.Name"
            description="Name of action card: Assassinate Representative"
            defaultMessage="Assassinate Representative"
          />
          :
          <FactionSelectRadialMenu
            factions={mapOrderedFactionIds}
            selectedFaction={assassinatedRep}
            onSelect={(factionId, prevFaction) => {
              if (prevFaction) {
                unplayActionCardAsync(
                  gameId,
                  "Assassinate Representative",
                  prevFaction,
                );
              }
              if (factionId) {
                playActionCardAsync(
                  gameId,
                  "Assassinate Representative",
                  factionId,
                );
              }
            }}
            size={32}
            viewOnly={viewOnly}
          />
        </div>
      </div>
    </ClientOnlyHoverMenu>
  );
}
