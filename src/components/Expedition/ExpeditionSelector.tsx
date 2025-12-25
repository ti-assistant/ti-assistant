import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useExpedition,
  useGameId,
  useOptions,
  usePlanet,
  useViewOnly,
} from "../../context/dataHooks";
import {
  claimPlanetAsync,
  commitToExpeditionAsync,
  unclaimPlanetAsync,
} from "../../dynamic/api";
import {
  getClaimedPlanets,
  getLatestExpedition,
  getNewOwner,
} from "../../util/actionLog";
import { getSelectedActionFromLog } from "../../util/api/data";
import { objectEntries, objectKeys, rem } from "../../util/util";
import ExpeditionSelectRadialMenu from "../ExpeditionSelectRadialMenu/ExpeditionSelectRadialMenu";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";

function expeditionComplete(expedition: Expedition) {
  return objectKeys(expedition).length === 6;
}

function getPotentialOwners(expedition: Expedition) {
  const countsPerFaction: Partial<Record<FactionId, number>> = {};
  let max = 0;
  const owners = [];
  for (const factionId of Object.values(expedition)) {
    let count = countsPerFaction[factionId] ?? 0;
    count++;
    max = Math.max(count, max);
    countsPerFaction[factionId] = count;
  }

  return objectEntries(countsPerFaction)
    .filter(([_, count]) => count === max)
    .map(([factionId, _]) => factionId);
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
  const thundersEdge = usePlanet("Thunder's Edge");
  const options = useOptions();
  const viewOnly = useViewOnly();
  const selectedAction = getSelectedActionFromLog(currentTurn);

  if (
    !options.expansions.includes("THUNDERS EDGE") ||
    options.expansions.includes("TWILIGHTS FALL")
  ) {
    return null;
  }

  if (!selectedAction) {
    return null;
  }

  if (expeditionComplete(expedition) && !latestExpedition) {
    return null;
  }

  const newOwner = getNewOwner(currentTurn, "Thunder's Edge");

  return (
    <>
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
      {expeditionComplete(expedition) && (!thundersEdge?.owner || newOwner) ? (
        <div className="flexRow" style={{ fontSize: rem(16), gap: rem(4) }}>
          <FormattedMessage
            id="JOb6MX"
            defaultMessage="Choose Thunder's Edge Owner"
            description="Message for choosing the owner of Thunder's Edge"
          />
          <FactionSelectRadialMenu
            factions={getPotentialOwners(expedition)}
            onSelect={(faction, prevFaction) => {
              if (faction) {
                claimPlanetAsync(gameId, faction, "Thunder's Edge");
              } else if (prevFaction) {
                unclaimPlanetAsync(gameId, prevFaction, "Thunder's Edge");
              }
            }}
            selectedFaction={newOwner}
            viewOnly={viewOnly}
          />
        </div>
      ) : null}
    </>
  );
}
