import {
  useFactionColor,
  useIsFactionPassed,
} from "../../context/factionDataHooks";
import { BLACK_BORDER_GLOW } from "../../util/borderGlow";
import { rem } from "../../util/util";
import FactionComponents from "../FactionComponents/FactionComponents";
import styles from "./FactionTile.module.scss";

interface FactionTileProps {
  factionId: FactionId;
  fontSize: number;
  iconSize: number;
}

export default function FactionTile({
  factionId,
  fontSize,
  iconSize,
}: FactionTileProps) {
  const factionColor = useFactionColor(factionId);
  const isPassed = useIsFactionPassed(factionId);

  const color = isPassed ? "#555" : factionColor;

  const factionTileCSS = {
    "--color": color,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    fontSize: rem(fontSize),
  };

  return (
    <div className={styles.FactionTile} style={factionTileCSS}>
      <div
        className={styles.Body}
        style={{
          height: rem(iconSize),
          minWidth: rem(iconSize),
        }}
      >
        <div
          className={styles.Icon}
          style={{
            height: rem(iconSize),
            opacity: "60%",
            userSelect: "none",
          }}
        >
          <FactionComponents.Icon factionId={factionId} size="100%" />
        </div>
        <div className={styles.Name}>
          {<FactionComponents.Name factionId={factionId} />}
        </div>
      </div>
    </div>
  );
}
