import Image from 'next/image';

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

export function FactionCard({ player, onClick }) {
  const border = "3px solid " + player.color;
  const victory_points = (player.victory_points ?? []).reduce((prev, current) => {
    return prev + current.amount;
  }, 0);
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        border: border
      }}
    >
      <div class="flexRow" style={{ width: "40px", height: "40px", paddingLeft: "4px", paddingRight: "8px" }}>
        <FactionSymbol faction={player.faction} size={40} />
      </div>
      <b style={{ paddingRight: "12px" }}>{player.faction}</b>
      {victory_points} VPs
    </div>
  );
}