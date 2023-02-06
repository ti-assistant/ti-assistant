import { PlanetRow } from "/src/PlanetRow.js";

export function SystemRow({planets, factionName, addPlanet, removePlanet}) {
  function addPlanets() {
    planets.forEach((planet) => {
      addPlanet(planet.name);
    });
  }

  function removePlanets() {
    planets.forEach((planet) => {
      removePlanet(planet.name);
    });
  }

  return (
    <div className="systemRow" style={{width: "99%"}}>
      {addPlanet !== undefined ? 
        <div
        style={{
          position: "relative",
          lineHeight: "32px",
          color: "darkgreen",
          cursor: "pointer",
          fontSize: "32px",
          zIndex: 100,
          marginRight: "8px",
          height: "32px",
        }}
        onClick={addPlanets}
      >
        &#x2713;
      </div>
      : null}
      {removePlanet !== undefined ? 
        <div
        style={{
          position: "relative",
          lineHeight: "32px",
          color: "firebrick",
          cursor: "pointer",
          fontSize: "32px",
          zIndex: 100,
          marginRight: "6px",
          height: "32px",
        }}
        onClick={removePlanets}
      >
        &#x2715;
      </div>
      : null}
      <div className="flexColumn" style={{width: "100%", alignItems: "stretch"}}>
        {planets.map((planet) => {
          return <PlanetRow key={planet.name} factionName={factionName} planet={planet} opts={{showSelfOwned: true}} />;
        })}
      </div>
    </div>);
}