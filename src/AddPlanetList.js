import { useState } from "react";
import { useRouter } from 'next/router'

import { PlanetRow } from "/src/PlanetRow.js";
import { SystemRow } from "/src/SystemRow.js";
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
  const router = useRouter();
  const [tabShown, setTabShown] = useState("normal");
  const [groupBySystem, setGroupBySystem] = useState(false);
  const { faction: playerFaction } = router.query;

  if (!playerFaction) {
    return <div>Loading...</div>;
  }

  function toggleGroupBySystem() {
    setGroupBySystem(!groupBySystem);
  }

  const remainingPlanets = [];
  Object.values(planets ?? {}).forEach((planet) => {
    if (!(planet.owners ?? []).includes(playerFaction)) {
      remainingPlanets.push(planet);
    }
  });

  const normalPlanets = remainingPlanets.filter((planet) => {
    return !planet.home &&
      !(planet.attributes ?? []).includes("legendary")
  });
  let planetsBySystem = [];
  Object.values(planets ?? {}).forEach((planet) => {
    if (!planet.system) {
      return;
    }
    if (!planetsBySystem[planet.system]) {
      planetsBySystem[planet.system] = [];
    }
    planetsBySystem[planet.system].push(planet);
  });
  planetsBySystem = planetsBySystem.filter((system) => {
    for (let i = 0; i < system.length; i++) {
      if (!(system[i].owners ?? []).includes(playerFaction)) {
        return true;
      }
    }
    return false;
  });
  planetsBySystem.sort((a, b) => {
    if (a[0].name < b[0].name) {
      return -1;
    }
    if (b[0].name < a[0].name) {
      return 1;
    }
    return 0;
  });
  const homePlanets = remainingPlanets.filter((planet) => planet.home);
  sortPlanets(homePlanets, "faction");
  const legendaryPlanets = remainingPlanets.filter((planet) => (planet.attributes ?? []).includes("legendary"));

  return (
    <div>
      <div className="flexRow" style={{ position: "sticky", top: "36px", backgroundColor: "#222", zIndex: 902, padding: "4px 4px 0px 4px", borderBottom: "1px solid grey"}}>
        <Tab selectTab={setTabShown} id="normal" selectedId={tabShown} content={
          "Planets"
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
          <div className="flexRow" style={{backgroundColor: "#222", height: "32px", position: "sticky", zIndex: 904, top: "73px", fontSize: "14px"}}>
          <label>
              <input type="checkbox"
            checked={groupBySystem}
            onChange={toggleGroupBySystem}
          />Group by System</label>
          </div>
          <div>
            {groupBySystem ? 
              planetsBySystem.map((system) => {
                return <SystemRow key={system[0].system} planets={system} addPlanet={addPlanet} />;
              }) :
              normalPlanets.map((planet) => {
                return <PlanetRow key={planet.name} planet={planet} addPlanet={addPlanet} />;
              })
            }
          </div>
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