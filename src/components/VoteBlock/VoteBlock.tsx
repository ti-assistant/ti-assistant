import { useRouter } from "next/router";
import React, { CSSProperties, useContext, useRef, useState } from "react";
import {
  ActionLogContext,
  AgendaContext,
  AttachmentContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  StateContext,
  StrategyCardContext,
} from "../../context/Context";
import { Selector } from "../../Selector";
import {
  castVotesAsync,
  playActionCardAsync,
  playRiderAsync,
  setSpeakerAsync,
  unplayActionCardAsync,
  unplayRiderAsync,
} from "../../dynamic/api";
import {
  getPromissoryTargets,
  getActionCardTargets,
  getPlayedRiders,
  getAllVotes,
  getFactionVotes,
} from "../../util/actionLog";
import {
  getCurrentPhasePreviousLogEntries,
  getCurrentTurnLogEntries,
} from "../../util/api/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionName, getFactionColor } from "../../util/factions";
import {
  filterToClaimedPlanets,
  applyAllPlanetAttachments,
} from "../../util/planets";
import { responsivePixels } from "../../util/util";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import NumberInput from "../NumberInput/NumberInput";
import styles from "./VoteBlock.module.scss";

export function getTargets(
  agenda: Agenda | undefined,
  factions: Partial<Record<FactionId, Faction>>,
  strategycards: Partial<Record<StrategyCardId, StrategyCard>>,
  planets: Partial<Record<PlanetId, Planet>>,
  agendas: Partial<Record<AgendaId, Agenda>>,
  objectives: Partial<Record<ObjectiveId, Objective>>
) {
  if (!agenda) {
    return [];
  }
  switch (agenda.elect) {
    case "For/Against":
      return ["For", "Against", "Abstain"];
    case "Player":
      return [
        ...Object.values(factions).map((faction) => {
          return faction.id;
        }),
        "Abstain",
      ];
    case "Strategy Card":
      return [...Object.keys(strategycards), "Abstain"];
    case "Planet":
      const ownedPlanetNames = Object.values(planets)
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...ownedPlanetNames, "Abstain"];
    case "Cultural Planet":
      const culturalPlanets = Object.values(planets)
        .filter((planet) => planet.type === "CULTURAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...culturalPlanets, "Abstain"];
    case "Hazardous Planet":
      const hazardousPlanets = Object.values(planets)
        .filter((planet) => planet.type === "HAZARDOUS")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...hazardousPlanets, "Abstain"];
    case "Industrial Planet":
      const industrialPlanets = Object.values(planets)
        .filter((planet) => planet.type === "INDUSTRIAL")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...industrialPlanets, "Abstain"];
    case "Non-Home Planet Other Than Mecatol Rex":
      const electablePlanets = Object.values(planets)
        .filter((planet) => !planet.home && planet.name !== "Mecatol Rex")
        .filter((planet) => !!planet.owner)
        .map((planet) => planet.name);
      return [...electablePlanets, "Abstain"];
    case "Law":
      const passedLaws = Object.values(agendas)
        .filter((agenda) => agenda.type === "LAW" && agenda.passed)
        .map((law) => law.name);
      return [...passedLaws, "Abstain"];
    case "Scored Secret Objective":
      const secrets = Object.values(objectives).filter((objective) => {
        return objective.type === "SECRET";
      });
      const scoredSecrets = secrets.filter((objective) => {
        return (objective.scorers ?? []).length > 0;
      });
      if (scoredSecrets.length === 0) {
        return [...secrets.map((secret) => secret.name), "Abstain"];
      }
      return [...scoredSecrets.map((secret) => secret.name), "Abstain"];
  }
  return [];
}

export function canFactionPredict(
  factionId: FactionId,
  currentTurn: ActionLogEntry[]
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
  currentTurn: ActionLogEntry[]
) {
  if (faction.id === "Nekro Virus") {
    return false;
  }
  if (
    faction.id === "Xxcha Kingdom" &&
    faction &&
    faction.commander === "readied"
  ) {
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
  currentPhasePrevious: ActionLogEntry[]
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
      planet.type !== "CULTURAL" && !planet.attributes.includes("all-types")
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
  for (const planet of orderedPlanets) {
    let planetInfluence = planet.influence;
    if (factionId === "Xxcha Kingdom") {
      if (
        options.expansions.includes("CODEX THREE") &&
        faction.hero === "readied"
      ) {
        planetInfluence += planet.resources;
      }
      if (faction.commander === "readied") {
        planetInfluence += 1;
      }
    }
    if (influenceNeeded > 0 && planetInfluence <= influenceNeeded) {
      influenceNeeded -= planetInfluence;
      continue;
    }
    if (factionId === "Xxcha Kingdom" && faction.commander === "readied") {
      planetInfluence -= 1;
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
  if (factionId === "Xxcha Kingdom" && faction.commander === "readied") {
    extraVotes += planetCount;
  }
  const hasPredictiveIntelligence = hasTech(faction, "Predictive Intelligence");
  if (hasPredictiveIntelligence) {
    extraVotes += 3;
  }

  return {
    influence: remainingVotes,
    extraVotes: extraVotes,
  };
}

function ExtraVotes({ factionId }: { factionId: FactionId }) {
  const actionLog = useContext(ActionLogContext);
  const factions = useContext(FactionContext);

  const faction = factions[factionId];

  const hasCommander = faction?.commander === "readied";

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const factionVotes = getFactionVotes(currentTurn, factionId);
  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";

  return (
    <div className="flexColumn" style={{ padding: responsivePixels(4) }}>
      {factionId === "Council Keleres" &&
      factionVotes?.votes &&
      factionVotes.votes > 0
        ? `+${Object.keys(factions).length} votes from Zeal`
        : null}
      {factionId === "Xxcha Kingdom" && hasCommander
        ? `+${0} votes from Elder Qanoj`
        : null}
      <button>Distinguished Councilor</button>
    </div>
  );
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
  agenda: Agenda | undefined;
}

export default function VoteBlock({ factionId, agenda }: VoteBlockProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);

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
      noBlur
      style={{
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
              className="flexRow"
              style={{
                gap: responsivePixels(4),
                fontSize: responsivePixels(14),
              }}
            >
              {state.votingStarted ? (
                <div style={{ height: responsivePixels(20) }}></div>
              ) : (
                <div
                  className="icon clickable negative"
                  style={{ marginRight: 0 }}
                  onClick={() => {
                    if (!gameid) {
                      return;
                    }
                    unplayRiderAsync(gameid, rider.rider);
                  }}
                >
                  &#x2715;
                </div>
              )}
              <i>{rider.rider}</i>: {rider.outcome}
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
          gap: responsivePixels(16),
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
          !canFactionVote(faction, agendas, state, currentTurn) ? (
            completeRiders.length > 0 ? null : (
              <div
                className="flexRow"
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  gridColumn: "span 4",
                }}
              >
                Cannot Vote
              </div>
            )
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
  agenda: Agenda | undefined;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const strategycards = useContext(StrategyCardContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog ?? []);

  const playedRiders = getPlayedRiders(currentTurn);

  const pendingRider = playedRiders.filter((rider) => {
    return rider.faction === factionId && !rider.outcome;
  })[0];

  const remainingRiders = RIDERS.filter((rider) => {
    if (rider === "Keleres Rider" && factions && !factions["Council Keleres"]) {
      return false;
    }
    if (rider === "Galactic Threat" && factions && !factions["Nekro Virus"]) {
      return false;
    }
    const secrets = getPromissoryTargets(currentTurn, "Political Secret");
    if (rider === "Galactic Threat" && secrets.includes("Nekro Virus")) {
      return false;
    }
    if (
      rider === "Sanction" &&
      options &&
      !options.expansions.includes("CODEX ONE")
    ) {
      return false;
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
    strategycards,
    planets ?? {},
    agendas ?? {},
    objectives ?? {}
  ).filter((target) => target !== "Abstain");

  if (!canFactionPredict(factionId, currentTurn)) {
    return (
      <>
        <div
          style={{
            paddingLeft: responsivePixels(4),
            fontSize: responsivePixels(14),
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
        hoverMenuLabel="Play Rider"
        options={remainingRiders}
        selectedItem={pendingRider?.rider}
        toggleItem={(itemId, add) => {
          if (!gameid) {
            return;
          }
          if (add) {
            playRiderAsync(gameid, itemId, factionId, undefined);
          } else {
            unplayRiderAsync(gameid, itemId);
          }
        }}
      />
      <AvailableVotes factionId={factionId} />{" "}
      {pendingRider && targets.length > 0 ? (
        <div style={{ gridColumn: "span 2" }}>
          <Selector
            hoverMenuLabel="Prediction"
            options={targets}
            selectedItem={undefined}
            toggleItem={(itemId, add) => {
              if (!gameid) {
                return;
              }
              playRiderAsync(gameid, pendingRider.rider, factionId, itemId);
            }}
            style={{ minWidth: responsivePixels(154) }}
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
  agenda: Agenda | undefined;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const strategycards = useContext(StrategyCardContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  function castVotesLocal(target: string | undefined, votes: number) {
    if (!gameid) {
      return;
    }

    if (target === "Abstain") {
      castVotesAsync(gameid, factionId, 0, "Abstain");
    } else {
      castVotesAsync(gameid, factionId, votes, target);
    }
  }

  const targets = getTargets(
    agenda,
    factions,
    strategycards,
    planets ?? {},
    agendas ?? {},
    objectives ?? {}
  );
  const factionVotes = getFactionVotes(currentTurn, factionId);

  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";

  const { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog ?? [])
  );
  let castExtraVotes = 0;
  const usingPredictive = getActionCardTargets(
    currentTurn,
    "Predictive Intelligence"
  ) as FactionId[];
  const currentCouncilor = getActionCardTargets(
    currentTurn,
    "Distinguished Councilor"
  )[0] as FactionId | undefined;
  if (factionId === currentCouncilor) {
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
            hoverMenuLabel="Select Outcome"
            options={targets}
            selectedItem={factionVotes?.target}
            toggleItem={(itemId, add) => {
              if (add) {
                castVotesLocal(itemId, 0);
              } else {
                castVotesLocal(undefined, 0);
              }
            }}
            style={{ minWidth: responsivePixels(154) }}
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
            castVotesLocal(factionVotes.target, votes);
          }}
        />
      ) : null}
      {hasVotableTarget && factionVotes.votes > 0 ? (
        <ClientOnlyHoverMenu
          label={castExtraVotes === 0 ? "-" : `+${castExtraVotes}`}
          buttonStyle={{ minWidth: responsivePixels(48) }}
        >
          <div
            className="flexColumn"
            style={{
              padding: responsivePixels(4),
              fontSize: responsivePixels(16),
              alignItems: "flex-start",
            }}
          >
            {factionId === "Argent Flight"
              ? `+${
                  factionVotes.votes > 0 ? Object.keys(factions).length : 0
                } votes from Zeal`
              : null}
            {factionId === "Xxcha Kingdom" && faction?.commander === "readied"
              ? `+? votes from Elder Qanoj`
              : null}
            {factionId === "Emirates of Hacan" &&
            faction?.commander === "readied"
              ? `+0 votes from Gila the Silvertongue`
              : null}
            {hasTech(faction, "Predictive Intelligence") ? (
              <button
                className={
                  usingPredictive.includes(factionId) ? "selected" : ""
                }
                style={{ fontSize: responsivePixels(14) }}
                onClick={() => {
                  if (!gameid) {
                    return;
                  }
                  if (usingPredictive.includes(factionId)) {
                    unplayActionCardAsync(
                      gameid,
                      "Predictive Intelligence",
                      factionId
                    );
                  } else {
                    playActionCardAsync(
                      gameid,
                      "Predictive Intelligence",
                      factionId
                    );
                  }
                }}
              >
                Predictive Intelligence
              </button>
            ) : null}
            <button
              disabled={currentCouncilor && currentCouncilor !== factionId}
              className={currentCouncilor === factionId ? "selected" : ""}
              style={{ fontSize: responsivePixels(14) }}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                if (currentCouncilor === factionId) {
                  unplayActionCardAsync(
                    gameid,
                    "Distinguished Councilor",
                    factionId
                  );
                } else {
                  playActionCardAsync(
                    gameid,
                    "Distinguished Councilor",
                    factionId
                  );
                }
              }}
            >
              Distinguished Councilor
            </button>
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
  const actionLog = useContext(ActionLogContext);
  const agendas = useContext(AgendaContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);

  const { influence, extraVotes } = computeRemainingVotes(
    factionId,
    factions,
    planets,
    attachments,
    agendas,
    options,
    state,
    getCurrentPhasePreviousLogEntries(actionLog)
  );

  const availableVotesStyle: AvailableVotesStyle = {
    "--height": responsivePixels(35),
    "--width": responsivePixels(28),
  };

  return (
    <div className={styles.AvailableVotes} style={availableVotesStyle}>
      <div className={styles.InfluenceIcon}>&#x2B21;</div>
      <div className={styles.InfluenceText}>{influence}</div>
      <div>+ {extraVotes}</div>
    </div>
  );
}
