import { useRouter } from "next/router";
import React, { CSSProperties, ReactNode, useState } from "react";
import useSWR from "swr";
import { capitalizeFirstLetter } from "../../../pages/setup";
import { AgendaRow } from "../../AgendaRow";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { LabeledDiv, LabeledLine } from "../../LabeledDiv";
import { Modal } from "../../Modal";
import { SelectableRow } from "../../SelectableRow";
import { TechRow } from "../../TechRow";
import { Agenda } from "../../util/api/agendas";
import { Attachment } from "../../util/api/attachments";
import { Component } from "../../util/api/components";
import { Faction } from "../../util/api/factions";
import { Planet } from "../../util/api/planets";
import {
  addSubStateTech,
  clearAddedSubStateTech,
  clearRemovedSubStateTech,
  clearSubState,
  removeRepealedSubStateAgenda,
  removeSubStateTech,
  repealSubStateAgenda,
  setSubStateOther,
  setSubStateSelectedAction,
  SubState,
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
  const exploration = components.filter(
    (component) => component.type === "RELIC"
  );
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
      component.type !== "PROMISSORY"
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
  switch (subState?.component) {
    case "Enigmatic Device":
    case "Focused Research": {
      const faction = factions[factionName];
      if (!faction) {
        break;
      }
      const researchedTech =
        ((subState.factions ?? {})[factionName] ?? {}).techs ?? [];
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
        ((subState.factions ?? {})[factionName] ?? {}).removeTechs ?? [];
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
        ((subState.factions ?? {})[factionName] ?? {}).techs ?? [];
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
              ) : (
                <TechSelectHoverMenu
                  techs={availableTechs}
                  selectTech={addTech}
                />
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
  const { data: components = {} }: { data?: Record<string, Component> } =
    useSWR(gameid ? `/api/${gameid}/components` : null, fetcher, {
      revalidateIfStale: false,
    });
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
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

  async function selectComponent(componentName: string | undefined) {
    if (!gameid) {
      return;
    }
    if (!componentName) {
      await clearSubState(gameid);
      setSubStateSelectedAction(gameid, "Component");
    } else {
      const updatedName = componentName.replace(/\./g, "").replace(/,/g, "");
      setSubStateOther(gameid, "component", updatedName);
    }
  }

  if (!factions) {
    return null;
  }

  const component = components[subState.component] ?? null;
  const faction = factions[factionName];

  if (!faction) {
    return null;
  }

  if (!component) {
    const filteredComponents = Object.values(components).filter((component) => {
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
        component.subFaction &&
        component.subFaction !== faction.startswith.faction
      ) {
        return false;
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
    });

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
