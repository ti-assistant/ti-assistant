import { Attachment } from "./api/attachments";
import { Planet } from "./api/planets";

/**
 * Gets all the planets claimed by a specific faction.
 */
export function filterToClaimedPlanets(
  planets: Record<string, Planet>,
  factionName: string
) {
  return Object.values(planets).filter((planet) =>
    (planet.owners ?? []).includes(factionName)
  );
}

/**
 * Updates all planets' values based on their attachments.
 */
export function applyAllPlanetAttachments(
  planets: Planet[],
  attachments: Record<string, Attachment>
) {
  return planets.map((planet) => {
    return applyPlanetAttachments(planet, attachments);
  });
}

/**
 * Returns true if the planet has a tech-skip, false otherwise.
 */
function hasSkip(planet: Planet) {
  return (
    planet.attributes.includes("red-skip") ||
    planet.attributes.includes("blue-skip") ||
    planet.attributes.includes("green-skip") ||
    planet.attributes.includes("yellow-skip")
  );
}

/**
 * Updates a single planet's values based on the attachments on the planet.
 */
export function applyPlanetAttachments(
  planet: Planet,
  attachments: Record<string, Attachment>
) {
  let updatedPlanet = structuredClone(planet);
  if (!attachments) {
    return updatedPlanet;
  }
  updatedPlanet.attributes = [...planet.attributes];
  const planetAttachments = (planet.attachments ?? []).map((attachment) => {
    return attachments[attachment];
  });
  planetAttachments.forEach((attachment) => {
    if (!attachment) {
      return;
    }
    const attribute = attachment.attribute;
    if (attribute && attribute.includes("skip")) {
      if (hasSkip(updatedPlanet)) {
        updatedPlanet.resources += attachment.resources ?? 1;
        updatedPlanet.influence += attachment.influence ?? 1;
      } else {
        updatedPlanet.attributes.push(attribute);
      }
    } else if (attribute === "all-types") {
      updatedPlanet.type = "all";
      updatedPlanet.resources += attachment.resources ?? 1;
      updatedPlanet.influence += attachment.influence ?? 1;
    } else {
      updatedPlanet.resources += attachment.resources ?? 0;
      updatedPlanet.influence += attachment.influence ?? 0;
      if (
        attachment.attribute &&
        !updatedPlanet.attributes.includes(attachment.attribute)
      ) {
        updatedPlanet.attributes.push(attachment.attribute);
      }
    }
  });
  return updatedPlanet;
}
