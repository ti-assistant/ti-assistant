interface TIEvent {
  description: string;
  expansion: Expansion;
  id: EventId;
  name: string;
}

type EventId = CodexFour.EventId | ThundersEdge.EventId;
