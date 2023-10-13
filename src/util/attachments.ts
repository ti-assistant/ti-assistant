/**
 * Gets all the attachments for a specific planet.
 */
export function filterToPlanetAttachments(
  attachments: Partial<Record<AttachmentId, Attachment>>,
  planetId: PlanetId
) {
  return Object.values(attachments).filter((attachment) =>
    (attachment.planets ?? []).includes(planetId)
  );
}
