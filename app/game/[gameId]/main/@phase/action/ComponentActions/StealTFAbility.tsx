import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";

export default function StealTFAbility({
  factionId,
}: {
  factionId: FactionId;
}) {
  return (
    <GainTFCard factionId={factionId} steal numToGain={{ abilities: 1 }} />
  );
}
