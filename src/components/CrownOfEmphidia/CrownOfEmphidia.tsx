import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { GameIdContext } from "../../context/Context";
import {
  useActionLog,
  useFactions,
  usePlanets,
  useRelics,
} from "../../context/dataHooks";
import { playRelicAsync, unplayRelicAsync } from "../../dynamic/api";
import { SymbolX } from "../../icons/svgs";
import { getPlayedRelic } from "../../util/actionLog";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { rem } from "../../util/util";

export default function CrownOfEmphidia({}) {
  const gameId = useContext(GameIdContext);
  const actionLog = useActionLog();
  const factions = useFactions();
  const planets = usePlanets();
  const relics = useRelics();

  const crownOfEmphidia = relics["The Crown of Emphidia"];

  if (!crownOfEmphidia || !crownOfEmphidia.owner) {
    return null;
  }

  let canScoreCrown = false;
  for (const planet of Object.values(planets)) {
    if (
      planet.owner === crownOfEmphidia.owner &&
      planet.attachments?.includes("Tomb of Emphidia")
    ) {
      canScoreCrown = true;
      break;
    }
  }

  if (!canScoreCrown) {
    return null;
  }

  const wasPlayedThisTurn = getPlayedRelic(actionLog, "The Crown of Emphidia");
  const isPurged = crownOfEmphidia.state === "purged";

  if (isPurged && !wasPlayedThisTurn) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(factions[crownOfEmphidia.owner])}
      color={getFactionColor(factions[crownOfEmphidia.owner])}
    >
      <div className="flexRow">
        <FormattedMessage
          id="/lAAq/"
          defaultMessage="Score Crown of Emphidia?"
          description="Message asking if a specific player scored the Crown of Emphidia relic."
        />
        <div
          className="flexRow hiddenButtonParent"
          style={{
            position: "relative",
            width: rem(32),
            height: rem(32),
          }}
        >
          <FactionIcon factionId={crownOfEmphidia.owner} size="100%" />
          <div
            className="flexRow"
            style={{
              position: "absolute",
              backgroundColor: "#222",
              cursor: "pointer",
              borderRadius: "100%",
              marginLeft: "60%",
              marginTop: "60%",
              boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
              width: rem(20),
              height: rem(20),
              zIndex: 2,
              color: wasPlayedThisTurn ? "green" : "red",
            }}
            onClick={() => {
              if (!gameId) {
                return;
              }
              if (wasPlayedThisTurn) {
                unplayRelicAsync(gameId, {
                  relic: "The Crown of Emphidia",
                });
              } else {
                playRelicAsync(gameId, {
                  relic: "The Crown of Emphidia",
                });
              }
            }}
          >
            {wasPlayedThisTurn ? (
              <div
                className="symbol"
                style={{
                  fontSize: rem(18),
                  lineHeight: rem(18),
                }}
              >
                ✓
              </div>
            ) : (
              <div
                className="flexRow"
                style={{
                  width: "80%",
                  height: "80%",
                }}
              >
                <SymbolX color="red" />
              </div>
            )}
          </div>
        </div>
      </div>
    </LabeledDiv>
  );
}
