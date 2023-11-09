import { useRouter } from "next/router";
import React, { CSSProperties, ReactNode, useContext, useState } from "react";
import { capitalizeFirstLetter } from "../../../pages/setup";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { Selector } from "../../Selector";
import { TechRow } from "../../TechRow";
import FactionSelectRadialMenu from "../../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../components/LabeledLine/LabeledLine";
import Modal from "../../components/Modal/Modal";
import PlanetRow from "../../components/PlanetRow/PlanetRow";
import { TacticalAction } from "../../components/TacticalAction";
import TechSelectHoverMenu from "../../components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  ActionLogContext,
  AttachmentContext,
  ComponentContext,
  FactionContext,
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
import { getFactionColor } from "../../util/factions";
import { applyAllPlanetAttachments } from "../../util/planets";
import { pluralize, responsivePixels } from "../../util/util";

function InfoContent({ component }: { component: Component }) {
  const description = component.description.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: "320px",
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
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
  const nonTechComponents: (BaseComponent & GameComponent)[] =
    components.filter(
      (component) => component.type !== "TECH"
    ) as (BaseComponent & GameComponent)[];
  const actionCards = nonTechComponents.filter(
    (component) => component.type === "CARD"
  );
  const techs = components.filter((component) => component.type === "TECH");
  const leaders = nonTechComponents
    .filter((component) => component.type === "LEADER")
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
    padding: responsivePixels(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: "repeat(10, auto)",
    gap: responsivePixels(4),
    maxWidth: "85vw",
    overflowX: "auto",
    justifyContent: "flex-start",
  };

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return (
    <div
      className={className}
      style={{
        padding: responsivePixels(8),
        alignItems: "stretch",
        gap: responsivePixels(4),
        justifyContent: "flex-start",
        maxWidth: "85vw",
      }}
    >
      <ClientOnlyHoverMenu label="Action Cards">
        <div className="flexRow" style={innerStyle}>
          {actionCards.map((component) => {
            return (
              <button
                key={component.name}
                style={{ writingMode: "horizontal-tb" }}
                className={
                  component.state === "exhausted" || component.state === "used"
                    ? "faded"
                    : ""
                }
                onClick={() => selectComponent(component.name)}
              >
                {component.name}
              </button>
            );
          })}
        </div>
      </ClientOnlyHoverMenu>
      {techs.length > 0 ? (
        <ClientOnlyHoverMenu label="Techs">
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
                  key={component.name}
                  style={{ writingMode: "horizontal-tb" }}
                  className={
                    component.state === "exhausted" ||
                    component.state === "used"
                      ? "faded"
                      : ""
                  }
                  onClick={() => selectComponent(component.name)}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {leaders.length > 0 ? (
        <ClientOnlyHoverMenu label="Leaders">
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: responsivePixels(8) }}
          >
            {leaders.map((component) => {
              return (
                <div className="flexColumn" key={component.name}>
                  <LabeledDiv
                    noBlur={true}
                    label={capitalizeFirstLetter(component.leader ?? "")}
                  >
                    <button
                      className={
                        component.state === "exhausted" ||
                        component.state === "used"
                          ? "faded"
                          : ""
                      }
                      onClick={() => selectComponent(component.name)}
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
        <ClientOnlyHoverMenu label="Exploration/Relic">
          <div
            className="flexColumn"
            style={{
              gap: responsivePixels(4),
              alignItems: "stretch",
              padding: responsivePixels(8),
            }}
          >
            {exploration.map((component) => {
              return (
                <button
                  key={component.name}
                  className={
                    component.state === "exhausted" ||
                    component.state === "used"
                      ? "faded"
                      : ""
                  }
                  onClick={() => selectComponent(component.name)}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {promissory.length > 0 ? (
        <ClientOnlyHoverMenu label="Promissory">
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: responsivePixels(8) }}
          >
            {Object.entries(promissoryByFaction).map(([id, components]) => {
              const factionId = id as FactionId;
              return (
                <div className="flexColumn" key={factionId}>
                  <LabeledDiv noBlur={true} label={factionId}>
                    {components.map((component) => {
                      return (
                        <button
                          key={component.name}
                          className={
                            component.state === "exhausted" ||
                            component.state === "used"
                              ? "faded"
                              : ""
                          }
                          onClick={() => selectComponent(component.name)}
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
        <ClientOnlyHoverMenu label="Other">
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: responsivePixels(8) }}
          >
            {others.map((component) => {
              if (component.type === "FLAGSHIP") {
                return (
                  <div className="flexColumn" key={component.name}>
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
                        onClick={() => selectComponent(component.name)}
                      >
                        {component.name}
                      </button>
                    </LabeledDiv>
                  </div>
                );
              }
              return (
                <button
                  key={component.name}
                  onClick={() => selectComponent(component.name)}
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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const relics = useContext(RelicContext);
  const techs = useContext(TechContext);

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
    if (!gameid) {
      return;
    }
    addTechAsync(gameid, factionId, tech.id);
  }
  function removeTechLocal(techId: TechId) {
    if (!gameid) {
      return;
    }
    removeTechAsync(gameid, factionId, techId);
  }
  function addRemoveTech(tech: Tech) {
    if (!gameid) {
      return;
    }
    removeTechAsync(gameid, factionId, tech.id);
  }
  function clearAddedTech(techId: TechId) {
    if (!gameid) {
      return;
    }
    addTechAsync(gameid, factionId, techId);
  }
  function addRelic(relicId: RelicId) {
    if (!gameid) {
      return;
    }
    gainRelicAsync(gameid, factionId, relicId);
  }
  function removeRelic(relicId: RelicId) {
    if (!gameid) {
      return;
    }
    loseRelicAsync(gameid, factionId, relicId);
  }
  function destroyPlanet(planetId: PlanetId) {
    if (!gameid) {
      return;
    }

    updatePlanetStateAsync(gameid, planetId, "PURGED");
  }
  function undestroyPlanet(planetId: PlanetId) {
    if (!gameid) {
      return;
    }
    updatePlanetStateAsync(gameid, planetId, "READIED");
  }
  function toggleAttachment(
    planetId: PlanetId,
    attachmentId: AttachmentId,
    add: boolean
  ) {
    if (!gameid) {
      return;
    }

    if (add) {
      addAttachmentAsync(gameid, planetId, attachmentId);
    } else {
      removeAttachmentAsync(gameid, planetId, attachmentId);
    }
  }

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets ?? {}),
    attachments ?? {}
  );

  let leftLabel: ReactNode | undefined = "Details";
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
        innerContent = "Gain 3 command tokens";
        break;
      }
      const researchedTech = getResearchedTechs(currentTurn, factionId);
      const availableTechs = getResearchableTechs(faction);

      if (researchedTech.length > 0) {
        leftLabel = "Researched Tech";
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
            techs={availableTechs}
            selectTech={addTechLocal}
          />
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
              <LabeledDiv label="Returned Tech">
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
                <LabeledDiv label="Researched Tech">
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
                  techs={availableTechs}
                  selectTech={addTechLocal}
                />
              ) : (
                "Gain 3 command tokens"
              )}
            </React.Fragment>
          ) : (
            <TechSelectHoverMenu
              factionId={factionId}
              techs={canReturnTechs}
              label="Return Tech"
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
        <React.Fragment>{`Gain ${numCommodities} Trade Goods`}</React.Fragment>
      );
      break;
    }
    case "Gain Relic":
    case "Black Market Forgery":
    case "Hesh and Prit":
    case "Fabrication": {
      const unownedRelics = Object.values(relics ?? {})
        .filter((relic) => !relic.owner)
        .map((relic) => relic.id);
      leftLabel = "Gained Relic";
      innerContent =
        unownedRelics.length > 0 ? (
          <Selector
            hoverMenuLabel="Gain Relic"
            options={unownedRelics}
            renderItem={(itemId) => {
              const relic = (relics ?? {})[itemId];
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
            selectedItem={getGainedRelic(currentTurn)}
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
      }
      innerContent = (
        <div
          className="flexColumn"
          style={{ width: "100%", alignItems: "flex-start" }}
        >
          <Selector
            hoverMenuLabel="Destroy Planet"
            options={nonHomeNonLegendaryNonMecatolPlanets.map(
              (planet) => planet.id
            )}
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
          <Selector<PlanetId>
            hoverMenuLabel="Attach to Planet"
            options={ownedNonHomeNonLegendaryPlanets.map((planet) => planet.id)}
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
            options={ownedNonHomeNonLegendaryNonMecatolPlanets.map(
              (planet) => planet.id
            )}
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
          gameid={gameid ?? ""}
          objectives={objectives ?? {}}
          planets={planets ?? {}}
          scoredObjectives={scoredObjectives}
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
      const scorableObjectives = Object.values(objectives ?? {}).filter(
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
      label = selectedFaction ? "Tactical Action" : "Select Faction";
      rightLabel = (
        <FactionSelectRadialMenu
          selectedFaction={selectedFaction}
          factions={Object.values(factions)
            .sort((a, b) => a.mapPosition - b.mapPosition)
            .map((faction) => faction.id)}
          onSelect={(factionId, _) => {
            if (!gameid) {
              return;
            }
            selectFactionAsync(gameid, factionId ?? "None");
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
        <div style={{ width: "100%", minHeight: responsivePixels(12) }}>
          {selectedFaction ? (
            <div style={{ paddingTop: responsivePixels(12) }}>
              <TacticalAction
                activeFactionId={selectedFaction}
                attachments={attachments ?? {}}
                claimablePlanets={claimablePlanets}
                conqueredPlanets={claimedPlanets}
                currentTurn={getCurrentTurnLogEntries(actionLog)}
                factions={factions ?? {}}
                gameid={gameid ?? ""}
                objectives={objectives ?? {}}
                planets={planets ?? {}}
                scorableObjectives={scorableObjectives}
                scoredObjectives={scoredObjectives}
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
        leftLabel = "Gained Tech";
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
            label="Gain Tech"
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
    //     padding: responsivePixels(8),
    //     display: "grid",
    //     gridAutoFlow: "column",
    //     gridTemplateRows: "repeat(14, auto)",
    //     gap: responsivePixels(4),
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
          {`Gain ${numIndustrialPlanets} ${pluralize(
            "trade good",
            numIndustrialPlanets
          )}`}
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
    <div
      className="flexColumn"
      style={{ width: "100%", gap: responsivePixels(4) }}
    >
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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const actionLog = useContext(ActionLogContext);
  const components = useContext(ComponentContext);
  const factions = useContext(FactionContext);
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
    if (!gameid) {
      return;
    }
    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    playComponentAsync(gameid, updatedName);
  }

  function unselectComponent(componentName: string) {
    if (!gameid) {
      return;
    }

    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    unplayComponentAsync(gameid, updatedName);
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
          (component.name === "Gain Relic" ||
            component.name === "Black Market Forgery")
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
          const relic = (relics ?? {})[component.name as RelicId];
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

        if (
          "leader" in component &&
          component.leader === "HERO" &&
          faction.hero !== "readied"
        ) {
          return false;
        }

        return true;
      }
    );

    return (
      <ClientOnlyHoverMenu label="Select Component">
        <ComponentSelect
          components={filteredComponents}
          selectComponent={selectComponent}
        />
      </ClientOnlyHoverMenu>
    );
  }

  const agentsForSsruu = Object.values(components ?? {})
    .filter((component) => {
      if (component.type !== "LEADER") {
        return false;
      }
      if (component.leader !== "AGENT") {
        return false;
      }
      if (component.name === "Ssruu") {
        return false;
      }
      return true;
    })
    .map((component) => component.name);

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        visible={showInfoModal}
        title={
          <div
            className="flexColumn"
            style={{ fontSize: responsivePixels(40) }}
          >
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
        <LabeledDiv label="Component" style={{ width: "90%" }}>
          <SelectableRow
            itemId={component.name}
            removeItem={() => unselectComponent(component.name)}
          >
            {component.name}
            <div
              className="popupIcon"
              onClick={displayInfo}
              style={{ fontSize: responsivePixels(16) }}
            >
              &#x24D8;
            </div>
          </SelectableRow>
          {component.name === "Ssruu" ? (
            <div
              className="flexRow"
              style={{ paddingLeft: responsivePixels(16) }}
            >
              Using the ability of
              <Selector
                hoverMenuLabel="Select Agent"
                options={agentsForSsruu}
                selectedItem={getSelectedSubComponent(currentTurn)}
                toggleItem={(agent, add) => {
                  if (!gameid) {
                    return;
                  }
                  const updatedName = agent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(/ Ω/g, "");
                  selectSubComponentAsync(gameid, add ? updatedName : "None");
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
