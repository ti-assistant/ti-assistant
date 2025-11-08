import { IntlShape } from "react-intl";
import { translateOutcome } from "../components/VoteBlock/VoteBlock";
import { useMemoizedGameDataValue } from "./dataHooks";

export function useOutcome(agendaId: AgendaId, intl: IntlShape) {
  return useMemoizedGameDataValue<GameData, string>("", "", (gameData) => {
    const agenda = (gameData.agendas ?? {})[agendaId];
    if (!agenda) {
      return "";
    }
    return (
      translateOutcome(
        agenda.target,
        agenda.elect,
        gameData.planets,
        gameData.factions,
        gameData.objectives ?? {},
        gameData.agendas ?? {},
        gameData.strategycards ?? {},
        intl
      ) ?? ""
    );
  });
}
