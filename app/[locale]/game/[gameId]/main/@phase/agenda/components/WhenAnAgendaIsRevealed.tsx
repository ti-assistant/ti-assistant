import { FormattedMessage } from "react-intl";
import FactionIcon from "../../../../../../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useCurrentAgenda } from "../../../../../../../../src/context/actionLogDataHooks";
import {
  useCurrentTurn,
  useGameId,
  useViewOnly,
} from "../../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactions,
} from "../../../../../../../../src/context/factionDataHooks";
import { useGameState } from "../../../../../../../../src/context/stateDataHooks";
import {
  hideAgendaAsync,
  playPromissoryNoteAsync,
  unplayPromissoryNoteAsync,
} from "../../../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../../../src/HoverMenu";
import { SymbolX } from "../../../../../../../../src/icons/svgs";
import { getPromissoryTargets } from "../../../../../../../../src/util/actionLog";
import { rem } from "../../../../../../../../src/util/util";

export default function WhenAnAgendaIsRevealed({
  speaker,
}: {
  speaker: FactionId;
}) {
  const currentAgenda = useCurrentAgenda();
  const state = useGameState();

  if (!currentAgenda) {
    return null;
  }

  if (state.votingStarted) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="0MawcE"
          description="Label on hover menu for actions that happen when an agenda is revealed."
          defaultMessage="When an Agenda is Revealed"
        />
      }
    >
      <div
        className="flexColumn"
        style={{
          padding: rem(8),
          paddingTop: 0,
          alignItems: "flex-start",
        }}
      >
        <VetoButton />
        <PoliticalSecrets speaker={speaker} />
      </div>
    </ClientOnlyHoverMenu>
  );
}

function VetoButton() {
  const currentAgenda = useCurrentAgenda();
  const gameId = useGameId();
  const viewOnly = useViewOnly();
  const xxcha = useFaction("Xxcha Kingdom");

  if (!currentAgenda) {
    return null;
  }

  const vetoText = !xxcha ? (
    <FormattedMessage
      id="Action Cards.Veto.Name"
      description="Name of action card: Veto"
      defaultMessage="Veto"
    />
  ) : (
    <FormattedMessage
      id="KzTGw5"
      description="Text on a button for replacing the current agenda."
      defaultMessage="Veto or Quash or Political Favor"
    />
  );

  return (
    <button
      onClick={() => hideAgendaAsync(gameId, currentAgenda, true)}
      disabled={viewOnly}
    >
      {vetoText}
    </button>
  );
}

function PoliticalSecrets({ speaker }: { speaker: FactionId }) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret",
  );
  const speakerOrder = factions[speaker]?.order ?? 1;

  const votingOrder = Object.values(factions).sort((a, b) => {
    if (a.name === "Argent Flight") {
      return -1;
    }
    if (b.name === "Argent Flight") {
      return 1;
    }
    if (a.order === speakerOrder) {
      return 1;
    }
    if (b.order === speakerOrder) {
      return -1;
    }
    if (a.order > speakerOrder && b.order < speakerOrder) {
      return -1;
    }
    if (a.order < speakerOrder && b.order > speakerOrder) {
      return 1;
    }
    return a.order - b.order;
  });
  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="Promissories.Political Secret.Title"
          description="Title of Promissory: Political Secret"
          defaultMessage="Political Secret"
        />
      }
    >
      <div className="flexRow" style={{ width: "100%" }}>
        {votingOrder.map((faction) => {
          const politicalSecret = politicalSecrets.includes(faction.id);
          return (
            <div
              key={faction.id}
              className="flexRow hiddenButtonParent"
              style={{
                position: "relative",
                width: rem(32),
                height: rem(32),
              }}
            >
              <FactionIcon factionId={faction.id} size="100%" />
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--light-bg)",
                  borderRadius: "100%",
                  marginLeft: "60%",
                  cursor: viewOnly ? "default" : "pointer",
                  marginTop: "60%",
                  boxShadow: `${"1px"} ${"1px"} ${"1px"} black`,
                  width: rem(20),
                  height: rem(20),
                  color: politicalSecret ? "green" : "red",
                }}
                onClick={() => {
                  if (viewOnly) {
                    return;
                  }
                  if (politicalSecret) {
                    unplayPromissoryNoteAsync(
                      gameId,
                      "Political Secret",
                      faction.id,
                    );
                  } else {
                    playPromissoryNoteAsync(
                      gameId,
                      "Political Secret",
                      faction.id,
                    );
                  }
                }}
              >
                {politicalSecret ? (
                  <div
                    className="symbol"
                    style={{
                      fontSize: rem(18),
                      lineHeight: rem(18),
                    }}
                  >
                    ✓
                  </div>
                ) : (
                  <div
                    className="flexRow"
                    style={{
                      width: "80%",
                      height: "80%",
                    }}
                  >
                    <SymbolX color="red" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </LabeledDiv>
  );
}
