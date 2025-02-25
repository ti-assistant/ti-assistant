import Image from "next/image";
import { useState } from "react";

import { Tab, TabBody } from "./Tab";
import { TechRow } from "./TechRow";
import { sortTechsByName, sortTechsByPreReqAndExpansion } from "./util/techs";
import { FormattedMessage } from "react-intl";
import { rem } from "./util/util";
import GreenTechSVG from "./icons/techs/GreenTech";
import YellowTechSVG from "./icons/techs/YellowTech";
import RedTechSVG from "./icons/techs/RedTech";
import BlueTechSVG from "./icons/techs/BlueTech";

interface AddTechListProps {
  techs: Tech[];
  addTech: (techId: TechId) => void;
}

export function AddTechList({ techs, addTech }: AddTechListProps) {
  const [tabShown, setTabShown] = useState("blue");

  const blueTechs = techs.filter((tech) => {
    return tech.type === "BLUE";
  });
  sortTechsByPreReqAndExpansion(blueTechs);
  const greenTechs = techs.filter((tech) => {
    return tech.type === "GREEN";
  });
  sortTechsByPreReqAndExpansion(greenTechs);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === "YELLOW";
  });
  sortTechsByPreReqAndExpansion(yellowTechs);
  const redTechs = techs.filter((tech) => {
    return tech.type === "RED";
  });
  sortTechsByPreReqAndExpansion(redTechs);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === "UPGRADE";
  });
  sortTechsByName(unitUpgrades);

  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      <div
        className="flexRow"
        style={{
          backgroundColor: "var(--background-color)",
          zIndex: 902,
          padding: `${rem(8)} ${rem(4)} 0 ${rem(4)}`,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Tab selectTab={setTabShown} id="blue" selectedId={tabShown}>
          <div className="flexRow" style={{ width: rem(24), height: rem(28) }}>
            <BlueTechSVG />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="green" selectedId={tabShown}>
          <div className="flexRow" style={{ width: rem(24), height: rem(28) }}>
            <GreenTechSVG />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="yellow" selectedId={tabShown}>
          <div className="flexRow" style={{ width: rem(24), height: rem(28) }}>
            <YellowTechSVG />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="red" selectedId={tabShown}>
          <div className="flexRow" style={{ width: rem(24), height: rem(28) }}>
            <RedTechSVG />
          </div>
        </Tab>
        <Tab selectTab={setTabShown} id="upgrades" selectedId={tabShown}>
          <div className="flexRow" style={{ height: rem(28) }}>
            <FormattedMessage
              id="2hHU0G"
              description="Title of uprade techs."
              defaultMessage="Unit Upgrades"
            />
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
            padding: rem(4),
            alignItems: "stretch",
          }}
        >
          {blueTechs.map((tech) => {
            return <TechRow key={tech.id} tech={tech} addTech={addTech} />;
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
            padding: rem(4),
            alignItems: "stretch",
          }}
        >
          {greenTechs.map((tech) => {
            return <TechRow key={tech.id} tech={tech} addTech={addTech} />;
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
            padding: rem(4),
            alignItems: "stretch",
          }}
        >
          {yellowTechs.map((tech) => {
            return <TechRow key={tech.id} tech={tech} addTech={addTech} />;
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
            padding: rem(4),
            alignItems: "stretch",
          }}
        >
          {redTechs.map((tech) => {
            return <TechRow key={tech.id} tech={tech} addTech={addTech} />;
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
            padding: rem(4),
            alignItems: "stretch",
          }}
        >
          {unitUpgrades.map((tech) => {
            return <TechRow key={tech.id} tech={tech} addTech={addTech} />;
          })}
        </div>
      </TabBody>
    </div>
  );
}
