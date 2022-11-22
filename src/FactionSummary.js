import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { FactionSymbol } from "./FactionCard";
import { PlanetAttributes, PlanetSymbol } from "./PlanetRow";
import { Resources } from "./Resources";
import { TechIcon, TechRow } from "./TechRow";
import { manualVPUpdate } from "./util/api/factions";
import { fetcher } from "./util/api/util";
import { applyAllPlanetAttachments, filterToClaimedPlanets } from "./util/planets";
import { filterToOwnedTechs } from "./util/techs";
import { pluralize } from "./util/util";

function getTechColor(tech) {
  switch (tech.type) {
    case "red":
      return "indianred";
    case "yellow":
      return "goldenrod";
    case "blue":
      return "cornflowerblue";
    case "green":
      return "seagreen";
  }
  return "#eee";
}

function TechList({ techs }) {
  return <div className="flexColumn" style={{alignItems: "stretch", padding: "4px 8px", backgroundColor: "#222", boxShadow: "1px 1px 4px black", whiteSpace: "nowrap", gap: "4px", border: `2px solid #333`, borderRadius: "5px"}}>
  {techs.map((tech) => <div key={tech.name} style={{color: getTechColor(tech)}}>{tech.name}</div>)}
</div>
}

export function TechSummary({ techs }) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "red":
        redTechs.push(tech);
        break;
      case "yellow":
        yellowTechs.push(tech);
        break;
      case "green":
        greenTechs.push(tech);
        break;
      case "blue":
        blueTechs.push(tech);
        break;
      case "upgrade":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder = [
    "red",
    "green",
    "blue",
    "yellow",
    "upgrade",
  ];

  techs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
  <div className="flexColumn hoverParent" style={{flexBasis: "30%", flexGrow: 2, maxWidth: "120px", fontSize: "16px", height: "90px", justifyContent: "space-evenly"}}>
    <div className="hoverInfo left" style={{marginRight: "20px"}}>
      {techs.length > 0 ?
          <div className="flexColumn">
            <TechList techs={techs} />
          </div>
      : null}
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{redTechs.length}</div>
        <TechIcon type={"red"} width="21px" height="22px" />
      </div>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{greenTechs.length}</div>
        <TechIcon type={"green"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{blueTechs.length}</div>
        <TechIcon type={"blue"} width="21px" height="22px" />
      </div>
      <div className="flexRow hoverParent" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{yellowTechs.length}</div>
        <TechIcon type={"yellow"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow hoverParent" style={{width: "100%"}}>
      {upgradeTechs.length} {pluralize("Upgrade", upgradeTechs.length)}
    </div>
  </div>
  );
}

export function PlanetSummary({ planets, options = {} }) {
  let resources = 0;
  let influence = 0;
  let cultural = 0;
  let hazardous = 0;
  let industrial = 0;
  const skips = [];
  for (const planet of planets) {
    if (planet.ready || options.total) {
      resources += planet.resources;
      influence += planet.influence;
      for (const attribute of planet.attributes) {
        if (attribute.includes("skip")) {
          skips.push(attribute);
        }
      }
    }
    switch (planet.type) {
      case "Cultural":
        ++cultural;
        break;
      case "Industrial":
        ++industrial;
        break;
      case "Hazardous":
        ++hazardous;
        break;
    }
    if (planet.attributes.includes("all-types")) {
      ++cultural;
      ++industrial;
      ++hazardous;
    }
  }

  return (
  <div className="flexColumn" style={{flexBasis: "30%", flexGrow: 2, maxWidth: "120px"}}>
    <div className="flexRow">
      <Resources
        resources={resources}
        influence={influence}
      />
      <PlanetAttributes attributes={skips} />
    </div>
    <div className="flexRow" style={{fontSize: "16px", width: "100%"}}>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div className="flexColumn" style={{flexBasis: "15%"}}>{cultural}</div>
        <PlanetSymbol type={"Cultural"} size="18px" />
      </div>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div>{hazardous}</div>
        <PlanetSymbol type={"Hazardous"} size="18px" />
      </div>
      <div className="flexRow" style={{flexBasis: "33%"}}>
        <div>{industrial}</div>
        <PlanetSymbol type={"Industrial"} size="18px" />
      </div>
    </div>
  </div>
  );
}

export function FactionSummary({ factionName, options={} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher, { refreshInterval: 5000 });
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher, { refreshInterval: 5000 });
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets?faction=${factionName}` : null, fetcher, {
    refreshInterval: 5000,
  });
  const { data: techs, error: techsError } = useSWR(gameid ? `/api/${gameid}/techs?faction=${factionName}` : null, fetcher, {
    refreshInterval: 5000,
  });

  if (attachmentsError) {
    return (<div>Failed to load attachments</div>);
  }
  if (planetsError) {
    return (<div>Failed to load planets</div>);
  }
  if (techsError) {
    return (<div>Failed to load technologies</div>);
  }
  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }

  const faction = factions[factionName] ?? {};

  const ownedTechs = filterToOwnedTechs(techs, faction);

  const ownedPlanets = filterToClaimedPlanets(planets, factionName);
  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  const VPs = (faction.vps ?? 0) + Object.values(objectives ?? {}).filter((objective) => {
    return (objective.scorers ?? []).includes(factionName);
  }).reduce((total, objective) => {
    const count = objective.scorers.reduce((count, scorer) => {
      if (scorer === factionName) {
        return count + 1;
      }
      return count;
    }, 0);
    return total + (count * objective.points);
  }, 0);

  function manualVpAdjust(increase) {
    const value = increase ? 1 : -1;
    manualVPUpdate(mutate, gameid, factions, factionName, value);
  }

  return (
    <div className="flexRow" style={{width: "100%", maxWidth: "800px", padding: "4px 0px", zIndex: 2, position: "relative"}}>
      {options.showIcon ? <div className="flexColumn" style={{position: "absolute", zIndex: -1, opacity: 0.5}}>
        <FactionSymbol faction={factionName} size={90} />
      </div> : null}
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
      <div className="flexColumn" style={{flexBasis: "30%", height: "91px", fontSize: "28px"}}>
        <div className="flexRow" style={{gap: "4px", fontSize: "40px"}}>
          {VPs > 0 ? <div className="arrowDown" onClick={() => manualVpAdjust(false)}></div> : <div style={{width: "12px"}}></div>}
          <div className="flexRow" style={{width: "32px"}}>{VPs}</div>
          <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
        </div>
        <div style={{fontSize: "28px"}}>{pluralize('VP', VPs)}</div>
      </div>
      {options.hidePlanets ? null : <PlanetSummary planets={updatedPlanets} options={options} />}
    </div>);
}