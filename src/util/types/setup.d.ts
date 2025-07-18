type GameVariant = "normal" | "alliance-separate" | "alliance-combined";

type MapStyle = "standard" | "warp" | "skinny" | "large";

interface SetupOptions {
  "map-string": string;
  "processed-map-string"?: string;
  "map-style": MapStyle;
  "victory-points": number;
  "secondary-victory-points": number;
  "game-variant": GameVariant;
  expansions: Set<Expansion>;
  "hide-objectives": boolean;
  "hide-planets": boolean;
  "hide-techs": boolean;
  events: Set<EventId>;
  [key: string]: any;
}

interface SetupFaction {
  alliancePartner?: number;
  color?: string;
  id?: FactionId;
  name?: string;
  playerName?: string;
}
