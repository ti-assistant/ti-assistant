import React, { CSSProperties, PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  useCurrentTurn,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useSystems,
  useTechs,
  useViewOnly,
} from "../context/dataHooks";
import { useFactions } from "../context/factionDataHooks";
import { useObjectives } from "../context/objectiveDataHooks";
import {
  playAdjudicatorBaalAsync,
  scoreObjectiveAsync,
  undoAdjudicatorBaalAsync,
  unscoreObjectiveAsync,
} from "../dynamic/api";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { SelectableRow } from "../SelectableRow";
import {
  getAdjudicatorBaalSystem,
  getGainedRelic,
  getLogEntries,
  getResearchedTechs,
} from "../util/actionLog";
import { hasTech } from "../util/api/techs";
import { getWormholeNexusSystemNumber } from "../util/map";
import { getMapString } from "../util/options";
import { objectKeys, rem } from "../util/util";
import GainRelic from "./Actions/GainRelic";
import ClaimPlanetsSection from "./ClaimPlanetsSection/ClaimPlanetsSection";
import FrontierExploration from "./FrontierExploration/FrontierExploration";
import LabeledDiv from "./LabeledDiv/LabeledDiv";
import LabeledLine from "./LabeledLine/LabeledLine";
import GameMap from "./Map/GameMap";
import ObjectiveRow from "./ObjectiveRow/ObjectiveRow";
import ScoreObjectiveRow from "./ObjectiveRow/ScoreObjectiveRow";
import ObjectiveSelectHoverMenu from "./ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import styles from "./TacticalAction.module.scss";
import TechResearchSection from "./TechResearchSection/TechResearchSection";

export function TacticalAction({
  activeFactionId,
  claimablePlanets,
  conqueredPlanets,
  frontier = true,
  scorableObjectives,
  scoredObjectives,
  style = {},
}: {
  activeFactionId: FactionId;
  claimablePlanets: Planet[];
  conqueredPlanets: ClaimPlanetEvent[];
  frontier?: boolean;
  scorableObjectives: Objective[];
  scoredObjectives: ObjectiveId[];
  style?: CSSProperties;
}) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const relics = useRelics();
  const techs = useTechs();
  const nekroTechs = getResearchedTechs(currentTurn, "Nekro Virus");

  claimablePlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const intl = useIntl();

  let hasCustodiansPoint = false;
  const mecatolConquerers = getLogEntries<ClaimPlanetData>(
    currentTurn,
    "CLAIM_PLANET"
  ).filter((logEntry) => logEntry.data.event.planet === "Mecatol Rex");
  if (mecatolConquerers[0]) {
    const event = mecatolConquerers[0].data.event;
    if (event.faction === activeFactionId && !event.prevOwner) {
      hasCustodiansPoint = true;
    }
  }

  const faction = factions[activeFactionId];
  if (!faction) {
    return null;
  }
  const nekroPossibleTechs = new Set<TechId>();
  Object.values(factions).forEach((otherFaction) => {
    objectKeys(otherFaction.techs).forEach((id) => {
      const techId = id;
      const tech = techs[id];
      if (hasTech(otherFaction, tech) && !hasTech(faction, tech)) {
        nekroPossibleTechs.add(techId);
      }
    });
  });

  const gainedRelic = getGainedRelic(currentTurn);
  const relic = gainedRelic ? relics[gainedRelic] : undefined;

  return (
    <div
      className={`flexColumn largeFont ${styles.TacticalAction}`}
      style={{ ...style }}
    >
      <ClaimPlanetsSection
        availablePlanets={claimablePlanets}
        factionId={activeFactionId}
      />
      {hasCustodiansPoint ? (
        <FormattedMessage
          id="64NLXu"
          description="Text telling the player that they gained a victory point for removing the Custodians Token."
          defaultMessage="+1 VP for Custodians Token"
        />
      ) : null}
      {(scoredObjectives.length > 0 && !hasCustodiansPoint) ||
      scoredObjectives.length > 1 ? (
        <LabeledDiv
          label={
            <FormattedMessage
              id="DGs6vS"
              description="Label for section of scored action phase objectives."
              defaultMessage="Scored Action Phase {count, plural, one {Objective} other {Objectives}}"
              values={{ count: scoredObjectives.length }}
            />
          }
          blur
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", paddingLeft: rem(4) }}
          >
            {scoredObjectives.map((objective) => {
              if (!objectives) {
                return null;
              }
              if (
                objective === "Custodians Token" ||
                objective === "Support for the Throne"
              ) {
                return null;
              }
              const objectiveObj = objectives[objective];
              if (!objectiveObj) {
                return null;
              }
              return (
                <ObjectiveRow
                  key={objective}
                  hideScorers={true}
                  objective={objectiveObj}
                  removeObjective={() =>
                    unscoreObjectiveAsync(gameId, activeFactionId, objective)
                  }
                />
              );
            })}
          </div>
        </LabeledDiv>
      ) : null}
      {scorableObjectives.length > 0 && scoredObjectives.length < 4 ? (
        <ObjectiveSelectHoverMenu
          action={(_, objectiveId) => {
            scoreObjectiveAsync(gameId, activeFactionId, objectiveId);
          }}
          label={
            <FormattedMessage
              id="fCdj3q"
              description="Text on a hover menu allowing a player to score an action phase objective."
              defaultMessage="Score Action Phase Objective"
            />
          }
          objectives={scorableObjectives}
        />
      ) : null}
      {relic && frontier && conqueredPlanets.length === 0 ? (
        <GainRelic factionId={activeFactionId} blur />
      ) : null}
      {activeFactionId === "Nekro Virus" &&
      (nekroTechs.length > 0 || nekroPossibleTechs.size > 0) ? (
        <React.Fragment>
          <TechResearchSection
            factionId={activeFactionId}
            label={intl.formatMessage({
              id: "Nekro Virus.Abilities.Technological Singularity.Title",
              description:
                "Title of Faction Ability: Technological Singularity",
              defaultMessage: "Technological Singularity",
            })}
            filter={(tech) => nekroPossibleTechs.has(tech.id)}
            numTechs={4}
            gain
            style={{ alignItems: "center" }}
          />
        </React.Fragment>
      ) : null}
      {frontier &&
      hasTech(faction, techs["Dark Energy Tap"]) &&
      conqueredPlanets.length === 0 &&
      !relic ? (
        <React.Fragment>
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="GyiC2A"
                description="Text on a hover menu for selecting the result of frontier exploration."
                defaultMessage="Frontier Exploration"
              />
            }
            style={{ whiteSpace: "nowrap" }}
            buttonStyle={{ fontSize: rem(14) }}
          >
            <div
              className={styles.OuterTechSelectMenu}
              style={{
                padding: rem(8),
                alignItems: "flex-start",
                overflow: "visible",
              }}
            >
              <FrontierExploration factionId={activeFactionId} />
            </div>
          </ClientOnlyHoverMenu>
        </React.Fragment>
      ) : null}
      {activeFactionId === "Embers of Muaat" ? <AdjudicatorBaal /> : null}

      <OtherFactionsSection>
        <BecomeAMartyr conqueredPlanets={conqueredPlanets} />
      </OtherFactionsSection>
    </div>
  );
}

function OtherFactionsSection({ children }: PropsWithChildren) {
  return (
    <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
      <LabeledLine
        className={styles.OtherFactionsLabel}
        leftLabel="Other Factions"
      />
      {children}
    </div>
  );
}

function AdjudicatorBaal() {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const options = useOptions();
  const planets = usePlanets();
  const systems = useSystems();
  const viewOnly = useViewOnly();

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const adjudicatorBaalSystem = getAdjudicatorBaalSystem(currentTurn);

  const mapString = getMapString(options, Object.keys(factions).length);
  if (!mapString) {
    return null;
  }

  const adjudicatorBaal = leaders["Adjudicator Ba'al"];
  if (!adjudicatorBaal) {
    return null;
  }

  if (adjudicatorBaalSystem) {
    const system = systems[adjudicatorBaalSystem];
    if (!system) {
      return null;
    }
    const planetString = system.planets.join("/");
    return (
      <LabeledDiv label={adjudicatorBaal.name} blur>
        <SelectableRow
          itemId={`${adjudicatorBaalSystem}`}
          removeItem={() => {
            undoAdjudicatorBaalAsync(gameId, adjudicatorBaalSystem);
          }}
          style={{ fontSize: rem(14) }}
          viewOnly={viewOnly}
        >
          <FormattedMessage
            id="dsGVrU"
            defaultMessage="Replaced System {system}"
            description="Message telling a player which system was replaced by the Muaat hero"
            values={{ system: adjudicatorBaalSystem }}
          />
          {planetString !== "" ? ` (${planetString})` : ""}
        </SelectableRow>
      </LabeledDiv>
    );
  }

  if (adjudicatorBaal.state !== "readied" || viewOnly) {
    return null;
  }
  return (
    <ClientOnlyHoverMenu
      label={adjudicatorBaal.name}
      buttonStyle={{ fontSize: rem(14) }}
    >
      <div
        className="flexColumn"
        style={{ width: rem(320), height: rem(320), marginBottom: rem(16) }}
      >
        <GameMap
          hideLegend
          hideFracture
          mapString={mapString}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          planets={planets}
          expansions={options.expansions}
          canSelectSystem={(systemId) => {
            const systemNumber = parseInt(systemId);
            if (
              systemNumber < 19 ||
              (systemNumber > 50 && systemNumber < 59) ||
              (systemNumber > 80 && systemNumber < 82) ||
              (systemNumber > 82 && systemNumber < 1037)
            ) {
              return false;
            }
            return true;
          }}
          onSelect={(systemId) => {
            const systemNumber = parseInt(systemId);
            if (!systemNumber) {
              return;
            }

            if (
              systemNumber < 19 ||
              (systemNumber > 50 && systemNumber < 59) ||
              (systemNumber > 80 && systemNumber < 82) ||
              (systemNumber > 82 && systemNumber < 1037)
            ) {
              return;
            }

            playAdjudicatorBaalAsync(gameId, systemId as SystemId);
          }}
          wormholeNexus={getWormholeNexusSystemNumber(
            options,
            planets,
            factions
          )}
        />
      </div>
    </ClientOnlyHoverMenu>
  );
}

function BecomeAMartyr({
  conqueredPlanets,
}: {
  conqueredPlanets: ClaimPlanetEvent[];
}) {
  const planets = usePlanets();

  function canScore(faction: Faction) {
    for (const conqueredPlanet of conqueredPlanets) {
      const planet = planets[conqueredPlanet.planet];
      const prevOwner = conqueredPlanet.prevOwner;
      if (
        !planet ||
        !planet.home ||
        !prevOwner ||
        planet.attributes.includes("space-station")
      ) {
        continue;
      }
      if (faction.id === prevOwner) {
        return true;
      }
    }
    return false;
  }

  return (
    <ScoreObjectiveRow objectiveId="Become a Martyr" canScore={canScore} />
  );
}
