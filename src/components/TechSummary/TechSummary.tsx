import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { SettingsContext } from "../../context/contexts";
import { Techs } from "../../context/techDataHooks";
import { rem } from "../../util/util";
import OptionalElement from "../OptionalElement/OptionalElement";
import TechIcon from "../TechIcon/TechIcon";
import TechTree from "../TechTree/TechTree";
import styles from "./TechSummary.module.scss";

export function FullTechSummary({
  techs,
  ownedTechs,
  factionId,
  viewOnly,
}: {
  techs: Techs;
  ownedTechs: TechId[];
  factionId: FactionId;
  viewOnly?: boolean;
}) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of Object.values(techs)) {
    if (!ownedTechs.includes(tech.id)) {
      continue;
    }
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
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
        <TechTree
          type="GREEN"
          factionId={factionId}
          techs={techs}
          ownedTechs={ownedTechs}
          viewOnly={viewOnly}
        />
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
        <TechTree
          type="BLUE"
          factionId={factionId}
          techs={techs}
          ownedTechs={ownedTechs}
          viewOnly={viewOnly}
        />
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
        <TechTree
          type="YELLOW"
          factionId={factionId}
          techs={techs}
          ownedTechs={ownedTechs}
          viewOnly={viewOnly}
        />
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
        <TechTree
          type="RED"
          factionId={factionId}
          techs={techs}
          ownedTechs={ownedTechs}
          viewOnly={viewOnly}
        />
        <div
          className={styles.UnitUpgradeText}
          style={{ whiteSpace: "nowrap" }}
        >
          {upgradeTechs.length || "-"}{" "}
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: upgradeTechs.length }}
          />
        </div>
        <div className={styles.UnitUpgradeTree}>
          <TechTree
            type="UPGRADE"
            factionId={factionId}
            techs={techs}
            ownedTechs={ownedTechs}
            viewOnly={viewOnly}
          />
        </div>
        <div className={styles.FactionTechTree}>
          <TechTree
            type="FACTION"
            factionId={factionId}
            techs={techs}
            ownedTechs={ownedTechs}
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
  viewOnly,
}: {
  factionId: FactionId;
  techs: Techs;
  ownedTechs: TechId[];
  viewOnly?: boolean;
}) {
  const { settings } = useContext(SettingsContext);

  if (settings["fs-tech-summary-display"] === "NONE") {
    return null;
  }

  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of Object.values(techs)) {
    if (!ownedTechs.includes(tech.id)) {
      continue;
    }
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
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

  const showNumbers = settings["fs-tech-summary-display"].includes("NUMBER");
  const showIcons = settings["fs-tech-summary-display"].includes("ICON");
  const showTrees = settings["fs-tech-summary-display"].includes("TREE");

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
              {redTechs.length || "-"}
            </div>
          </OptionalElement>
        </div>
        <div
          className="flexRow"
          style={{ height: "100%", gridRow: "1 / 3", gridColumn: "3 / 4" }}
        >
          <OptionalElement value={showTrees}>
            <TechTree
              factionId={factionId}
              techs={techs}
              ownedTechs={ownedTechs}
              type="FACTION"
              viewOnly={viewOnly}
            />
          </OptionalElement>
        </div>
        <div
          className={styles.TechSummarySection}
          style={{ gridColumn: "span 3" }}
        >
          <OptionalElement value={showNumbers}>
            <div className={styles.TechSummaryNumber}>
              {upgradeTechs.length || "-"}
            </div>
          </OptionalElement>
          <OptionalElement value={showIcons}>
            <div className="flexRow" style={{ fontSize: rem(12) }}>
              <FormattedMessage
                id="lGDH2d"
                description="Unit upgrade techs."
                defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
                values={{ count: upgradeTechs.length }}
              />
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
        </div>
      </div>
    </>
  );
}
