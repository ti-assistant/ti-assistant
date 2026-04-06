import GainTFCard from "../Actions/GainSplicedCard";
import styles from "./StartingComponents.module.scss";

export default function InauguralSplice({
  factionId,
}: {
  factionId: FactionId;
}) {
  return (
    <div className={styles.StartingComponents}>
      <GainTFCard
        factionId={factionId}
        numToGain={{ abilities: 2, genomes: 1, upgrades: 1 }}
        splice
      />
    </div>
  );
}
