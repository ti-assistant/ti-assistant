import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { FactionCard } from '/src/FactionCard.js'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  console.log(data);
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

export default function SelectFactionPage() {
  const router = useRouter();
  const { gameid } = router.query;
  const { data: gameState, error } = useSWR(`/api/game/${gameid}`, fetcher);

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (!gameState) {
    return (<div>Loading...</div>);
  }

  function selectFaction(index) {
    router.push(`/game/${gameid}/${index}`);
  }

  function goToMainPage() {
    router.push(`/game/${gameid}/main.js`);
  }

  return (
    <div>
      <h1>Twilight Imperium Assistant</h1>
      <h3>Game ID: {gameid}</h3>
      <div
        style={{
          display: "flex",
          flexFlow: "column wrap",
          gap: "10px"
        }}
      >
        <div
          onClick={goToMainPage}
          style={{
            border: "3px solid grey",
            borderRadius: "5px",
            height: "40px",
            display: "flex",
            alignItems: "center"
          }}
        >
          Main Screen
        </div>
        {gameState.players.map((player, index) => {
          return (
            <FactionCard
              key={index}
              player={player}
              onClick={() => selectFaction(index)}
            />
          );
        })}
      </div>
    </div>
  );
}