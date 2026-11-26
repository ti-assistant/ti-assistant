import { usePlanets } from "../../context/dataHooks";
import { rem } from "../../util/util";
import ClaimPlanetsSection from "../ClaimPlanetsSection/ClaimPlanetsSection";
import TechResearchSection from "../TechResearchSection/TechResearchSection";

export default function RapidMobilization({
  factionId,
}: {
  factionId: FactionId;
}) {
  const planets = usePlanets();

  const availablePlanets = Object.values(planets)
    .filter((planet) => {
      if (planet.locked) {
        return false;
      }
      if (
        planet.id === "Mecatol Rex" ||
        planet.id === "Mirage" ||
        planet.id === "Mallice"
      ) {
        return false;
      }
      if (
        planet.attributes.includes("ocean") ||
        planet.attributes.includes("synthetic") ||
        planet.home ||
        planet.owner ||
        planet.attributes.includes("relic")
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  return (
    <div style={{ fontSize: rem(14) }}>
      <ClaimPlanetsSection
        availablePlanets={availablePlanets}
        blockExploration
        factionId={factionId}
        hideWrapper
      />
      <TechResearchSection
        factionId={factionId}
        numTechs={factionId === "Nomad" ? 2 : 1}
      />
    </div>
  );
}
