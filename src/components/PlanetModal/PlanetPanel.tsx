import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAttachments,
  useGameId,
  useLeader,
  usePlanets,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactionColor } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { claimPlanetAsync, unclaimPlanetAsync } from "../../dynamic/api";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../util/planets";
import { rem } from "../../util/util";
import { CollapsibleSection } from "../CollapsibleSection";
import FactionComponents from "../FactionComponents/FactionComponents";
import { FactionSelectHoverMenu } from "../FactionSelect";
import styles from "./PlanetPanel.module.scss";
import PlanetRow from "../PlanetRow/PlanetRow";
import PlanetSummary from "../PlanetSummary/PlanetSummary";

function PlanetSection({
  factionId,
  openedByDefault,
}: {
  factionId: FactionId;
  openedByDefault: boolean;
}) {
  const attachments = useAttachments();
  const factionColor = useFactionColor(factionId);
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();
  const xxekirGrom = useLeader("Xxekir Grom");

  const ownedPlanets = filterToClaimedPlanets(planets, factionId);

  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);
  updatedPlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const hasXxchaHero =
    factionId === "Xxcha Kingdom" && xxekirGrom?.state === "readied";

  return (
    <CollapsibleSection
      color={factionColor}
      openedByDefault={openedByDefault}
      title={
        <div className={styles.planetTitle}>
          <FactionComponents.Icon factionId={factionId} size={20} />
          <FactionComponents.Name factionId={factionId} />
          <FactionComponents.Icon factionId={factionId} size={20} />
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
        <PlanetSummary
          factionId={factionId}
          planets={updatedPlanets}
          hasXxchaHero={hasXxchaHero}
        />
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
  const gameId = useGameId();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const planets = usePlanets();
  const viewOnly = useViewOnly();

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
            let possibleFactions = mapOrderedFactionIds;
            if (planet.attributes.includes("ocean")) {
              possibleFactions = ["Deepwrought Scholarate"];
            }
            return (
              <div
                key={planet.id}
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  gap: rem(4),
                }}
              >
                {viewOnly ? null : (
                  <FactionSelectHoverMenu
                    options={possibleFactions}
                    onSelect={(factionId) => {
                      if (!factionId) {
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
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");

  return (
    <div
      className={styles.planetGrid}
      style={
        {
          "--num-columns": Math.ceil(mapOrderedFactionIds.length / 2) + 1,
          "--num-factions": mapOrderedFactionIds.length,
        } as CSSWithNumColumns
      }
    >
      {mapOrderedFactionIds.map((factionId) => {
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
