import { useContext } from "react";
import { SettingsContext } from "../../context/contexts";
import {
  useAbilities,
  useOptions,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import { Techs } from "../../context/techDataHooks";
import { rem } from "../../util/util";
import FactionComponents from "../FactionComponents/FactionComponents";
import OptionalElement from "../OptionalElement/OptionalElement";
import TechIcon from "../TechIcon/TechIcon";
import TechTree from "../TechTree/TechTree";
import styles from "./TechSummary.module.scss";

interface TechCounts {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  upgrade: number;
  faction: number;
}

function getTechCounts(techs: Techs, ownedTechs: TechId[]) {
  const techsByType: TechCounts = {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    upgrade: 0,
    faction: 0,
  };
  for (const tech of Object.values(techs)) {
    if (tech.state === "purged" || !ownedTechs.includes(tech.id)) {
      continue;
    }
    if (tech.faction) {
      techsByType.faction++;
    }
    switch (tech.type) {
      case "RED":
        techsByType.red++;
        break;
      case "YELLOW":
        techsByType.yellow++;
        break;
      case "GREEN":
        techsByType.green++;
        break;
      case "BLUE":
        techsByType.blue++;
        break;
      case "UPGRADE":
        techsByType.upgrade++;
        break;
    }
  }
  return techsByType;
}

export function FullTechSummary({
  techs,
  ownedTechs,
  factionId,
}: {
  techs: Techs;
  ownedTechs: TechId[];
  factionId: FactionId;
}) {
  const viewOnly = useViewOnly();

  const techCounts = getTechCounts(techs, ownedTechs);

  const numberWidth = rem(10.75 * 1.2);
  const iconSize = 20;

  return (
    <>
      <div className={`${styles.TechSummaryGrid} ${styles.Horizontal}`}>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {techCounts.green || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"GREEN"} size={iconSize} />
        </div>
        <TechTree
          type="GREEN"
          factionId={factionId}
          techs={techs}
          ownedTechs={new Set(ownedTechs)}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {techCounts.blue || "-"}
        </div>

        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"BLUE"} size={iconSize} />
        </div>
        <TechTree
          type="BLUE"
          factionId={factionId}
          techs={techs}
          ownedTechs={new Set(ownedTechs)}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {techCounts.yellow || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"YELLOW"} size={iconSize} />
        </div>
        <TechTree
          type="YELLOW"
          factionId={factionId}
          techs={techs}
          ownedTechs={new Set(ownedTechs)}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {techCounts.red || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"RED"} size={iconSize} />
        </div>
        <TechTree
          type="RED"
          factionId={factionId}
          techs={techs}
          ownedTechs={new Set(ownedTechs)}
          viewOnly={viewOnly}
        />
        <div
          className="flexRow"
          style={{ gridColumn: "span 15", justifyContent: "center" }}
        >
          <div
            className="flexRow centered"
            style={{ height: "100%", width: numberWidth }}
          >
            {techCounts.upgrade || "-"}
          </div>
          <div className="flexRow" style={{ height: "100%" }}>
            <TechIcon type={"UPGRADE"} size={iconSize} />
          </div>
          <TechTree
            type="UPGRADE"
            factionId={factionId}
            techs={techs}
            ownedTechs={new Set(ownedTechs)}
            viewOnly={viewOnly}
          />
          <div>&nbsp;</div>
          <div className={styles.TechSummaryNumber}>
            {techCounts.faction || "-"}
          </div>
          <div className="flexRow" style={{ height: "100%" }}>
            <FactionComponents.Icon factionId={factionId} size={16} />
          </div>
          <TechTree
            factionId={factionId}
            techs={techs}
            ownedTechs={new Set(ownedTechs)}
            type="FACTION"
            viewOnly={viewOnly}
          />
        </div>
      </div>
    </>
  );
}

export default function TechSummary({
  factionId,
  techs,
  ownedTechs,
}: {
  factionId: FactionId;
  techs: Techs;
  ownedTechs: Set<TechId>;
}) {
  const options = useOptions();
  const { settings } = useContext(SettingsContext);
  const viewOnly = useViewOnly();

  if (settings["fs-tech-summary-display"] === "NONE") {
    return null;
  }

  const techCounts = getTechCounts(techs, Array.from(ownedTechs));

  const showNumbers = settings["fs-tech-summary-display"].includes("NUMBER");
  const showIcons = settings["fs-tech-summary-display"].includes("ICON");
  const showTrees =
    settings["fs-tech-summary-display"].includes("TREE") &&
    !options.expansions.includes("TWILIGHTS FALL");

  return (
    <>
      <div className={`${styles.TechSummaryGrid}`}>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.green || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"GREEN"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="GREEN"
              viewOnly={viewOnly}
            />
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="BLUE"
              viewOnly={viewOnly}
            />
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"BLUE"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.blue || "-"}
            </div>
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.yellow || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"YELLOW"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="YELLOW"
              viewOnly={viewOnly}
            />
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="RED"
              viewOnly={viewOnly}
            />
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"RED"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.red || "-"}
            </div>
          </OptionalElement>
        </div>
        <div
          className={styles.TechSummarySection}
          style={{ gridColumn: "span 2" }}
        >
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.upgrade || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"UPGRADE"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="UPGRADE"
              viewOnly={viewOnly}
            />
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <FactionComponents.Icon factionId={factionId} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="FACTION"
              viewOnly={viewOnly}
            />
          </OptionalElement>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {techCounts.faction || "-"}
            </div>
          </OptionalElement>
        </div>
      </div>
    </>
  );
}

export function TFTechSummary({
  factionId,
  techs,
  ownedTechs,
}: {
  factionId: FactionId;
  techs: Techs;
  ownedTechs: Set<TechId>;
}) {
  const abilities = useAbilities();
  const { settings } = useContext(SettingsContext);
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  if (settings["fs-tech-summary-display"] === "NONE") {
    return null;
  }

  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  let factionTechs = [];
  for (const ability of Object.values(abilities)) {
    if (ability.owner !== factionId) {
      continue;
    }
    switch (ability.type) {
      case "RED":
        redTechs.push(ability);
        break;
      case "YELLOW":
        yellowTechs.push(ability);
        break;
      case "GREEN":
        greenTechs.push(ability);
        break;
      case "BLUE":
        blueTechs.push(ability);
        break;
    }
  }
  for (const upgrade of Object.values(upgrades)) {
    if (upgrade.owner !== factionId) {
      continue;
    }
    upgradeTechs.push(upgrade);
  }

  for (const tech of Object.values(techs)) {
    if (!ownedTechs.has(tech.id)) {
      continue;
    }
    if (tech.faction) {
      factionTechs.push(tech);
    }
  }

  const showNumbers = settings["fs-tech-summary-display"].includes("NUMBER");
  const showIcons = settings["fs-tech-summary-display"].includes("ICON");

  return (
    <>
      <div className={`${styles.TechSummaryGrid}`}>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {greenTechs.length || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"GREEN"} size={16} />
            </div>
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"BLUE"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {blueTechs.length || "-"}
            </div>
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {yellowTechs.length || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"YELLOW"} size={16} />
            </div>
          </OptionalElement>
        </div>
        <div className={styles.TechSummarySection}>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"RED"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {redTechs.length || "-"}
            </div>
          </OptionalElement>
        </div>
        <div
          className={styles.TechSummarySection}
          style={{ gridColumn: "span 2" }}
        >
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {upgradeTechs.length || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <TechIcon type={"UPGRADE"} size={16} />
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ height: "100%" }}>
              <FactionComponents.Icon factionId={factionId} size={16} />
            </div>
          </OptionalElement>
          <TechTree
            factionId={factionId}
            techs={techs}
            ownedTechs={ownedTechs}
            type="FACTION"
            viewOnly={viewOnly}
          />
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {factionTechs.length || "-"}
            </div>
          </OptionalElement>
        </div>
      </div>
    </>
  );
}

export function FullTFTechSummary({
  techs,
  ownedTechs,
  factionId,
}: {
  techs: Techs;
  ownedTechs: TechId[];
  factionId: FactionId;
}) {
  const abilities = useAbilities();
  const { settings } = useContext(SettingsContext);
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  let factionTechs = [];
  for (const ability of Object.values(abilities)) {
    if (ability.owner !== factionId) {
      continue;
    }
    switch (ability.type) {
      case "RED":
        redTechs.push(ability);
        break;
      case "YELLOW":
        yellowTechs.push(ability);
        break;
      case "GREEN":
        greenTechs.push(ability);
        break;
      case "BLUE":
        blueTechs.push(ability);
        break;
    }
  }
  for (const upgrade of Object.values(upgrades)) {
    if (upgrade.owner !== factionId) {
      continue;
    }
    upgradeTechs.push(upgrade);
  }

  const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

  Object.values(techs).sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff: number = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  for (const tech of Object.values(techs)) {
    if (!ownedTechs.includes(tech.id)) {
      continue;
    }
    if (tech.faction) {
      factionTechs.push(tech);
    }
  }

  const numberWidth = rem(10.75 * 1.2);
  const iconSize = 20;

  return (
    <>
      <div className={`${styles.TechSummaryGrid} ${styles.Horizontal}`}>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {greenTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"GREEN"} size={iconSize} />
        </div>
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {blueTechs.length || "-"}
        </div>

        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"BLUE"} size={iconSize} />
        </div>
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {yellowTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"YELLOW"} size={iconSize} />
        </div>
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {redTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"RED"} size={iconSize} />
        </div>

        <div
          className="flexRow"
          style={{ gridColumn: "span 15", justifyContent: "center" }}
        >
          <div
            className="flexRow centered"
            style={{ height: "100%", width: numberWidth }}
          >
            {upgradeTechs.length || "-"}
          </div>
          <div className="flexRow" style={{ height: "100%" }}>
            <TechIcon type={"UPGRADE"} size={iconSize} />
          </div>
          <TechTree
            type="UPGRADE"
            factionId={factionId}
            techs={techs}
            ownedTechs={new Set(ownedTechs)}
            viewOnly={viewOnly}
          />
          <div>&nbsp;</div>
          <div className={styles.TechSummaryNumber}>
            {factionTechs.length || "-"}
          </div>
          <div className="flexRow" style={{ height: "100%" }}>
            <FactionComponents.Icon factionId={factionId} size={16} />
          </div>
          <TechTree
            factionId={factionId}
            techs={techs}
            ownedTechs={new Set(ownedTechs)}
            type="FACTION"
            viewOnly={viewOnly}
          />
        </div>
      </div>
    </>
  );
}
