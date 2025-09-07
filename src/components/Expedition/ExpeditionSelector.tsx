import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useExpedition,
  useGameId,
  useOptions,
  useViewOnly,
} from "../../context/dataHooks";
import { commitToExpeditionAsync } from "../../dynamic/api";
import { SelectableRow } from "../../SelectableRow";
import { getLatestExpedition } from "../../util/actionLog";
import { objectKeys, rem } from "../../util/util";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { Selector } from "../Selector/Selector";
import ExpeditionIcon from "./ExpeditionIcon";
import { getSelectedActionFromLog } from "../../util/api/data";
import ExpeditionSelectRadialMenu from "../ExpeditionSelectRadialMenu/ExpeditionSelectRadialMenu";

function expeditionComplete(expedition: Expedition) {
  return objectKeys(expedition).length === 6;
}

export default function ExpeditionSelector({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const expedition = useExpedition();
  const gameId = useGameId();
  const latestExpedition = getLatestExpedition(currentTurn, factionId);
  const options = useOptions();
  const viewOnly = useViewOnly();
  const selectedAction = getSelectedActionFromLog(currentTurn);

  console.log("Current Turn", currentTurn);

  if (!options.expansions.includes("THUNDERS EDGE")) {
    return null;
  }

  if (!selectedAction) {
    return null;
  }

  if (expeditionComplete(expedition) && !latestExpedition) {
    return null;
  }

  return (
    <div className="flexRow" style={{ fontSize: rem(16), gap: rem(4) }}>
      <FormattedMessage
        id="1bUwOq"
        description="Text shown on a menu for selecting an expedition."
        defaultMessage="Thunder's Edge Expedition"
      />
      :
      <ExpeditionSelectRadialMenu
        selectedExpedition={latestExpedition?.expedition}
        invalidExpeditions={objectKeys(expedition)}
        expeditions={[
          "resources",
          "actionCards",
          "influence",
          "secrets",
          "techSkip",
          "tradeGoods",
        ]}
        onSelect={(expeditionId, prevExpedition) => {
          if (prevExpedition) {
            commitToExpeditionAsync(gameId, prevExpedition, undefined);
          }
          if (expeditionId)
            commitToExpeditionAsync(gameId, expeditionId, factionId);
        }}
        size={40}
      />
    </div>
  );

  return (
    <Selector<ExpeditionId, string>
      buttonStyle={{ fontSize: rem(14) }}
      hoverMenuLabel={
        <FormattedMessage
          id="1bUwOq"
          description="Text shown on a menu for selecting an expedition."
          defaultMessage="Thunder's Edge Expedition"
        />
      }
      itemsPerColumn={2}
      options={[
        { id: "tradeGoods", name: "Trade Goods" },
        { id: "techSkip", name: "Tech Skip" },
        { id: "resources", name: "Resources" },
        { id: "secrets", name: "Secrets" },
        { id: "actionCards", name: "Action Cards" },
        { id: "influence", name: "Influence" },
      ]}
      fadedOptions={objectKeys(expedition)}
      toggleItem={(itemId, add) => {
        if (add) {
          commitToExpeditionAsync(gameId, itemId, factionId);
        } else {
          commitToExpeditionAsync(gameId, itemId, undefined);
        }
      }}
      renderButton={(itemId, _, toggleItem) => {
        const faded = objectKeys(expedition).includes(itemId);
        return (
          <button
            className={`flexRow ${faded ? "faded" : ""}`}
            style={{
              position: "relative",
              height: rem(28),
              fontFamily: "Slider",
              gap: rem(4),
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={viewOnly}
            onClick={viewOnly ? undefined : () => toggleItem(itemId, true)}
          >
            <ExpeditionIcon expedition={itemId} faded={faded} />
          </button>
        );
      }}
      renderItem={(itemId, _) => {
        return (
          <LabeledDiv
            label={
              <FormattedMessage
                id="1bUwOq"
                description="Text shown on a menu for selecting an expedition."
                defaultMessage="Thunder's Edge Expedition"
              />
            }
            style={{ fontSize: rem(16), width: "fit-content" }}
            blur
          >
            <div className="flexRow" style={{ width: "100%" }}>
              <SelectableRow
                itemId={itemId}
                removeItem={() => {
                  const prevFaction = latestExpedition?.prevFaction;
                  commitToExpeditionAsync(gameId, itemId, prevFaction);
                }}
                viewOnly={viewOnly}
              >
                <ExpeditionIcon expedition={itemId} />
              </SelectableRow>
            </div>
          </LabeledDiv>
        );
      }}
      selectedItem={latestExpedition?.expedition}
      selectedLabel={
        <FormattedMessage
          id="1bUwOq"
          description="Text shown on a menu for selecting an expedition."
          defaultMessage="Thunder's Edge Expedition"
        />
      }
      viewOnly={viewOnly}
    />
  );
}
