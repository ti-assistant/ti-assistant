"use client";

import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import {
  useAttachments,
  useOptions,
  usePlanets,
  useRelics,
  useTechs,
  useViewOnly,
} from "../../context/dataHooks";
import { useFaction, useFactions } from "../../context/factionDataHooks";
import { applyAllPlanetAttachments } from "../../util/planets";
import {
  canResearchTech,
  getFactionPreReqs,
  getTechTypeColor,
  sortTechsByName,
  sortTechsByPreReqAndExpansion,
} from "../../util/techs";
import { rem } from "../../util/util";
import UnitIcon from "../Units/Icons";
import TechPrereqDots from "./TechPrereqDots";
import styles from "./TechSelectHoverMenu.module.scss";
import TechIcon from "../TechIcon/TechIcon";

interface InnerTechSelectHoverMenuProps {
  factionId: FactionId;
  ignorePrereqs?: boolean;
  prereqs: Record<TechType, number>;
  label: ReactNode;
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
  const techObjs = useTechs();
  const options = useOptions();
  const viewOnly = useViewOnly();

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
            const canResearch = canResearchTech(
              tech,
              options,
              prereqs,
              faction,
              isTechOwned,
              techObjs,
            );
            return (
              <button
                key={tech.id}
                onClick={() => {
                  innerCloseFn();
                  outerCloseFn();
                  selectTech(tech);
                }}
                className={ignorePrereqs || canResearch ? "" : "faded"}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: rem(16),
                  gap: rem(8),
                }}
                disabled={viewOnly}
              >
                {tech.name}
                <div className="flexRow" style={{ gap: rem(4) }}>
                  {tech.type === "UPGRADE" ? (
                    <UnitIcon
                      type={tech.unitType}
                      size={16}
                      color={
                        ignorePrereqs || canResearch
                          ? undefined
                          : "var(--disabled-fg)"
                      }
                    />
                  ) : null}
                  <TechPrereqDots prereqs={tech.prereqs} />
                </div>
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
    relics,
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
  const otherTechs = techs.filter((tech) => {
    return tech.type === "OTHER";
  });
  sortTechsByName(unitUpgrades);

  if (techs.length === 0) {
    return <div>No techs available.</div>;
  }

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
            label={<TechIcon type="GREEN" size="1.5em" />}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={blueTechs}
            label={<TechIcon type="BLUE" size="1.5em" />}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={yellowTechs}
            label={<TechIcon type="YELLOW" size="1.5em" />}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={redTechs}
            label={<TechIcon type="RED" size="1.5em" />}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={unitUpgrades}
            label={<TechIcon type="UPGRADE" size="1.5em" />}
            prereqs={factionPreReqs}
            selectTech={selectTech}
            outerCloseFn={outerCloseFn}
          />
          <InnerTechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={ignorePrereqs}
            techs={otherTechs}
            label={intl.formatMessage({
              id: "sgqLYB",
              description: "Text on a button used to select a non-listed value",
              defaultMessage: "Other",
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
