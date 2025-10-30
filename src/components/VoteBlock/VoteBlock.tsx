import { CSSProperties, useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import {
  useActionLog,
  useAgendas,
  useAttachments,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useStrategyCards,
  useTechs,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useObjectives } from "../../context/objectiveDataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { Techs } from "../../context/techDataHooks";
import {
  castVotesAsync,
  playActionCardAsync,
  playPromissoryNoteAsync,
  playRiderAsync,
  unplayActionCardAsync,
  unplayPromissoryNoteAsync,
  unplayRiderAsync,
} from "../../dynamic/api";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import InfluenceSVG from "../../icons/planets/Influence";
import TradeGoodSVG from "../../icons/ui/TradeGood";
import {
  getActionCardTargets,
  getAllVotes,
  getFactionVotes,
  getPlayedRelic,
  getPlayedRiders,
  getPromissoryTargets,
} from "../../util/actionLog";
import {
  getCurrentPhaseLogEntries,
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../util/api/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionColor, getFactionName } from "../../util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../util/planets";
import { riderString } from "../../util/strings";
import { ActionLog, Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import NumberInput from "../NumberInput/NumberInput";
import { Selector } from "../Selector/Selector";
import Toggle from "../Toggle/Toggle";
import styles from "./VoteBlock.module.scss";

// Checks whether or not a faction can use Blood Pact.
function canUseBloodPact(currentTurn: ActionLog, factionId: FactionId) {
  if (factionId === "Empyrean") {
    return false;
  }
  const factionVotes = getFactionVotes(currentTurn, factionId);
  const empyreanVotes = getFactionVotes(currentTurn, "Empyrean");
  if (!factionVotes || !empyreanVotes) {
    return false;
  }
  if (!factionVotes.target || !empyreanVotes.target) {
    return false;
  }
  const bloodPactUser = getPromissoryTargets(
    currentTurn,
    "Blood Pact"
  )[0] as Optional<FactionId>;

  if (bloodPactUser && bloodPactUser !== factionId) {
    return false;
  }

  return factionVotes.target === empyreanVotes.target;
}

function hasCouncilPreserve(
  factionId: FactionId,
  planets: Partial<Record<PlanetId, Planet>>
) {
  for (const planet of Object.values(planets)) {
    if (
      planet.owner === factionId &&
      planet.attachments?.includes("Council Preserve")
    ) {
      return true;
    }
  }
  return false;
}

export function getTargets(
  agenda: Optional<Agenda>,
  factions: Partial<Record<FactionId, Faction>>,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  planets: Partial<Record<PlanetId, Planet>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  intl: IntlShape
) {
  if (!agenda) {
    return [];
  }
  const abstain = {
    id: "Abstain",
    name: intl.formatMessage({
      id: "LaXLjN",
      defaultMessage: "Abstain",
      description: "Outcome choosing not to vote.",
    }),
  };
  switch (agenda.elect) {
    case "For/Against":
      return [
        {
          id: "For",
          name: intl.formatMessage({
            id: "ymJxS0",
            defaultMessage: "For",
            description: "Outcome choosing to pass a law.",
          }),
        },
        {
          id: "Against",
          name: intl.formatMessage({
            id: "SOC2Bh",
            defaultMessage: "Against",
            description: "Outcome choosing to vote down a law.",
          }),
        },
        abstain,
      ];
    case "Player":
      return [
        ...Object.values(factions).map((faction) => {
          return { id: faction.id, name: faction.name };
        }),
        abstain,
      ];
    case "Strategy Card":
      return [
        ...Object.values(strategyCards).map((card) => {
          return { id: card.id, name: card.name };
        }),
        abstain,
      ];
    case "Planet":
      const ownedPlanetNames = Object.values(planets)
        .filter((planet) => !!planet.owner)
        .filter(
          (planet) =>
            !planet.attributes.includes("ocean") &&
            !planet.attributes.includes("space-station")
        )
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...ownedPlanetNames, abstain];
    case "Cultural Planet":
      const culturalPlanets = Object.values(planets)
        .filter((planet) => planet.types.includes("CULTURAL"))
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...culturalPlanets, abstain];
    case "Hazardous Planet":
      const hazardousPlanets = Object.values(planets)
        .filter((planet) => planet.types.includes("HAZARDOUS"))
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...hazardousPlanets, abstain];
    case "Industrial Planet":
      const industrialPlanets = Object.values(planets)
        .filter((planet) => planet.types.includes("INDUSTRIAL"))
        .filter((planet) => !!planet.owner)
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...industrialPlanets, abstain];
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets)
        .filter((planet) => !planet.home && planet.name !== "Mecatol Rex")
        .filter((planet) => !!planet.owner)
        .filter(
          (planet) =>
            !planet.attributes.includes("ocean") &&
            !planet.attributes.includes("space-station")
        )
        .map((planet) => {
          return { id: planet.id, name: planet.name };
        });
      return [...electablePlanets, abstain];
    case "Law":
      const passedLaws = Object.values(agendas)
        .filter((agenda) => agenda.type === "LAW" && agenda.passed)
        .map((law) => {
          return { id: law.id, name: law.name };
        });
      return [...passedLaws, abstain];
    case "Scored Secret Objective":
      const secrets = Object.values(objectives).filter((objective) => {
        return objective.type === "SECRET";
      });
      const scoredSecrets = secrets.filter((objective) => {
        return (objective.scorers ?? []).length > 0;
      });
      if (scoredSecrets.length === 0) {
        return [
          ...secrets.map((secret) => {
            return { id: secret.id, name: secret.name };
          }),
          abstain,
        ];
      }
      return [
        ...scoredSecrets.map((secret) => {
          return { id: secret.id, name: secret.name };
        }),
        abstain,
      ];
  }
  return [];
}

export function translateOutcome(
  target: Optional<string>,
  elect: Optional<OutcomeType>,
  planets: Partial<Record<PlanetId, Planet>>,
  factions: Partial<Record<FactionId, Faction>>,
  objectives: Partial<Record<ObjectiveId, Objective>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  strategyCards: Partial<Record<StrategyCardId, StrategyCard>>,
  intl: IntlShape
) {
  if (!target || !elect) {
    return undefined;
  }
  let displayText = target;
  switch (elect) {
    case "Cultural Planet":
    case "Hazardous Planet":
    case "Industrial Planet":
    case "Non-Home Planet Other Than Mecatol Rex":
    case "Planet":
      const planet = planets[target as PlanetId];
      if (!planet) {
        break;
      }
      displayText = planet.name;
      break;
    case "Player":
      const faction = factions[target as FactionId];
      displayText = getFactionName(faction);
      break;
    case "Scored Secret Objective":
      const objective = objectives[target as ObjectiveId];
      if (!objective) {
        break;
      }
      displayText = objective.name;
      break;
    case "Law":
      const agenda = agendas[target as AgendaId];
      if (!agenda) {
        break;
      }
      displayText = agenda.name;
      break;
    case "Strategy Card":
      const card = strategyCards[target as StrategyCardId];
      if (!card) {
        break;
      }
      displayText = card.name;
      break;
    case "For/Against":
      if (target === "For") {
        displayText = intl.formatMessage({
          id: "ymJxS0",
          defaultMessage: "For",
          description: "Outcome choosing to pass a law.",
        });
      } else {
        displayText = intl.formatMessage({
          id: "SOC2Bh",
          defaultMessage: "Against",
          description: "Outcome choosing to vote down a law.",
        });
      }
      break;
  }
  return displayText;
}

export function canFactionPredict(
  factionId: FactionId,
  currentTurn: ActionLog
) {
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  return !politicalSecrets.includes(factionId);
}

export function canFactionVote(
  faction: Faction,
  agendas: Partial<Record<AgendaId, Agenda>>,
  state: GameState,
  currentTurn: ActionLog,
  leaders: Partial<Record<LeaderId, Leader>>
) {
  if (faction.id === "Nekro Virus") {
    return false;
  }
  const hasXxchaCommander = leaders["Elder Qanoj"]?.state === "readied";
  if (faction.id === "Xxcha Kingdom" && faction && hasXxchaCommander) {
    return true;
  }
  const politicalSecrets = getPromissoryTargets(
    currentTurn,
    "Political Secret"
  );
  if (politicalSecrets.includes(faction.id)) {
    return false;
  }
  const assassinatedRep = getActionCardTargets(
    currentTurn,
    "Assassinate Representative"
  )[0];
  if (assassinatedRep === faction.id) {
    return false;
  }
  const riders = getPlayedRiders(currentTurn);
  for (const rider of riders) {
    if (rider.faction === faction.id) {
      return false;
    }
  }
  const publicExecution = agendas["Public Execution"];
  if (
    publicExecution &&
    publicExecution.resolved &&
    publicExecution.target === faction.id &&
    publicExecution.activeRound === state.round
  ) {
    return false;
  }
  return true;
}

export function computeRemainingVotes(
  factionId: FactionId,
  factions: Partial<Record<FactionId, Faction>>,
  planets: Partial<Record<PlanetId, Planet>>,
  attachments: Partial<Record<AttachmentId, Attachment>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  options: Options,
  state: GameState,
  currentPhasePrevious: ActionLog,
  leaders: Partial<Record<LeaderId, Leader>>,
  techs: Techs
) {
  const representativeGovernment = agendas["Representative Government"];

  if (representativeGovernment && representativeGovernment.passed) {
    return {
      influence: 0,
      extraVotes: 1,
    };
  }
  const ownedPlanets = filterToClaimedPlanets(planets, factionId);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const filteredPlanets = updatedPlanets.filter((planet) => {
    if (factionId !== state?.ancientBurialSites) {
      return true;
    }
    return (
      !planet.types.includes("CULTURAL") &&
      !planet.attributes.includes("all-types")
    );
  });

  const orderedPlanets = filteredPlanets.sort((a, b) => {
    const aRatio =
      a.resources > 0 ? a.influence / a.resources : Number.MAX_SAFE_INTEGER;
    const bRatio =
      b.resources > 0 ? b.influence / b.resources : Number.MAX_SAFE_INTEGER;
    if (aRatio !== bRatio) {
      return bRatio - aRatio;
    }
    if (a.influence !== b.influence) {
      return b.influence - a.influence;
    }
    if ((a.attributes ?? []).length !== (b.attributes ?? []).length) {
      return (a.attributes ?? []).length - (b.attributes ?? []).length;
    }
    return 0;
  });

  const faction = factions[factionId];
  if (!faction) {
    return {
      influence: 0,
      extraVotes: 0,
    };
  }

  const votesCast = getAllVotes(currentPhasePrevious)
    .filter((voteEvent) => {
      return voteEvent.faction === factionId;
    })
    .reduce((votes, voteEvent) => {
      return votes + voteEvent.votes;
    }, 0);

  let influenceNeeded = votesCast;
  let planetCount = 0;
  let remainingVotes = 0;
  const hasXxchaHero = leaders["Xxekir Grom"]?.state === "readied";
  for (const planet of orderedPlanets) {
    // Space Stations do not count for voting.
    if (planet.attributes.includes("space-station")) {
      continue;
    }
    let planetInfluence = planet.influence;
    if (factionId === "Xxcha Kingdom") {
      if (options.expansions.includes("CODEX THREE") && hasXxchaHero) {
        planetInfluence += planet.resources;
      }
    }
    if (influenceNeeded > 0 && planetInfluence <= influenceNeeded) {
      influenceNeeded -= planetInfluence;
      continue;
    }
    planetCount++;

    remainingVotes += planetInfluence;
  }

  // Player cast an invalid number of votes. Forcibly adjust.
  if (influenceNeeded > 0) {
    remainingVotes = Math.max(remainingVotes - influenceNeeded, 0);
  }

  let extraVotes = 0;
  if (factionId === "Argent Flight") {
    extraVotes += Object.keys(factions).length;
  }
  const hasXxchaCommander = leaders["Elder Qanoj"]?.state === "readied";
  if (factionId === "Xxcha Kingdom" && hasXxchaCommander) {
    extraVotes += planetCount;
  }
  const hasPredictiveIntelligence = hasTech(
    faction,
    techs["Predictive Intelligence"]
  );
  if (hasPredictiveIntelligence) {
    extraVotes += 3;
  }
  const councilPreserve = hasCouncilPreserve(factionId, planets);
  if (councilPreserve) {
    extraVotes += 5;
  }

  return {
    influence: remainingVotes,
    extraVotes: extraVotes,
  };
}

const RIDERS = [
  "Galactic Threat",
  "Leadership Rider",
  "Diplomacy Rider",
  "Politics Rider",
  "Construction Rider",
  "Trade Rider",
  "Warfare Rider",
  "Technology Rider",
  "Imperial Rider",
  "Sanction",
  "Keleres Rider",
];

interface VoteBlockProps {
  factionId: FactionId;
  agenda: Optional<Agenda>;
}

export default function VoteBlock({ factionId, agenda }: VoteBlockProps) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const [overrideVotingBlock, setOverrideVotingBlock] = useState(false);

  const intl = useIntl();

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const completeRiders = getPlayedRiders(currentTurn).filter((rider) => {
    return rider.faction === faction.id && rider.outcome;
  });

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
      style={{
        display: "grid",
        gridColumn: "span 4",
        gridTemplateColumns: "subgrid",
        rowGap: 0,
      }}
      innerStyle={{
        display: "grid",
        gridColumn: "span 4",
        gridTemplateColumns: "subgrid",
        rowGap: 0,
      }}
    >
      <div className="flexColumn" style={{ gridColumn: "span 4", gap: 0 }}>
        {completeRiders.map((rider) => {
          return (
            <div
              key={rider.rider}
              className="flexRow"
              style={{
                gap: rem(4),
                fontSize: rem(14),
              }}
            >
              {state.votingStarted || viewOnly ? (
                <div style={{ height: rem(20) }}></div>
              ) : (
                <div
                  className="icon clickable negative"
                  style={{ marginRight: 0 }}
                  onClick={() => {
                    unplayRiderAsync(gameId, rider.rider);
                  }}
                >
                  &#x2715;
                </div>
              )}
              <i>{riderString(rider.rider, intl)}</i>:{" "}
              {translateOutcome(
                rider.outcome,
                agenda?.elect,
                planets,
                factions,
                objectives,
                agendas,
                strategyCards,
                intl
              )}
            </div>
          );
        })}
      </div>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridColumn: "span 4",
          gridTemplateColumns: "subgrid",
          gap: rem(16),
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!agenda ? (
          <>
            <div></div>
            <AvailableVotes factionId={factionId} />
          </>
        ) : null}
        {agenda && !state.votingStarted ? (
          <PredictionSection factionId={factionId} agenda={agenda} />
        ) : null}
        {agenda && state.votingStarted ? (
          !canFactionVote(faction, agendas, state, currentTurn, leaders) &&
          !overrideVotingBlock ? (
            <div
              className="flexRow"
              style={{
                boxSizing: "border-box",
                width: "100%",
                gridColumn: "span 4",
                justifyContent: "space-evenly",
              }}
            >
              <FormattedMessage
                id="c4LYqr"
                description="Text informing a player that they cannot vote."
                defaultMessage="Cannot Vote"
              />
              <button
                style={{ fontSize: rem(10) }}
                onClick={() => setOverrideVotingBlock(true)}
                disabled={viewOnly}
              >
                Allow Voting
              </button>
            </div>
          ) : (
            <VotingSection factionId={factionId} agenda={agenda} />
          )
        ) : null}
      </div>
    </LabeledDiv>
  );
}

function PredictionSection({
  factionId,
  agenda,
}: {
  factionId: FactionId;
  agenda: Optional<Agenda>;
}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const playedRiders = getPlayedRiders(currentTurn);

  const pendingRider = playedRiders.filter((rider) => {
    return rider.faction === factionId && !rider.outcome;
  })[0];

  const remainingRiders = RIDERS.filter((rider) => {
    if (rider === "Keleres Rider") {
      if (factionId === "Council Keleres" || !factions["Council Keleres"]) {
        return false;
      }
    }
    const secrets = getPromissoryTargets(currentTurn, "Political Secret");
    if (rider === "Galactic Threat") {
      if (factionId !== "Nekro Virus" || secrets.includes("Nekro Virus")) {
        return false;
      }
    }
    if (
      rider === "Sanction" &&
      options &&
      !options.expansions.includes("CODEX ONE")
    ) {
      return false;
    }

    if (
      pendingRider &&
      pendingRider.rider === rider &&
      pendingRider.faction === factionId
    ) {
      return true;
    }
    for (const playedRider of playedRiders) {
      if (playedRider.rider === rider) {
        return false;
      }
    }
    return true;
  });

  const targets = getTargets(
    agenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  ).filter((target) => target.id !== "Abstain");

  if (!canFactionPredict(factionId, currentTurn)) {
    return (
      <>
        <div
          style={{
            paddingLeft: rem(4),
            fontSize: rem(14),
          }}
        >
          Cannot Predict
        </div>
        <AvailableVotes factionId={factionId} />
      </>
    );
  }

  return (
    <>
      <Selector
        hoverMenuLabel={
          <FormattedMessage
            id="jGX605"
            description="Text on hover menu for selecting a rider to play."
            defaultMessage="Play Rider"
          />
        }
        options={remainingRiders.map((rider) => {
          return { id: rider, name: riderString(rider, intl) };
        })}
        selectedItem={pendingRider?.rider}
        toggleItem={(itemId, add) => {
          if (!gameId) {
            return;
          }
          if (add) {
            playRiderAsync(gameId, itemId, factionId, undefined);
          } else {
            unplayRiderAsync(gameId, itemId);
          }
        }}
        viewOnly={viewOnly}
      />
      <AvailableVotes factionId={factionId} />{" "}
      {pendingRider && targets.length > 0 ? (
        <div style={{ gridColumn: "span 2" }}>
          <Selector
            hoverMenuLabel={
              <FormattedMessage
                id="+x4AIR"
                description="Text on a hover menu for selecting a rider target."
                defaultMessage="Pending"
              />
            }
            options={targets}
            selectedItem={undefined}
            toggleItem={(itemId, _) => {
              playRiderAsync(gameId, pendingRider.rider, factionId, itemId);
            }}
            style={{ minWidth: rem(154) }}
            viewOnly={viewOnly}
          />
        </div>
      ) : null}
    </>
  );
}

function VotingSection({
  factionId,
  agenda,
}: {
  factionId: FactionId;
  agenda: Optional<Agenda>;
}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const currentPhase = getCurrentPhaseLogEntries(actionLog);

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  function castVotesLocal(
    target: Optional<string>,
    votes: number,
    extraVotes: number
  ) {
    if (!gameId) {
      return;
    }

    if (target === "Abstain") {
      castVotesAsync(gameId, factionId, 0, 0, "Abstain");
    } else {
      castVotesAsync(gameId, factionId, votes, extraVotes, target);
    }
  }

  const targets = getTargets(
    agenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  );
  const factionVotes = getFactionVotes(currentTurn, factionId);

  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";

  let { influence } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog ?? []),
    leaders,
    techs
  );

  const mawOfWorlds = relics["Maw of Worlds"];
  if (mawOfWorlds && mawOfWorlds.owner === factionId) {
    const mawEvent: Optional<MawOfWorldsEvent> = getPlayedRelic(
      currentPhase,
      "Maw of Worlds"
    ) as Optional<MawOfWorldsEvent>;
    if (mawEvent) {
      influence = 0;
    }
  }
  let castExtraVotes = factionVotes?.extraVotes ?? 0;
  const usingPredictive = getActionCardTargets(
    currentTurn,
    "Predictive Intelligence"
  ) as FactionId[];
  const currentCouncilor = getActionCardTargets(
    currentTurn,
    "Distinguished Councilor"
  )[0] as Optional<FactionId>;
  // Technically not an action card, but easiest to use as this.
  const councilPreservePlayer = getActionCardTargets(
    currentTurn,
    "Council Preserve"
  )[0] as Optional<FactionId>;
  const bloodPactUser = getPromissoryTargets(
    currentTurn,
    "Blood Pact"
  )[0] as Optional<FactionId>;
  if (factionId === bloodPactUser) {
    castExtraVotes += 4;
  }
  if (factionId === currentCouncilor) {
    castExtraVotes += 5;
  }
  if (factionId === councilPreservePlayer) {
    castExtraVotes += 5;
  }
  if (usingPredictive.includes(factionId)) {
    castExtraVotes += 3;
  }
  switch (factionId) {
    case "Argent Flight":
      if (factionVotes && factionVotes.votes > 0) {
        castExtraVotes += Object.keys(factions).length;
      }
      break;
  }

  return (
    <>
      <div className="flexRow" style={{ justifyContent: "flex-start" }}>
        {state.votingStarted && targets.length > 0 ? (
          <Selector
            hoverMenuLabel={
              <FormattedMessage
                id="cHsAYk"
                description="Text on hover menu for selecting voting outcome."
                defaultMessage="Select Outcome"
              />
            }
            options={targets}
            selectedItem={factionVotes?.target}
            toggleItem={(itemId, add) => {
              if (add) {
                castVotesLocal(itemId, 0, 0);
              } else {
                castVotesLocal(undefined, 0, 0);
              }
            }}
            style={{ minWidth: rem(154) }}
            viewOnly={viewOnly}
          />
        ) : null}
      </div>
      <AvailableVotes factionId={factionId} />
      {hasVotableTarget ? (
        <NumberInput
          value={factionVotes.votes}
          maxValue={99}
          softMax={influence}
          minValue={0}
          onChange={(votes) => {
            castVotesLocal(factionVotes.target, votes, factionVotes.extraVotes);
          }}
          viewOnly={viewOnly}
        />
      ) : null}
      {hasVotableTarget && factionVotes.votes > 0 ? (
        <ClientOnlyHoverMenu
          label={castExtraVotes === 0 ? "-" : `+${castExtraVotes}`}
          buttonStyle={{ minWidth: rem(48) }}
        >
          <div
            className="flexColumn"
            style={{
              padding: rem(4),
              fontSize: rem(16),
              alignItems: "flex-start",
            }}
          >
            {factionId === "Argent Flight"
              ? `+${
                  factionVotes.votes > 0 ? Object.keys(factions).length : 0
                } votes from Zeal`
              : null}
            {canUseBloodPact(currentTurn, factionId) ? (
              <Toggle
                selected={bloodPactUser === factionId}
                toggleFn={() => {
                  if (bloodPactUser === factionId) {
                    unplayPromissoryNoteAsync(gameId, "Blood Pact", factionId);
                  } else {
                    playPromissoryNoteAsync(gameId, "Blood Pact", factionId);
                  }
                }}
                disabled={viewOnly}
              >
                <FormattedMessage
                  id="Components.Blood Pact.Title"
                  description="Title of Component: Blood Pact"
                  defaultMessage="Blood Pact"
                />
              </Toggle>
            ) : null}
            {hasTech(faction, techs["Predictive Intelligence"]) ? (
              <button
                className={
                  usingPredictive.includes(factionId) ? "selected" : ""
                }
                style={{ fontSize: rem(14) }}
                onClick={() => {
                  if (usingPredictive.includes(factionId)) {
                    unplayActionCardAsync(
                      gameId,
                      "Predictive Intelligence",
                      factionId
                    );
                  } else {
                    playActionCardAsync(
                      gameId,
                      "Predictive Intelligence",
                      factionId
                    );
                  }
                }}
                disabled={viewOnly}
              >
                <FormattedMessage
                  id="Techs.Predictive Intelligence.Title"
                  description="Title of Tech: Predictive Intelligence"
                  defaultMessage="Predictive Intelligence"
                />
              </button>
            ) : null}
            {hasCouncilPreserve(factionId, planets) ? (
              <span style={{ fontFamily: "Myriad Pro" }}>
                <Toggle
                  selected={councilPreservePlayer === factionId}
                  toggleFn={() => {
                    if (councilPreservePlayer === factionId) {
                      unplayActionCardAsync(
                        gameId,
                        "Council Preserve",
                        factionId
                      );
                    } else {
                      playActionCardAsync(
                        gameId,
                        "Council Preserve",
                        factionId
                      );
                    }
                  }}
                  disabled={viewOnly}
                >
                  <FormattedMessage
                    id="Attachments.Council Preserve.Title"
                    description="Title for Attachment: Council Preserve"
                    defaultMessage="Council Preserve"
                  />
                </Toggle>
              </span>
            ) : null}
            <span style={{ fontSize: rem(14), fontFamily: "Myriad Pro" }}>
              <Toggle
                disabled={
                  viewOnly ||
                  (currentCouncilor && currentCouncilor !== factionId)
                }
                selected={currentCouncilor === factionId}
                toggleFn={(_) => {
                  if (currentCouncilor === factionId) {
                    unplayActionCardAsync(
                      gameId,
                      "Distinguished Councilor",
                      factionId
                    );
                  } else {
                    playActionCardAsync(
                      gameId,
                      "Distinguished Councilor",
                      factionId
                    );
                  }
                }}
              >
                <FormattedMessage
                  id="Components.Distinguished Councilor.Title"
                  description="Title of Component: Distinguished Councilor"
                  defaultMessage="Distinguished Councilor"
                />
              </Toggle>
            </span>
            {hasVotableTarget ? (
              <div
                className="flexRow"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <FormattedMessage
                  id="sgqLYB"
                  defaultMessage="Other"
                  description="Text on a button used to select a non-listed value"
                />
                <NumberInput
                  value={factionVotes.extraVotes}
                  maxValue={99}
                  minValue={0}
                  onChange={(votes) => {
                    castVotesLocal(
                      factionVotes.target,
                      factionVotes.votes,
                      votes
                    );
                  }}
                  viewOnly={viewOnly}
                />
              </div>
            ) : null}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
    </>
  );
}

interface AvailableVotesStyle extends CSSProperties {
  "--width": string;
  "--height": string;
}

function AvailableVotes({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const currentPhase = getCurrentPhaseLogEntries(actionLog);
  const agendas = useAgendas();
  const attachments = useAttachments();
  const factions = useFactions();
  const leaders = useLeaders();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const state = useGameState();
  const techs = useTechs();

  let { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog),
    leaders,
    techs
  );
  const mawOfWorlds = relics["Maw of Worlds"];
  if (mawOfWorlds && mawOfWorlds.owner === factionId) {
    const mawEvent: Optional<MawOfWorldsEvent> = getPlayedRelic(
      currentPhase,
      "Maw of Worlds"
    ) as Optional<MawOfWorldsEvent>;
    if (mawEvent) {
      influence = 0;
    }
  }

  const hasHacanCommander =
    factionId === "Emirates of Hacan" &&
    leaders["Gila the Silvertongue"]?.state === "readied";

  const availableVotesStyle: AvailableVotesStyle = {
    "--height": rem(35),
    "--width": rem(28),
  };

  return (
    <div className={styles.AvailableVotes} style={availableVotesStyle}>
      <div className={styles.InfluenceIcon}>
        <InfluenceSVG influence={influence} />
      </div>
      <div className="flexRow" style={{ gap: 0 }}>
        {hasHacanCommander ? (
          <>
            +{" "}
            <div
              className="flexColumn"
              style={{
                gap: 0,
                paddingLeft: rem(4),
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {extraVotes}
              <div className="flexRow" style={{ gap: rem(2) }}>
                2x
                <div
                  style={{
                    width: rem(14),
                    height: rem(15),
                    position: "relative",
                  }}
                >
                  <TradeGoodSVG />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>+ {extraVotes}</>
        )}
      </div>
    </div>
  );
}
