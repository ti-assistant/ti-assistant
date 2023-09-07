import { useRouter } from "next/router";
import React, { CSSProperties, ReactNode, useState } from "react";
import { capitalizeFirstLetter } from "../../../pages/setup";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { LabeledDiv, LabeledLine } from "../../LabeledDiv";
import { Modal } from "../../Modal";
import { PlanetRow } from "../../PlanetRow";
import { SelectableRow } from "../../SelectableRow";
import { Selector } from "../../Selector";
import { TechRow } from "../../TechRow";
import { FactionSelectRadialMenu } from "../../components/FactionSelect";
import { TacticalAction } from "../../components/TacticalAction";
import { useGameData } from "../../data/GameData";
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
import { addAttachment, removeAttachment } from "../../util/api/addAttachment";
import { addTech, removeTech } from "../../util/api/addTech";
import { Component } from "../../util/api/components";
import { Faction } from "../../util/api/factions";
import { gainRelic, loseRelic } from "../../util/api/gainRelic";
import { playComponent, unplayComponent } from "../../util/api/playComponent";
import { selectFaction } from "../../util/api/selectFaction";
import { selectSubComponent } from "../../util/api/selectSubComponent";
import { Tech, hasTech } from "../../util/api/techs";
import { updatePlanetState } from "../../util/api/updatePlanetState";
import { getFactionColor } from "../../util/factions";
import { PlayComponentData } from "../../util/model/playComponent";
import { applyAllPlanetAttachments } from "../../util/planets";
import { pluralize, responsivePixels } from "../../util/util";
import { TechSelectHoverMenu } from "./TechSelectHoverMenu";

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
  const actionCards = components.filter(
    (component) => component.type === "CARD"
  );
  const techs = components.filter((component) => component.type === "TECH");
  const leaders = components
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
  const exploration = components.filter((component) => {
    if (component.type === "EXPLORATION") {
      return true;
    }
    if (component.type !== "RELIC") {
      return false;
    }
    return true;
  });
  const promissory = components.filter(
    (component) => component.type === "PROMISSORY"
  );
  const promissoryByFaction: Record<string, Component[]> = {};
  promissory.forEach((component) => {
    if (!component.faction) {
      return;
    }
    const factionComponents = promissoryByFaction[component.faction] ?? [];
    factionComponents.push(component);
    promissoryByFaction[component.faction] = factionComponents;
  });
  const others = components.filter(
    (component) =>
      component.type !== "LEADER" &&
      component.type !== "TECH" &&
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
            {Object.entries(promissoryByFaction).map(
              ([factionName, components]) => {
                return (
                  <div className="flexColumn" key={factionName}>
                    <LabeledDiv noBlur={true} label={factionName}>
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
              }
            )}
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

function ComponentDetails({ factionName }: { factionName: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "attachments",
    "factions",
    "objectives",
    "planets",
    "relics",
    "techs",
  ]);
  const attachments = gameData.attachments;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const planets = gameData.planets;
  const relics = gameData.relics;
  const techs = gameData.techs;

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  if (!factions) {
    return null;
  }

  function getResearchableTechs(faction: Faction) {
    const replaces: string[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.name)) {
        return false;
      }
      if (!factions || (tech.faction && !factions[tech.faction])) {
        return false;
      }
      if (
        faction.name !== "Nekro Virus" &&
        tech.faction &&
        faction.name !== tech.faction
      ) {
        return false;
      }
      const researchedTechs = getResearchedTechs(currentTurn, faction.name);
      if (researchedTechs.includes(tech.name)) {
        return false;
      }
      if (tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    if (faction.name !== "Nekro Virus") {
      return availableTechs.filter((tech) => !replaces.includes(tech.name));
    }
    return availableTechs;
  }

  function addTechLocal(tech: Tech) {
    if (!gameid) {
      return;
    }
    addTech(gameid, factionName, tech.name);
  }
  function removeTechLocal(techName: string) {
    if (!gameid) {
      return;
    }
    removeTech(gameid, factionName, techName);
  }
  function addRemoveTech(tech: Tech) {
    if (!gameid) {
      return;
    }
    removeTech(gameid, factionName, tech.name);
  }
  function clearAddedTech(techName: string) {
    if (!gameid) {
      return;
    }
    addTech(gameid, factionName, techName);
  }
  function addRelic(relicName: string) {
    if (!gameid) {
      return;
    }
    gainRelic(gameid, factionName, relicName);
  }
  function removeRelic(relicName: string) {
    if (!gameid) {
      return;
    }
    loseRelic(gameid, factionName, relicName);
  }
  function destroyPlanet(planetName: string) {
    if (!gameid) {
      return;
    }

    updatePlanetState(gameid, planetName, "PURGED");
  }
  function undestroyPlanet(planetName: string) {
    if (!gameid) {
      return;
    }
    updatePlanetState(gameid, planetName, "READIED");
  }
  function toggleAttachment(
    planetName: string,
    attachmentName: string,
    add: boolean
  ) {
    if (!gameid) {
      return;
    }

    if (add) {
      addAttachment(gameid, planetName, attachmentName);
    } else {
      removeAttachment(gameid, planetName, attachmentName);
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
      const faction = factions[factionName];
      if (!faction) {
        break;
      }
      if (factionName === "Nekro Virus") {
        innerContent = "Gain 3 command tokens";
        break;
      }
      const researchedTech = getResearchedTechs(currentTurn, factionName);
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
            factionName={factionName}
            techs={availableTechs}
            selectTech={addTechLocal}
          />
        );
      }
      break;
    }
    case "Divert Funding": {
      const faction = factions[factionName];
      if (!faction || !techs) {
        break;
      }
      const returnedTechs = getReplacedTechs(currentTurn, factionName);
      const canReturnTechs = Object.keys(faction.techs ?? {})
        .filter((tech) => {
          const techObj = techs[tech];
          if (!techObj) {
            return false;
          }
          return !techObj.faction && techObj.type !== "UPGRADE";
        })
        .map((tech) => techs[tech] as Tech);
      const researchedTech = getResearchedTechs(currentTurn, factionName);
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
              ) : factionName !== "Nekro Virus" ? (
                <TechSelectHoverMenu
                  factionName={factionName}
                  techs={availableTechs}
                  selectTech={addTechLocal}
                />
              ) : (
                "Gain 3 command tokens"
              )}
            </React.Fragment>
          ) : (
            <TechSelectHoverMenu
              factionName={factionName}
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
      const faction = factions[factionName];
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
        .map((relic) => relic.name);
      leftLabel = "Gained Relic";
      innerContent =
        unownedRelics.length > 0 ? (
          <Selector
            hoverMenuLabel="Gain Relic"
            options={unownedRelics}
            renderItem={(itemName) => {
              const relic = (relics ?? {})[itemName];
              if (!relic) {
                return null;
              }
              return (
                <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
                  <SelectableRow itemName={relic.name} removeItem={removeRelic}>
                    <InfoRow
                      infoTitle={relic.name}
                      infoContent={relic.description}
                    >
                      {relic.name}
                    </InfoRow>
                  </SelectableRow>
                  {relic.name === "Shard of the Throne" ? (
                    <div>+1 VP</div>
                  ) : null}
                </div>
              );
            }}
            selectedItem={getGainedRelic(currentTurn)}
            toggleItem={(relicName, add) => {
              if (add) {
                addRelic(relicName);
              } else {
                removeRelic(relicName);
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
            planet.name !== "Mecatol Rex"
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
              (planet) => planet.name
            )}
            selectedItem={destroyedPlanet}
            toggleItem={(planetName, add) => {
              if (add) {
                destroyPlanet(planetName);
              } else {
                undestroyPlanet(planetName);
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
            planet.owner === factionName &&
            !planet.home &&
            !planet.attributes.includes("legendary")
          );
        }
      );
      let nanoForgedPlanet: string | undefined;
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments ?? []).includes("Nano-Forge")) {
          nanoForgedPlanet = planet.name;
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
            options={ownedNonHomeNonLegendaryPlanets.map(
              (planet) => planet.name
            )}
            renderItem={(planetName) => {
              const planet = updatedPlanets.find(
                (planet) => planet.name === planetName
              );
              if (!planet) {
                return null;
              }
              return (
                <PlanetRow
                  planet={planet}
                  factionName={factionName}
                  removePlanet={() =>
                    toggleAttachment(planetName, "Nano-Forge", false)
                  }
                />
              );
            }}
            selectedItem={nanoForgedPlanet}
            toggleItem={(planetName, add) => {
              toggleAttachment(planetName, "Nano-Forge", add);
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
            planet.owner === factionName &&
            !planet.home &&
            !planet.attributes.includes("legendary") &&
            planet.name !== "Mecatol Rex"
          );
        }
      );
      let terraformedPlanet: string | undefined;
      Object.values(planets).forEach((planet) => {
        if ((planet.attachments ?? []).includes("Terraform")) {
          terraformedPlanet = planet.name;
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
              (planet) => planet.name
            )}
            selectedItem={terraformedPlanet}
            renderItem={(planetName) => {
              const planet = updatedPlanets.find(
                (planet) => planet.name === planetName
              );
              if (!planet) {
                return null;
              }
              return (
                <PlanetRow
                  planet={planet}
                  factionName={factionName}
                  removePlanet={() =>
                    toggleAttachment(planetName, "Terraform", false)
                  }
                />
              );
            }}
            toggleItem={(planetName, add) => {
              toggleAttachment(planetName, "Terraform", add);
            }}
          />
        </div>
      );
      break;
    }
    case "Dannel of the Tenth": {
      const nonHomeUnownedPlanets = updatedPlanets.filter((planet) => {
        return !planet.home && !planet.locked && planet.owner !== factionName;
      });
      const conqueredPlanets = getClaimedPlanets(currentTurn, factionName);
      const claimablePlanets = Object.values(planets ?? {}).filter((planet) => {
        if (planet.home || planet.locked || planet.owner === factionName) {
          return false;
        }
        if (planet.owner === factionName) {
          return false;
        }
        return true;
      });
      const scoredObjectives = getScoredObjectives(currentTurn, factionName);
      const scorableObjectives = Object.values(objectives ?? {}).filter(
        (objective) => {
          const scorers = objective.scorers ?? [];
          if (scorers.includes(factionName)) {
            return false;
          }
          if (
            objective.name === "Betray a Friend" ||
            objective.name === "Become a Martyr" ||
            objective.name === "Prove Endurance" ||
            objective.name === "Darken the Skies" ||
            objective.name === "Demonstrate Your Power" ||
            objective.name === "Destroy Their Greatest Ship" ||
            objective.name === "Fight With Precision" ||
            objective.name === "Make an Example of Their World" ||
            objective.name === "Turn Their Fleets to Dust" ||
            objective.name === "Unveil Flagship"
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
          activeFactionName="Yin Brotherhood"
          attachments={attachments ?? {}}
          claimablePlanets={conqueredPlanets.length < 3 ? claimablePlanets : []}
          conqueredPlanets={conqueredPlanets}
          currentTurn={getCurrentTurnLogEntries(gameData.actionLog ?? [])}
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
      const selectedFaction = getSelectedFaction(currentTurn);

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
          if (claimedPlanet.planet === planet.name) {
            return false;
          }
        }
        if (claimedPlanets.length > 0) {
          const claimedPlanetName = claimedPlanets[0]?.planet;
          const claimedPlanet = planets[claimedPlanetName ?? ""];
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
          if (scorers.includes(selectedFaction ?? "")) {
            return false;
          }
          if (scoredObjectives.includes(objective.name)) {
            return false;
          }
          if (
            objective.name === "Become a Martyr" ||
            objective.name === "Prove Endurance"
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
          allowNone={false}
          selectedFaction={selectedFaction}
          options={Object.keys(factions)}
          onSelect={(factionName, _) => {
            if (!gameid) {
              return;
            }
            selectFaction(gameid, factionName ?? "None");
          }}
          size={44}
          borderColor={getFactionColor(factions[selectedFaction ?? ""])}
        />
      );
      lineColor = getFactionColor(factions[selectedFaction ?? ""]);
      innerContent = (
        <div style={{ width: "100%", minHeight: responsivePixels(12) }}>
          {selectedFaction ? (
            <div style={{ paddingTop: responsivePixels(12) }}>
              <TacticalAction
                activeFactionName={selectedFaction}
                attachments={attachments ?? {}}
                claimablePlanets={claimablePlanets}
                conqueredPlanets={claimedPlanets}
                currentTurn={getCurrentTurnLogEntries(gameData.actionLog ?? [])}
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
      const faction = factions[factionName];
      if (!faction) {
        break;
      }
      const researchedTech = getResearchedTechs(currentTurn, factionName);
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
            factionName={factionName}
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
        if (planet.owner !== factionName) {
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
      let bestPlanet = null;
      updatedPlanets
        .filter((planet) => {
          if (planet.owner !== factionName) {
            return false;
          }
          return true;
        })
        .forEach((planet) => {
          if (planet.resources > maxValue) {
            bestPlanet = planet.name;
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

export function ComponentAction({ factionName }: { factionName: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "components",
    "factions",
    "relics",
  ]);
  const components = gameData.components;
  const factions = gameData.factions;
  const relics = gameData.relics;

  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

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
    playComponent(gameid, updatedName);
  }

  function unselectComponent(componentName: string) {
    if (!gameid) {
      return;
    }

    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    unplayComponent(gameid, updatedName);
  }

  if (!factions) {
    return null;
  }

  const faction = factions[factionName];

  if (!faction) {
    return null;
  }

  const unownedRelics = Object.values(relics ?? {})
    .filter((relic) => !relic.owner)
    .map((relic) => relic.name);

  if (!component) {
    const filteredComponents = Object.values(components ?? {}).filter(
      (component) => {
        if (component.type === "PROMISSORY") {
          if (
            component.faction &&
            (!factions[component.faction] || component.faction === faction.name)
          ) {
            return false;
          }
        }
        if (
          component.faction &&
          component.type !== "PROMISSORY" &&
          component.type !== "TECH"
        ) {
          if (component.faction !== faction.name) {
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
          component.subFaction &&
          component.subFaction !== faction.startswith.faction
        ) {
          return false;
        }

        if (component.type === "RELIC") {
          const relic = (relics ?? {})[component.name];
          if (!relic) {
            return false;
          }
          if (relic.owner !== factionName) {
            return false;
          }
        }

        if (component.type === "TECH" && !hasTech(faction, component.name)) {
          return false;
        }

        if (component.state === "purged") {
          return false;
        }

        if (component.leader === "HERO" && faction.hero !== "unlocked") {
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
            itemName={component.name}
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
                  selectSubComponent(gameid, add ? updatedName : "None");
                }}
              />
            </div>
          ) : null}
          <ComponentDetails factionName={factionName} />
        </LabeledDiv>
      </div>
    </React.Fragment>
  );

  return null;
}
