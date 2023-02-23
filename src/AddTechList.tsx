import { useState } from "react";
import Image from "next/image";

import { TechRow } from "./TechRow";
import { Tab, TabBody } from "./Tab";
import { Tech } from "./util/api/techs";

export function sortTechsByPreReqAndExpansion(techs: Tech[]) {
  techs.sort((a, b) => {
    if (a.prereqs.length === b.prereqs.length) {
      if (a.game > b.game) {
        return 1;
      }
      return -1;
    }
    if (a.prereqs.length > b.prereqs.length) {
      return 1;
    }
    return -1;
  });
}

export function sortTechsByName(techs: Tech[]) {
  techs.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
}

export interface AddTechListProps {
  techs: Tech[];
  addTech: (techName: string) => void;
}

export function AddTechList({ techs, addTech }: AddTechListProps) {
  const [tabShown, setTabShown] = useState("blue");

  const blueTechs = techs.filter((tech) => {
    return tech.type === "blue";
  });
  sortTechsByPreReqAndExpansion(blueTechs);
  const greenTechs = techs.filter((tech) => {
    return tech.type === "green";
  });
  sortTechsByPreReqAndExpansion(greenTechs);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === "yellow";
  });
  sortTechsByPreReqAndExpansion(yellowTechs);
  const redTechs = techs.filter((tech) => {
    return tech.type === "red";
  });
  sortTechsByPreReqAndExpansion(redTechs);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === "upgrade";
  });
  sortTechsByName(unitUpgrades);

  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      <div
        className="flexRow"
        style={{
          backgroundColor: "#222",
          zIndex: 902,
          padding: "8px 4px 0px 4px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Tab selectTab={setTabShown} id="blue" selectedId={tabShown}>
          <div className="flexRow" style={{ width: "24px", height: "28px" }}>
            <Image
              src="/images/blue_tech.webp"
              alt="Blue Tech Skip"
              width="22px"
              height="22px"
            />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="green" selectedId={tabShown}>
          <div className="flexRow" style={{ width: "24px", height: "28px" }}>
            <Image
              src="/images/green_tech.webp"
              alt="Green Tech Skip"
              width="22px"
              height="22px"
            />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="yellow" selectedId={tabShown}>
          <div className="flexRow" style={{ width: "24px", height: "28px" }}>
            <Image
              src="/images/yellow_tech.webp"
              alt="Yellow Tech Skip"
              width="22px"
              height="22px"
            />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="red" selectedId={tabShown}>
          <div className="flexRow" style={{ width: "24px", height: "28px" }}>
            <Image
              src="/images/red_tech.webp"
              alt="Red Tech Skip"
              width="22px"
              height="22px"
            />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="upgrades" selectedId={tabShown}>
          <div className="flexRow" style={{ height: "28px" }}>
            Upgrades
          </div>
        </Tab>
      </div>
      <TabBody id="blue" style={{ width: "100%" }} selectedId={tabShown}>
        <div
          className="flexColumn largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            alignItems: "stretch",
          }}
        >
          {blueTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
      <TabBody id="green" selectedId={tabShown} style={{ width: "100%" }}>
        <div
          className="flexColumn largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            alignItems: "stretch",
          }}
        >
          {greenTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
      <TabBody id="yellow" selectedId={tabShown} style={{ width: "100%" }}>
        <div
          className="flexColumn largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            alignItems: "stretch",
          }}
        >
          {yellowTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
      <TabBody id="red" selectedId={tabShown} style={{ width: "100%" }}>
        <div
          className="flexColumn largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            alignItems: "stretch",
          }}
        >
          {redTechs.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
      <TabBody id="upgrades" selectedId={tabShown} style={{ width: "100%" }}>
        <div
          className="flexColumn largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            alignItems: "stretch",
          }}
        >
          {unitUpgrades.map((tech) => {
            return <TechRow key={tech.name} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
    </div>
  );
}