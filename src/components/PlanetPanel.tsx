import { CSSProperties, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAttachments,
  useGameId,
  useLeaders,
  usePlanets,
  useViewOnly,
} from "../context/dataHooks";
import { useFaction } from "../context/factionDataHooks";
import { useFactions } from "../context/factionDataHooks";
import { claimPlanetAsync, unclaimPlanetAsync } from "../dynamic/api";
import { getFactionColor, getFactionName } from "../util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../util/planets";
import { objectKeys, rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import { FactionSelectHoverMenu } from "./FactionSelect";
import styles from "./PlanetPanel.module.scss";
import PlanetRow from "./PlanetRow/PlanetRow";
import PlanetSummary from "./PlanetSummary/PlanetSummary";

function PlanetSection({
  factionId,
  openedByDefault,
}: {
  factionId: FactionId;
  openedByDefault: boolean;
}) {
  const attachments = useAttachments();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const leaders = useLeaders();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const ownedPlanets = filterToClaimedPlanets(planets, factionId);

  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);
  updatedPlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const hasXxchaHero =
    factionId === "Xxcha Kingdom" &&
    leaders["Xxekir Grom"]?.state === "readied";

  return (
    <CollapsibleSection
      color={getFactionColor(faction)}
      openedByDefault={openedByDefault}
      title={
        <div className={styles.planetTitle}>
          <FactionIcon factionId={factionId} size={20} />
          {getFactionName(faction)}
          <FactionIcon factionId={factionId} size={20} />
        </div>
      }
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1001,
          backgroundColor: "var(--background-color)",
          paddingBottom: rem(4),
          borderBottom: "1px solid var(--neutral-border)",
          width: "100%",
        }}
      >
        <PlanetSummary planets={updatedPlanets} hasXxchaHero={hasXxchaHero} />
      </div>
      <div
        className={styles.planetList}
        style={{
          minHeight: rem(40),
        }}
      >
        {updatedPlanets.map((planet) => {
          return (
            <PlanetRow
              key={planet.id}
              planet={planet}
              factionId={factionId}
              removePlanet={
                viewOnly
                  ? undefined
                  : (planetId) => {
                      if (!gameId) {
                        return;
                      }
                      unclaimPlanetAsync(gameId, factionId, planetId);
                    }
              }
              opts={{
                hideAttachButton: viewOnly,
              }}
            />
          );
        })}
      </div>
    </CollapsibleSection>
  );
}

function UnclaimedPlanetSection() {
  const factions = useFactions();
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const [collapsed, setCollapsed] = useState(true);

  const unownedPlanets = Object.values(planets)
    .filter((planet) => !planet.owner && !planet.locked)
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });

  return (
    <div className={styles.unclaimedColumn}>
      <CollapsibleSection
        title={
          <div className={styles.planetTitle}>
            <FormattedMessage
              id="V7viK1"
              defaultMessage="Unclaimed Planets"
              description="Header for a section of planets that no player controls."
            />
          </div>
        }
      >
        <div
          className={styles.collapsiblePlanetColumn}
          style={{ position: "relative" }}
        >
          {unownedPlanets.map((planet) => {
            return (
              <div
                key={planet.id}
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  gap: 0,
                }}
              >
                {viewOnly ? null : (
                  <FactionSelectHoverMenu
                    options={objectKeys(factions)}
                    onSelect={(factionId) => {
                      if (!gameId || !factionId) {
                        return;
                      }
                      claimPlanetAsync(gameId, factionId, planet.id);
                    }}
                    size={32}
                  />
                )}
                <div style={{ width: "100%" }}>
                  <PlanetRow
                    planet={planet}
                    opts={{ hideAttachButton: viewOnly }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
}

interface CSSWithNumColumns extends CSSProperties {
  "--num-columns": number;
}

export default function PlanetPanel() {
  const factions = useFactions();

  const orderedFactionIds = Object.values(factions)
    .sort((a, b) => a.mapPosition - b.mapPosition)
    .map((faction) => faction.id);

  return (
    <div
      className={styles.planetGrid}
      style={
        {
          "--num-columns": Math.ceil(Object.keys(factions).length / 2) + 1,
          "--num-factions": Object.keys(factions).length,
        } as CSSWithNumColumns
      }
    >
      {orderedFactionIds.map((factionId) => {
        return (
          <PlanetSection
            key={factionId}
            factionId={factionId}
            openedByDefault
          />
        );
      })}
      <UnclaimedPlanetSection />
    </div>
  );
}
