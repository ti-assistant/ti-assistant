import { CSSProperties, useContext } from "react";
import { GameIdContext } from "../../context/Context";
import { useFactions, useTechs } from "../../context/dataHooks";
import { removeTechAsync, addTechAsync } from "../../dynamic/api";
import { hasTech, isTechReplaced } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
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
  viewOnly,
}: {
  factionId: FactionId;
  type: TechType | "FACTION";
  size?: number;
  style?: CSSProperties;
  viewOnly?: boolean;
}) {
  const factions = useFactions();
  const techs = useTechs();
  const gameId = useContext(GameIdContext);

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  if (type === "FACTION") {
    let factionTechs = Object.values(techs)
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
    let extras: string[] = [];
    if (factionId === "Nekro Virus") {
      factionTechs = Object.values(techs)
        .filter((tech) => tech.faction && hasTech(faction, tech.id))
        .sort((a, b) => {
          if (a.type === b.type) {
            if (a.type === "UPGRADE") {
              return a.name > b.name ? 1 : -1;
            }
            return a.prereqs.length > b.prereqs.length ? 1 : -1;
          }
          return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
        });
      while (factionTechs.length + extras.length < 2) {
        extras.push("#eee");
      }
    }

    return (
      <div
        className="flexColumn"
        style={{
          gap: rem(4),
          height: "100%",
          justifyContent: "center",
          ...style,
        }}
      >
        {factionTechs.map((tech) => {
          const filled = hasTech(faction, tech.id);
          const color = getTechTypeColor(tech.type);
          return (
            <div
              key={tech.id}
              title={tech.name}
              className={`${styles.TechTreeElement} ${
                viewOnly ? styles.viewOnly : ""
              }`}
              style={{
                border: `1px solid ${color}`,
                backgroundColor: filled ? color : undefined,
              }}
              onClick={
                viewOnly
                  ? undefined
                  : () => {
                      if (filled) {
                        removeTechAsync(gameId, factionId, tech.id);
                      } else {
                        addTechAsync(gameId, factionId, tech.id);
                      }
                    }
              }
            ></div>
          );
        })}
        {extras.map((color, index) => {
          return (
            <div
              key={index}
              className={styles.TechTreeElement}
              style={{
                border: `1px solid ${color}`,
                cursor: "unset",
              }}
            ></div>
          );
        })}
      </div>
    );
  }

  const color = getTechTypeColor(type);

  if (type === "UPGRADE") {
    const color = "#ccc";
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
              <div
                key={tech.id}
                style={{ width: rem(size), height: rem(size) }}
              ></div>
            );
          }
          return (
            <div
              key={tech.id}
              title={tech.name}
              className={`${styles.TechTreeElement} ${
                viewOnly ? styles.viewOnly : ""
              }`}
              style={{
                border: `1px solid ${color}`,
                backgroundColor: filled ? color : undefined,
              }}
              onClick={
                viewOnly
                  ? undefined
                  : () => {
                      if (filled) {
                        removeTechAsync(gameId, factionId, tech.id);
                      } else {
                        addTechAsync(gameId, factionId, tech.id);
                      }
                    }
              }
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
          <div key={num} className={styles.TechTreeRow}>
            {techs.map((tech) => {
              const filled = hasTech(faction, tech.id);
              return (
                <div
                  key={tech.id}
                  title={tech.name}
                  className={`${styles.TechTreeElement} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                  style={{
                    border: `1px solid ${color}`,
                    backgroundColor: filled ? color : undefined,
                  }}
                  onClick={
                    viewOnly
                      ? undefined
                      : () => {
                          if (filled) {
                            removeTechAsync(gameId, factionId, tech.id);
                          } else {
                            addTechAsync(gameId, factionId, tech.id);
                          }
                        }
                  }
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
