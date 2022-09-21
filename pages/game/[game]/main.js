import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import { TechChoice } from '/src/TechChoice.js'
import QRCode from "qrcode";

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
}

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: gameState, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: techs, techError } = useSWR(gameid ? `/api/${gameid}/techs` : null, fetcher);
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {}, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (techError) {
    return (<div>Failed to load techs</div>);
  }
  if (factionsError) {
    return (<div>Failed to load factions</div>);
  }
  if (!gameState || !techs || !factions) {
    return (<div>Loading...</div>);
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  const factionChoices = Object.values(factions).filter((faction) => {
    return faction.startswith.choice;
  }).map((faction) => {
    const options = new Set();
    if (faction.name === "Council Keleres") {
      Object.values(factions).forEach((faction) => {
        (faction.startswith.techs ?? [])  .forEach((tech) => {
          options.add(techs[tech]);
        });
      });
    } else {
      faction.startswith.choice.options.forEach((option) => {
        if (techs[option]) {
          options.add(techs[option]);
        }
      });
    }
    return {
      faction: faction,
      options: options,
      select: faction.startswith.choice.select,
    }
  });

  function selectTechs(selectedTech, faction) {
    const data = {
      action: "CHOOSE_STARTING_TECHS",
      faction: faction,
      techs: selectedTech,
      returnAll: true,
    };

    const updatedFactions = {...factions};

    delete updatedFactions[faction].startswith.choice;

    selectedTech.forEach((tech) => {
      updatedFactions[faction].techs[tech] = {
        ready: true,
      };
    });

    const options = {
      optimisticData: updatedFactions,
    };

    mutate(`/api/${gameid}/factions`, poster(`/api/${gameid}/factionUpdate`, data), options);
  }

  switch (gameState.state.phase) {
    case "SETUP":
      return (
        <div>
          <div className="flexColumn" style={{alignItems: "center"}}>
            <h2>Twilight Imperium Assistant</h2>
            <div className="flexColumn" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "40px", top: "20px"}}>
              <h4>Game ID: {gameid}</h4>
              {qrCode ? <img src={qrCode} /> : null}
            </div>
            <h3>Setup Game</h3>
            <ol className='flexColumn'>
              <li>Build the galaxy</li>
              <li>Select starting techs</li>
              <div className="flexRow" style={{alignItems:"flex-start", justifyContent: "space-between", gap: "8px"}}>
              {factionChoices.map((choice) => {
                return <TechChoice key={choice.faction.name} faction={choice.faction} select={choice.select} options={choice.options} selectTechs={selectTechs} />
              })}
              </div>
            </ol>
          </div>
        </div>
      );
  }
  return (
    <div>Error...</div>
  );
}