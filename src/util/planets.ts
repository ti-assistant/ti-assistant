import { Optional } from "./types/types";

/**
 * Gets all the planets claimed by a specific faction.
 */
export function filterToClaimedPlanets(
  planets: Partial<Record<PlanetId, Planet>>,
  factionId: FactionId
) {
  return Object.values(planets).filter((planet) => planet.owner === factionId);
}

/**
 * Updates all planets' values based on their attachments.
 */
export function applyAllPlanetAttachments(
  planets: Planet[],
  attachments: Partial<Record<AttachmentId, Attachment>>
): Planet[] {
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
  attachments: Partial<Record<AttachmentId, Attachment>>
) {
  let updatedPlanet = { ...planet };
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
      updatedPlanet.types = ["CULTURAL", "HAZARDOUS", "INDUSTRIAL"];
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

export function getPlanetTypeColor(type: Optional<PlanetType>) {
  if (!type) {
    return "#555";
  }
  switch (type) {
    case "CULTURAL": {
      return "steelblue";
    }
    case "HAZARDOUS": {
      return "firebrick";
    }
    case "INDUSTRIAL": {
      return "Green";
    }
  }
  return "#555";
}

export function fracturePlanetsOwned(
  planets: Partial<Record<PlanetId, Planet>>
) {
  return (
    planets.Styx?.owner ||
    planets.Lethe?.owner ||
    planets.Cocytus?.owner ||
    planets.Phlegethon?.owner
  );
}
