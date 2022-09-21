import { FactionSymbol } from "./FactionCard";
import { TechRow } from "./TechRow";
import { useEffect, useState } from "react";


export function TechChoice({faction, select, options, selectTechs}) {
  const [selectedTech, setSelectedTech] = useState([]);

  function chooseTech(tech) {
    let updatedTech = [...selectedTech];
    const index = updatedTech.findIndex((value) => value === tech);
    if (index !== -1) {
      updatedTech.splice(index, 1);
    } else {
      if (updatedTech.length === select) {
        updatedTech.shift();
      }
      updatedTech.push(tech);
    }
    setSelectedTech(updatedTech);
  }

  const plural = select === 1 ? "" : "s";
  const border = "3px solid " + faction.color;
  return (
    <div style={{border: border, borderRadius: "5px", flexShrink: 0, padding: "4px"}}>
      <div className="flexRow" style={{justifyContent:"flex-start", marginBottom: "4px"}}>
        <FactionSymbol faction={faction.name} size={32} />
        {faction.name}
      </div>
      Select {select} starting tech{plural}
      {Array.from(options).map((option) => {
        return <TechRow key={option.name} tech={option} leftContent={
          <input name={option.name} type="checkbox"
            checked={selectedTech.includes(option.name)}
            onChange={() => chooseTech(option.name)}
          />
        } />
      })}
      <button disabled={selectedTech.length !== select} onClick={() => selectTechs(selectedTech, faction.name)}>Confirm</button>
    </div>
  )
}