export function FactionCard({ player, onClick }) {
  const border = "3px solid " + player.color;
  const victory_points = player.victory_points.reduce((prev, current) => {
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
      <div style={{ width: "40px", height: "40px", display: "inline-block" }}>
        icon
      </div>
      <b style={{ paddingRight: "12px" }}>{player.faction}</b>
      {victory_points} VPs
    </div>
  );
}