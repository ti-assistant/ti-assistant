import { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  useCurrentTurn,
  useGameId,
  useTechs,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { addTechAsync, removeTechAsync } from "../../dynamic/api";
import { TechRow } from "../../TechRow";
import { getAddTechEvents, getResearchedTechs } from "../../util/actionLog";
import { hasTech } from "../../util/api/techs";
import { ActionLog, Optional } from "../../util/types/types";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import styles from "./TechResearchSection.module.scss";
import { flattenDiagnosticMessageText } from "typescript";

function getResearchableTechs(
  currentTurn: ActionLog,
  techs: Partial<Record<TechId, Tech>>,
  faction: Optional<Faction>,
  factions: Partial<Record<FactionId, Faction>>,
  filter: Optional<(tech: Tech) => boolean>
) {
  if (!faction) {
    return [];
  }
  const replaces: TechId[] = [];
  const availableTechs = Object.values(techs).filter((tech) => {
    if (hasTech(faction, tech.id)) {
      return false;
    }
    // TODO: See if this can be removed by filtered in gameData.
    if (tech.faction && !factions[tech.faction]) {
      return false;
    }
    if (
      faction.id !== "Nekro Virus" &&
      tech.faction &&
      faction.id !== tech.faction
    ) {
      return false;
    }
    const researchedTechs = getResearchedTechs(currentTurn, faction.id);
    if (researchedTechs.includes(tech.id)) {
      return false;
    }
    if (tech.type === "UPGRADE" && tech.replaces) {
      replaces.push(tech.replaces);
    }
    if (filter) {
      return filter(tech);
    }
    return true;
  });
  if (faction.id !== "Nekro Virus") {
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }
  return availableTechs;
}

export default function TechResearchSection({
  label,
  factionId,
  duplicateToFaction,
  filter,
  gain = false,
  hideWrapper = false,
  numTechs = 1,
  shareKnowledge = false,
  style,
}: {
  label?: string;
  factionId: FactionId;
  duplicateToFaction?: FactionId;
  filter?: (tech: Tech) => boolean;
  gain?: boolean;
  hideWrapper?: boolean;
  numTechs?: number;
  shareKnowledge?: boolean;
  style?: CSSProperties;
}) {
  const currentTurn = useCurrentTurn();
  const factions = useFactions();
  const faction = factions[factionId];
  const gameId = useGameId();
  const intl = useIntl();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const availableTechs = getResearchableTechs(
    currentTurn,
    techs,
    faction,
    factions,
    filter
  );
  const researchedTechs = getResearchedTechs(currentTurn, factionId);
  const addTechEvents = getAddTechEvents(currentTurn);

  return (
    <div className={styles.TechResearchSection} style={style}>
      <ResearchedTechsSection
        factionId={factionId}
        duplicateToFaction={duplicateToFaction}
        gain={gain}
        hideWrapper={hideWrapper}
        researchedTechs={researchedTechs}
        addTechEvents={addTechEvents}
      />
      {!viewOnly && researchedTechs.length < numTechs ? (
        factionId !== "Nekro Virus" || gain ? (
          <TechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs={gain}
            label={
              label ??
              (gain
                ? intl.formatMessage({
                    id: "McKqpw",
                    description: "Label on a hover menu used to gain tech.",
                    defaultMessage: "Gain Tech",
                  })
                : intl.formatMessage({
                    id: "3qIvsL",
                    description: "Label on a hover menu used to research tech.",
                    defaultMessage: "Research Tech",
                  }))
            }
            techs={availableTechs}
            selectTech={(tech) => {
              let additionalFactions: Optional<FactionId[]>;
              if (duplicateToFaction) {
                const extraFaction = factions[duplicateToFaction];
                if (extraFaction && !hasTech(extraFaction, tech.id)) {
                  additionalFactions = [extraFaction.id];
                }
              }
              addTechAsync(
                gameId,
                factionId,
                tech.id,
                additionalFactions,
                false,
                shareKnowledge
              );
            }}
          />
        ) : (
          <FormattedMessage
            id="t5fXQR"
            description="Text telling a player how many command tokens to gain."
            defaultMessage="Gain {count} command {count, plural, one {token} other {tokens}}"
            values={{ count: numTechs * 3 }}
          />
        )
      ) : null}
    </div>
  );
}

function ResearchedTechsSection({
  factionId,
  duplicateToFaction,
  researchedTechs,
  gain = false,
  hideWrapper = false,
  addTechEvents,
}: {
  factionId: FactionId;
  duplicateToFaction?: FactionId;
  gain?: boolean;
  researchedTechs: TechId[];
  hideWrapper?: boolean;
  addTechEvents?: ActionLogEntry<AddTechData>[];
}) {
  const gameId = useGameId();
  const techs = useTechs();

  if (researchedTechs.length === 0) {
    return null;
  }
  const innerContent = (
    <>
      {researchedTechs.map((techId) => {
        const tech = techs[techId];
        if (!tech) {
          return null;
        }
        return (
          <TechRow
            key={techId}
            tech={tech}
            removeTech={() => {
              const { techCount, hadTech } = (addTechEvents ?? []).reduce(
                (result, event) => {
                  if (event.data.event.tech === techId) {
                    const hadTech = !event.data.event.additionalFactions;
                    return {
                      techCount: result.techCount + 1,
                      hadTech: result.hadTech && hadTech,
                    };
                  }
                  return result;
                },
                { techCount: 0, hadTech: true }
              );
              console.log("Count", techCount);
              let additionalFactions: Optional<FactionId[]>;
              if (techCount === 1 && !hadTech) {
                additionalFactions = ["Deepwrought Scholarate"];
              }
              removeTechAsync(gameId, factionId, techId, additionalFactions);
            }}
            researchAgreement={factionId === "Universities of Jol-Nar"}
            opts={{
              hideSymbols: true,
            }}
          />
        );
      })}
    </>
  );

  if (hideWrapper) {
    return innerContent;
  }

  // return (
  //   <IconDiv icon={<TechSkipIcon size={16} outline />}>{innerContent}</IconDiv>
  // );

  return (
    <LabeledDiv
      label={
        gain ? (
          <FormattedMessage
            id="+tb/XA"
            description="Label for a section listing gained techs."
            defaultMessage="Gained {count, plural, one {Tech} other {Techs}}"
            values={{ count: researchedTechs.length }}
          />
        ) : (
          <FormattedMessage
            id="wHhicR"
            description="Label for a section listing researched techs."
            defaultMessage="Researched {count, plural, one {Tech} other {Techs}}"
            values={{ count: researchedTechs.length }}
          />
        )
      }
    >
      {innerContent}
    </LabeledDiv>
  );
}
