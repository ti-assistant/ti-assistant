import { useRouter } from "next/router";
import useSWR from "swr";
import { FactionSymbol } from "./FactionCard";
import { PlanetAttributes, PlanetSymbol } from "./PlanetRow";
import { Resources } from "./Resources";
import { TechIcon } from "./TechRow";
import { fetcher } from "./util/api/util";
import { pluralize } from "./util/util";

export function TechSummary({ techs }) {
  let blueTechs = 0;
  let yellowTechs = 0;
  let greenTechs = 0;
  let redTechs = 0;
  let upgradeTechs = 0;
  for (const tech of techs) {
    switch (tech.type) {
      case "red":
        ++redTechs;
        break;
      case "yellow":
        ++yellowTechs;
        break;
      case "green":
        ++greenTechs;
        break;
      case "blue":
        ++blueTechs;
        break;
      case "upgrade":
        ++upgradeTechs;
        break;
    }
  }

  return (
  <div className="flexColumn" style={{flexBasis: "30%", fontSize: "16px", height: "90px", justifyContent: "space-evenly"}}>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
        <div className="flexColumn" style={{flexBasis: "30%"}}>{redTechs}</div><TechIcon type={"red"} width="21px" height="22px" />
      </div>
      <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
      <div className="flexColumn" style={{flexBasis: "30%"}}>{greenTechs}</div> <TechIcon type={"green"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
      <div className="flexColumn" style={{flexBasis: "30%"}}>{blueTechs}</div><TechIcon type={"blue"} width="21px" height="22px" />
      </div>
      <div className="flexRow" style={{flexBasis: "50%", justifyContent: "flex-start", gap: "6px"}}>
      <div className="flexColumn" style={{flexBasis: "30%"}}>{yellowTechs}</div><TechIcon type={"yellow"} width="21px" height="22px" />
      </div>
    </div>
    <div className="flexRow" style={{width: "100%"}}>
      {upgradeTechs} {pluralize("Upgrade", upgradeTechs)}
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
  <div className="flexColumn" style={{flexBasis: "30%"}}>
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

export function FactionSummary({ faction, options={} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher, { refreshInterval: 5000 });
  const { data: planets, error: planetsError } = useSWR(gameid ? `/api/${gameid}/planets?faction=${faction.name}` : null, fetcher);
  const { data: technologies, error: techsError } = useSWR(gameid ? `/api/${gameid}/techs?faction=${faction.name}` : null, fetcher);

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

  function applyPlanetAttachments(planet) {
    let updatedPlanet = {...planet};
    updatedPlanet.attributes = [...planet.attributes];
    const planetAttachments = Object.values(attachments ?? {}).filter((attachment) => attachment.planet === planet.name);
    planetAttachments.forEach((attachment) => {
      if (attachment.attribute.includes("skip")) {
        if (hasSkip(updatedPlanet)) {
          updatedPlanet.resources += attachment.resources;
          updatedPlanet.influence += attachment.influence;
        } else {
          updatedPlanet.attributes.push(attachment.attribute);
        }
      } else if (attachment.attribute === "all-types") {
        updatedPlanet.type = "all";
        updatedPlanet.resources += attachment.resources;
        updatedPlanet.influence += attachment.influence;
      } else {
        updatedPlanet.resources += attachment.resources;
        updatedPlanet.influence += attachment.influence;
        if (attachment.attribute && !updatedPlanet.attributes.includes(attachment.attribute)) {
          updatedPlanet.attributes.push(attachment.attribute);
        }
      }
    });
    return updatedPlanet;
  }

  const ownedTechs = Object.values(technologies ?? {}).filter((tech) => {
    return !!faction.techs[tech.name];
  });

  const ownedPlanets = Object.values(planets ?? {}).filter((planet) => {
    return (planet.owners ?? []).includes(faction.name);
  }).map((planet) => {
    return applyPlanetAttachments(planet);
  });

  const VPs = Object.values(objectives ?? {}).filter((objective) => {
    return (objective.scorers ?? []).includes(faction.name);
  }).reduce((total, objective) => {
    const count = objective.scorers.reduce((count, scorer) => {
      if (scorer === faction.name) {
        return count + 1;
      }
      return count;
    }, 0);
    return total + (count * objective.points);
  }, 0);

  return (
    <div className="flexRow" style={{width: "100%", maxWidth: "800px", zIndex: 2, position: "relative"}}>
      {options.showIcon ? <div className="flexColumn" style={{position: "absolute", zIndex: -1, opacity: 0.5}}>
        <FactionSymbol faction={faction.name} size={90} />
      </div> : null}
      <TechSummary techs={ownedTechs} />
      <div className="flexColumn" style={{flexBasis: "30%", fontSize: "28px"}}>
        <div style={{fontSize: "40px"}}>
          {VPs}
        </div>
        <div style={{fontSize: "28px"}}>{pluralize('VP', VPs)}</div>
      </div>
      <PlanetSummary planets={ownedPlanets} options={options} />
    </div>);
}