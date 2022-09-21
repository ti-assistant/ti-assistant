import Image from 'next/image';
import { useRouter } from 'next/router'
import useSWR, { mutate, useSWRConfig } from 'swr'

import { TechRow } from '/src/TechRow.js'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

const poster = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const val = await res.json();

  if (res.status !== 200) {
    throw new Error(val.message);
  }
  return val;
};

export function FactionSymbol({ faction, size }) {
  let width = size;
  let height = size;
  switch (faction) {
    case "Arborec":
      width = height * 0.816;
      break;
    case "Barony of Letnev":
      width = height * 0.96;
      break;
    case "Clan of Saar":
      height = width / 1.017;
      break;
    case "Embers of Muaat":
      width = height * 0.591;
      break;
    case "Emirates of Hacan":
      height = width / 1.064;
      break;
    case "Federation of Sol":
      height = width / 1.151;
      break;
    case "Ghosts of Creuss":
      height = width / 1.058;
      break;
    case "L1Z1X Mindnet":
      height = width / 1.268;
      break;
    case "Mentak Coalition":
      height = width / 1.023;
      break;
    case "Naalu Collective":
      height = width / 1.259;
      break;
    case "Nekro Virus":
      height = width / 1.021;
      break;
    case "Sardakk N'orr":
      width = height * 0.878;
      break;
    case "Universities of Jol'Nar":
      height = width / 1.093;
      break;
    case "Winnu":
      height = width / 1.051;
      break;
    case "Xxcha Kingdom":
      height = width / 1.043;
      break;
    case "Yin Brotherhood":
      width = height * 0.979;
      break;
    case "Yssaril Tribes":
      width = height * 0.950;
      break;
    case "Argent Flight":
      height = width / 1.013;
      break;
    case "Empyrean":
      width = height * 0.989;
      break;
    case "Mahact Gene-Sorcerers":
      height = width / 1.229;
      break;
    case "Naaz-Rokha Alliance":
      width = height * 0.829;
      break;
    case "Nomad":
      width = height * 0.958;
      break;
    case "Titans of Ul":
      width = height * 0.984;
      break;
    case "Vuil'Raith Cabal":
      width = height * 0.974;
      break;
    case "Council Keleres":
      width = height * 0.944;
      break;
  }
  return <Image src={`/images/factions/${faction}.webp`} alt={`${faction} Icon`} width={`${width}px`} height={`${height}px`} />;
}

const shouldNotPluralize = [
  "Infantry",
];

function pluralize(text, number) {
  if (number === 1 || shouldNotPluralize.includes(text)) {
    return `${text}`;
  } else {
    return `${text}s`;
  }
}

const unitOrder = [
  "Carrier",
  "Cruiser",
  "Destroyer",
  "Dreadnought",
  "Flagship",
  "War Sun",
  "Fighter",
  "Infantry",
  "Space Dock",
  "PDS",
];

const techOrder = [
  "green",
  "blue",
  "yellow",
  "red",
];

function StartingComponents({ faction }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (techError) {
    return (<div>Failed to load techs</div>);
  }
  if (!techs || !factions) {
    return (<div>Loading...</div>);
  }

  const startswith = faction.startswith;

  const orderedPlanets = (startswith.planets ?? []).sort((a, b) => {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  const orderedUnits = Object.entries(startswith.units).sort((a, b) => unitOrder.indexOf(a[0]) - unitOrder.indexOf(b[0]));
  const orderedTechs = (startswith.techs ?? []).map((tech) => {
    return techs[tech];
  }).sort((a, b) => {
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
  const orderedChoices = ((startswith.choice ?? {}).options ?? []).filter((tech) => {
    return !(startswith.techs ?? []).includes(tech);
  }).map((tech) => {
    return techs[tech];
  }).sort((a, b) => {
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

  function addTech(tech) {
    const data = {
      action: "CHOOSE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = [
      ...(updatedFactions[faction.name].startswith.techs ?? []),
      tech,
    ];
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set(updatedFactions["Council Keleres"].startswith.choice.options);
      councilChoice.add(tech);
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
    }

    const options = {
      optimisticData: updatedFactions,
    };

    mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  function removeTech(tech) {
    const data = {
      action: "REMOVE_STARTING_TECH",
      faction: faction.name,
      tech: tech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    updatedFactions[faction.name].startswith.techs = (updatedFactions[faction.name].startswith.techs ?? []).filter((startingTech) => startingTech !== tech);
    
    if (updatedFactions["Council Keleres"]) {
      const councilChoice = new Set();
      for (const [name, faction] of Object.entries(factions)) {
        if (name === "Council Keleres") {
          continue;
        }
        (faction.startswith.techs ?? []).forEach((tech) => {
          councilChoice.add(tech);
        });
      }
      updatedFactions["Council Keleres"].startswith.choice.options = Array.from(councilChoice);
      for (const [index, tech] of (factions["Council Keleres"].startswith.techs ?? []).entries()) {
        if (!councilChoice.has(tech)) {
          delete updatedFactions["Council Keleres"].techs[tech];
          factions["Council Keleres"].startswith.techs.splice(index, 1);
        }
      }
    }

    const options = {
      optimisticData: updatedFactions,
    };

    mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  const numToChoose = !startswith.choice ? 0 : startswith.choice.select - (startswith.techs ?? []).length;

  return (
    <div style={{paddingLeft: "4px", display: "flex", flexDirection: "column", gap: "4px"}}>
      Planets
      <div style={{paddingLeft: "8px", fontFamily: "Myriad Pro"}}>
        {orderedPlanets.map((planet) => {
          return <div key={planet}>
            {planet}
          </div>;
        })}
      </div>
      Units
      <div style={{paddingLeft: "4px", fontFamily: "Myriad Pro"}}>
        {orderedUnits.map(([unit, number]) => {
          return <div key={unit} className="flexRow" style={{justifyContent: "flex-start"}}>
            <div style={{display: "flex", justifyContent: "center", flexBasis: "14%"}}>
              {number}
            </div>{pluralize(unit, number)}
          </div>;
        })}
      </div>
      Techs {startswith.choice ? "(Choice)" : null}
      <div style={{paddingLeft: "4px"}}>
        {orderedTechs.map((tech) => {
          return <TechRow key={tech.name} tech={tech} removeTech={startswith.choice ? () => removeTech(tech.name) : null} />;
        })}
      </div>
      {numToChoose > 0 ?
        <div>
          Choose {numToChoose} more {pluralize("tech", numToChoose)}
          <div>
            {orderedChoices.map((tech) => {
              return <TechRow key={tech.name} tech={tech} addTech={() => addTech(tech.name)} />;
            })}
          </div>
        </div>
      : null}
    </div>
  )
}

export function FactionTile({ faction, onClick, opts = {} }) {
  const border = "3px solid " + faction.color;
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  const iconStyle = {
    width: "40px",
    height: "40px",
    position: "absolute",
    zIndex: -1,
    left: 0,
    width: "100%",
    opacity: "60%",
  };
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        border: border,
        fontSize: opts.fontSize ?? "24px",
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        alignItems: "center",
      }}
    >
      <div className="flexRow" style={{justifyContent: "flex-start", gap: "4px", padding: "0px 4px", height: "40px"}}>
        <div className="flexRow" style={iconStyle}>
          <FactionSymbol faction={faction.name} size={40} />
        </div>
        {opts.hideName ? null : <div style={{ textAlign: "center" }}>{faction.name}</div>}
      </div>
    </div>
  );
}

export function FactionCard({ faction, onClick, speaker, opts = {} }) {
  const border = "3px solid " + faction.color;
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  const iconStyle = {
    width: "40px",
    height: "52px",
    position: opts.backgroundIcon ? "absolute" : "relative",
    zIndex: opts.backgroundIcon ? -1 : 1,

  };
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        border: border,
        fontSize: opts.fontSize ?? "24px",
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
      }}
    >
      <div className="flexRow" style={{justifyContent: "flex-start", gap: "4px", padding: "0px 4px"}}>
        <div className="flexRow" style={iconStyle}>
          <FactionSymbol faction={faction.name} size={40} />
        </div>
        {opts.hideName ? null : <div style={{ paddingRight: "12px" }}>{faction.name}</div>}
        {speaker ? <div style={{position: "absolute", right: 0, paddingRight: "16px"}}>Speaker</div> : null}
      </div>
      {opts.displayStartingComponents ? 
        <StartingComponents faction={faction} />
      : null}
    </div>
  );
}