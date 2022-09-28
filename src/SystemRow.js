import { PlanetRow } from "/src/PlanetRow.js";

export function SystemRow({planets, addPlanet}) {
  function addPlanets() {
    planets.forEach((planet) => {
      addPlanet(planet.name);
    });
  }

  return (
    <div className="systemRow">
      {addPlanet !== undefined ? 
        <div
        style={{
          position: "relative",
          lineHeight: "20px",
          color: "darkgreen",
          cursor: "pointer",
          fontSize: "20px",
          zIndex: 100,
          marginRight: "8px",
          height: "20px",
        }}
        onClick={addPlanets}
      >
        &#x2713;
      </div>
      : null}
      <div className="flexColumn" style={{width: "100%"}}>
        {planets.map((planet) => {
          return <PlanetRow key={planet.name} planet={planet} opts={{showSelfOwned: true}} />;
        })}
      </div>
    </div>);
}