import { CSSProperties } from "react";
import { useGameId, useOptions, useViewOnly } from "../../context/dataHooks";
import { useOceans } from "../../context/planetDataHooks";
import { claimPlanetAsync, unclaimPlanetAsync } from "../../dynamic/api";
import { getRadialPosition } from "../../util/util";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import LegendaryPlanetIcon from "../PlanetIcons/LegendaryPlanetIcon";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import styles from "./PlanetSummary.module.scss";

interface PlanetSummaryProps {
  factionId: FactionId;
  planets: Planet[];
  hasXxchaHero: boolean;
}

// TODO: Figure out how to display oceans.
export default function PlanetSummary({
  factionId,
  planets,
  hasXxchaHero,
}: PlanetSummaryProps) {
  const gameId = useGameId();
  const oceans = useOceans();
  const options = useOptions();
  const viewOnly = useViewOnly();

  let numPlanets = 0;
  let resources = 0;
  let influence = 0;
  let cultural = 0;
  let hazardous = 0;
  let industrial = 0;
  let legendary = 0;
  let techSkips = 0;
  let attachments = 0;
  for (const planet of planets) {
    if (
      !planet.attributes.includes("space-station") &&
      !planet.attributes.includes("ocean") &&
      !planet.attributes.includes("synthetic")
    ) {
      numPlanets++;
    }
    if (
      hasXxchaHero &&
      options.expansions.includes("CODEX THREE") &&
      !options.expansions.includes("THUNDERS EDGE")
    ) {
      resources += planet.resources + planet.influence;
      influence += planet.resources + planet.influence;
    } else {
      resources += planet.resources;
      influence += planet.influence;
    }
    let hasSkip = false;
    for (const attribute of planet.attributes) {
      if (attribute.endsWith("skip")) {
        hasSkip = true;
      }
      if (attribute === "legendary") {
        ++legendary;
      }
    }
    if (hasSkip) {
      ++techSkips;
    }
    for (const type of planet.types) {
      switch (type) {
        case "CULTURAL":
          ++cultural;
          break;
        case "INDUSTRIAL":
          ++industrial;
          break;
        case "HAZARDOUS":
          ++hazardous;
          break;
      }
    }
    if (planet.attachments?.includes("Terraform")) {
      ++cultural;
      ++industrial;
      ++hazardous;
    }
    if ((planet.attachments ?? []).length > 0) {
      ++attachments;
    }
  }

  return (
    <div className={styles.PlanetSummary}>
      <div className={styles.ResourceSection}>
        <div className={styles.PlanetTotal}>
          {factionId === "Deepwrought Scholarate"
            ? oceans.map((ocean, index) => {
                const position: CSSProperties = getRadialPosition(
                  index,
                  /* numOptions= */ 9,
                  /* offset= */ -0.3,
                  /* circleSize= */ 26,
                  /* size= */ 4,
                );
                return (
                  <div
                    key={ocean.id}
                    title={ocean.name}
                    className={`${styles.OceanElement} ${
                      viewOnly ? styles.viewOnly : ""
                    }`}
                    style={{
                      border: `1px solid ${ocean.owner ? "#eee" : "#444"}`,
                      backgroundColor: ocean.owner
                        ? "#eee"
                        : "var(--background-color)",
                      ...position,
                    }}
                    onClick={
                      viewOnly
                        ? undefined
                        : () => {
                            if (ocean.owner) {
                              unclaimPlanetAsync(gameId, factionId, ocean.id);
                            } else {
                              claimPlanetAsync(gameId, factionId, ocean.id);
                            }
                          }
                    }
                  ></div>
                );
              })
            : null}
          {numPlanets}
        </div>
        <ResourcesIcon
          resources={resources}
          influence={influence}
          height={50}
        />
      </div>
      <div className={styles.CountSection}>
        <div className={styles.PlanetTypeGrid}>
          <div className={styles.centered}>{cultural || "-"}</div>
          <PlanetIcon types={["CULTURAL"]} size={16} />
          <div className={styles.centered}>{hazardous || "-"}</div>
          <PlanetIcon types={["HAZARDOUS"]} size={16} />
          <div className={styles.centered}>{industrial || "-"}</div>
          <PlanetIcon types={["INDUSTRIAL"]} size={16} />
        </div>
        <div className={styles.PlanetTypeGrid}>
          <LegendaryPlanetIcon />
          <div className={styles.centered}>{legendary || "-"}</div>
          <TechSkipIcon size={16} />
          <div className={styles.centered}>{techSkips || "-"}</div>
          <div className={styles.Attachments}>
            <div className={styles.symbol}>⎗</div>
          </div>
          <div className={styles.centered}>{attachments || "-"}</div>
        </div>
      </div>
    </div>
  );
}
