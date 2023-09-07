import { useState } from "react";
import { useRouter } from "next/router";

import { PlanetRow } from "./PlanetRow";
import { Tab, TabBody } from "./Tab";
import { Planet } from "./util/api/planets";

function sortPlanetsByFaction(planets: Planet[]) {
  planets.sort((a, b) => {
    if (a.faction === b.faction) {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    }
    if (!b.faction) {
      return 1;
    }
    if (!a.faction) {
      return -1;
    }
    if (a.faction > b.faction) {
      return 1;
    }
    return -1;
  });
}

export interface AddPlanetListProps {
  planets: Record<string, Planet>;
  addPlanet?: (planetName: string) => void;
}

export function AddPlanetList({ planets, addPlanet }: AddPlanetListProps) {
  const router = useRouter();
  const [tabShown, setTabShown] = useState("normal");
  const { faction: playerFaction }: { faction?: string } = router.query;

  if (!playerFaction) {
    return <div>Loading...</div>;
  }

  const remainingPlanets = Object.values(planets).filter((planet) => {
    if (planet.owner === playerFaction) {
      return false;
    }
    if (planet.locked) {
      return false;
    }
    return true;
  });

  const normalPlanets = remainingPlanets.filter((planet) => {
    return !planet.home && !(planet.attributes ?? []).includes("legendary");
  });
  const homePlanets = remainingPlanets.filter((planet) => planet.home);
  sortPlanetsByFaction(homePlanets);
  const legendaryPlanets = remainingPlanets.filter((planet) =>
    planet.attributes.includes("legendary")
  );

  return (
    <div className="flexColumn" style={{ alignItems: "stretch" }}>
      <div
        className="flexRow"
        style={{ backgroundColor: "#222", padding: "4px 4px 0px 4px" }}
      >
        <Tab selectTab={setTabShown} id="normal" selectedId={tabShown}>
          Planets
        </Tab>
        {homePlanets.length > 0 ? (
          <Tab selectTab={setTabShown} id="home" selectedId={tabShown}>
            Home
          </Tab>
        ) : null}
        {legendaryPlanets.length > 0 ? (
          <Tab selectTab={setTabShown} id="legendary" selectedId={tabShown}>
            Legendary
          </Tab>
        ) : null}
      </div>
      <TabBody id="normal" selectedId={tabShown}>
        <div
          className="largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            zIndex: 1,
            position: "relative",
          }}
        >
          {normalPlanets.map((planet) => {
            return (
              <PlanetRow
                key={planet.name}
                factionName={playerFaction}
                planet={planet}
                addPlanet={addPlanet}
              />
            );
          })}
        </div>
      </TabBody>
      <TabBody id="home" selectedId={tabShown}>
        <div
          className="largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            zIndex: 1,
            position: "relative",
          }}
        >
          {homePlanets.map((planet) => {
            return (
              <PlanetRow
                key={planet.name}
                factionName={playerFaction}
                planet={planet}
                addPlanet={addPlanet}
              />
            );
          })}
        </div>
      </TabBody>
      <TabBody id="legendary" selectedId={tabShown}>
        <div
          className="largeFont"
          style={{
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
            boxSizing: "border-box",
            padding: "4px",
            zIndex: 1,
            position: "relative",
          }}
        >
          {legendaryPlanets.map((planet) => {
            return (
              <PlanetRow
                key={planet.name}
                factionName={playerFaction}
                planet={planet}
                addPlanet={addPlanet}
              />
            );
          })}
        </div>
      </TabBody>
    </div>
  );
}
