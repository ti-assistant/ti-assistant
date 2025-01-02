"use client";

import React, { CSSProperties, ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { TechRow } from "../../TechRow";
import FactionSelectRadialMenu from "../../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FrontierExploration from "../../components/FrontierExploration/FrontierExploration";
import LabeledDiv from "../../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../components/LabeledLine/LabeledLine";
import Map from "../../components/Map/Map";
import MapBuilder, {
  SystemImage,
} from "../../components/MapBuilder/MapBuilder";
import { ModalContent } from "../../components/Modal/Modal";
import PlanetRow from "../../components/PlanetRow/PlanetRow";
import { Selector } from "../../components/Selector/Selector";
import { TacticalAction } from "../../components/TacticalAction";
import TechSelectHoverMenu from "../../components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  useActionLog,
  useAttachments,
  useComponents,
  useFactions,
  useGameId,
  useLeaders,
  useObjectives,
  useOptions,
  usePlanets,
  useRelics,
  useTechs,
} from "../../context/dataHooks";
import { useSharedModal } from "../../data/SharedModal";
import {
  addAttachmentAsync,
  addTechAsync,
  gainRelicAsync,
  loseRelicAsync,
  playComponentAsync,
  removeAttachmentAsync,
  removeTechAsync,
  selectFactionAsync,
  selectSubComponentAsync,
  swapMapTilesAsync,
  unplayComponentAsync,
  updatePlanetStateAsync,
} from "../../dynamic/api";
import {
  getClaimedPlanets,
  getGainedRelic,
  getPurgedPlanet,
  getReplacedTechs,
  getResearchedTechs,
  getScoredObjectives,
  getSelectedFaction,
  getSelectedSubComponent,
  wereTilesSwapped,
} from "../../util/actionLog";
import { getCurrentTurnLogEntries } from "../../util/api/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionColor, getFactionName } from "../../util/factions";
import {
  getFactionSystemNumber,
  getMalliceSystemNumber,
  updateMapString,
} from "../../util/map";
import { getMapString } from "../../util/options";
import { applyAllPlanetAttachments } from "../../util/planets";
import { Optional } from "../../util/types/types";
import { pluralize, rem } from "../../util/util";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function InfoContent({ component }: { component: Component }) {
  const description = component.description.replaceAll("\\n", "\n");
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
      <div className="flexColumn">{description}</div>
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
  const factions = useFactions();
  const leaders = useLeaders();

  const nonTechComponents: (BaseComponent & GameComponent)[] =
    components.filter(
      (component) => component.type !== "TECH"
    ) as (BaseComponent & GameComponent)[];
  const actionCards = nonTechComponents.filter(
    (component) => component.type === "CARD"
  );
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
  const exploration = nonTechComponents.filter((component) => {
    if (component.type === "EXPLORATION") {
      return true;
    }
    if (component.type !== "RELIC") {
      return false;
    }
    return true;
  });
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
  const others = nonTechComponents.filter(
    (component) =>
      component.type !== "LEADER" &&
      component.type !== "CARD" &&
      component.type !== "RELIC" &&
      component.type !== "PROMISSORY" &&
      component.type !== "EXPLORATION"
  );

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

  const faction = factions[factionId];

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
        <div className="flexRow" style={innerStyle}>
          {actionCards.map((component) => {
            return (
              <button
                key={component.id}
                style={{ writingMode: "horizontal-tb" }}
                className={
                  component.state === "exhausted" || component.state === "used"
                    ? "faded"
                    : ""
                }
                onClick={() => selectComponent(component.id)}
              >
                {component.name}
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
  const leaders = useLeaders();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const techs = useTechs();

  const intl = useIntl();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  if (!factions) {
    return null;
  }

  function getResearchableTechs(faction: Faction) {
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.id)) {
        return false;
      }
      if (!factions || (tech.faction && !factions[tech.faction])) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      const researchedTechs = getResearchedTechs(currentTurn, faction.id);
      if (researchedTechs.includes(tech.id)) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.id !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.id));
    }
    return availableTechs;
  }

  function addTechLocal(tech: Tech) {
    if (!gameId) {
      return;
    }
    addTechAsync(gameId, factionId, tech.id);
  }
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
  function addRelic(relicId: RelicId) {
    if (!gameId) {
      return;
    }
    gainRelicAsync(gameId, factionId, relicId);
  }
  function removeRelic(relicId: RelicId) {
    if (!gameId) {
      return;
    }
    loseRelicAsync(gameId, factionId, relicId);
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

  switch (componentName) {
    case "Enigmatic Device":
    case "Focused Research": {
      const faction = factions[factionId];
      if (!faction) {
        break;
      }
      if (factionId === "Nekro Virus") {
        innerContent = (
          <div className="flexRow" style={{ width: "100%" }}>
            <FormattedMessage
              id="t5fXQR"
              description="Text telling a player how many command tokens to gain."
              defaultMessage="Gain {count} command {count, plural, one {token} other {tokens}}"
              values={{ count: 3 }}
            />
          </div>
        );
        break;
      }
      const researchedTech = getResearchedTechs(currentTurn, factionId);
      const availableTechs = getResearchableTechs(faction);

      if (researchedTech.length > 0) {
        leftLabel = (
          <FormattedMessage
            id="wHhicR"
            description="Label for a section listing researched techs."
            defaultMessage="Researched {count, plural, one {Tech} other {Techs}}"
            values={{ count: researchedTech.length }}
          />
        );
        innerContent = (
          <React.Fragment>
            {researchedTech.map((tech) => {
              if (!techs) {
                return null;
              }
              const techObj = techs[tech];
              if (!techObj) {
                return null;
              }
              return (
                <TechRow
                  key={tech}
                  tech={techObj}
                  removeTech={() => removeTechLocal(tech)}
                  researchAgreement={factionId === "Universities of Jol-Nar"}
                />
              );
            })}
          </React.Fragment>
        );
      } else {
        innerContent = (
          <TechSelectHoverMenu
            factionId={factionId}
            label={intl.formatMessage({
              id: "3qIvsL",
              description: "Label on a hover menu used to research tech.",
              defaultMessage: "Research Tech",
            })}
            techs={availableTechs}
            selectTech={addTechLocal}
          />
        );
      }
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

      if (researchedTech.length > 0) {
        leftLabel = (
          <FormattedMessage
            id="+tb/XA"
            description="Label for a section listing gained techs."
            defaultMessage="Gained {count, plural, one {Tech} other {Techs}}"
            values={{ count: researchedTech.length }}
          />
        );
        innerContent = (
          <div className="flexColumn" style={{ width: "100%" }}>
            {researchedTech.map((tech) => {
              if (!techs) {
                return null;
              }
              const techObj = techs[tech];
              if (!techObj) {
                return null;
              }
              return (
                <TechRow
                  key={tech}
                  tech={techObj}
                  removeTech={() => removeTechLocal(tech)}
                  researchAgreement={factionId === "Universities of Jol-Nar"}
                />
              );
            })}
          </div>
        );
      } else {
        innerContent = (
          <div className="flexColumn" style={{ width: "100%" }}>
            <TechSelectHoverMenu
              factionId={factionId}
              label={intl.formatMessage({
                id: "McKqpw",
                description: "Label on a hover menu used to gain tech.",
                defaultMessage: "Gain Tech",
              })}
              techs={availableTechs}
              selectTech={addTechLocal}
            />
          </div>
        );
      }
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
      const availableTechs = getResearchableTechs(faction);

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
              {researchedTech.length > 0 ? (
                <LabeledDiv
                  label={
                    <FormattedMessage
                      id="wHhicR"
                      description="Label for a section listing researched techs."
                      defaultMessage="Researched {count, plural, one {Tech} other {Techs}}"
                      values={{ count: researchedTech.length }}
                    />
                  }
                >
                  {researchedTech.map((tech) => {
                    const techObj = techs[tech];
                    if (!techObj) {
                      return null;
                    }
                    return (
                      <TechRow
                        key={tech}
                        tech={techObj}
                        removeTech={() => removeTechLocal(tech)}
                        researchAgreement={
                          factionId === "Universities of Jol-Nar"
                        }
                      />
                    );
                  })}
                </LabeledDiv>
              ) : factionId !== "Nekro Virus" ? (
                <TechSelectHoverMenu
                  factionId={factionId}
                  label={intl.formatMessage({
                    id: "3qIvsL",
                    description: "Label on a hover menu used to research tech.",
                    defaultMessage: "Research Tech",
                  })}
                  techs={availableTechs}
                  selectTech={addTechLocal}
                />
              ) : (
                <FormattedMessage
                  id="t5fXQR"
                  description="Text telling a player how many command tokens to gain."
                  defaultMessage="Gain {count} command {count, plural, one {token} other {tokens}}"
                  values={{ count: 3 }}
                />
              )}
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
      const gainedRelic = getGainedRelic(currentTurn);
      const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
      const mirageClaimed = claimedPlanets.reduce((claimed, planet) => {
        if (planet.planet === "Mirage") {
          return true;
        }
        return claimed;
      }, false);
      if (mirageClaimed) {
        leftLabel = "Mirage";
      }
      if (gainedRelic) {
        leftLabel = (
          <FormattedMessage
            id="cqWqzv"
            description="Label for section listing the relic gained."
            defaultMessage="Gained Relic"
          />
        );
      }
      innerContent = <FrontierExploration factionId={factionId} />;
      break;
    case "Gain Relic":
    case "Black Market Forgery":
    case "Hesh and Prit":
    case "Fabrication": {
      const gainedRelic = getGainedRelic(currentTurn);
      const unownedRelics = Object.values(relics).filter(
        (relic) => !relic.owner || gainedRelic === relic.id
      );
      if (gainedRelic) {
        leftLabel = (
          <FormattedMessage
            id="cqWqzv"
            description="Label for section listing the relic gained."
            defaultMessage="Gained Relic"
          />
        );
      }
      innerContent =
        unownedRelics.length > 0 ? (
          <Selector
            hoverMenuLabel={
              <FormattedMessage
                id="Components.Gain Relic.Title"
                description="Title of Component: Gain Relic"
                defaultMessage="Gain Relic"
              />
            }
            options={unownedRelics}
            renderItem={(itemId, _) => {
              const relic = relics[itemId];
              if (!relic) {
                return null;
              }
              return (
                <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
                  <SelectableRow itemId={relic.id} removeItem={removeRelic}>
                    <InfoRow
                      infoTitle={relic.name}
                      infoContent={relic.description}
                    >
                      {relic.name}
                    </InfoRow>
                  </SelectableRow>
                  {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
                </div>
              );
            }}
            selectedItem={gainedRelic}
            toggleItem={(relicId, add) => {
              if (add) {
                addRelic(relicId);
              } else {
                removeRelic(relicId);
              }
            }}
          />
        ) : (
          "No Relics remaining"
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
                  removePlanet={() =>
                    toggleAttachment(planetId, "Nano-Forge", false)
                  }
                  opts={{ hideAttachButton: true }}
                />
              );
            }}
            selectedItem={nanoForgedPlanet?.id}
            toggleItem={(planetId, add) => {
              toggleAttachment(planetId, "Nano-Forge", add);
            }}
          />
        </div>
      );
      break;
    }
    case "Terraform": {
      const ownedNonHomeNonLegendaryNonMecatolPlanets = updatedPlanets.filter(
        (planet) => {
          return (
            planet.owner === factionId &&
            !planet.home &&
            !planet.attributes.includes("legendary") &&
            planet.id !== "Mecatol Rex"
          );
        }
      );
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
            options={ownedNonHomeNonLegendaryNonMecatolPlanets}
            selectedItem={terraformedPlanet}
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
                  removePlanet={() =>
                    toggleAttachment(planetId, "Terraform", false)
                  }
                />
              );
            }}
            toggleItem={(planetId, add) => {
              toggleAttachment(planetId, "Terraform", add);
            }}
          />
        </div>
      );
      break;
    }
    case "Dannel of the Tenth": {
      const nonHomeUnownedPlanets = updatedPlanets.filter((planet) => {
        return !planet.home && !planet.locked && planet.owner !== factionId;
      });
      const conqueredPlanets = getClaimedPlanets(currentTurn, factionId);
      const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
        if (planet.home || planet.locked || planet.owner === factionId) {
          return false;
        }
        if (planet.owner === factionId) {
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
          if (objective.type === "SECRET" && scorers.length > 0) {
            return false;
          }
          return objective.phase === "ACTION";
        }
      );

      innerContent = (
        <TacticalAction
          activeFactionId="Yin Brotherhood"
          attachments={attachments ?? {}}
          claimablePlanets={conqueredPlanets.length < 3 ? claimablePlanets : []}
          conqueredPlanets={conqueredPlanets}
          currentTurn={getCurrentTurnLogEntries(actionLog)}
          factions={factions ?? {}}
          frontier={false}
          gameid={gameId ?? ""}
          leaders={leaders}
          objectives={objectives ?? {}}
          planets={planets ?? {}}
          scoredObjectives={scoredActionPhaseObjectives}
          scorableObjectives={scorableObjectives}
          style={{ width: "100%" }}
          techs={techs ?? {}}
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
        if (claimedPlanets.length > 0) {
          const claimedPlanetName = claimedPlanets[0]?.planet;
          const claimedPlanet = claimedPlanetName
            ? planets[claimedPlanetName]
            : undefined;
          if (claimedPlanet?.system) {
            return planet.system === claimedPlanet.system;
          }
          if (claimedPlanet?.faction) {
            return planet.faction === claimedPlanet.faction;
          }
          return false;
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
            if (!gameId) {
              return;
            }
            selectFactionAsync(gameId, factionId ?? "None");
          }}
          size={44}
          borderColor={getFactionColor(
            selectedFaction ? factions[selectedFaction] : undefined
          )}
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
                attachments={attachments ?? {}}
                claimablePlanets={claimablePlanets}
                conqueredPlanets={claimedPlanets}
                currentTurn={getCurrentTurnLogEntries(actionLog)}
                factions={factions ?? {}}
                gameid={gameId ?? ""}
                leaders={leaders}
                objectives={objectives ?? {}}
                planets={planets ?? {}}
                scorableObjectives={scorableObjectives}
                scoredObjectives={scoredActionPhaseObjectives}
                style={{ width: "100%" }}
                techs={techs ?? {}}
              />
            </div>
          ) : null}
        </div>
      );
      break;
    }
    case "UNITDSGNFLAYESH": {
      const faction = factions[factionId];
      if (!faction) {
        break;
      }
      const researchedTech = getResearchedTechs(currentTurn, factionId);
      const availableTechs = getResearchableTechs(faction).filter((tech) => {
        return !tech.faction && tech.type !== "UPGRADE";
      });

      if (researchedTech.length > 0) {
        leftLabel = (
          <FormattedMessage
            id="+tb/XA"
            description="Label for a section listing gained techs."
            defaultMessage="Gained {count, plural, one {Tech} other {Techs}}"
            values={{ count: researchedTech.length }}
          />
        );
        innerContent = (
          <React.Fragment>
            {researchedTech.map((tech) => {
              if (!techs) {
                return null;
              }
              const techObj = techs[tech];
              if (!techObj) {
                return null;
              }
              return (
                <TechRow
                  key={tech}
                  tech={techObj}
                  removeTech={() => removeTechLocal(tech)}
                />
              );
            })}
          </React.Fragment>
        );
      } else {
        innerContent = (
          <TechSelectHoverMenu
            factionId={factionId}
            label={intl.formatMessage({
              id: "McKqpw",
              description: "Label on a hover menu used to gain tech.",
              defaultMessage: "Gain Tech",
            })}
            techs={availableTechs}
            selectTech={addTechLocal}
          />
        );
      }
      break;
    }

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
        return planet.type === "ALL" || planet.type === "INDUSTRIAL";
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
    case "Dark Energy Tap": {
      const mapString = getMapString(options, Object.keys(factions).length);
      if (!mapString) {
        break;
      }
      const mapOrderedFactions = Object.values(factions).sort(
        (a, b) => a.mapPosition - b.mapPosition
      );
      let updatedMapString = updateMapString(
        mapString,
        options["map-style"],
        mapOrderedFactions.length
      );
      let updatedSystemTiles = updatedMapString.split(" ");
      updatedSystemTiles = updatedSystemTiles.map((tile, index) => {
        const updatedTile = updatedSystemTiles[index];
        if (tile === "0" && updatedTile && updatedTile !== "0") {
          const parsedTile = parseInt(updatedTile);
          if (parsedTile > 4200) {
            return (parsedTile - 3200).toString();
          }
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
        for (let i = 1037; i < 1061; i++) {
          tileNumbers.push(i.toString());
        }
      }
      const alreadyUsed = wereTilesSwapped(getCurrentTurnLogEntries(actionLog));
      leftLabel = alreadyUsed ? "Updated Map" : "Add System";
      innerContent = alreadyUsed ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
          <Map
            mapString={mapString}
            mapStyle={options["map-style"]}
            factions={mapOrderedFactions}
            hideLegend
            mallice={getMalliceSystemNumber(options, planets, factions)}
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
  const actionLog = useActionLog();
  const components = useComponents();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const relics = useRelics();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const { openModal } = useSharedModal();

  const playedComponent = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  const component = playedComponent
    ? components[playedComponent as ComponentId]
    : null;

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
        component.type !== "TECH"
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
                  if (!gameId) {
                    return;
                  }
                  const updatedName = agent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(/ Ω/g, "");
                  selectSubComponentAsync(gameId, add ? updatedName : "None");
                }}
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
      const parsedTile = parseInt(updatedTile);
      if (parsedTile > 4200) {
        return (parsedTile - 3200).toString();
      }
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
        <Map
          mapString={updatedSystemTiles.join(" ")}
          mapStyle={options["map-style"]}
          factions={mapOrderedFactions}
          mallice={getMalliceSystemNumber(options, planets, factions)}
          hideLegend
        />
      </div>
    );
  }
  const mallice = getMalliceSystemNumber(options, planets, factions);
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
                if (dragItem.index === dropItem.index) {
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
