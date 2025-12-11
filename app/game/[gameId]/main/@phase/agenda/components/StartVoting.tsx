import { FormattedMessage } from "react-intl";
import { useCurrentAgenda } from "../../../../../../../src/context/actionLogDataHooks";
import {
  useGameId,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useGameState } from "../../../../../../../src/context/stateDataHooks";
import { startVotingAsync } from "../../../../../../../src/dynamic/api";

export default function StartVoting() {
  const currentAgenda = useCurrentAgenda();
  const gameId = useGameId();
  const state = useGameState();
  const viewOnly = useViewOnly();

  if (!currentAgenda) {
    return null;
  }

  if (state.votingStarted) {
    return null;
  }
  return (
    <button
      style={{ width: "fit-content" }}
      onClick={() => {
        startVotingAsync(gameId);
      }}
      disabled={viewOnly}
    >
      <FormattedMessage
        id="gQ0twG"
        description="Text on a button that will start the voting part of Agenda Phase."
        defaultMessage="Start Voting"
      />
    </button>
  );
}
