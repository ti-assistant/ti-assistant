import GainTFCard from "../Actions/GainSplicedCard";
import FactionComponents from "../FactionComponents/FactionComponents";
import styles from "./StartingComponents.module.scss";

export default function InauguralSplice({
  factionId,
}: {
  factionId: FactionId;
}) {
  return (
    <div className={styles.StartingComponents}>
      <div className={styles.FactionIcon}>
        <FactionComponents.Icon factionId={factionId} size={60} />
      </div>
      <GainTFCard
        factionId={factionId}
        numToGain={{ abilities: 2, genomes: 1, upgrades: 1 }}
      />
    </div>
  );
}
