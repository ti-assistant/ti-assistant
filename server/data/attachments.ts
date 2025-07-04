import { IntlShape } from "react-intl";
import getBaseAttachments from "./base/attachments";
import getCodexTwoAttachments from "./codextwo/attachments";
import getDiscordantStarsAttachments from "./discordantstars/attachments";
import getProphecyOfKingsAttachments from "./prophecyofkings/attachments";

export function getAttachments(
  intl: IntlShape
): Record<AttachmentId, BaseAttachment> {
  return {
    ...getBaseAttachments(intl),
    ...getProphecyOfKingsAttachments(intl),
    ...getCodexTwoAttachments(intl),
    ...getDiscordantStarsAttachments(intl),
  };
}
