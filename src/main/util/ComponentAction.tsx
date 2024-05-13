"use client";

import React, { CSSProperties, ReactNode, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { TechRow } from "../../TechRow";
import FactionSelectRadialMenu from "../../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FrontierExploration from "../../components/FrontierExploration/FrontierExploration";
import LabeledDiv from "../../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../components/LabeledLine/LabeledLine";
import Modal from "../../components/Modal/Modal";
import PlanetRow from "../../components/PlanetRow/PlanetRow";
import { Selector } from "../../components/Selector/Selector";
import { TacticalAction } from "../../components/TacticalAction";
import TechSelectHoverMenu from "../../components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  ActionLogContext,
  AttachmentContext,
  ComponentContext,
  FactionContext,
  GameIdContext,
  LeaderContext,
  ObjectiveContext,
  PlanetContext,
  RelicContext,
  TechContext,
} from "../../context/Context";
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
} from "../../util/actionLog";
import { getCurrentTurnLogEntries } from "../../util/api/actionLog";
import { hasTech } from "../../util/api/techs";
import { getFactionColor, getFactionName } from "../../util/factions";
import { applyAllPlanetAttachments } from "../../util/planets";
import { pluralize } from "../../util/util";

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
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
      }}
    >
      <div className="flexColumn">{description}</div>
    </div>
  );
}

function ComponentSelect({
  components,
  selectComponent,
}: {
  components: Component[];
  selectComponent: (componentName: string) => void;
}) {
  const factions = useContext(FactionContext);
  const leaders = useContext(LeaderContext);

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
    padding: "8px",
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: "repeat(10, auto)",
    gap: "4px",
    maxWidth: "85vw",
    overflowX: "auto",
    justifyContent: "flex-start",
  };

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return (
    <div
      className={className}
      style={{
        padding: "8px",
        alignItems: "stretch",
        gap: "4px",
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
              return (
                <button
                  key={component.id}
                  style={{ writingMode: "horizontal-tb" }}
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
            style={{ alignItems: "stretch", padding: "8px" }}
          >
            {leaderComponents.map((component) => {
              const leader = leaders[component.id as LeaderId];
              if (!leader || leader.state === "purged") {
                return null;
              }
              return (
                <div className="flexColumn" key={component.id}>
                  <LabeledDiv
                    noBlur={true}
                    label={capitalizeFirstLetter(component.leader ?? "")}
                  >
                    <button
                      className={leader.state === "exhausted" ? "faded" : ""}
                      onClick={() => selectComponent(component.id)}
                    >
                      {component.name}
                    </button>
                  </LabeledDiv>
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
              gap: "4px",
              alignItems: "stretch",
              padding: "8px",
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
            style={{ alignItems: "stretch", padding: "8px" }}
          >
            {Object.entries(promissoryByFaction).map(([id, components]) => {
              const faction = factions[id as FactionId];
              if (!faction) {
                return null;
              }
              return (
                <div className="flexColumn" key={faction.id}>
                  <LabeledDiv noBlur={true} label={getFactionName(faction)}>
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
                  </LabeledDiv>
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
            style={{ alignItems: "stretch", padding: "8px" }}
          >
            {others.map((component) => {
              if (component.type === "FLAGSHIP") {
                return (
                  <div className="flexColumn" key={component.id}>
                    <LabeledDiv
                      noBlur={true}
                      label={capitalizeFirstLetter(component.type)}
                    >
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
                    </LabeledDiv>
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
  const actionLog = useContext(ActionLogContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const relics = useContext(RelicContext);
  const techs = useContext(TechContext);

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

  let leftLabel: ReactNode | undefined = (
    <FormattedMessage
      id="fVAave"
      description="Label for a section containing additional details."
      defaultMessage="Details"
    />
  );
  let label: ReactNode | undefined;
  let rightLabel: ReactNode | undefined;
  let lineColor: string | undefined;
  let innerContent: ReactNode | undefined;

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
      // TODO: Check if Mecatol can be Nano-Forged
      const ownedNonHomeNonLegendaryPlanets = updatedPlanets.filter(
        (planet) => {
          return (
            planet.owner === factionId &&
            !planet.home &&
            !planet.attributes.includes("legendary")
          );
        }
      );
      let nanoForgedPlanet: PlanetId | undefined;
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments ?? []).includes("Nano-Forge")) {
          nanoForgedPlanet = planet.id;
        }
      });
      if (nanoForgedPlanet) {
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
                />
              );
            }}
            selectedItem={nanoForgedPlanet}
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
      let terraformedPlanet: PlanetId | undefined;
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
        <div style={{ width: "100%", minHeight: "12px" }}>
          {selectedFaction ? (
            <div style={{ paddingTop: "12px" }}>
              <TacticalAction
                activeFactionId={selectedFaction}
                attachments={attachments ?? {}}
                claimablePlanets={claimablePlanets}
                conqueredPlanets={claimedPlanets}
                currentTurn={getCurrentTurnLogEntries(actionLog)}
                factions={factions ?? {}}
                gameid={gameId ?? ""}
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
    //     padding: "8px",
    //     display: "grid",
    //     gridAutoFlow: "column",
    //     gridTemplateRows: "repeat(14, auto)",
    //     gap: "4px",
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
      let bestPlanet: PlanetId | undefined;
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
  }
  if (!innerContent) {
    return null;
  }
  return (
    <div className="flexColumn" style={{ width: "100%", gap: "4px" }}>
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
  const actionLog = useContext(ActionLogContext);
  const components = useContext(ComponentContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const leaders = useContext(LeaderContext);
  const relics = useContext(RelicContext);

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  const playedComponent = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  const component = (components ?? {})[playedComponent ?? ""] ?? null;

  async function selectComponent(componentName: string) {
    if (!gameId) {
      return;
    }
    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    playComponentAsync(gameId, updatedName);
  }

  function unselectComponent(componentName: string) {
    if (!gameId) {
      return;
    }

    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    unplayComponentAsync(gameId, updatedName);
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

  if (!component) {
    const filteredComponents = Object.values(components ?? {}).filter(
      (component) => {
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
      }
    );

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
        />
      </ClientOnlyHoverMenu>
    );
  }

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

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={
          <div className="flexColumn" style={{ fontSize: "40px" }}>
            {component.name}
          </div>
        }
        level={2}
      >
        <InfoContent component={component} />
      </Modal>
      <div
        className="flexColumn largeFont"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <LabeledDiv
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
              onClick={displayInfo}
              style={{ fontSize: "16px" }}
            >
              &#x24D8;
            </div>
          </SelectableRow>
          {component.id === "Ssruu" ? (
            <div className="flexRow" style={{ paddingLeft: "16px" }}>
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
