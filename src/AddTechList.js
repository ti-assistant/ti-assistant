import { useState } from "react";
import Image from 'next/image';

import { TechRow } from "/src/TechRow.js";
import { Tab, TabBody } from "/src/Tab.js";
import { LabeledLine } from "./LabeledDiv";

function sortTechs(techs, fields) {
  techs.sort((a, b) => {
    for (let index = 0; index < fields.length; index++) {
      if (a[fields[0]] > b[fields[0]]) {
        return 1;
      }
      if (a[fields[0]] < b[fields[0]]) {
        return -1;
      }
    }
    return 0;
  });
}

export function AddTechList({ techs, addTech }) {
  const [tabShown, setTabShown] = useState("blue");

  const blueTechs = techs.filter((tech) => {
    return tech.type === 'blue';
  });
  sortTechs(blueTechs, ['prereqs', 'game']);
  const greenTechs = techs.filter((tech) => {
    return tech.type === 'green';
  });
  sortTechs(greenTechs, ['prereqs', 'game']);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === 'yellow';
  });
  sortTechs(yellowTechs, ['prereqs', 'game']);
  const redTechs = techs.filter((tech) => {
    return tech.type === 'red';
  });
  sortTechs(redTechs, ['prereqs', 'game']);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === 'upgrade';
  });
  sortTechs(unitUpgrades, ['name']);

  return (
    <div className="flexColumn" style={{width: "100%"}}>
      <div className="flexRow" style={{backgroundColor: "#222", zIndex: 902, padding: "8px 4px 0px 4px", boxSizing: 'border-box', width: "100%"}}>
        <Tab selectTab={setTabShown} id="blue" selectedId={tabShown} content={
          <div className="flexRow" style={{width: "24px", height: "28px"}}>
            <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width="22px" height="22px" />
          </div>
        } />
        <Tab selectTab={setTabShown} id="green" selectedId={tabShown} content={
          <div className="flexRow" style={{width: "24px", height: "28px"}}>
            <Image src="/images/green_tech.webp" alt="Green Tech Skip" width="22px" height="22px" />
          </div>
        } />
        <Tab selectTab={setTabShown} id="yellow" selectedId={tabShown} content={
          <div className="flexRow" style={{width: "24px", height: "28px"}}>
          <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width="22px" height="22px" />
          </div>
        } />
        <Tab selectTab={setTabShown} id="red" selectedId={tabShown} content={
          <div className="flexRow" style={{width: "24px", height: "28px"}}>
            <Image src="/images/red_tech.webp" alt="Red Tech Skip" width="22px" height="22px" />
          </div>
        } />
        <Tab selectTab={setTabShown} id="upgrades" selectedId={tabShown} content={
          <div className="flexRow" style={{height: "28px"}}>
          Upgrades
          </div>
        } />
      </div>
      <TabBody id="blue" selectedId={tabShown} content={
        <div className="flexColumn largeFont" style={{width: "100%", overflowY: "auto", overvflowX: "hidden", maxHeight: "75vh", width: "100%", boxSizing: "border-box", padding: "4px", alignItems: "stretch"}}>
          {blueTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } style={{width: "100%"}} />
      <TabBody id="green" selectedId={tabShown} content={
        <div className="flexColumn largeFont" style={{width: "100%", overflowY: "auto", overvflowX: "hidden", maxHeight: "75vh", width: "100%", boxSizing: "border-box", padding: "4px", alignItems: "stretch"}}>
          {greenTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } style={{width: "100%"}} />
      <TabBody id="yellow" selectedId={tabShown} content={
        <div className="flexColumn largeFont" style={{width: "100%", overflowY: "auto", overvflowX: "hidden", maxHeight: "75vh", width: "100%", boxSizing: "border-box", padding: "4px", alignItems: "stretch"}}>
          {yellowTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } style={{width: "100%"}} />
      <TabBody id="red" selectedId={tabShown} content={
        <div className="flexColumn largeFont" style={{width: "100%", overflowY: "auto", overvflowX: "hidden", maxHeight: "75vh", width: "100%", boxSizing: "border-box", padding: "4px", alignItems: "stretch"}}>
          {redTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } style={{width: "100%"}} />
      <TabBody id="upgrades" selectedId={tabShown} content={
        <div className="flexColumn largeFont" style={{width: "100%", overflowY: "auto", overvflowX: "hidden", maxHeight: "75vh", width: "100%", boxSizing: "border-box", padding: "4px", alignItems: "stretch"}}>
          {unitUpgrades.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      } style={{width: "100%"}} />
    </div>
  )
}