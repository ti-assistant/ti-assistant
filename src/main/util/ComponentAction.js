import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { capitalizeFirstLetter, Map } from "../../../pages/setup";
import { AgendaRow } from "../../AgendaRow";
import { HoverMenu } from "../../HoverMenu";
import { LabeledDiv, LabeledLine } from "../../LabeledDiv";
import { Modal } from "../../Modal";
import { SelectableRow } from "../../SelectableRow";
import { TechRow } from "../../TechRow";
import { addSubStateTech, clearAddedSubStateTech, clearRemovedSubStateTech, clearSubState, removeRepealedSubStateAgenda, removeSubStateTech, repealSubStateAgenda, setSubStateOther, setSubStateSelectedAction } from "../../util/api/subState";
import { hasTech } from "../../util/api/techs";
import { fetcher } from "../../util/api/util";
import { getFactionColor, getFactionName } from "../../util/factions";
import { applyAllPlanetAttachments } from "../../util/planets";
import { pluralize, responsivePixels } from "../../util/util";
import { TechSelectHoverMenu } from "./TechSelectHoverMenu";

function InfoContent({component}) {
  const description = component.description.replaceAll("\\n", "\n");
  return (
    <div className="myriadPro" style={{boxSizing: "border-box", width: "100%", minWidth: "320px", padding: responsivePixels(4), whiteSpace: "pre-line", textAlign: "center", fontSize: responsivePixels(32)}}>
      <div className="flexColumn">
        {description}
      </div>
    </div>
  );
}

function ComponentSelect({ components, selectComponent }) {
  const actionCards = components.filter((component) => component.type === "card");
  const techs = components.filter((component) => component.type === "tech");
  const leaders = components.filter((component) => component.type === "leader").sort((a, b) => {
    if (a.leader === "agent") {
      return -1;
    }
    if (a.leader === "hero") {
      return 1;
    }
    return 0;
  })
  const exploration = components.filter((component) => component.type === "relic");
  const promissory = components.filter((component) => component.type === "promissory");
  const others = components.filter((component) => component.type !== "leader" && component.type !== "tech" && component.type !== "card" && component.type !== "relic" && component.type !== "promissory");

  const innerStyle = {
    fontFamily: "Myriad Pro",
    padding: responsivePixels(8),
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: responsivePixels(4),
    maxHeight: responsivePixels(400),
    maxWidth: "85vw",
    overflowX: "auto",
    writingMode: "vertical-lr",
    justifyContent: "flex-start"};

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return <div className={className} style={{
    padding: responsivePixels(8),
    alignItems: "stretch",
    gap: responsivePixels(4),
    justifyContent: "flex-start",
    maxWidth: "85vw"}}>
    <HoverMenu label="Action Cards">
      <div className="flexRow" style={innerStyle}>
      {actionCards.map((component) => {
        return <button key={component.name} onClick={() => selectComponent(component.name)}>{component.name}</button>
      })}
      </div>
    </HoverMenu>
    {techs.length > 0 ? <HoverMenu label="Techs">
      <div className="flexRow" style={innerStyle}>
      {techs.map((component) => {
        return <button key={component.name} onClick={() => selectComponent(component.name)}>{component.name}</button>
      })}
      </div>
    </HoverMenu> : null}
    {leaders.length > 0 ? <HoverMenu label="Leaders">
      <div className="flexColumn" style={{alignItems: "stretch", padding: responsivePixels(8)}}>
      {leaders.map((component) => {
        return <div className="flexColumn" key={component.name}>
          <LabeledDiv noBlur={true}  label={capitalizeFirstLetter(component.leader)}>
            <button onClick={() => selectComponent(component.name)}>{component.name}</button>
          </LabeledDiv>
        </div>
      })}
      </div>
    </HoverMenu> : null}
    {exploration.length > 0 ? <HoverMenu label="Exploration/Relic">
      <div className="flexRow" style={innerStyle}>
      {exploration.map((component) => {
        return <button key={component.name} onClick={() => selectComponent(component.name)}>{component.name}</button>
      })}
      </div>
    </HoverMenu> : null}
    {promissory.length > 0 ? <HoverMenu label="Promissory">
      <div className="flexRow" style={{padding: responsivePixels(8)}}>
      {promissory.map((component) => {
        return <div className="flexColumn" key={component.name}>
          <LabeledDiv noBlur={true} label={capitalizeFirstLetter(component.faction)}>
          <button onClick={() => selectComponent(component.name)}>{component.name}</button>
        </LabeledDiv>
        </div>
        return <div className="flexColumn" style={{gap: responsivePixels(4)}}>{capitalizeFirstLetter(component.faction)}:
            <button onClick={() => selectComponent(component.name)}>{component.name}</button>
          </div>
        })}
      </div>
    </HoverMenu> : null}
    {others.length > 0 ? <HoverMenu label="Other">
      <div className="flexRow" style={innerStyle}>
      {others.map((component) => {
        return <button key={component.name} onClick={() => selectComponent(component.name)}>{component.name}</button>
      })}
      </div>
    </HoverMenu> : null}
  </div>
}



function ComponentDetails({ factionName }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas = {} } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: attachments } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: components = {} } = useSWR(gameid ? `/api/${gameid}/components` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: options = {} } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);

  function getResearchableTechs(faction) {
    const replaces = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (hasTech(faction, tech.name)) {
        return false;
      }
      if (faction.name !== "Nekro Virus" && tech.faction && faction.name !== tech.faction) {
        return false;
      }
      const researchedTechs = ((subState.factions ?? {})[faction.name] ?? {}).techs ?? [];
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

  function addTech(tech) {
    addSubStateTech(mutate, gameid, subState, factionName, tech.name);
  }
  function removeTech(techName) {
    clearAddedSubStateTech(mutate, gameid, subState, factionName, techName);
  }
  function addRemoveTech(tech) {
    removeSubStateTech(mutate, gameid, subState, factionName, tech.name);
  }
  function clearAddedTech(techName) {
    clearRemovedSubStateTech(mutate, gameid, subState, factionName, techName);
  }
  function repealLaw(lawName) {
    repealSubStateAgenda(mutate, gameid, subState, lawName);
  }
  function removeRepealedAgenda(agendaName) {
    removeRepealedSubStateAgenda(mutate, gameid, subState);
  }

  const updatedPlanets = applyAllPlanetAttachments(Object.values(planets), attachments);

  let label = "Details"
  let innerContent = <div className="flexRow" style={{width: "100%"}}>Work in Progress</div>;
  switch (subState.component) {
    case "Enigmatic Device":
    case "Focused Research": {
      const researchedTech = ((subState.factions ?? {})[factionName] ?? {}).techs ?? [];
      const availableTechs = getResearchableTechs(factions[factionName]);

      if (researchedTech.length > 0) {
        label = "Researched Tech";
        innerContent = researchedTech.map((tech) => {
          return <TechRow key={tech} tech={techs[tech]} removeTech={() => removeTech(tech)} />
        });
      } else {
        innerContent = <TechSelectHoverMenu techs={availableTechs} selectTech={addTech} />;
      }
      break;
    }
    case "Divert Funding": {
      const returnedTechs = ((subState.factions ?? {})[factionName] ?? {}).removeTechs ?? [];
      const canReturnTechs = Object.keys(factions[factionName].techs ?? {}).filter((tech) => {
        return !techs[tech].faction && techs[tech].type !== "upgrade";
      }).map((tech) => techs[tech]);
      const researchedTech = ((subState.factions ?? {})[factionName] ?? {}).techs ?? [];
      const availableTechs = getResearchableTechs(factions[factionName]);

      innerContent = <div className="flexColumn" style={{width: "100%"}}>
        {returnedTechs.length > 0 ? 
          <React.Fragment>
          <LabeledDiv label="Returned Tech">
            {returnedTechs.map((tech) => {
              return <TechRow key={tech} tech={techs[tech]} removeTech={() => {
                researchedTech.forEach(removeTech);
                clearAddedTech(tech);
              }} />
            })}
            </LabeledDiv>
            {researchedTech.length > 0 ? 
              <LabeledDiv label="Researched Tech">
              {researchedTech.map((tech) => {
                return <TechRow key={tech} tech={techs[tech]} removeTech={() => removeTech(tech)} />
              })}
            </LabeledDiv>
            : <TechSelectHoverMenu techs={availableTechs} selectTech={addTech} />}
            </React.Fragment>
        : <TechSelectHoverMenu techs={canReturnTechs} label="Return Tech" selectTech={addRemoveTech} />}
      </div>;
      break;
    }
    case "Dynamis Core": {
      const numCommodities = factions[factionName].commodities + 2;

      innerContent = `Gain ${numCommodities} Trade Goods`;
      break;
    }
    case "Repeal Law": {
      const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
        return agenda.passed && agenda.type === "law";
      });
      const selectStyle = {
        fontFamily: "Myriad Pro",
        padding: responsivePixels(8),
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: responsivePixels(4),
        maxHeight: responsivePixels(400),
        maxWidth: "85vw",
        overflowX: "auto",
        writingMode: "vertical-lr",
        justifyContent: "flex-start"};

      innerContent = <div className="flexColumn" style={{width: "100%"}}>
        {subState.repealedAgenda ? 
          <LabeledDiv label="Repealed Law">
            <AgendaRow agenda={agendas[subState.repealedAgenda]} removeAgenda={removeRepealedAgenda} />
          </LabeledDiv>
        : passedLaws.length > 0 ? <HoverMenu label="Repeal Law">
            <div className="flexRow" style={selectStyle}>
            {passedLaws.map((law) => {
              return <button key={law.name} onClick={() => repealLaw(law.name)}>{law.name}</button>
            })}
            </div>
          </HoverMenu> : "No laws to repeal"}
      </div>
      break;
    }
    case "Industrial Initiative": {
      const numIndustrialPlanets = updatedPlanets.filter((planet) => {
        if (!(planet.owners ?? []).includes(factionName)) {
          return false;
        }
        return planet.type === "all" || planet.type === "Industrial";
      }).length;

      innerContent = `Gain ${numIndustrialPlanets} ${pluralize("trade good", numIndustrialPlanets)}`;
      break;
    }
    case "Mining Initiative": {
      let maxValue = 0;
      let bestPlanet = null;
      updatedPlanets.filter((planet) => {
        if (!(planet.owners ?? []).includes(factionName)) {
          return false;
        }
        return true;
      }).forEach((planet) => {
        if (planet.resources > maxValue) {
          bestPlanet = planet.name;
          maxValue = planet.resources;
        }
      });

      innerContent = `Best option: ${bestPlanet} to gain ${maxValue} ${pluralize("trade good", maxValue)}`;
      break;
    }
  }
  return <div className="flexColumn" style={{width: "100%", gap: responsivePixels(4)}}>
    <LabeledLine leftLabel={label} />
    <div className="flexColumn" style={{width: "90%"}}>
    {innerContent}
    </div>
  </div>;
}

export function ComponentAction({ factionName }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: components = {} } = useSWR(gameid ? `/api/${gameid}/components` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: techs } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: planets } = useSWR(gameid ? `/api/${gameid}/planets` : null, fetcher);
  const { data: objectives } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  const { data: subState = {} } = useSWR(gameid ? `/api/${gameid}/subState` : null, fetcher);
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }


  async function selectComponent(componentName) {
    if (componentName === null) {
      await clearSubState(mutate, gameid, subState);
      setSubStateSelectedAction(mutate, gameid, subState, "Component");
    } else {
      const updatedName = componentName.replace(/\./g,"");
      setSubStateOther(mutate, gameid, subState, "component", updatedName);
    }
  }

  const component = components[subState.component] ?? null;
  const faction = factions[factionName];

  if (!component) {
    const filteredComponents = Object.values(components).filter((component) => {
      if (component.type === "promissory") {
        if (!factions[component.faction] || component.faction === faction.name) {
          return false;
        }
      }
      if (component.faction && component.type !== "promissory") {
        if (component.faction !== faction.name) {
          return false;
        }
      }

      if (component.subFaction && component.subFaction !== faction.startswith.faction) {
        return false;
      }

      if (component.type === "tech" && !hasTech(faction, component.name)) {
        return false;
      }

      if (component.leader === "hero" && faction.hero !== "unlocked") {
        return false;
      }

      return true;
    });

    return (
    <HoverMenu label="Select Component">
      <ComponentSelect components={filteredComponents} selectComponent={selectComponent} />
    </HoverMenu>);
  }

  return (
    <React.Fragment>
      <Modal closeMenu={() => setShowInfoModal(false)} visible={showInfoModal} title={<div className="flexColumn" style={{fontSize: responsivePixels(40)}}>{component.name}</div>} content={
        <InfoContent component={component} />
      } top="35%" level={2} />
    <div className="flexColumn largeFont" style={{width: "100%", justifyContent: "flex-start"}}>
      <LabeledDiv label="COMPONENT" style={{width: "90%"}}> 
        <SelectableRow removeItem={() => selectComponent(null)}>
          {component.name}
          <div className="popupIcon" onClick={displayInfo} style={{fontSize: responsivePixels(16)}}>&#x24D8;</div>
        </SelectableRow>
      {component.details ? 
        <ComponentDetails factionName={factionName} />
      : null}
      </LabeledDiv>
    </div>
    </React.Fragment>);

  return null;
}