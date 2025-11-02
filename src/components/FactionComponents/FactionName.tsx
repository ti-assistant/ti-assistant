import { useFactionDisplayName } from "../../context/factionDataHooks";

export default function FactionName({ factionId }: { factionId: FactionId }) {
  const factionName = useFactionDisplayName(factionId);

  return <>{factionName}</>;
}
