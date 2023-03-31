import { useRouter } from "next/router";
import React, { CSSProperties, ReactNode, useState } from "react";
import useSWR from "swr";
import { capitalizeFirstLetter } from "../../../pages/setup";
import { AgendaRow } from "../../AgendaRow";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { LabeledDiv, LabeledLine } from "../../LabeledDiv";
import { Modal } from "../../Modal";
import { PlanetRow } from "../../PlanetRow";
import { SelectableRow } from "../../SelectableRow";
import { Selector } from "../../Selector";
import { TechRow } from "../../TechRow";
import { Agenda } from "../../util/api/agendas";
import { Attachment } from "../../util/api/attachments";
import { Component } from "../../util/api/components";
import { Faction } from "../../util/api/factions";
import {
  addAttachment,
  Planet,
  purgePlanet,
  removeAttachment,
  unclaimPlanet,
  unpurgePlanet,
} from "../../util/api/planets";
import { gainRelic, loseRelic, Relic } from "../../util/api/relics";
import {
  addSubStatePlanet,
  addSubStateTech,
  clearAddedSubStateTech,
  clearRemovedSubStateTech,
  clearSubState,
  destroySubStatePlanet,
  removeRepealedSubStateAgenda,
  removeSubStatePlanet,
  removeSubStateTech,
  repealSubStateAgenda,
  selectSubStateComponent,
  setSubStateOther,
  setSubStateSelectedAction,
  SubState,
  toggleSubStateAttachment,
  toggleSubStateRelic,
} from "../../util/api/subState";
import { hasTech, Tech } from "../../util/api/techs";
import { fetcher } from "../../util/api/util";
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
          <div className="flexRow" style={innerStyle}>
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
  const { data: techs }: { data?: Record<string, Tech> } = useSWR(
    gameid ? `/api/${gameid}/techs` : null,
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
  const { data: relics }: { data?: Record<string, Relic> } = useSWR(
    gameid ? `/api/${gameid}/relics` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

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
      const researchedTechs =
        ((subState?.factions ?? {})[faction.name] ?? {}).techs ?? [];
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

  function addTech(tech: Tech) {
    if (!gameid) {
      return;
    }
    addSubStateTech(gameid, factionName, tech.name);
  }
  function removeTech(techName: string) {
    if (!gameid) {
      return;
    }
    clearAddedSubStateTech(gameid, factionName, techName);
  }
  function addRemoveTech(tech: Tech) {
    if (!gameid) {
      return;
    }
    removeSubStateTech(gameid, factionName, tech.name);
  }
  function clearAddedTech(techName: string) {
    if (!gameid) {
      return;
    }
    clearRemovedSubStateTech(gameid, factionName, techName);
  }
  function addRelic(relicName: string) {
    if (!gameid) {
      return;
    }
    gainRelic(gameid, relicName, factionName);
    toggleSubStateRelic(gameid, relicName, factionName);
  }
  function removeRelic(relicName: string) {
    if (!gameid) {
      return;
    }
    loseRelic(gameid, relicName, factionName);
    toggleSubStateRelic(gameid, undefined, factionName);
  }
  function destroyPlanet(planetName: string) {
    if (!gameid) {
      return;
    }
    const prevOwner = (planets ?? {})[planetName]?.owner;

    purgePlanet(gameid, planetName);
    destroySubStatePlanet(gameid, planetName, prevOwner);
  }
  function undestroyPlanet(planetName: string) {
    if (!gameid) {
      return;
    }
    let prevOwner = subState?.turnData?.destroyedPlanet?.prevOwner;
    unpurgePlanet(gameid, planetName);
    destroySubStatePlanet(gameid, undefined, prevOwner);
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
    toggleSubStateAttachment(
      gameid,
      add ? planetName : undefined,
      attachmentName
    );
  }
  function gainPlanet(planetName: string) {
    if (!gameid) {
      return;
    }
    addSubStatePlanet(gameid, factionName, planetName);
  }
  function losePlanet(planetName: string) {
    if (!gameid) {
      return;
    }
    removeSubStatePlanet(gameid, factionName, planetName);
  }
  // function repealLaw(lawName: string) {
  //   if (!gameid) {
  //     return;
  //   }
  //   repealSubStateAgenda(gameid, lawName);
  // }
  // function removeRepealedAgenda() {
  //   if (!gameid) {
  //     return;
  //   }
  //   removeRepealedSubStateAgenda(gameid);
  // }

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets ?? {}),
    attachments ?? {}
  );

  let label = "Details";
  let innerContent: ReactNode | undefined;
  switch (subState?.turnData?.component?.name) {
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
      const researchedTech =
        ((subState.turnData?.factions ?? {})[factionName] ?? {}).techs ?? [];
      const availableTechs = getResearchableTechs(faction);

      if (researchedTech.length > 0) {
        label = "Researched Tech";
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
                  removeTech={() => removeTech(tech)}
                />
              );
            })}
          </React.Fragment>
        );
      } else {
        innerContent = (
          <TechSelectHoverMenu techs={availableTechs} selectTech={addTech} />
        );
      }
      break;
    }
    case "Divert Funding": {
      const faction = factions[factionName];
      if (!faction || !techs) {
        break;
      }
      const returnedTechs =
        ((subState.turnData?.factions ?? {})[factionName] ?? {}).removeTechs ??
        [];
      const canReturnTechs = Object.keys(faction.techs ?? {})
        .filter((tech) => {
          const techObj = techs[tech];
          if (!techObj) {
            return false;
          }
          return !techObj.faction && techObj.type !== "UPGRADE";
        })
        .map((tech) => techs[tech] as Tech);
      const researchedTech =
        ((subState.turnData?.factions ?? {})[factionName] ?? {}).techs ?? [];
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
                        researchedTech.forEach(removeTech);
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
                        removeTech={() => removeTech(tech)}
                      />
                    );
                  })}
                </LabeledDiv>
              ) : factionName !== "Nekro Virus" ? (
                <TechSelectHoverMenu
                  techs={availableTechs}
                  selectTech={addTech}
                />
              ) : (
                "Gain 3 command tokens"
              )}
            </React.Fragment>
          ) : (
            <TechSelectHoverMenu
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
    case "Fabrication": {
      const unownedRelics = Object.values(relics ?? {})
        .filter((relic) => !relic.owner)
        .map((relic) => relic.name);
      label = "Gained Relic";
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
            selectedItem={
              (
                ((subState.turnData ?? {}).factions ?? {})[factionName]
                  ?.relic ?? {}
              ).name
            }
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
      const destroyedPlanet = (subState.turnData ?? {}).destroyedPlanet?.name;
      if (destroyedPlanet) {
        label = "Destroyed Planet";
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
      Object.entries((subState.turnData ?? {}).attachments ?? {}).forEach(
        ([attachmentName, planetName]) => {
          if (attachmentName === "Nano-Forge") {
            nanoForgedPlanet = planetName;
          }
        }
      );
      if (nanoForgedPlanet) {
        label = "Attached to";
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
      Object.entries((subState.turnData ?? {}).attachments ?? {}).forEach(
        ([attachmentName, planetName]) => {
          if (attachmentName === "Terraform") {
            terraformedPlanet = planetName;
          }
        }
      );
      if (terraformedPlanet) {
        label = "Attached to";
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
      const targetButtonStyle = {
        fontFamily: "Myriad Pro",
        padding: responsivePixels(8),
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateRows: `repeat(${Math.min(
          12,
          nonHomeUnownedPlanets.length
        )}, auto)`,
        gap: responsivePixels(4),
        justifyContent: "flex-start",
      };
      const conqueredPlanets =
        ((subState.turnData?.factions ?? {})[factionName] ?? {}).planets ?? [];
      const destroyedPlanet = (subState.turnData ?? {}).destroyedPlanet?.name;
      if (destroyedPlanet) {
        label = "Destroyed Planet";
      }
      if (conqueredPlanets.length > 0) {
        label = "Newly Controlled Planets";
      }
      innerContent = (
        <div className="flexColumn largeFont" style={{ width: "100%" }}>
          {conqueredPlanets.length > 0 ? (
            <React.Fragment>
              <div
                className="flexColumn"
                style={{ alignItems: "stretch", width: "100%" }}
              >
                {conqueredPlanets.map((planetName) => {
                  const planet = updatedPlanets.find(
                    (planet) => planet.name === planetName
                  );
                  if (!planet) {
                    return null;
                  }
                  return (
                    <PlanetRow
                      key={planetName}
                      factionName={factionName}
                      planet={planet}
                      removePlanet={() => losePlanet(planetName)}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          ) : null}
          {nonHomeUnownedPlanets.length > 0 && conqueredPlanets.length < 3 ? (
            <ClientOnlyHoverMenu
              label="Take Control of Planet"
              renderProps={(closeFn) => (
                <div className="flexRow" style={targetButtonStyle}>
                  {nonHomeUnownedPlanets.map((planet) => {
                    return (
                      <button
                        key={planet.name}
                        style={{
                          writingMode: "horizontal-tb",
                          width: responsivePixels(90),
                        }}
                        onClick={() => {
                          closeFn();
                          gainPlanet(planet.name);
                        }}
                      >
                        {planet.name}
                      </button>
                    );
                  })}
                </div>
              )}
            ></ClientOnlyHoverMenu>
          ) : null}
        </div>
      );
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

    //   const repealedAgenda = agendas[subState.repealedAgenda ?? ""];

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
      <LabeledLine leftLabel={label} />
      <div className="flexColumn" style={{ width: "90%" }}>
        {innerContent}
      </div>
    </div>
  );
}

export function ComponentAction({ factionName }: { factionName: string }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: components }: { data?: Record<string, Component> } = useSWR(
    gameid ? `/api/${gameid}/components` : null,
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
  const { data: relics }: { data?: Record<string, Relic> } = useSWR(
    gameid ? `/api/${gameid}/relics` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  const component =
    (components ?? {})[subState.turnData?.component?.name ?? ""] ?? null;

  async function selectComponent(componentName: string | undefined) {
    if (!gameid) {
      return;
    }
    if (!componentName) {
      setSubStateSelectedAction(gameid, "Component");
    } else {
      const updatedName = componentName
        .replace(/\./g, "")
        .replace(/,/g, "")
        .replace(/ Ω/g, "");
      console.log(updatedName);
      selectSubStateComponent(gameid, updatedName);
      if (componentName === "Ul The Progenitor") {
        addAttachment(gameid, "Elysium", "Ul the Progenitor");
        toggleSubStateAttachment(gameid, "Elysium", "Ul the Progenitor");
      }
    }
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
    console.log("Re-render time");
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
        if (component.faction && component.type !== "PROMISSORY") {
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

        if (component.name === "Terraform") {
          console.log(component);
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
            removeItem={() => selectComponent(undefined)}
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
          <ComponentDetails factionName={factionName} />
        </LabeledDiv>
      </div>
    </React.Fragment>
  );

  return null;
}
