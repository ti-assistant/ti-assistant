import {
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../AddTechList";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { Tech } from "../../util/api/techs";
import { getTechTypeColor } from "../../util/techs";
import { responsivePixels } from "../../util/util";

export interface TechSelectHoverMenuProps {
  direction?: string;
  label?: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
}

export function TechSelectHoverMenu({
  techs,
  label = "Research Tech",
  selectTech,
  direction = "horizontal",
}: TechSelectHoverMenuProps) {
  const blueTechs = techs.filter((tech) => {
    return tech.type === "BLUE";
  });
  sortTechsByPreReqAndExpansion(blueTechs);
  const greenTechs = techs.filter((tech) => {
    return tech.type === "GREEN";
  });
  sortTechsByPreReqAndExpansion(greenTechs);
  const yellowTechs = techs.filter((tech) => {
    return tech.type === "YELLOW";
  });
  sortTechsByPreReqAndExpansion(yellowTechs);
  const redTechs = techs.filter((tech) => {
    return tech.type === "RED";
  });
  sortTechsByPreReqAndExpansion(redTechs);
  const unitUpgrades = techs.filter((tech) => {
    return tech.type === "UPGRADE";
  });
  sortTechsByName(unitUpgrades);

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";
  return (
    <ClientOnlyHoverMenu
      label={label}
      style={{ whiteSpace: "nowrap" }}
      renderProps={(outerCloseFn) => (
        <div
          className={className}
          style={{
            padding: responsivePixels(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          {redTechs.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Warfare"
              borderColor={getTechTypeColor("RED")}
              renderProps={(innerCloseFn) => (
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                  }}
                >
                  {redTechs.map((tech) => {
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
          ) : null}
          {blueTechs.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Propulsion"
              borderColor={getTechTypeColor("BLUE")}
              renderProps={(innerCloseFn) => (
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                  }}
                >
                  {blueTechs.map((tech) => {
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
          ) : null}
          {yellowTechs.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Cybernetic"
              borderColor={getTechTypeColor("YELLOW")}
              renderProps={(innerCloseFn) => (
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                  }}
                >
                  {yellowTechs.map((tech) => {
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
          ) : null}
          {greenTechs.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Biotic"
              borderColor={getTechTypeColor("GREEN")}
              renderProps={(innerCloseFn) => (
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                  }}
                >
                  {greenTechs.map((tech) => {
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
          ) : null}
          {unitUpgrades.length > 0 ? (
            <ClientOnlyHoverMenu
              label="Unit Upgrades"
              renderProps={(innerCloseFn) => (
                <div
                  className="flexColumn"
                  style={{
                    padding: responsivePixels(8),
                    gap: responsivePixels(4),
                    alignItems: "stretch",
                  }}
                >
                  {unitUpgrades.map((tech) => {
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
          ) : null}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
