import { useRouter } from "next/router";
import {
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../AddTechList";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { useGameData } from "../../data/GameData";
import { Tech, TechType } from "../../util/api/techs";
import {
  canResearchTech,
  getFactionPreReqs,
  getTechTypeColor,
} from "../../util/techs";
import { responsivePixels } from "../../util/util";
import { applyAllPlanetAttachments } from "../../util/planets";

interface InnerTechSelectHoverMenuProps {
  factionName: string;
  prereqs: Record<TechType, number>;
  label: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
  outerCloseFn: () => void;
}

function InnerTechSelectHoverMenu({
  factionName,
  prereqs,
  techs,
  label,
  selectTech,
  outerCloseFn,
}: InnerTechSelectHoverMenuProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "options"]);
  const factions = gameData.factions;
  const options = gameData.options;

  const faction = factions[factionName];
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
            let isTechOwned = false;
            for (const faction of Object.values(factions)) {
              if (faction.techs[tech.name]) {
                isTechOwned = true;
                break;
              }
            }
            return (
              <button
                key={tech.name}
                onClick={() => {
                  innerCloseFn();
                  outerCloseFn();
                  selectTech(tech);
                }}
                className={
                  canResearchTech(tech, options, prereqs, faction, isTechOwned)
                    ? ""
                    : "faded"
                }
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
  factionName: string;
  label?: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
}

export function TechSelectHoverMenu({
  factionName,
  techs,
  label = "Research Tech",
  selectTech,
}: TechSelectHoverMenuProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "attachments",
    "factions",
    "options",
    "planets",
    "relics",
    "techs",
  ]);
  const attachments = gameData.attachments ?? {};
  const factions = gameData.factions;
  const options = gameData.options;
  const planets = gameData.planets;
  const relics = gameData.relics ?? {};
  const allTechs = gameData.techs ?? {};

  const factionPreReqs = getFactionPreReqs(
    factions[factionName],
    allTechs,
    options,
    applyAllPlanetAttachments(Object.values(planets), attachments),
    relics
  );

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
            factionName={factionName}
            techs={redTechs}
            label="Warfare"
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionName={factionName}
            techs={blueTechs}
            label="Propulsion"
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionName={factionName}
            techs={yellowTechs}
            label="Cybernetic"
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionName={factionName}
            techs={greenTechs}
            label="Biotic"
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionName={factionName}
            techs={unitUpgrades}
            label="Unit Upgrades"
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
