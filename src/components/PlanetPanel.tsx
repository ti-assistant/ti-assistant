import { CSSProperties, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import { GameIdContext } from "../context/Context";
import {
  useAttachments,
  useFaction,
  useFactions,
  usePlanets,
} from "../context/dataHooks";
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
import { rem } from "../util/util";

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
  const gameId = useContext(GameIdContext);

  const attachments = useAttachments();
  const faction = useFaction(factionId);
  const planets = usePlanets();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const ownedPlanets = filterToClaimedPlanets(planets, factionId);

  const updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);
  updatedPlanets.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  return (
    <div
      className={styles.planetColumn}
      style={
        {
          "--color": getFactionColor(faction),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.planetTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FactionIcon factionId={factionId} size={20} />
        {getFactionName(faction)}
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
              paddingBottom: rem(4),
              borderBottom: "1px solid #555",
              width: "100%",
            }}
          >
            <PlanetSummary
              planets={updatedPlanets}
              hasXxchaHero={
                factionId === "Xxcha Kingdom" && faction?.hero === "readied"
              }
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

function UnclaimedPlanetSection() {
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const planets = usePlanets();

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
    <div className={`${styles.planetColumn} ${styles.unclaimedColumn}`}>
      <div
        className={styles.planetTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FormattedMessage
          id="V7viK1"
          defaultMessage="Unclaimed Planets"
          description="Header for a section of planets that no player controls."
        />
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
  const factions = useFactions();

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
