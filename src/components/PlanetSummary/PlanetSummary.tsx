import { useContext } from "react";
import { OptionContext } from "../../context/Context";
import LegendaryPlanetIcon from "../LegendaryPlanetIcon/LegendaryPlanetIcon";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import styles from "./PlanetSummary.module.scss";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";

interface PlanetSummaryProps {
  planets: Planet[];
  hasXxchaHero: boolean;
}

export default function PlanetSummary({
  planets,
  hasXxchaHero,
}: PlanetSummaryProps) {
  const options = useContext(OptionContext);

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
    numPlanets++;
    if (options.expansions.includes("CODEX THREE") && hasXxchaHero) {
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
    switch (planet.type) {
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
        <ResourcesIcon
          resources={resources}
          influence={influence}
          height={50}
        />
        <div className={styles.PlanetTotal}>{numPlanets}</div>
      </div>
      <div className={styles.CountSection}>
        <div className={styles.PlanetTypeGrid}>
          <div className={styles.centered}>{cultural || "-"}</div>
          <PlanetIcon type={"CULTURAL"} size={16} />
          <div className={styles.centered}>{hazardous || "-"}</div>
          <PlanetIcon type={"HAZARDOUS"} size={16} />
          <div className={styles.centered}>{industrial || "-"}</div>
          <PlanetIcon type={"INDUSTRIAL"} size={16} />
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
