import { CSSProperties, useContext } from "react";
import { GameIdContext } from "../../context/Context";
import { useFactions, useTechs } from "../../context/dataHooks";
import { removeTechAsync, addTechAsync } from "../../dynamic/api";
import { hasTech, isTechReplaced } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { objectEntries } from "../../util/util";
import styles from "./TechTree.module.scss";

const TYPE_ORDER: Record<TechType, number> = {
  GREEN: 1,
  BLUE: 2,
  YELLOW: 3,
  RED: 4,
  UPGRADE: 5,
} as const;

export default function TechTree({
  factionId,
  type,
  size = 4,
  style = {},
}: {
  factionId: FactionId;
  type: TechType | "FACTION";
  size?: number;
  style?: CSSProperties;
}) {
  const factions = useFactions();
  const techs = useTechs();
  const gameId = useContext(GameIdContext);

  const faction = factions[factionId];
  if (!faction) {
    return;
  }

  if (type === "FACTION") {
    const factionTechs = Object.values(techs)
      .filter((tech) => tech.faction && tech.faction === factionId)
      .sort((a, b) => {
        if (a.type === b.type) {
          if (a.type === "UPGRADE") {
            return a.name > b.name ? 1 : -1;
          }
          return a.prereqs.length > b.prereqs.length ? 1 : -1;
        }
        return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
      });

    return (
      <div
        className="flexColumn"
        style={{
          paddingLeft: "2px",
          gap: "4px",
          justifyContent: "center",
          ...style,
        }}
      >
        {factionTechs.map((tech) => {
          const filled = hasTech(faction, tech.id);
          const color = getTechTypeColor(tech.type);
          return (
            <div
              className={styles.TechTreeElement}
              style={{
                border: `1px solid ${color}`,
                backgroundColor: filled ? color : undefined,
                width: `${size}px`,
                height: `${size}px`,
              }}
              onClick={() => {
                if (filled) {
                  removeTechAsync(gameId, factionId, tech.id);
                } else {
                  addTechAsync(gameId, factionId, tech.id);
                }
              }}
            ></div>
          );
        })}
      </div>
    );
  }

  const color = getTechTypeColor(type);

  if (type === "UPGRADE") {
    const sortedUpgrades = Object.values(techs)
      .filter((tech) => tech.type === type)
      .filter((tech) => !tech.faction)
      .sort((a, b) => {
        if (a.type === b.type && a.type !== "UPGRADE") {
          return a.prereqs.length < b.prereqs.length ? -1 : 1;
        }
        return a.name < b.name ? -1 : 1;
      });
    return (
      <div
        className="flexRow"
        style={{ gap: 0, justifyContent: "space-between", ...style }}
      >
        {sortedUpgrades.map((tech) => {
          const filled = hasTech(faction, tech.id);
          if (isTechReplaced(factionId, tech.id)) {
            return (
              <div style={{ width: `${size}px`, height: `${size}px` }}></div>
            );
          }
          return (
            <div
              className={styles.TechTreeElement}
              style={{
                border: `1px solid ${color}`,
                backgroundColor: filled ? color : undefined,
                width: `${size}px`,
                height: `${size}px`,
              }}
              onClick={() => {
                if (filled) {
                  removeTechAsync(gameId, factionId, tech.id);
                } else {
                  addTechAsync(gameId, factionId, tech.id);
                }
              }}
            ></div>
          );
        })}
      </div>
    );
  }

  const techsByPrereq: Record<number, Tech[]> = {};

  Object.values(techs)
    .filter((tech) => tech.type === type)
    .filter((tech) => !tech.faction)
    .forEach((tech) => {
      const prereqs = techsByPrereq[tech.prereqs.length] ?? [];
      prereqs.push(tech);
      prereqs.sort((a, b) => {
        if (a.expansion === "POK") {
          return 1;
        }
        return -1;
      });
      techsByPrereq[tech.prereqs.length] = prereqs;
    });

  return (
    <div className={styles.TechTree} style={style}>
      {objectEntries(techsByPrereq).map(([num, techs]) => {
        return (
          <div className={styles.TechTreeRow}>
            {techs.map((tech) => {
              const filled = hasTech(faction, tech.id);
              return (
                <div
                  className={styles.TechTreeElement}
                  style={{
                    border: `1px solid ${color}`,
                    backgroundColor: filled ? color : undefined,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  onClick={() => {
                    if (filled) {
                      removeTechAsync(gameId, factionId, tech.id);
                    } else {
                      addTechAsync(gameId, factionId, tech.id);
                    }
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
