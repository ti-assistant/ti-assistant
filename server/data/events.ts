import { IntlShape } from "react-intl";
import getCodexFourEvents from "./codexfour/events";
import getThundersEdgeEvents from "./thundersedge/events";

export function getEvents(intl: IntlShape): Record<EventId, TIEvent> {
  return {
    ...getCodexFourEvents(intl),
    ...getThundersEdgeEvents(intl),
  };
}
