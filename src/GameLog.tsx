import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { capitalizeFirstLetter } from "../pages/setup";
import { AgendaRow } from "./AgendaRow";
import { BLACK_TEXT_GLOW, LabeledDiv, LabeledLine } from "./LabeledDiv";
import { ObjectiveRow } from "./ObjectiveRow";
import { PlanetRow } from "./PlanetRow";
import { StrategyCardElement } from "./StrategyCard";
import { TimerDisplay } from "./Timer";
import { Agenda } from "./util/api/agendas";
import { Attachment } from "./util/api/attachments";
import { StrategyCard, StrategyCardName } from "./util/api/cards";
import { Faction } from "./util/api/factions";
import { LogEntry } from "./util/api/gameLog";
import { Objective } from "./util/api/objectives";
import { Planet } from "./util/api/planets";
import { PlanetEvent, SubStateFaction } from "./util/api/subState";
import { fetcher } from "./util/api/util";
import { getFactionColor, getFactionName } from "./util/factions";
import { applyPlanetAttachments } from "./util/planets";
import { responsivePixels } from "./util/util";

function createRepeatedString(array: string[]) {
  const arrayCopy = structuredClone(array);
  switch (arrayCopy.length) {
    case 0:
      return "";
    case 1:
      return arrayCopy[0] as string;
    case 2:
      return arrayCopy.join(" and ");
    default:
      let lastElement = arrayCopy.pop();
      return arrayCopy.join(", ") + ", and " + lastElement;
  }
}

function conqueredPlanetsString(
  planetEvents: PlanetEvent[],
  factions: Record<string, Faction>
) {
  const eventArray = planetEvents.map((planetEvent) => {
    if (planetEvent.prevOwner) {
      const prevFaction = factions[planetEvent.prevOwner];
      return planetEvent.name + " from " + getFactionName(prevFaction);
    }
    return planetEvent.name;
  });
  return "Took control of " + createRepeatedString(eventArray);
}

export function LogEntryElement({
  logEntry,
  prevEntry,
}: {
  logEntry: LogEntry;
  prevEntry?: LogEntry;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: attachments }: { data?: Record<string, Attachment> } = useSWR(
    gameid ? `/api/${gameid}/attachments` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  switch (logEntry.phase) {
    case "SETUP":
      return (
        <div
          className="flexColumn"
          style={{ alignItems: "stretch", width: "calc(100% - 8px)" }}
        >
          <LabeledDiv label="Starting objectives">
            {logEntry.objectives.map((objectiveName: string) => {
              const objective = (objectives ?? {})[objectiveName];
              if (!objective) {
                return null;
              }
              return (
                <ObjectiveRow
                  key={objectiveName}
                  hideScorers={true}
                  objective={objective}
                />
              );
            })}
          </LabeledDiv>
        </div>
      );
    case "STRATEGY":
      return (
        <div className="flexColumn" style={{ alignItems: "stretch" }}>
          {/* <LabeledDiv label="Selected strategy cards"> */}
          {(logEntry.strategyCards ?? []).map((card) => {
            const color = getFactionColor((factions ?? {})[card.assignedTo]);
            return (
              <div key={card.name}>
                <span
                  style={{
                    color: color,
                    textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
                  }}
                >
                  {getFactionName((factions ?? {})[card.assignedTo])}
                </span>{" "}
                : {card.name}
              </div>
            );
          })}
          {/* </LabeledDiv> */}
        </div>
      );
    case "ACTION":
      if (!logEntry.turnData?.selectedAction || !logEntry.activeFaction) {
        return null;
      }
      let turnSummary = null;

      let componentSection,
        planetSection,
        objectiveSection,
        techSection,
        otherFactionsSection = null;

      if (logEntry.turnData?.component?.name) {
        let componentText = `Used ${logEntry.turnData.component.name}`;
        switch (logEntry.turnData.component.name) {
          case "Gain Relic":
            componentText = `Purged 3 relic fragments and gained ${
              (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
                ?.name
            }`;
            break;
          case "Fabrication":
            if (
              (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
                ?.name
            ) {
              componentText = `Purged 2 relic fragments and gained ${
                (logEntry.turnData.factions ?? {})[logEntry.activeFaction]
                  ?.relic?.name
              }`;
            } else {
              componentText = `Purged 1 relic fragment and gained 1 command token`;
            }
            break;
          case "Black Market Forgery":
            componentText = `Purged 2 relic fragments and gained ${
              (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
                ?.name
            }`;
          case "Hesh and Prit":
            componentText = `Used Hesh and Prit and gained ${
              (logEntry.turnData.factions ?? {})[logEntry.activeFaction]?.relic
                ?.name
            }`;
          case "Nano-Forge":
            componentText = `Attached Nano-Forge to ${
              (logEntry.turnData.attachments ?? {})["Nano-Forge"]
            }`;
        }
        componentSection = (
          <div
            className="flexColumn myriadPro"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            {componentText}
          </div>
        );
      }

      const turnFactions = logEntry.turnData.factions ?? {};

      const conqueredPlanets =
        turnFactions[logEntry.activeFaction]?.planets ?? [];
      if (conqueredPlanets.length > 0) {
        planetSection = (
          <div
            className="flexColumn myriadPro"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            {conqueredPlanetsString(conqueredPlanets, factions ?? {})}
          </div>
        );
      }

      const scoredObjectives =
        turnFactions[logEntry.activeFaction]?.objectives ?? [];
      if (scoredObjectives.length > 0) {
        objectiveSection = (
          <div
            className="flexColumn myriadPro"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            Scored {createRepeatedString(scoredObjectives)}
          </div>
        );
      }
      const researchedTechs = turnFactions[logEntry.activeFaction]?.techs ?? [];
      if (researchedTechs.length > 0) {
        techSection = (
          <div
            className="flexColumn myriadPro"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            Researched {createRepeatedString(researchedTechs)}
          </div>
        );
      }

      let hasOtherFactionContent = false;
      otherFactionsSection = (
        <div
          className="flexColumn myriadPro"
          style={{
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {Object.entries(logEntry.turnData.factions ?? {}).map(
            ([factionName, faction]) => {
              if (factionName === logEntry.activeFaction) {
                return null;
              }
              let localPlanetSummary,
                localObjectiveSummary,
                localTechSummary = null;
              const conqueredPlanets = faction.planets ?? [];
              if (conqueredPlanets.length > 0) {
                localPlanetSummary = (
                  <div
                    className="flexColumn myriadPro"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    {conqueredPlanetsString(conqueredPlanets, factions ?? {})}
                  </div>
                );
              }

              const scoredObjectives = faction.objectives ?? [];
              if (scoredObjectives.length > 0) {
                localObjectiveSummary = (
                  <div
                    className="flexColumn myriadPro"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    Scored {createRepeatedString(scoredObjectives)}
                  </div>
                );
              }
              const researchedTechs = faction.techs ?? [];
              if (researchedTechs.length > 0) {
                localTechSummary = (
                  <div
                    className="flexColumn myriadPro"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    Researched {createRepeatedString(researchedTechs)}
                  </div>
                );
              }

              const color = getFactionColor((factions ?? {})[factionName]);

              if (
                !localObjectiveSummary &&
                !localPlanetSummary &&
                !localTechSummary
              ) {
                return null;
              }
              hasOtherFactionContent = true;
              return (
                <div
                  key={factionName}
                  className="flexColumn"
                  style={{
                    alignItems: "flex-start",
                    paddingLeft: responsivePixels(8),
                    gap: responsivePixels(4),
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Slider",
                      color: color,
                      textShadow:
                        color === "Black" ? BLACK_TEXT_GLOW : undefined,
                    }}
                  >
                    {getFactionName((factions ?? {})[factionName])}
                  </span>
                  <div
                    className="flexColumn"
                    style={{
                      alignItems: "flex-start",
                      paddingLeft: responsivePixels(8),
                    }}
                  >
                    {localTechSummary}
                    {localObjectiveSummary}
                    {localPlanetSummary}
                  </div>
                </div>
              );
            }
          )}
        </div>
      );
      let totalSeconds = 0;
      let totalMinutes = 0;
      if (prevEntry?.gameSeconds && logEntry.gameSeconds) {
        totalSeconds = logEntry.gameSeconds - prevEntry.gameSeconds;
        totalMinutes = Math.floor(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
      }
      turnSummary = (
        <div
          className="flexColumn"
          style={{
            width: "100%",
            padding: `0 ${responsivePixels(16)}`,
          }}
        >
          {componentSection}
          {planetSection}
          {objectiveSection}
          {techSection}
          {hasOtherFactionContent ? otherFactionsSection : null}
        </div>
      );
      return (
        <>
          <LabeledLine
            label={getFactionName((factions ?? {})[logEntry.activeFaction])}
            rightLabel={logEntry.turnData.selectedAction}
            leftLabel={
              (totalMinutes > 0 ? totalMinutes + " mins " : "") +
              totalSeconds +
              " secs"
            }
            // leftLabel={
            //   <TimerDisplay
            //     time={totalSeconds ?? 0}
            //     style={{
            //       fontSize: responsivePixels(16),
            //     }}
            //     width={84}
            //   />
            // }
            // rightLabel={logEntry.turnData?.selectedAction}
            style={{ width: "calc(100% - 8px)" }}
            color={getFactionColor((factions ?? {})[logEntry.activeFaction])}
          />
          {turnSummary}
        </>
      );
    case "STATUS": {
      let factionScoringSection;
      factionScoringSection = (
        <div
          className="flexColumn myriadPro"
          style={{
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {Object.entries(logEntry.turnData?.factions ?? {}).map(
            ([factionName, faction]) => {
              if (factionName === logEntry.activeFaction) {
                return null;
              }
              let localObjectiveSummary = null;

              const scoredObjectives = faction.objectives ?? [];
              if (scoredObjectives.length > 0) {
                localObjectiveSummary = (
                  <div
                    className="flexColumn myriadPro"
                    style={{ alignItems: "stretch", width: "100%" }}
                  >
                    Scored {createRepeatedString(scoredObjectives)}
                  </div>
                );
              }

              const color = getFactionColor((factions ?? {})[factionName]);

              if (!localObjectiveSummary) {
                return null;
              }
              hasOtherFactionContent = true;
              return (
                <div
                  key={factionName}
                  className="flexColumn"
                  style={{
                    alignItems: "flex-start",
                    paddingLeft: responsivePixels(8),
                    gap: responsivePixels(4),
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Slider",
                      color: color,
                      textShadow:
                        color === "Black" ? BLACK_TEXT_GLOW : undefined,
                    }}
                  >
                    {getFactionName((factions ?? {})[factionName])}
                  </span>
                  <div
                    className="flexColumn"
                    style={{
                      alignItems: "flex-start",
                      paddingLeft: responsivePixels(8),
                    }}
                  >
                    {localObjectiveSummary}
                  </div>
                </div>
              );
            }
          )}
        </div>
      );
      return (
        <>
          {factionScoringSection}
          <LabeledDiv
            label="Revealed objective"
            style={{ width: "fit-content", marginLeft: responsivePixels(8) }}
          >
            {(logEntry.objectives ?? []).map((objectiveName: string) => {
              const objective = (objectives ?? {})[objectiveName];
              if (!objective) {
                return null;
              }
              return (
                <ObjectiveRow
                  key={objectiveName}
                  hideScorers={true}
                  objective={objective}
                />
              );
            })}
          </LabeledDiv>
        </>
      );
    }
    case "AGENDA": {
      if (!logEntry.agenda) {
        return null;
      }
      const agenda = (agendas ?? {})[logEntry.agenda];
      if (!agenda) {
        return null;
      }
      return (
        <div className="flexColumn">
          <AgendaRow key={logEntry.agenda} agenda={agenda} />
        </div>
      );
    }
  }
  if (logEntry.selectedAction) {
    return (
      <React.Fragment>
        {/* <LabeledDiv
        label={
          <TimerDisplay
            time={logEntry.gameSeconds ?? 0}
            style={{
              fontSize: responsivePixels(16),
              width: responsivePixels(84),
            }}
          />
        }
      > */}
        {logEntry.activeFaction} used {logEntry.selectedAction}
        <LabeledLine
          leftLabel={
            <TimerDisplay
              time={logEntry.gameSeconds ?? 0}
              style={{
                fontSize: responsivePixels(16),
                width: responsivePixels(84),
              }}
            />
          }
          rightLabel={new Date(logEntry.time).toLocaleString()}
        />
      </React.Fragment>
    );
  }
  return <div>{logEntry.activeFaction}</div>;
}

export function GameLog({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: gameLog }: { data?: LogEntry[] } = useSWR(
    gameid ? `/api/${gameid}/gameLog` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  if (!gameLog) {
    return null;
  }

  let prevPhase = "None";
  let prevEntry: LogEntry | undefined;
  let currRound = 0;

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        height: responsivePixels(440),
        overflow: "auto",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {gameLog.map((logEntry, index) => {
        if (logEntry.phase && logEntry.phase !== prevPhase) {
          prevPhase = logEntry.phase;
          if (logEntry.phase === "STRATEGY") {
            currRound++;
          }
          const output = (
            <React.Fragment key={index}>
              <LabeledLine
                label={
                  currRound !== 0
                    ? `Round ${currRound} ${capitalizeFirstLetter(
                        logEntry.phase.toLowerCase()
                      )} Phase`
                    : `${capitalizeFirstLetter(
                        logEntry.phase.toLowerCase()
                      )} Phase`
                }
                style={{ width: "calc(100% - 8px)" }}
              />
              <LogEntryElement logEntry={logEntry} prevEntry={prevEntry} />
            </React.Fragment>
          );
          prevEntry = logEntry;
          return output;
        }
        const output = (
          <LogEntryElement
            key={index}
            logEntry={logEntry}
            prevEntry={prevEntry}
          />
        );
        prevEntry = logEntry;
        return output;
      })}
    </div>
  );
}
