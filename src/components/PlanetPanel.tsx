import { CSSProperties, useContext, useState } from "react";
import {
  AttachmentContext,
  FactionContext,
  GameIdContext,
  PlanetContext,
} from "../context/Context";
import { claimPlanetAsync, unclaimPlanetAsync } from "../dynamic/api";
import { getFactionColor, getFactionName } from "../util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../util/planets";
import FactionIcon from "./FactionIcon/FactionIcon";
import { FactionSelectHoverMenu } from "./FactionSelect";
import styles from "./PlanetPanel.module.scss";
import PlanetRow from "./PlanetRow/PlanetRow";
import PlanetSummary from "./PlanetSummary/PlanetSummary";

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function PlanetSection({
  factionId,
  openedByDefault,
}: {
  factionId: FactionId;
  openedByDefault: boolean;
}) {
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const planets = useContext(PlanetContext);

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const ownedPlanets = filterToClaimedPlanets(planets, factionId);

  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

  return (
    <div
      className={styles.planetColumn}
      style={
        {
          "--color": getFactionColor(factions[factionId]),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.planetTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FactionIcon factionId={factionId} size={20} />
        {getFactionName(factions[factionId])}
        <FactionIcon factionId={factionId} size={20} />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
        style={{ gap: 0 }}
      >
        <div
          className={styles.collapsiblePlanetColumn}
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1001,
              backgroundColor: "#222",
              paddingBottom: "4px",
              borderBottom: "1px solid #555",
              width: "100%",
            }}
          >
            <PlanetSummary
              planets={updatedPlanets}
              hasXxchaHero={
                factionId === "Xxcha Kingdom" &&
                factions[factionId]?.hero === "readied"
              }
            />
          </div>
          <div
            className={styles.planetList}
            style={{
              minHeight: "40px",
            }}
          >
            {updatedPlanets.map((planet) => {
              return (
                <PlanetRow
                  key={planet.id}
                  planet={planet}
                  factionId={factionId}
                  removePlanet={(planetId) => {
                    if (!gameId) {
                      return;
                    }
                    unclaimPlanetAsync(gameId, factionId, planetId);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function UnclaimedPlanetSection({}: {}) {
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const planets = useContext(PlanetContext);

  const [collapsed, setCollapsed] = useState(true);

  const unownedPlanets = Object.values(planets).filter(
    (planet) => !planet.owner
  );

  return (
    <div className={`${styles.planetColumn} ${styles.unclaimedColumn}`}>
      <div
        className={styles.planetTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        Unclaimed Planets
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
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
                <FactionSelectHoverMenu
                  options={Object.keys(factions) as FactionId[]}
                  onSelect={(factionId) => {
                    if (!gameId || !factionId) {
                      return;
                    }
                    claimPlanetAsync(gameId, factionId, planet.id);
                  }}
                  size={28}
                />
                <div style={{ width: "100%" }}>
                  <PlanetRow planet={planet} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface CSSWithNumColumns extends CSSProperties {
  "--num-columns": number;
}

export default function PlanetPanel({}) {
  const factions = useContext(FactionContext);

  const orderedFactionIds = Object.values(factions ?? {})
    .map((faction) => faction.id)
    .sort();

  return (
    <div
      className={styles.planetGrid}
      style={
        {
          "--num-columns": Object.keys(factions).length / 2 + 1,
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
