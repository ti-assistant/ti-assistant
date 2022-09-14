import { useState } from "react";

import { PlanetRow } from "/src/PlanetRow.js";
import { Tab, TabBody } from "/src/Tab.js";

function sortPlanets(planets, field, descending = false) {
  planets.sort((a, b) => {
    if (a[field] > b[field]) {
      return descending ? -1 : 1;
    }
    if (a[field] < b[field]) {
      return descending ? 1 : -1;
    }
    return 0;
  });
}

export function AddPlanetList({ planets, addPlanet }) {
  const [tabShown, setTabShown] = useState("normal");

  const normalPlanets = planets.filter((planet) => {
    return !planet.home &&
      !planet.attributes.includes("legendary")
  });
  const homePlanets = planets.filter((planet) => planet.home);
  sortPlanets(homePlanets, "faction");
  const legendaryPlanets = planets.filter((planet) => planet.attributes.includes("legendary"));

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "41px", backgroundColor: "white", zIndex: 902, padding: "4px 4px 0px 4px", borderBottom: "1px solid black"}}>
        <Tab selectTab={setTabShown} id="normal" selectedId={tabShown} content={
          "Normal"
        } />
        <Tab selectTab={setTabShown} id="home" selectedId={tabShown} content={
          "Home"
        } />
        <Tab selectTab={setTabShown} id="legendary" selectedId={tabShown} content={
          "Legendary"
        } />
      </div>
      <TabBody id="normal" selectedId={tabShown} content={
        <div>
          {normalPlanets.map((planet) => {
            return <PlanetRow key={planet.name} planet={planet} addPlanet={addPlanet} />;
          })}
        </div>
      } />
      <TabBody id="home" selectedId={tabShown} content={
        <div>
          {homePlanets.map((planet) => {
            return <PlanetRow key={planet.name} planet={planet} addPlanet={addPlanet} />;
          })}
        </div>
      } />
      <TabBody id="legendary" selectedId={tabShown} content={
        <div>
          {legendaryPlanets.map((planet) => {
            return <PlanetRow key={planet.name} planet={planet} addPlanet={addPlanet} />;
          })}
        </div>
      } />
    </div>
  )
}