import { FormattedMessage } from "react-intl";
import {
  useAttachments,
  usePlanets,
} from "../../../../../../../src/context/dataHooks";
import { applyAllPlanetAttachments } from "../../../../../../../src/util/planets";

export default function IndustrialInitiative({
  factionId,
}: {
  factionId: FactionId;
}) {
  const attachments = useAttachments();
  const planets = usePlanets();

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets),
    attachments
  );

  const numIndustrialPlanets = updatedPlanets.filter(
    (planet) =>
      planet.owner === factionId && planet.types.includes("INDUSTRIAL")
  ).length;

  return (
    <FormattedMessage
      id="M0ywrk"
      description="Text telling a player how many Trade Goods to gain."
      defaultMessage="Gain {count} Trade {count, plural, =0 {Goods} one {Good} other {Goods}}"
      values={{ count: numIndustrialPlanets }}
    />
  );
}
