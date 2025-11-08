import {
  useManualFactionVPs,
  useScoredFactionVPs,
} from "../../context/gameDataHooks";

export default function FactionVPs({ factionId }: { factionId: FactionId }) {
  const manualVPs = useManualFactionVPs(factionId);
  const scoredVPs = useScoredFactionVPs(factionId);

  return <>{manualVPs + scoredVPs}</>;
}
