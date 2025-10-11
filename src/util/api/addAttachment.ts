import {
  AddAttachmentHandler,
  RemoveAttachmentHandler,
} from "../model/addAttachment";
import dataUpdate from "./dataUpdate";

// TODO: Determine whether planet treatment is necessary.
export function addAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const data: GameUpdateData = {
    action: "ADD_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };

  return dataUpdate(gameId, data, AddAttachmentHandler);
}

export function removeAttachment(
  gameId: string,
  planet: PlanetId,
  attachment: AttachmentId
) {
  const data: GameUpdateData = {
    action: "REMOVE_ATTACHMENT",
    event: {
      attachment,
      planet,
    },
  };

  return dataUpdate(gameId, data, RemoveAttachmentHandler);
}
