import { Attachment } from "./api/attachments";

/**
 * Gets all the attachments for a specific planet.
 */
export function filterToPlanetAttachments(
  attachments: Record<string, Attachment>,
  planetName: string
) {
  return Object.values(attachments).filter((attachment) =>
    (attachment.planets ?? []).includes(planetName)
  );
}
