type AttachmentUpdateAction = "ATTACH_TO_PLANET" | "REMOVE_FROM_PLANET";

interface AttachmentUpdateData {
  action?: AttachmentUpdateAction;
  attachment?: AttachmentId;
  planet?: PlanetId;
  timestamp?: number;
}

interface BaseAttachment {
  expansion: Expansion;
  id: AttachmentId;
  name: string;
  required: {
    home: boolean;
    id?: PlanetId;
    legendary?: boolean;
    type?: PlanetType;
  };

  // Optional
  attribute?: PlanetAttribute;
  faction?: FactionId;
  influence?: number;
  replaces?: AttachmentId;
  resources?: number;
}

interface GameAttachment {
  // Game Values
  ordering?: Record<AttachmentId, number>;
  planets?: PlanetId[];
}

type Attachment = BaseAttachment & GameAttachment;

type AttachmentId =
  | BaseGame.AttachmentId
  | ProphecyOfKings.AttachmentId
  | CodexTwo.AttachmentId
  | DiscordantStars.AttachmentId;
