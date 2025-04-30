import { useFaction } from "../../context/factionDataHooks";
import { getFactionName } from "../../util/factions";

export default function FactionName({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);

  return <>{getFactionName(faction)}</>;
}
