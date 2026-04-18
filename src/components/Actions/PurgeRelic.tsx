import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useOptions,
  useRelics,
  useViewOnly,
} from "../../context/dataHooks";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { getPurgedRelic } from "../../util/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import IconDiv from "../LabeledDiv/IconDiv";
import RelicPlanetIcon from "../PlanetIcons/RelicPlanetIcon";
import { Selector } from "../Selector/Selector";
import Card from "../Card/Card";
import RelicMenuSVG from "../../icons/ui/RelicMenu";

export default function PurgeRelic({
  factionId,
  unravel,
}: {
  factionId: FactionId;
  unravel?: boolean;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const options = useOptions();
  const relics = useRelics();
  const viewOnly = useViewOnly();

  if (options.hide?.includes("RELICS")) {
    return null;
  }

  const purgedRelic = getPurgedRelic(currentTurn);
  const ownedRelics = Object.values(relics)
    .filter((relic) => !!relic.owner)
    .filter((relic) => relic.state !== "purged" || purgedRelic === relic.id)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (ownedRelics.length === 0) {
    return "No Relics to Purge";
  }

  let innerContent;
  if (!purgedRelic) {
    innerContent = (
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="Components.Purge Relic.Title"
            description="Title of Component: Purge Relic"
            defaultMessage="Purge Relic"
          />
        }
        buttonStyle={{ fontSize: rem(14) }}
        renderProps={(innerCloseFn) => (
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateRows: `repeat(${Math.min(11, ownedRelics.length)}, auto)`,
              padding: rem(8),
              gap: rem(4),
              alignItems: "stretch",
              maxWidth: "88vw",
              overflowX: "auto",
            }}
          >
            {ownedRelics.map((relic) => {
              return (
                <button
                  key={relic.id}
                  onClick={() => {
                    innerCloseFn();
                    const gainVP = unravel && relic.owner !== factionId;
                    dataUpdate(Events.PurgeRelicEvent(relic.id, gainVP));
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontSize: rem(16),
                    gap: rem(8),
                  }}
                  disabled={viewOnly}
                >
                  <FactionIcon factionId={relic.owner} size={16} />
                  {relic.name}
                </button>
              );
            })}
          </div>
        )}
      ></ClientOnlyHoverMenu>
    );
  } else {
    const relic = relics[purgedRelic];
    if (!relic) {
      return null;
    }
    innerContent = (
      <div
        className="flexColumn"
        style={{
          gap: 0,
          width: "fit-content",
        }}
      >
        <SelectableRow
          itemId={relic.id}
          removeItem={() => {
            const gainVP = relic.owner !== factionId && unravel;
            dataUpdate(Events.UnpurgeRelicEvent(relic.id, gainVP));
          }}
          viewOnly={viewOnly}
          style={{ width: "100%" }}
        >
          <InfoRow
            infoTitle={relic.name}
            infoContent={
              <FormattedDescription description={relic.description} />
            }
          >
            <FactionIcon factionId={relic.owner} size={16} />
            {relic.name}
          </InfoRow>
        </SelectableRow>
        {relic.owner !== factionId ? (
          <div>+1 VP</div>
        ) : (
          <div style={{ color: "var(--muted-text)" }}>
            Put The Fracture into play
          </div>
        )}
      </div>
    );
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="Components.Purge Relic.Title"
          description="Title of Component: Purge Relic"
          defaultMessage="Purge Relic"
        />
      }
      icon={
        <div
          style={{ position: "relative", width: "1.25em", height: "1.25em" }}
        >
          <RelicMenuSVG color="var(--muted-text)" />
        </div>
      }
    >
      {innerContent}
    </Card>
  );
}
