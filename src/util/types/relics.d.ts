interface BaseRelic {
  description: string;
  expansion: Expansion;
  id: RelicId;
  name: string;
  timing: Timing;
}

interface GameRelic {
  owner?: FactionId;
  state?: ComponentState;
}

type Relic = BaseRelic & GameRelic;

type RelicUpdateAction = "GAIN_RELIC" | "LOSE_RELIC" | "USE_RELIC";

interface RelicUpdateData {
  action?: RelicUpdateAction;
  faction?: string;
  relic?: RelicId;
  timestamp?: number;
}

type RelicId =
  | "Dominus Orb"
  | "Dynamis Core"
  | "JR-XS455-O"
  | "Maw of Worlds"
  | "Nano-Forge"
  | "Scepter of Emelpar"
  | "Shard of the Throne"
  | "Stellar Converter"
  | "The Codex"
  | "The Crown of Emphidia"
  | "The Crown of Thalnos"
  | "The Obsidian"
  | "The Prophet's Tears";
