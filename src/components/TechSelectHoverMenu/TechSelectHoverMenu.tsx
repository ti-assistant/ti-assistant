"use client";

import { useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import {
  useAttachments,
  useFaction,
  useFactions,
  useOptions,
  usePlanets,
  useRelics,
  useTechs,
} from "../../context/dataHooks";
import { applyAllPlanetAttachments } from "../../util/planets";
import {
  canResearchTech,
  getFactionPreReqs,
  getTechTypeColor,
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../util/techs";
import styles from "./TechSelectHoverMenu.module.scss";
import { rem } from "../../util/util";

interface InnerTechSelectHoverMenuProps {
  factionId: FactionId;
  ignorePrereqs?: boolean;
  prereqs: Record<TechType, number>;
  label: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
  outerCloseFn: () => void;
}

function InnerTechSelectHoverMenu({
  factionId,
  ignorePrereqs = false,
  prereqs,
  techs,
  label,
  selectTech,
  outerCloseFn,
}: InnerTechSelectHoverMenuProps) {
  const faction = useFaction(factionId);
  const factions = useFactions();
  const options = useOptions();

  return techs.length > 0 ? (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: rem(14) }}
      borderColor={getTechTypeColor(techs[0]?.type ?? "UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          className="flexColumn"
          style={{
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
          }}
        >
          {techs.map((tech) => {
            let isTechOwned = false;
            for (const faction of Object.values(factions)) {
              if (faction.techs[tech.id]) {
                isTechOwned = true;
                break;
              }
            }
            return (
              <button
                key={tech.id}
                onClick={() => {
                  innerCloseFn();
                  outerCloseFn();
                  selectTech(tech);
                }}
                className={
                  ignorePrereqs ||
                  canResearchTech(tech, options, prereqs, faction, isTechOwned)
                    ? ""
                    : "faded"
                }
                style={{ fontSize: rem(16) }}
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

interface TechSelectHoverMenuProps {
  factionId: FactionId;
  ignorePrereqs?: boolean;
  label: string;
  techs: Tech[];
  selectTech: (tech: Tech) => void;
}

export default function TechSelectHoverMenu({
  factionId,
  ignorePrereqs = false,
  techs,
  label,
  selectTech,
}: TechSelectHoverMenuProps) {
  const attachments = useAttachments();
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();
  const relics = useRelics();
  const allTechs = useTechs();

  const intl = useIntl();

  const factionPreReqs = getFactionPreReqs(
    factions[factionId],
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

  return (
    <ClientOnlyHoverMenu
      label={label}
      style={{ whiteSpace: "nowrap" }}
      buttonStyle={{ fontSize: rem(14) }}
      renderProps={(outerCloseFn) => (
        <div
          className={styles.OuterTechSelectMenu}
          style={{
            padding: rem(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={greenTechs}
            label={intl.formatMessage({
              id: "2I5JBO",
              description: "Title of green techs.",
              defaultMessage: "Biotic",
            })}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={blueTechs}
            label={intl.formatMessage({
              id: "Nr4DLa",
              description: "Title of blue techs.",
              defaultMessage: "Propulsion",
            })}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={yellowTechs}
            label={intl.formatMessage({
              id: "W9OGxl",
              description: "Title of yellow techs.",
              defaultMessage: "Cybernetic",
            })}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={redTechs}
            label={intl.formatMessage({
              id: "ZqAjEi",
              description: "Title of red techs.",
              defaultMessage: "Warfare",
            })}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={unitUpgrades}
            label={intl.formatMessage({
              id: "2hHU0G",
              description: "Title of uprade techs.",
              defaultMessage: "Unit Upgrades",
            })}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
