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
  | "Biotic Research Facility"
  | "Core Mining"
  | "Cybernetic Research Facility"
  | "Demilitarized Zone"
  | "Dyson Sphere"
  | "Holy Planet of Ixth"
  | "Lazax Survivors"
  | "Mining World"
  | "Nano-Forge"
  | "Paradise World"
  | "Propulsion Research Facility"
  | "Research Team: Biotic"
  | "Research Team: Cybernetic"
  | "Research Team: Propulsion"
  | "Research Team: Warfare"
  | "Rich World"
  | "Senate Sanctuary"
  | "Terraform"
  | "Terraforming Initiative"
  | "Tomb of Emphidia"
  | "Ul the Progenitor"
  | "Warfare Research Facility"
  | DiscordantStars.AttachmentId;
