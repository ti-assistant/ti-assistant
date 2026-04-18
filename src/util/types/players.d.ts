interface GamePlayer {
  factionId: FactionId;
  id: PlayerId;
  mapPosition: number;
}

type Player = GamePlayer;

type PlayerId = Exclude<FactionId, "Obsidian"> | "Potato";
