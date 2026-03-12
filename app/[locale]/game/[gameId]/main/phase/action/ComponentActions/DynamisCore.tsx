import { FormattedMessage } from "react-intl";
import { usePlanets } from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";

export default function DynamisCore({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);
  const planets = usePlanets();

  if (!faction) {
    return null;
  }

  const numSpaceStations = Object.values(planets).filter(
    (planet) =>
      planet.owner === factionId && planet.attributes.includes("space-station"),
  ).length;

  const numCommodities = faction.commodities + 2 + numSpaceStations;

  return (
    <>
      <FormattedMessage
        id="M0ywrk"
        description="Text telling a player how many Trade Goods to gain."
        defaultMessage="Gain {count} Trade {count, plural, =0 {Goods} one {Good} other {Goods}}"
        values={{ count: numCommodities }}
      />
    </>
  );
}
