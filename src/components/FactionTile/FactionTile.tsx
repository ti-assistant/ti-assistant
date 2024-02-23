import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./FactionTile.module.scss";

interface FactionTileProps {
  faction: Faction;
  fontSize: number;
  iconSize: number;
}

export default function FactionTile({
  faction,
  fontSize,
  iconSize,
}: FactionTileProps) {
  const color = faction.passed ? "#555" : getFactionColor(faction);

  const factionTileCSS = {
    "--color": color,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    fontSize: `${fontSize}px`,
  };

  return (
    <div className={styles.FactionTile} style={factionTileCSS}>
      <div
        className={styles.Body}
        style={{
          height: `${iconSize}px`,
          minWidth: `${iconSize}px`,
        }}
      >
        <div className={styles.Icon} style={{ height: `${iconSize}px` }}>
          <FactionIcon factionId={faction.id} size="100%" />
        </div>
        <div className={styles.Name}>{getFactionName(faction)}</div>
      </div>
    </div>
  );
}
