import { Expansion } from "./options";
import { PlanetAttribute } from "./planets";

export type AttachmentUpdateAction = "ATTACH_TO_PLANET" | "REMOVE_FROM_PLANET";

export interface AttachmentUpdateData {
  action?: AttachmentUpdateAction;
  attachment?: string;
  planet?: string;
  timestamp?: number;
}

export interface BaseAttachment {
  game: Expansion;
  name: string;
  required: {
    home: boolean;
    legendary?: boolean;
    type?: string;
    name?: string;
  };

  // Optional
  attribute?: PlanetAttribute;
  influence?: number;
  replaces?: string;
  resources?: number;
}

export interface GameAttachment {
  // Game Values
  ordering?: Record<string, number>;
  planets?: string[];
}

export type Attachment = BaseAttachment & GameAttachment;
