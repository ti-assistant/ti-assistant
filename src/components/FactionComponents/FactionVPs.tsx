import { useFactionVPs } from "../../context/gameDataHooks";

export default function FactionVPs({ factionId }: { factionId: FactionId }) {
  const VPs = useFactionVPs(factionId);

  return <>{VPs}</>;
}
