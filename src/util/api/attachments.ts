import { Expansion } from "./options";
import { PlanetAttribute, PlanetType } from "./planets";

export type AttachmentUpdateAction = "ATTACH_TO_PLANET" | "REMOVE_FROM_PLANET";

export interface AttachmentUpdateData {
  action?: AttachmentUpdateAction;
  attachment?: string;
  planet?: string;
  timestamp?: number;
}

export interface BaseAttachment {
  expansion: Expansion;
  name: string;
  required: {
    home: boolean;
    legendary?: boolean;
    type?: PlanetType;
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
