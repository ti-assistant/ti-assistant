"use client";

import React, { CSSProperties, ReactNode, use } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import { TechRow } from "../../../../../../src/TechRow";
import GainRelic from "../../../../../../src/components/Actions/GainRelic";
import FactionIcon from "../../../../../../src/components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../../../../../../src/components/FormattedDescription/FormattedDescription";
import FrontierExploration from "../../../../../../src/components/FrontierExploration/FrontierExploration";
import IconDiv from "../../../../../../src/components/LabeledDiv/IconDiv";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import GameMap from "../../../../../../src/components/Map/GameMap";
import MapBuilder, {
  SystemImage,
} from "../../../../../../src/components/MapBuilder/MapBuilder";
import { ModalContent } from "../../../../../../src/components/Modal/Modal";
import PlanetRow from "../../../../../../src/components/PlanetRow/PlanetRow";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import { TacticalAction } from "../../../../../../src/components/TacticalAction";
import TechResearchSection from "../../../../../../src/components/TechResearchSection/TechResearchSection";
import TechSelectHoverMenu from "../../../../../../src/components/TechSelectHoverMenu/TechSelectHoverMenu";
import { ModalContext } from "../../../../../../src/context/contexts";
import {
  useActionCards,
  useActionLog,
  useAttachments,
  useComponents,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useFactions,
  useNumFactions,
} from "../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../src/context/objectiveDataHooks";
import {
  addAttachmentAsync,
  addTechAsync,
  playComponentAsync,
  removeAttachmentAsync,
  removeTechAsync,
  selectFactionAsync,
  selectSubComponentAsync,
  swapMapTilesAsync,
  unplayComponentAsync,
  updatePlanetStateAsync,
} from "../../../../../../src/dynamic/api";
import RelicMenuSVG from "../../../../../../src/icons/ui/RelicMenu";
import {
  getClaimedPlanets,
  getLogEntries,
  getPurgedPlanet,
  getReplacedTechs,
  getResearchedTechs,
  getScoredObjectives,
  getSelectedFaction,
  getSelectedSubComponent,
  wereTilesSwapped,
} from "../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../src/util/api/actionLog";
import { hasTech } from "../../../../../../src/util/api/techs";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../src/util/factions";
import {
  getFactionSystemNumber,
  getWormholeNexusSystemNumber,
  updateMapString,
} from "../../../../../../src/util/map";
import { getMapString } from "../../../../../../src/util/options";
import { applyAllPlanetAttachments } from "../../../../../../src/util/planets";
import { Optional } from "../../../../../../src/util/types/types";
import { pluralize, rem } from "../../../../../../src/util/util";
import Overrule from "./components/Overrule";
import PlanetaryRigs from "./components/PlanetaryRigs";
import Strategize from "./components/Strategize";
import VaultsOfTheHeir from "./components/VaultsOfTheHeir";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function InfoContent({
  component,
}: {
  component: ActionCard | Component | Relic;
}) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: rem(20),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <div className="flexColumn" style={{ gap: rem(32) }}>
        <FormattedDescription description={component.description} />
      </div>
    </div>
  );
}

function ComponentSelect({
  components,
  selectComponent,
  factionId,
}: {
  components: Component[];
  selectComponent: (componentName: string) => void;
  factionId: FactionId;
}) {
  const allActionCards = useActionCards();
  const factions = useFactions();
  const options = useOptions();
  const leaders = useLeaders();
  const relics = useRelics();
  const viewOnly = useViewOnly();

  const nonTechComponents: (BaseComponent & GameComponent)[] =
    components.filter(
      (component) => component.type !== "TECH"
    ) as (BaseComponent & GameComponent)[];
  const actionCards = Object.values(allActionCards)
    .filter((actionCard) => actionCard.timing === "COMPONENT_ACTION")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const techs = components.filter((component) => component.type === "TECH");
  const leaderComponents = nonTechComponents
    .filter((component) => component.type === "LEADER")
    .filter((component) => {
      const leader = leaders[component.id as LeaderId];
      if (!leader) {
        return false;
      }
      return leader.state !== "purged";
    })
    .sort((a, b) => {
      if (a.leader === "AGENT") {
        return -1;
      }
      if (a.leader === "HERO") {
        return 1;
      }
      return 0;
    });
  const exploration = [
    ...nonTechComponents.filter(
      (component) => component.type === "EXPLORATION"
    ),
    ...Object.values(relics).filter((relic) => {
      return (
        relic.timing === "COMPONENT_ACTION" &&
        relic.owner === factionId &&
        relic.state !== "purged"
      );
    }),
  ].sort((a, b) => (a.name > b.name ? 1 : -1));
  const events = nonTechComponents.filter(
    (component) => component.type === "EVENT"
  );
  const promissory = nonTechComponents.filter(
    (component) => component.type === "PROMISSORY"
  );
  const promissoryByFaction: Partial<Record<FactionId, Component[]>> = {};
  promissory.forEach((component) => {
    if (!component.faction) {
      return;
    }
    const factionComponents = promissoryByFaction[component.faction] ?? [];
    factionComponents.push(component);
    promissoryByFaction[component.faction] = factionComponents;
  });
  const faction = factions[factionId];
  const others = nonTechComponents
    .filter(
      (component) =>
        component.type !== "LEADER" &&
        component.type !== "CARD" &&
        component.type !== "RELIC" &&
        component.type !== "PROMISSORY" &&
        component.type !== "EXPLORATION" &&
        component.type !== "EVENT"
    )
    .filter(
      (component) =>
        component.type !== "BREAKTHROUGH" ||
        (faction?.breakthrough?.state &&
          faction.breakthrough.state !== "locked")
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const innerStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: "repeat(10, auto)",
    gap: rem(4),
    maxWidth: "85vw",
    overflowX: "auto",
    justifyContent: "flex-start",
  };

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return (
    <div
      className={className}
      style={{
        padding: rem(8),
        alignItems: "stretch",
        gap: rem(4),
        justifyContent: "flex-start",
        maxWidth: "85vw",
      }}
    >
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="HW1UF8"
            description="Cards that are used to make actions."
            defaultMessage="Action Cards"
          />
        }
      >
        <div
          className="flexRow"
          style={{
            ...innerStyle,
            fontSize: options.expansions.includes("DISCORDANT STARS")
              ? rem(12)
              : undefined,
          }}
        >
          {actionCards.map((actionCard) => {
            return (
              <button
                key={actionCard.id}
                style={{
                  writingMode: "horizontal-tb",
                  fontSize: options.expansions.includes("DISCORDANT STARS")
                    ? rem(14)
                    : undefined,
                }}
                className={actionCard.state === "discarded" ? "faded" : ""}
                onClick={() => selectComponent(actionCard.id)}
                disabled={viewOnly}
              >
                {actionCard.name}
              </button>
            );
          })}
        </div>
      </ClientOnlyHoverMenu>
      {techs.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="ys7uwX"
              description="Shortened version of technologies."
              defaultMessage="Techs"
            />
          }
        >
          <div
            className="flexRow"
            style={{
              ...innerStyle,
              gridTemplateRows: `repeat(${Math.min(techs.length, 10)}, auto)`,
            }}
          >
            {techs.map((component) => {
              if (!faction) {
                return null;
              }
              const gameTech = faction.techs[component.id as TechId];
              return (
                <button
                  key={component.id}
                  style={{ writingMode: "horizontal-tb" }}
                  className={gameTech && !gameTech.ready ? "faded" : ""}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {leaderComponents.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="/MkeMw"
              description="Agent, commander, and hero cards."
              defaultMessage="Leaders"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8) }}
          >
            {leaderComponents.map((component) => {
              const leader = leaders[component.id as LeaderId];
              if (!leader || leader.state === "purged") {
                return null;
              }
              return (
                <div className="flexColumn" key={component.id}>
                  <LabeledLine
                    leftLabel={capitalizeFirstLetter(component.leader ?? "")}
                  />
                  <button
                    className={leader.state === "exhausted" ? "faded" : ""}
                    onClick={() => selectComponent(component.id)}
                    disabled={viewOnly}
                  >
                    {component.name}
                  </button>
                </div>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {exploration.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="t0EFbu"
              description="Abilities related to exploration and relics."
              defaultMessage="Exploration/Relic"
            />
          }
        >
          <div
            className="flexColumn"
            style={{
              gap: rem(4),
              alignItems: "stretch",
              padding: rem(8),
            }}
          >
            {exploration.map((component) => {
              const isRelic = !component.hasOwnProperty("type");
              const faded =
                component.state === "exhausted" || component.state === "used";
              return (
                <button
                  key={component.id}
                  className={`flexRow ${faded ? "faded" : ""}`}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                  style={{ position: "relative", justifyContent: "flex-start" }}
                >
                  {component.name}
                  {isRelic ? (
                    <>
                      <div style={{ width: rem(4) }}></div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: rem(4),
                          right: rem(4),
                          width: rem(10),
                        }}
                      >
                        <RelicMenuSVG color={faded ? "#555" : undefined} />
                      </div>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {events.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="WVs5Hr"
              description="Event actions."
              defaultMessage="Events"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8), width: "100%" }}
          >
            {events.map((component) => {
              return (
                <button
                  key={component.id}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {promissory.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="+IA3Oz"
              description="Promissory note actions."
              defaultMessage="Promissory"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8), width: "100%" }}
          >
            {Object.entries(promissoryByFaction).map(([id, components]) => {
              const faction = factions[id as FactionId];
              if (!faction) {
                return null;
              }
              return (
                <div
                  className="flexColumn"
                  key={faction.id}
                  style={{ width: "100%", alignItems: "flex-start" }}
                >
                  <LabeledLine
                    leftLabel={getFactionName(faction)}
                    style={{ width: "100%" }}
                  />
                  {components.map((component) => {
                    return (
                      <button
                        key={component.id}
                        className={
                          component.state === "exhausted" ||
                          component.state === "used"
                            ? "faded"
                            : ""
                        }
                        onClick={() => selectComponent(component.id)}
                        disabled={viewOnly}
                      >
                        {component.name}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {others.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="sgqLYB"
              description="Text on a button used to select a non-listed value"
              defaultMessage="Other"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8) }}
          >
            {others.map((component) => {
              if (component.type === "FLAGSHIP") {
                return (
                  <div className="flexColumn" key={component.id}>
                    <LabeledLine
                      leftLabel={capitalizeFirstLetter(component.type)}
                    />
                    <button
                      className={
                        component.state === "exhausted" ||
                        component.state === "used"
                          ? "faded"
                          : ""
                      }
                      onClick={() => selectComponent(component.id)}
                      disabled={viewOnly}
                    >
                      {component.name}
                    </button>
                  </div>
                );
              }
              if (component.type === "BREAKTHROUGH") {
                const state = faction?.breakthrough?.state;
                return (
                  <div
                    className="flexColumn"
                    key={component.id}
                    style={{ minWidth: rem(150), alignItems: "flex-start" }}
                  >
                    <LabeledLine
                      leftLabel={capitalizeFirstLetter(component.type)}
                    />
                    <button
                      className={
                        state === "exhausted" || state === "used" ? "faded" : ""
                      }
                      onClick={() => selectComponent(component.id)}
                      disabled={viewOnly}
                    >
                      {component.name}
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={component.id}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
    </div>
  );
}

function ComponentDetails({ factionId }: { factionId: FactionId }) {
  const actionLog = useActionLog();
  const attachments = useAttachments();
  const factions = useFactions();
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const numFactions = useNumFactions();

  function removeTechLocal(techId: TechId) {
    if (!gameId) {
      return;
    }
    removeTechAsync(gameId, factionId, techId);
  }
  function addRemoveTech(tech: Tech) {
    if (!gameId) {
      return;
    }
    removeTechAsync(gameId, factionId, tech.id);
  }
  function clearAddedTech(techId: TechId) {
    if (!gameId) {
      return;
    }
    addTechAsync(gameId, factionId, techId);
  }
  function destroyPlanet(planetId: PlanetId) {
    if (!gameId) {
      return;
    }

    updatePlanetStateAsync(gameId, planetId, "PURGED");
  }
  function undestroyPlanet(planetId: PlanetId) {
    if (!gameId) {
      return;
    }
    updatePlanetStateAsync(gameId, planetId, "READIED");
  }
  function toggleAttachment(
    planetId: PlanetId,
    attachmentId: AttachmentId,
    add: boolean
  ) {
    if (!gameId) {
      return;
    }

    if (add) {
      addAttachmentAsync(gameId, planetId, attachmentId);
    } else {
      removeAttachmentAsync(gameId, planetId, attachmentId);
    }
  }

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets ?? {}),
    attachments ?? {}
  );

  let leftLabel: Optional<ReactNode> = (
    <FormattedMessage
      id="fVAave"
      description="Label for a section containing additional details."
      defaultMessage="Details"
    />
  );
  let label: Optional<ReactNode>;
  let rightLabel: Optional<ReactNode>;
  let lineColor: Optional<string>;
  let innerContent: Optional<ReactNode>;

  let componentName = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  if (componentName === "Ssruu") {
    componentName = getSelectedSubComponent(currentTurn);
  }

  let requiredNeighbors = 2;
  let nonHomeNeighbors = false;
  switch (componentName) {
    case "Enigmatic Device":
    case "Focused Research": {
      innerContent = <TechResearchSection factionId={factionId} />;
      break;
    }
    case "Share Knowledge": {
      const deepwrought = factions["Deepwrought Scholarate"];
      if (!deepwrought) {
        return null;
      }
      innerContent = (
        <TechResearchSection
          factionId={factionId}
          filter={(tech) => hasTech(deepwrought, tech.id)}
          gain
          shareKnowledge
        />
      );
      break;
    }
    case "Plagiarize": {
      const faction = factions[factionId];
      if (!faction) {
        return null;
      }

      const researchedTech = getResearchedTechs(currentTurn, factionId);
      const possibleTechs = new Set<TechId>();
      Object.values(factions).forEach((otherFaction) => {
        Object.keys(otherFaction.techs).forEach((id) => {
          const techId = id as TechId;
          const tech = techs[techId];
          if (!tech || tech.faction) {
            return;
          }
          if (!hasTech(faction, techId) && !researchedTech.includes(techId)) {
            possibleTechs.add(techId);
          }
        });
      });
      const availableTechs = Array.from(possibleTechs).map(
        (techId) => techs[techId] as Tech
      );

      innerContent = (
        <TechResearchSection
          factionId={factionId}
          filter={(tech) => possibleTechs.has(tech.id)}
          gain
        />
      );
      break;
    }
    case "Divert Funding": {
      const faction = factions[factionId];
      if (!faction || !techs) {
        break;
      }
      const returnedTechs = getReplacedTechs(currentTurn, factionId);
      const canReturnTechs = Object.keys(faction.techs ?? {})
        .filter((techId) => {
          const techObj = techs[techId as TechId];
          if (!techObj) {
            return false;
          }
          return !techObj.faction && techObj.type !== "UPGRADE";
        })
        .map((techId) => techs[techId as TechId] as Tech);
      const researchedTech = getResearchedTechs(currentTurn, factionId);

      innerContent = (
        <div className="flexColumn" style={{ width: "100%" }}>
          {returnedTechs.length > 0 ? (
            <React.Fragment>
              <LabeledDiv
                label={
                  <FormattedMessage
                    id="sngfoO"
                    description="Label for a section listing returned techs."
                    defaultMessage="Returned {count, plural, one {Tech} other {Techs}}"
                    values={{ count: returnedTechs.length }}
                  />
                }
              >
                {returnedTechs.map((tech) => {
                  const techObj = techs[tech];
                  if (!techObj) {
                    return null;
                  }
                  return (
                    <TechRow
                      key={tech}
                      tech={techObj}
                      removeTech={() => {
                        researchedTech.forEach(removeTechLocal);
                        clearAddedTech(tech);
                      }}
                    />
                  );
                })}
              </LabeledDiv>
              <TechResearchSection factionId={factionId} />
            </React.Fragment>
          ) : (
            <TechSelectHoverMenu
              factionId={factionId}
              techs={canReturnTechs}
              label={intl.formatMessage({
                id: "XG4lKH",
                description: "Label on a hover menu used to return a tech.",
                defaultMessage: "Return Tech",
              })}
              selectTech={addRemoveTech}
            />
          )}
        </div>
      );
      break;
    }
    case "Visionaria Select": {
      innerContent = (
        <div
          className="flexColumn"
          style={{ width: "100%", boxSizing: "border-box" }}
        >
          {mapOrderedFactionIds.map((id) => {
            const faction = factions[id];
            if (!faction) {
              return null;
            }
            if (faction.id === "Deepwrought Scholarate") {
              return null;
            }
            return (
              <IconDiv
                key={faction.id}
                // icon={<TechSVG />}
                icon={<FactionIcon size={24} factionId={faction.id} />}
                iconSize={24}
                color={getFactionColor(faction)}
              >
                <TechResearchSection
                  factionId={faction.id}
                  duplicateToFaction="Deepwrought Scholarate"
                  hideWrapper
                  filter={(tech) => !tech.faction && tech.type !== "UPGRADE"}
                />
              </IconDiv>
            );
          })}
        </div>
      );
      break;
    }
    case "Dynamis Core": {
      const faction = factions[factionId];
      if (!faction) {
        break;
      }
      const numCommodities = faction.commodities + 2;

      innerContent = (
        <React.Fragment>
          <FormattedMessage
            id="M0ywrk"
            description="Text telling a player how many Trade Goods to gain."
            defaultMessage="Gain {count} Trade {count, plural, =0 {Goods} one {Good} other {Goods}}"
            values={{ count: numCommodities }}
          />
        </React.Fragment>
      );
      break;
    }
    case "Exploration Probe":
    case "Circlet of the Void":
      const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
      const mirageClaimed = claimedPlanets.reduce((claimed, planet) => {
        if (planet.planet === "Mirage") {
          return true;
        }
        return claimed;
      }, false);
      leftLabel = (
        <FormattedMessage
          id="GyiC2A"
          description="Text on a hover menu for selecting the result of frontier exploration."
          defaultMessage="Frontier Exploration"
        />
      );
      if (mirageClaimed) {
        leftLabel = "Mirage";
      }
      innerContent = <FrontierExploration factionId={factionId} />;
      break;
    case "Gain Relic":
    case "Black Market Forgery":
    case "Hesh and Prit":
    case "Fabrication": {
      innerContent = (
        <div className="flexColumn" style={{ width: "100%" }}>
          <GainRelic factionId={factionId} />
        </div>
      );
      break;
    }
    case "Stellar Converter": {
      const nonHomeNonLegendaryNonMecatolPlanets = updatedPlanets.filter(
        (planet) => {
          return (
            !planet.home &&
            !planet.attributes.includes("legendary") &&
            planet.id !== "Mecatol Rex"
          );
        }
      );
      const destroyedPlanet = getPurgedPlanet(currentTurn);
      if (destroyedPlanet) {
        leftLabel = "Destroyed Planet";
        nonHomeNonLegendaryNonMecatolPlanets.push({
          id: destroyedPlanet,
          name: destroyedPlanet,
        } as Planet);
      }
      innerContent = (
        <div
          className="flexColumn"
          style={{ width: "100%", alignItems: "flex-start" }}
        >
          <Selector
            hoverMenuLabel="Destroy Planet"
            options={nonHomeNonLegendaryNonMecatolPlanets}
            selectedItem={destroyedPlanet}
            toggleItem={(planetId, add) => {
              if (add) {
                destroyPlanet(planetId);
              } else {
                undestroyPlanet(planetId);
              }
            }}
            viewOnly={viewOnly}
          />
        </div>
      );
      break;
    }
    case "Nano-Forge": {
      const ownedNonHomeNonLegendaryPlanets = updatedPlanets.filter(
        (planet) => {
          return (
            planet.owner === factionId &&
            !planet.home &&
            !planet.attributes.includes("legendary")
          );
        }
      );
      let nanoForgedPlanet: Optional<Planet>;
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments ?? []).includes("Nano-Forge")) {
          nanoForgedPlanet = planet;
        }
      });
      if (nanoForgedPlanet) {
        ownedNonHomeNonLegendaryPlanets.push(nanoForgedPlanet);
        leftLabel = "Attached to";
      }
      innerContent = (
        <div
          className="flexColumn"
          style={{ width: "100%", alignItems: "flex-start" }}
        >
          <Selector
            hoverMenuLabel="Attach to Planet"
            options={ownedNonHomeNonLegendaryPlanets}
            renderItem={(planetId) => {
              const planet = updatedPlanets.find(
                (planet) => planet.id === planetId
              );
              if (!planet) {
                return null;
              }
              return (
                <PlanetRow
                  planet={planet}
                  factionId={factionId}
                  removePlanet={
                    viewOnly
                      ? undefined
                      : () => toggleAttachment(planetId, "Nano-Forge", false)
                  }
                  opts={{ hideAttachButton: true }}
                />
              );
            }}
            selectedItem={nanoForgedPlanet?.id}
            toggleItem={(planetId, add) => {
              toggleAttachment(planetId, "Nano-Forge", add);
            }}
            viewOnly={viewOnly}
          />
        </div>
      );
      break;
    }
    case "Terraform": {
      const ownedNonHomeNonMecatolPlanets = updatedPlanets.filter((planet) => {
        return (
          planet.owner === factionId &&
          !planet.home &&
          planet.id !== "Mecatol Rex"
        );
      });
      let terraformedPlanet: Optional<PlanetId>;
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments ?? []).includes("Terraform")) {
          terraformedPlanet = planet.id;
        }
      });
      if (terraformedPlanet) {
        leftLabel = "Attached to";
      }
      innerContent = (
        <div
          className="flexColumn"
          style={{ width: "100%", alignItems: "flex-start" }}
        >
          <Selector
            hoverMenuLabel="Attach to Planet"
            options={ownedNonHomeNonMecatolPlanets}
            selectedItem={terraformedPlanet}
            renderItem={(planetId) => {
              const planet = updatedPlanets.find(
                (planet) => planet.id === planetId
              );
              if (!planet) {
                return null;
              }
              return (
                <div style={{ width: "100%" }}>
                  <PlanetRow
                    planet={planet}
                    factionId={factionId}
                    removePlanet={
                      viewOnly
                        ? undefined
                        : () => toggleAttachment(planetId, "Terraform", false)
                    }
                  />
                </div>
              );
            }}
            toggleItem={(planetId, add) => {
              toggleAttachment(planetId, "Terraform", add);
            }}
            viewOnly={viewOnly}
          />
        </div>
      );
      break;
    }
    case "Dannel of the Tenth": {
      const conqueredPlanets = getClaimedPlanets(currentTurn, factionId);
      const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
        if (planet.home || planet.locked || planet.owner === factionId) {
          return false;
        }
        if (planet.owner === factionId) {
          return false;
        }
        if (planet.attributes.includes("ocean")) {
          return false;
        }
        return true;
      });
      const scoredObjectives = getScoredObjectives(currentTurn, factionId);
      const scoredActionPhaseObjectives = scoredObjectives.filter(
        (objective) => {
          const objectiveObj = objectives[objective];
          if (!objectiveObj) {
            return false;
          }
          return objectiveObj.phase === "ACTION";
        }
      );
      const scorableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          const scorers = objective.scorers ?? [];
          if (scorers.includes(factionId)) {
            return false;
          }
          if (
            objective.id === "Betray a Friend" ||
            objective.id === "Become a Martyr" ||
            objective.id === "Prove Endurance" ||
            objective.id === "Darken the Skies" ||
            objective.id === "Demonstrate Your Power" ||
            objective.id === "Destroy Their Greatest Ship" ||
            objective.id === "Fight With Precision" ||
            objective.id === "Make an Example of Their World" ||
            objective.id === "Turn Their Fleets to Dust" ||
            objective.id === "Unveil Flagship"
          ) {
            return false;
          }
          if (objective.type === "OTHER") {
            return false;
          }
          if (objective.type === "SECRET" && scorers.length > 0) {
            return false;
          }
          return objective.phase === "ACTION";
        }
      );

      innerContent = (
        <TacticalAction
          activeFactionId="Yin Brotherhood"
          claimablePlanets={conqueredPlanets.length < 3 ? claimablePlanets : []}
          conqueredPlanets={conqueredPlanets}
          frontier={false}
          scoredObjectives={scoredActionPhaseObjectives}
          scorableObjectives={scorableObjectives}
          style={{ width: "100%" }}
        />
      );
      break;
    }
    case "Riftwalker Meian": {
      innerContent = <RiftwalkerMeian />;
      break;
    }
    case "Z'eu": {
      const factionPicked = getSelectedFaction(currentTurn);
      const selectedFaction =
        factionPicked === "None" ? undefined : factionPicked;

      const claimedPlanets = selectedFaction
        ? getClaimedPlanets(currentTurn, selectedFaction)
        : [];
      const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
        if (!planets) {
          return false;
        }
        if (planet.owner === selectedFaction) {
          return false;
        }
        if (planet.locked) {
          return false;
        }
        for (const claimedPlanet of claimedPlanets) {
          if (claimedPlanet.planet === planet.id) {
            return false;
          }
        }
        if (planet.attributes.includes("ocean")) {
          return selectedFaction === "Deepwrought Scholarate";
        }
        // Avernus could be in any system.
        if (planet.id === "Avernus" && planet.owner) {
          return true;
        }
        if (claimedPlanets.length > 0) {
          for (const claimedPlanetEvent of claimedPlanets) {
            if (claimedPlanetEvent.planet === "Avernus") {
              continue;
            }
            const claimedPlanet = planets[claimedPlanetEvent.planet];
            if (claimedPlanet?.attributes.includes("ocean")) {
              continue;
            }
            if (claimedPlanet?.system) {
              return planet.system === claimedPlanet.system;
            }
            if (claimedPlanet?.faction) {
              return planet.faction === claimedPlanet.faction;
            }
            return false;
          }
        }
        return true;
      });
      const scoredObjectives = selectedFaction
        ? getScoredObjectives(currentTurn, selectedFaction)
        : [];
      const scoredActionPhaseObjectives = scoredObjectives.filter(
        (objective) => {
          const objectiveObj = objectives[objective];
          if (!objectiveObj) {
            return false;
          }
          return objectiveObj.phase === "ACTION";
        }
      );
      const scorableObjectives = Object.values(objectives).filter(
        (objective) => {
          const scorers = objective.scorers ?? [];
          if (selectedFaction && scorers.includes(selectedFaction)) {
            return false;
          }
          if (scoredObjectives.includes(objective.id)) {
            return false;
          }
          if (
            objective.id === "Become a Martyr" ||
            objective.id === "Prove Endurance"
          ) {
            return false;
          }
          if (objective.type === "OTHER") {
            return false;
          }
          if (objective.type === "SECRET" && scorers.length > 0) {
            return false;
          }
          return objective.phase === "ACTION";
        }
      );
      leftLabel = undefined;
      label = selectedFaction ? (
        <FormattedMessage
          id="e01Ge2"
          description="Type of action involving activating a system."
          defaultMessage="Tactical Action"
        />
      ) : (
        <FormattedMessage
          id="c6uq+j"
          description="Instruction telling the user to select their faction."
          defaultMessage="Select Faction"
        />
      );
      rightLabel = (
        <FactionSelectRadialMenu
          selectedFaction={selectedFaction}
          factions={Object.values(factions)
            .sort((a, b) => a.mapPosition - b.mapPosition)
            .map((faction) => faction.id)}
          onSelect={(factionId, _) => {
            selectFactionAsync(gameId, factionId ?? "None");
          }}
          size={44}
          borderColor={getFactionColor(
            selectedFaction ? factions[selectedFaction] : undefined
          )}
          viewOnly={viewOnly}
        />
      );
      lineColor = getFactionColor(
        selectedFaction ? factions[selectedFaction] : undefined
      );
      innerContent = (
        <div style={{ width: "100%", minHeight: rem(12) }}>
          {selectedFaction ? (
            <div style={{ paddingTop: rem(12) }}>
              <TacticalAction
                activeFactionId={selectedFaction}
                claimablePlanets={claimablePlanets}
                conqueredPlanets={claimedPlanets}
                scorableObjectives={scorableObjectives}
                scoredObjectives={scoredActionPhaseObjectives}
                style={{ width: "100%" }}
              />
            </div>
          ) : null}
        </div>
      );
      break;
    }
    case "UNITDSGNFLAYESH": {
      innerContent = (
        <TechResearchSection
          factionId={factionId}
          filter={(tech) => !tech.faction && tech.type !== "UPGRADE"}
          gain
        />
      );
      break;
    }
    case "Planetary Rigs": {
      leftLabel = undefined;
      innerContent = <PlanetaryRigs factionId={factionId} />;
      break;
    }
    case "Overrule": {
      leftLabel = undefined;
      innerContent = <Overrule factionId={factionId} />;
      break;
    }
    case "Strategize": {
      leftLabel = undefined;
      innerContent = <Strategize factionId={factionId} />;
      break;
    }
    case "Vaults of the Heir":
      leftLabel = undefined;
      innerContent = <VaultsOfTheHeir factionId={factionId} />;
      break;

    // case "Repeal Law": {
    //   if (!agendas) {
    //     break;
    //   }
    //   const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    //     return agenda.passed && agenda.type === "law";
    //   });
    //   const selectStyle: CSSProperties = {
    //     fontFamily: "Myriad Pro",
    //     padding: rem(8),
    //     display: "grid",
    //     gridAutoFlow: "column",
    //     gridTemplateRows: "repeat(14, auto)",
    //     gap: rem(4),
    //     maxWidth: "85vw",
    //     overflowX: "auto",
    //     justifyContent: "flex-start",
    //   };

    //   const repealedAgenda = getRepealedAgenda(currentTurn);

    //   innerContent = (
    //     <div className="flexColumn" style={{ width: "100%" }}>
    //       {repealedAgenda ? (
    //         <LabeledDiv label="Repealed Law">
    //           <AgendaRow
    //             agenda={repealedAgenda}
    //             removeAgenda={removeRepealedAgenda}
    //           />
    //         </LabeledDiv>
    //       ) : passedLaws.length > 0 ? (
    //         <ClientOnlyHoverMenu label="Repeal Law">
    //           <div className="flexRow" style={selectStyle}>
    //             {passedLaws.map((law) => {
    //               return (
    //                 <button
    //                   key={law.name}
    //                   style={{ writingMode: "horizontal-tb" }}
    //                   onClick={() => repealLaw(law.name)}
    //                 >
    //                   {law.name}
    //                 </button>
    //               );
    //             })}
    //           </div>
    //         </ClientOnlyHoverMenu>
    //       ) : (
    //         "No laws to repeal"
    //       )}
    //     </div>
    //   );
    //   break;
    // }
    case "Industrial Initiative": {
      const numIndustrialPlanets = updatedPlanets.filter((planet) => {
        if (planet.owner !== factionId) {
          return false;
        }
        return planet.types.includes("INDUSTRIAL");
      }).length;

      innerContent = (
        <React.Fragment>
          <FormattedMessage
            id="M0ywrk"
            description="Text telling a player how many Trade Goods to gain."
            defaultMessage="Gain {count} Trade {count, plural, =0 {Goods} one {Good} other {Goods}}"
            values={{ count: numIndustrialPlanets }}
          />
        </React.Fragment>
      );
      break;
    }
    case "Mining Initiative": {
      let maxValue = 0;
      let bestPlanet: Optional<PlanetId>;
      updatedPlanets
        .filter((planet) => {
          if (planet.owner !== factionId) {
            return false;
          }
          return true;
        })
        .forEach((planet) => {
          if (planet.resources > maxValue) {
            bestPlanet = planet.id;
            maxValue = planet.resources;
          }
        });

      innerContent = (
        <React.Fragment>{`Best option: ${bestPlanet} to gain ${maxValue} ${pluralize(
          "trade good",
          maxValue
        )}`}</React.Fragment>
      );
      break;
    }
    case "Total War":
      innerContent = (
        <div className="flexRow" style={{ width: "100%" }}>
          +1 VP
        </div>
      );
      break;
    case "Book of Latvinia":
      const bookEntry = getLogEntries<PlayComponentData>(
        currentTurn,
        "PLAY_COMPONENT"
      )[0];
      if (bookEntry && bookEntry.data.event.prevFaction) {
        const faction = factions[factionId];
        innerContent = (
          <div className="flexRow" style={{ width: "100%" }}>
            <FormattedMessage
              id="pTiYPm"
              description="Label for a selector selecting a new speaker."
              defaultMessage="New Speaker"
            />
            : {getFactionName(faction)}
          </div>
        );
      } else {
        innerContent = (
          <div className="flexRow" style={{ width: "100%" }}>
            +1 VP
          </div>
        );
      }
      break;
    case "Age of Exploration":
      requiredNeighbors = 2;
      nonHomeNeighbors = true;
    case "Star Chart":
    case "Azdel's Key": {
      const mapString = getMapString(options, Object.keys(factions).length);
      if (!mapString) {
        break;
      }
      const mapOrderedFactions = Object.values(factions).sort(
        (a, b) => a.mapPosition - b.mapPosition
      );
      let updatedMapString =
        mapString === ""
          ? updateMapString(mapString, options["map-style"], numFactions)
          : mapString;
      let updatedSystemTiles = updatedMapString.split(" ");
      updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
        const updatedTile = updatedSystemTiles[index];
        if (tile === "0" && updatedTile && updatedTile !== "0") {
          return updatedTile;
        }
        if (tile.startsWith("P")) {
          const number = tile.at(tile.length - 1);
          if (!number) {
            return tile;
          }
          const factionIndex = parseInt(number);
          return getFactionSystemNumber(mapOrderedFactions[factionIndex - 1]);
        }
        return tile;
      });
      updatedMapString = updatedSystemTiles.join(" ");
      let tileNumbers: string[] = [];
      for (let i = 19; i < 51; i++) {
        tileNumbers.push(i.toString());
      }
      if (options.expansions.includes("POK")) {
        for (let i = 59; i < 81; i++) {
          tileNumbers.push(i.toString());
        }
      }
      if (options.expansions.includes("DISCORDANT STARS")) {
        for (let i = 4253; i < 4270; i++) {
          tileNumbers.push(i.toString());
        }
      }
      const alreadyUsed = wereTilesSwapped(getCurrentTurnLogEntries(actionLog));
      leftLabel = alreadyUsed ? "Updated Map" : "Add System";
      innerContent = alreadyUsed ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
          <GameMap
            mapString={mapString}
            mapStyle={options["map-style"]}
            factions={mapOrderedFactions}
            hideLegend
            hideFracture
            wormholeNexus={getWormholeNexusSystemNumber(
              options,
              planets,
              factions
            )}
            planets={planets}
            expansions={options.expansions}
          />
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%" }}>
          <DndProvider backend={HTML5Backend}>
            <div style={{ width: "100%", aspectRatio: 1 }}>
              <MapBuilder
                mapString={updatedMapString}
                updateMapString={(dragItem, dropItem) => {
                  swapMapTilesAsync(gameId, dropItem, dragItem);
                }}
                dropOnly
                exploration
                mallice={undefined}
                requiredNeighbors={requiredNeighbors}
                nonHomeNeighbors={nonHomeNeighbors}
              ></MapBuilder>
            </div>
            <LabeledDiv
              label="Unused Tiles"
              style={{
                height: rem(80),
              }}
              innerStyle={{
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  columnGap: rem(8),
                  width: "100%",
                  justifyContent: "flex-start",
                  overflowY: "auto",
                  overflowX: "hidden",
                  height: "100%",
                }}
              >
                {tileNumbers.map((number) => {
                  const inMapString = mapString
                    .split(" ")
                    .reduce((found, systemNumber) => {
                      return found || number == systemNumber;
                    }, false);
                  if (inMapString) {
                    return null;
                  }
                  return (
                    <div key={number} style={{ width: "100%", aspectRatio: 1 }}>
                      <SystemImage index={-1} systemNumber={number} />
                    </div>
                  );
                })}
              </div>
            </LabeledDiv>
          </DndProvider>
        </div>
      );
      break;
    }
  }
  if (!innerContent) {
    return null;
  }
  return (
    <div className="flexColumn" style={{ width: "100%", gap: rem(4) }}>
      <LabeledLine
        leftLabel={leftLabel}
        label={label}
        rightLabel={rightLabel}
        color={lineColor}
      />
      <div
        className="flexColumn"
        style={{ alignItems: "flex-start", width: "100%" }}
      >
        {innerContent}
      </div>
    </div>
  );
}

export function ComponentAction({ factionId }: { factionId: FactionId }) {
  const actionCards = useActionCards();
  const actionLog = useActionLog();
  const components = useComponents();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const planets = usePlanets();
  const relics = useRelics();
  const viewOnly = useViewOnly();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const { openModal } = use(ModalContext);

  const playedComponent = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  let component: Optional<Component | ActionCard | Relic>;
  if (playedComponent) {
    component = components[playedComponent];
    if (!component) {
      component = actionCards[playedComponent as ActionCardId];
    }
    if (!component) {
      component = relics[playedComponent as RelicId];
    }
  }

  async function selectComponent(componentName: string) {
    if (!gameId) {
      return;
    }
    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    playComponentAsync(gameId, updatedName, factionId);
  }

  function unselectComponent(componentName: string) {
    if (!gameId) {
      return;
    }

    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    unplayComponentAsync(gameId, updatedName, factionId);
  }

  if (!factions) {
    return null;
  }

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  const unownedRelics = Object.values(relics ?? {})
    .filter((relic) => !relic.owner)
    .map((relic) => relic.id);

  const agentsForSsruu = Object.values(components ?? {}).filter((component) => {
    if (component.type !== "LEADER") {
      return false;
    }
    if (component.leader !== "AGENT") {
      return false;
    }
    if (component.id === "Ssruu") {
      return false;
    }
    return true;
  });

  if (!component) {
    const filteredComponents = Object.values(components).filter((component) => {
      if (component.type === "PROMISSORY") {
        if (
          component.faction &&
          (!factions[component.faction] || component.faction === faction.id)
        ) {
          return false;
        }
      }
      if (
        component.faction &&
        component.type !== "PROMISSORY" &&
        component.type !== "TECH" &&
        component.type !== "PLANET"
      ) {
        if (component.faction !== faction.id) {
          return false;
        }
      }

      if (
        unownedRelics.length === 0 &&
        (component.id === "Gain Relic" ||
          component.id === "Black Market Forgery")
      ) {
        return false;
      }

      if (
        "subFaction" in component &&
        component.subFaction &&
        component.subFaction !== faction.startswith.faction
      ) {
        return false;
      }

      if (component.type === "RELIC") {
        const relic = (relics ?? {})[component.id as RelicId];
        if (!relic) {
          return false;
        }
        if (relic.owner !== factionId) {
          return false;
        }
      }

      if (component.type === "TECH" && !hasTech(faction, component.id)) {
        return false;
      }

      if (component.state === "purged") {
        return false;
      }

      if (component.id === "Ssruu" && agentsForSsruu.length === 0) {
        return false;
      }

      if ("leader" in component && component.leader === "HERO") {
        const hero = leaders[component.id as LeaderId];
        if (!hero) {
          return false;
        }
        if (hero.state !== "readied") {
          return false;
        }
      }

      if (
        component.id === "Age of Exploration" &&
        !hasTech(faction, "Dark Energy Tap")
      ) {
        return false;
      }

      if (component.type === "PLANET") {
        const planet = planets[component.id as PlanetId];
        if (!planet) {
          return false;
        }
        return planet.owner === factionId;
      }

      return true;
    });

    return (
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="mkUb00"
            description="Text on a hover menu for selecting a component action."
            defaultMessage="Select Component"
          />
        }
      >
        <ComponentSelect
          components={filteredComponents}
          selectComponent={selectComponent}
          factionId={factionId}
        />
      </ClientOnlyHoverMenu>
    );
  }

  return (
    <React.Fragment>
      <div
        className="flexColumn largeFont"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <LabeledDiv
          blur
          label={
            <FormattedMessage
              id="43UU69"
              description="Text on a button that will select a component action."
              defaultMessage="Component"
            />
          }
          style={{ width: "90%" }}
        >
          <SelectableRow
            itemId={component.id}
            removeItem={() => unselectComponent(component.id)}
            viewOnly={viewOnly}
          >
            {component.name}
            <div
              className="popupIcon"
              onClick={() =>
                openModal(
                  <ModalContent
                    title={
                      <div className="flexColumn" style={{ fontSize: rem(40) }}>
                        {component.name}
                      </div>
                    }
                  >
                    <InfoContent component={component} />
                  </ModalContent>
                )
              }
              style={{ fontSize: rem(16) }}
            >
              &#x24D8;
            </div>
          </SelectableRow>
          {component.id === "Ssruu" ? (
            <div className="flexRow" style={{ paddingLeft: rem(16) }}>
              Using the ability of
              <Selector
                hoverMenuLabel="Select Agent"
                options={agentsForSsruu}
                selectedItem={getSelectedSubComponent(currentTurn)}
                toggleItem={(agent, add) => {
                  const updatedName = agent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(/ Ω/g, "");
                  selectSubComponentAsync(gameId, add ? updatedName : "None");
                }}
                viewOnly={viewOnly}
              />
            </div>
          ) : null}
          <ComponentDetails factionId={factionId} />
        </LabeledDiv>
      </div>
    </React.Fragment>
  );

  return null;
}

function RiftwalkerMeian() {
  const actionLog = useActionLog();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const options = useOptions();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const mapString = getMapString(options, Object.keys(factions).length);
  if (!mapString) {
    return null;
  }

  const riftwalkerMeian = leaders["Riftwalker Meian"];
  if (!riftwalkerMeian) {
    return null;
  }

  const mapOrderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let updatedSystemTiles = mapString.split(" ");
  updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
    const updatedTile = updatedSystemTiles[index];
    if (tile === "0" && updatedTile && updatedTile !== "0") {
      return updatedTile;
    }
    if (tile.startsWith("P")) {
      const number = tile.at(tile.length - 1);
      if (!number) {
        return tile;
      }
      const factionIndex = parseInt(number);
      return getFactionSystemNumber(mapOrderedFactions[factionIndex - 1]);
    }
    return tile;
  });
  const alreadyUsed = wereTilesSwapped(getCurrentTurnLogEntries(actionLog));
  if (alreadyUsed) {
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
        <GameMap
          mapString={updatedSystemTiles.join(" ")}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          wormholeNexus={getWormholeNexusSystemNumber(
            options,
            planets,
            factions
          )}
          hideLegend
          hideFracture
          planets={planets}
          expansions={options.expansions}
        />
      </div>
    );
  }
  const mallice = getWormholeNexusSystemNumber(options, planets, factions);
  return (
    <div
      className="flexColumn"
      style={{ width: rem(320), height: rem(320), marginBottom: rem(16) }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        <DndProvider backend={HTML5Backend}>
          <div style={{ width: "100%", aspectRatio: 1 }}>
            <MapBuilder
              mapString={updatedSystemTiles.join(" ")}
              updateMapString={(dragItem, dropItem) => {
                if (viewOnly || dragItem.index === dropItem.index) {
                  return;
                }
                swapMapTilesAsync(gameId, dropItem, dragItem);
              }}
              riftWalker
              mallice={
                mallice === "PURGED" || mallice === "81" ? mallice : undefined
              }
            ></MapBuilder>
          </div>
        </DndProvider>
      </div>
    </div>
  );
}
