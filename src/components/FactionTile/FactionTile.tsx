import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { getFactionColor, getFactionName } from "../../util/factions";
import { responsivePixels } from "../../util/util";
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
    fontSize: responsivePixels(fontSize),
  };

  return (
    <div className={styles.FactionTile} style={factionTileCSS}>
      <div
        className={styles.Body}
        style={{
          height: responsivePixels(iconSize),
          minWidth: responsivePixels(iconSize),
        }}
      >
        <div
          className={styles.Icon}
          style={{ height: responsivePixels(iconSize) }}
        >
          <FactionIcon factionId={faction.id} size="100%" />
        </div>
        <div className={styles.Name}>{getFactionName(faction)}</div>
      </div>
    </div>
  );
}
