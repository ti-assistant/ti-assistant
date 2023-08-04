import { useRouter } from "next/router";
import { CSSProperties, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WrappedFactionIcon } from "../FactionCard";
import { PlanetSummary } from "../FactionSummary";
import { PlanetRow } from "../PlanetRow";
import { useGameData } from "../data/GameData";
import { claimPlanet, unclaimPlanet } from "../util/api/claimPlanet";
import { Faction } from "../util/api/factions";
import { getFactionColor, getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { FactionSelectHoverMenu } from "./FactionSelect";
import styles from "./PlanetPanel.module.scss";

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function PlanetSection({
  factionName,
  openedByDefault,
}: {
  factionName: string;
  openedByDefault: boolean;
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "planets"]);
  const factions = gameData.factions;
  const planets = gameData.planets;

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "PLANET",
      drop: (item: { id: string }) => {
        const planet = planets[item.id];
        console.log(planet);
        if (!gameid || !planet || planet.owner === factionName) {
          return;
        }

        console.log("Claiming Planet", item.id);
        claimPlanet(gameid, factionName, planet.name);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [planets]
  );

  const ownedPlanets = Object.values(planets).filter(
    (planet) => planet.owner === factionName
  );

  return (
    <div
      className={styles.planetColumn}
      style={
        {
          "--color": getFactionColor(factions[factionName]),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.planetTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <WrappedFactionIcon faction={factionName} size={20} />
        {getFactionName(factions[factionName])}
        <WrappedFactionIcon faction={factionName} size={20} />
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
              paddingBottom: responsivePixels(4),
              borderBottom: "1px solid #555",
              width: "100%",
            }}
          >
            <PlanetSummary
              planets={ownedPlanets}
              faction={factions[factionName] as Faction}
            />
          </div>
          <div
            className={styles.planetList}
            ref={dropRef}
            style={{
              minHeight: responsivePixels(40),
              backgroundColor: isOver ? "#333" : "#222",
            }}
          >
            {ownedPlanets.map((planet) => {
              return (
                <PlanetRow
                  key={planet.name}
                  planet={planet}
                  factionName={factionName}
                  removePlanet={(planetName) => {
                    if (!gameid) {
                      return;
                    }
                    unclaimPlanet(gameid, factionName, planetName);
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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "planets"]);
  const factions = gameData.factions;
  const planets = gameData.planets;

  const [collapsed, setCollapsed] = useState(true);

  const unownedPlanets = Object.values(planets).filter(
    (planet) => !planet.owner
  );

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "PLANET",
      drop: (item: { id: string }) => {
        const planet = planets[item.id];
        if (!gameid || !planet || !planet.owner) {
          return;
        }

        unclaimPlanet(gameid, planet.owner, planet.name);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [planets]
  );

  return (
    <div
      ref={dropRef}
      className={`${styles.planetColumn} ${styles.unclaimedColumn}`}
      style={{ backgroundColor: isOver ? "#333" : "#222" }}
    >
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
                key={planet.name}
                className="flexRow"
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  gap: 0,
                }}
              >
                <FactionSelectHoverMenu
                  options={Object.keys(factions)}
                  onSelect={(factionName) => {
                    if (!gameid || !factionName) {
                      return;
                    }
                    claimPlanet(gameid, factionName, planet.name);
                  }}
                  size={28}
                />
                <div style={{ width: "100%" }}>
                  <PlanetRow
                    key={planet.name}
                    planet={planet}
                    factionName="Unknown"
                  />
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

export function PlanetPanel({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions"]);
  const factions = gameData.factions;

  const orderedFactionNames = Object.keys(factions ?? {}).sort();

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={styles.planetGrid}
        style={
          {
            "--num-columns": Object.keys(factions).length / 2 + 1,
            "--num-factions": Object.keys(factions).length,
          } as CSSWithNumColumns
        }
      >
        {orderedFactionNames.map((factionName) => {
          return (
            <PlanetSection
              key={factionName}
              factionName={factionName}
              openedByDefault
            />
          );
        })}
        <UnclaimedPlanetSection />
      </div>
    </DndProvider>
  );
}
