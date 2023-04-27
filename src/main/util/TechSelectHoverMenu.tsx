import {
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../AddTechList";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { Tech } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { responsivePixels } from "../../util/util";

interface InnerTechSelectHoverMenuProps {
  label: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
  outerCloseFn: () => void;
}

function InnerTechSelectHoverMenu({
  techs,
  label,
  selectTech,
  outerCloseFn,
}: InnerTechSelectHoverMenuProps) {
  return techs.length > 0 ? (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: "14px" }}
      borderColor={getTechTypeColor(techs[0]?.type ?? "UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          className="flexColumn"
          style={{
            padding: responsivePixels(8),
            gap: responsivePixels(4),
            alignItems: "stretch",
          }}
        >
          {techs.map((tech) => {
            return (
              <button
                key={tech.name}
                onClick={() => {
                  innerCloseFn();
                  outerCloseFn();
                  selectTech(tech);
                }}
                style={{ fontSize: responsivePixels(16) }}
              >
                {tech.name}
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  ) : null;
}

export interface TechSelectHoverMenuProps {
  label?: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
}

export function TechSelectHoverMenu({
  techs,
  label = "Research Tech",
  selectTech,
}: TechSelectHoverMenuProps) {
  sortTechsByPreReqAndExpansion(techs);
  const blueTechs = techs.filter((tech) => {
    return tech.type === "BLUE";
  });
  const greenTechs = techs.filter((tech) => {
    return tech.type === "GREEN";
  });
  const yellowTechs = techs.filter((tech) => {
    return tech.type === "YELLOW";
  });
  const redTechs = techs.filter((tech) => {
    return tech.type === "RED";
  });
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === "UPGRADE";
  });
  sortTechsByName(unitUpgrades);

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";
  return (
    <ClientOnlyHoverMenu
      label={label}
      style={{ whiteSpace: "nowrap" }}
      buttonStyle={{ fontSize: "14px" }}
      renderProps={(outerCloseFn) => (
        <div
          className={className}
          style={{
            padding: responsivePixels(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          <InnerTechSelectHoverMenu
            techs={redTechs}
            label="Warfare"
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            techs={blueTechs}
            label="Propulsion"
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            techs={yellowTechs}
            label="Cybernetic"
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            techs={greenTechs}
            label="Biotic"
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            techs={unitUpgrades}
            label="Unit Upgrades"
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
