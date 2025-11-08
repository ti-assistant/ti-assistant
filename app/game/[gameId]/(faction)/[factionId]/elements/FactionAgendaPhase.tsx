import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../../../../../../src/AgendaRow";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import {
  canFactionVote,
  computeRemainingVotes,
  getTargets,
} from "../../../../../../src/components/VoteBlock/VoteBlock";
import {
  useActionLog,
  useAgendas,
  useAttachments,
  useCurrentTurn,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useStrategyCards,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import { useGameState } from "../../../../../../src/context/stateDataHooks";
import {
  castVotesAsync,
  hideAgendaAsync,
  resolveAgendaAsync,
  revealAgendaAsync,
  selectEligibleOutcomesAsync,
  speakerTieBreakAsync,
} from "../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import InfluenceSVG from "../../../../../../src/icons/planets/Influence";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import {
  getActiveAgenda,
  getFactionVotes,
  getSelectedEligibleOutcomes,
  getSpeakerTieBreak,
} from "../../../../../../src/util/actionLog";
import { getCurrentPhasePreviousLogEntries } from "../../../../../../src/util/api/actionLog";
import { Optional } from "../../../../../../src/util/types/types";
import { rem } from "../../../../../../src/util/util";
import { computeVotes } from "../../../main/@phase/agenda/AgendaPhase";
import styles from "../faction-page.module.scss";

export default function FactionAgendaPhase({
  factionId,
}: {
  factionId: FactionId;
}) {
  const actionLog = useActionLog();
  const agendas = useAgendas();
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const leaders = useLeaders();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const techs = useTechs();
  const viewOnly = useViewOnly();
  const voteRef = useRef<HTMLDivElement>(null);

  function saveCastVotes(element: HTMLDivElement) {
    if (element.innerText !== "") {
      const numerical = parseInt(element.innerText);
      if (!isNaN(numerical)) {
        castVotesAsync(
          gameId,
          factionId,
          numerical,
          factionVotes?.extraVotes ?? 0,
          factionVotes?.target
        );
        element.innerText = numerical.toString();
      }
    }
    element.innerText = factionVotes?.votes?.toString() ?? "0";
  }

  async function completeAgenda() {
    const tieBreak = getSpeakerTieBreak(currentTurn);
    const target = tieBreak ? tieBreak : selectedTargets[0];
    if (!target || !currentAgenda) {
      return;
    }
    resolveAgendaAsync(gameId, currentAgenda?.id, target);
  }

  let currentAgenda: Optional<Agenda>;
  const activeAgenda = getActiveAgenda(currentTurn);
  if (activeAgenda) {
    currentAgenda = agendas[activeAgenda];
  }

  if (!currentAgenda) {
    const orderedAgendas = Object.values(agendas ?? {}).sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      return 1;
    });
    return (
      <LabeledDiv
        label={
          <FormattedMessage
            id="5R8kPv"
            description="Label for a section for actions by the speaker."
            defaultMessage="Speaker Actions"
          />
        }
        innerStyle={{ paddingTop: rem(12) }}
      >
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="ZAYAbS"
              description="Instruction telling the speaker to reveal an agenda."
              defaultMessage="Reveal and Read one Agenda"
            />
          }
        >
          <div
            className="flexRow"
            style={{
              maxWidth: "85vw",
              gap: rem(4),
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: "repeat(8, auto)",
              whiteSpace: "nowrap",
              padding: rem(8),
              alignItems: "stretch",
              justifyContent: "flex-start",
              overflowX: "auto",
            }}
          >
            {orderedAgendas.map((agenda) => {
              return (
                <button
                  key={agenda.id}
                  style={{ writingMode: "horizontal-tb" }}
                  onClick={() => revealAgendaAsync(gameId, agenda.id)}
                  disabled={viewOnly}
                >
                  {agenda.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      </LabeledDiv>
    );
  }

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }
  const factionVotes = getFactionVotes(currentTurn, factionId);

  const localAgenda = structuredClone(currentAgenda);
  const eligibleOutcomes = getSelectedEligibleOutcomes(currentTurn);
  if (localAgenda && eligibleOutcomes && eligibleOutcomes !== "None") {
    localAgenda.elect = eligibleOutcomes;
  }
  const targets = getTargets(
    localAgenda,
    factions,
    strategyCards,
    planets,
    agendas,
    objectives,
    intl
  );
  const totalVotes = computeVotes(
    currentAgenda,
    currentTurn,
    Object.keys(factions).length
  );
  const maxVotes = Object.values(totalVotes).reduce((maxVotes, voteCount) => {
    return Math.max(maxVotes, voteCount);
  }, 0);
  const selectedTargets = Object.entries(totalVotes)
    .filter(([_, voteCount]) => {
      return voteCount === maxVotes;
    })
    .map(([target, _]) => {
      return target;
    });
  const isTie = selectedTargets.length !== 1;

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
  const agendaNum = state.agendaNum ?? 1;
  if (agendaNum > 2) {
    return null;
  }
  const tieBreak = getSpeakerTieBreak(currentTurn);
  const outcomes = new Set<OutcomeType>();
  Object.values(agendas ?? {}).forEach((agenda) => {
    if (agenda.target || agenda.elect === "???") return;
    outcomes.add(agenda.elect);
  });
  const label = agendaNum === 1 ? "FIRST AGENDA" : "SECOND AGENDA";
  const hasVotableTarget =
    !!factionVotes?.target && factionVotes?.target !== "Abstain";
  const items = Math.min((targets ?? []).length, 12);

  return (
    <>
      <div className="largeFont" style={{ width: "100%" }}>
        <LabeledDiv label={label}>
          <AgendaRow
            agenda={currentAgenda}
            removeAgenda={() => {
              if (!currentAgenda) {
                return;
              }
              hideAgendaAsync(gameId, currentAgenda.id);
            }}
          />
        </LabeledDiv>
      </div>
      {currentAgenda.id === "Covert Legislation" ? (
        eligibleOutcomes ? (
          <LabeledDiv
            label={
              <FormattedMessage
                id="+BcBcX"
                description="Label for a section showing the eligible outcomes."
                defaultMessage="Eligible Outcomes"
              />
            }
            innerStyle={{ paddingTop: rem(8) }}
          >
            <SelectableRow
              itemId={eligibleOutcomes}
              removeItem={() => selectEligibleOutcomesAsync(gameId, "None")}
              viewOnly={viewOnly}
            >
              <div style={{ display: "flex", fontSize: rem(18) }}>
                {eligibleOutcomes}
              </div>
            </SelectableRow>
          </LabeledDiv>
        ) : (
          <LabeledDiv
            label={
              <FormattedMessage
                id="5R8kPv"
                description="Label for a section for actions by the speaker."
                defaultMessage="Speaker Actions"
              />
            }
            style={{ marginTop: rem(4) }}
            innerStyle={{ paddingTop: rem(12) }}
          >
            <ClientOnlyHoverMenu
              label={
                <FormattedMessage
                  id="cKaLW8"
                  description="Text on a hover menu for revealing eligible outcomes."
                  defaultMessage="Reveal Eligible Outcomes"
                />
              }
            >
              <div
                className="flexColumn"
                style={{
                  padding: rem(8),
                  gap: rem(4),
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                }}
              >
                {Array.from(outcomes).map((outcome) => {
                  return (
                    <button
                      key={outcome}
                      onClick={() =>
                        selectEligibleOutcomesAsync(gameId, outcome)
                      }
                      disabled={viewOnly}
                    >
                      {outcome}
                    </button>
                  );
                })}
              </div>
            </ClientOnlyHoverMenu>
          </LabeledDiv>
        )
      ) : null}
      <div
        className="flexColumn"
        style={{ alignItems: "stretch", width: "100%" }}
      >
        <LabeledLine leftLabel={`Vote on ${currentAgenda.name}`} />
        {!canFactionVote(faction, agendas, state, currentTurn, leaders) ? (
          <div className="flexRow">
            <FormattedMessage
              id="c4LYqr"
              description="Text informing a player that they cannot vote."
              defaultMessage="Cannot Vote"
            />
          </div>
        ) : (
          <React.Fragment>
            <div
              className="flexColumn"
              style={{
                paddingLeft: rem(8),
                width: "100%",
                alignItems: "flex-start",
              }}
            >
              <Selector
                hoverMenuLabel={
                  <FormattedMessage
                    id="cHsAYk"
                    description="Text on hover menu for selecting voting outcome."
                    defaultMessage="Select Outcome"
                  />
                }
                selectedLabel="Selected Outcome"
                options={targets}
                selectedItem={factionVotes?.target}
                toggleItem={(itemId, add) => {
                  if (add) {
                    castVotesAsync(gameId, factionId, 0, 0, itemId);
                  } else {
                    castVotesAsync(gameId, factionId, 0, 0, undefined);
                  }
                }}
              />
              <div
                className="flexRow"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                Available Votes:
                <div className={styles.VotingBlock}>
                  <div className={styles.InfluenceSymbol}>
                    <InfluenceSVG influence={influence} />
                  </div>

                  <div style={{ fontSize: rem(16) }}>+ {extraVotes}</div>
                </div>
              </div>
              <div
                className="flexRow"
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                Cast Votes:
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "flex-start",
                    flexShrink: 0,
                    gap: rem(12),
                    fontSize: rem(24),
                    paddingLeft: rem(12),
                  }}
                >
                  {factionVotes?.votes ?? 0 > 0 ? (
                    <div
                      className="arrowDown"
                      onClick={() =>
                        castVotesAsync(
                          gameId,
                          factionId,
                          (factionVotes?.votes ?? 0) - 1,
                          factionVotes?.extraVotes ?? 0,
                          factionVotes?.target
                        )
                      }
                    ></div>
                  ) : (
                    <div style={{ width: rem(12) }}></div>
                  )}
                  <div
                    className="flexRow"
                    ref={voteRef}
                    contentEditable={hasVotableTarget}
                    suppressContentEditableWarning={true}
                    onClick={(e) => {
                      if (!hasVotableTarget) {
                        return;
                      }
                      e.currentTarget.innerText = "";
                    }}
                    onBlur={(e) => saveCastVotes(e.currentTarget)}
                    style={{ width: rem(32) }}
                  >
                    {factionVotes?.votes ?? 0}
                  </div>
                  {factionVotes?.target &&
                  factionVotes?.target !== "Abstain" ? (
                    <div
                      className="arrowUp"
                      onClick={() =>
                        castVotesAsync(
                          gameId,
                          factionId,
                          (factionVotes?.votes ?? 0) + 1,
                          factionVotes?.extraVotes ?? 0,
                          factionVotes?.target
                        )
                      }
                    ></div>
                  ) : null}
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        <LabeledLine />
        {isTie ? (
          !tieBreak ? (
            <LabeledDiv
              label={
                <FormattedMessage
                  id="5R8kPv"
                  description="Label for a section for actions by the speaker."
                  defaultMessage="Speaker Actions"
                />
              }
              innerStyle={{ paddingTop: rem(12) }}
            >
              <ClientOnlyHoverMenu
                label={
                  <FormattedMessage
                    id="Kzzn9t"
                    description="Text on a hover menu for the speaker choosing the outcome."
                    defaultMessage="Choose outcome if tied"
                  />
                }
              >
                <div
                  className="flexRow"
                  style={{
                    maxWidth: "85vw",
                    gap: rem(4),
                    whiteSpace: "nowrap",
                    padding: rem(8),
                    alignItems: "stretch",
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateRows: `repeat(${items}, auto)`,
                    justifyContent: "flex-start",
                    overflowX: "auto",
                  }}
                >
                  {selectedTargets.length > 0
                    ? selectedTargets.map((target) => {
                        return (
                          <button
                            key={target}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() => speakerTieBreakAsync(gameId, target)}
                            disabled={viewOnly}
                          >
                            {target}
                          </button>
                        );
                      })
                    : targets.map((target) => {
                        if (target.id === "Abstain") {
                          return null;
                        }
                        return (
                          <button
                            key={target.id}
                            style={{ writingMode: "horizontal-tb" }}
                            onClick={() =>
                              speakerTieBreakAsync(gameId, target.id)
                            }
                            disabled={viewOnly}
                          >
                            {target.name}
                          </button>
                        );
                      })}
                </div>
              </ClientOnlyHoverMenu>
            </LabeledDiv>
          ) : (
            <LabeledDiv
              label="SPEAKER TIE BREAK"
              innerStyle={{ paddingTop: rem(8) }}
            >
              <SelectableRow
                itemId={tieBreak}
                removeItem={() => speakerTieBreakAsync(gameId, "None")}
                viewOnly={viewOnly}
              >
                {tieBreak}
              </SelectableRow>
            </LabeledDiv>
          )
        ) : null}
        {selectedTargets.length === 1 || tieBreak ? (
          <div
            className="flexRow"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <button onClick={completeAgenda} disabled={viewOnly}>
              Resolve with target:{" "}
              {selectedTargets.length === 1 ? selectedTargets[0] : tieBreak}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
