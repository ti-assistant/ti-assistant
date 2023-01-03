import { HoverMenu } from "../../HoverMenu";
import { getTechColor } from "../../util/techs";

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

export function TechSelectHoverMenu({ techs, selectTech, direction = "horizontal" }) {
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
    <HoverMenu label="Research Tech" style={{whiteSpace: "nowrap"}} content={
      <div className={direction === "horizontal" ? "flexRow" : "flexColumn"} style={{padding: "8px", alignItems: "flex-start", gap: "8px", overflow: "visible"}}>
        {redTechs.length > 0 ?
        <HoverMenu label="Warfare" style={{width: "210px"}} borderColor={getTechColor(redTechs[0])} content={
          <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
          {redTechs.map((tech) => {
              return <button key={tech.name} style={{width: "180px"}} onClick={() => selectTech(tech)}>{tech.name}</button>
            })}
        </div>
        } /> : null}
        {blueTechs.length > 0 ? <HoverMenu label="Propulsion" style={{width: "210px"}} borderColor={getTechColor(blueTechs[0])}  content={
          <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
          {blueTechs.map((tech) => {
              return <button key={tech.name} style={{width: "180px"}} onClick={() => selectTech(tech)}>{tech.name}</button>
            })}
        </div>
        } /> : null}
        {yellowTechs.length > 0 ? <HoverMenu label="Cybernetic" style={{width: "210px"}} borderColor={getTechColor(yellowTechs[0])}  content={
          <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
          {yellowTechs.map((tech) => {
              return <button key={tech.name} style={{width: "180px"}} onClick={() => selectTech(tech)}>{tech.name}</button>
            })}
        </div>
        } /> : null}
        {greenTechs.length > 0 ? <HoverMenu label="Biotic" style={{width: "210px"}} borderColor={getTechColor(greenTechs[0])}  content={
          <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
          {greenTechs.map((tech) => {
              return <button key={tech.name} style={{width: "180px"}} onClick={() => selectTech(tech)}>{tech.name}</button>
            })}
        </div>
        } /> : null}
        {unitUpgrades.length > 0 ? <HoverMenu label="Unit Upgrades" style={{width: "210px"}} content={
          <div className="flexColumn" style={{padding: "8px", gap: "4px"}}>
          {unitUpgrades.map((tech) => {
              return <button key={tech.name} style={{width: "180px"}} onClick={() => selectTech(tech)}>{tech.name}</button>
            })}
        </div>
        } /> : null}
      </div>
    } />
  );
}