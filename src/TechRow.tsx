import { FormattedMessage } from "react-intl";
import InfoModal from "./InfoModal";
import { SelectableRow } from "./SelectableRow";
import styles from "./TechRow.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "./components/FormattedDescription/FormattedDescription";
import TechIcon from "./components/TechIcon/TechIcon";
import TechPrereqDots from "./components/TechSelectHoverMenu/TechPrereqDots";
import UnitStats from "./components/UnitStats/UnitStats";
import UnitIcon from "./components/Units/Icons";
import {
  useGameId,
  useLogEntries,
  useTech,
  useViewOnly,
} from "./context/dataHooks";
import { useFactions } from "./context/factionDataHooks";
import { useDataUpdate } from "./util/api/dataUpdate";
import { Events } from "./util/api/events";
import { hasTech } from "./util/api/techs";
import { getFactionColor, getMapOrderedFactionIds } from "./util/factions";
import { getTechColor } from "./util/techs";
import { objectEntries, rem } from "./util/util";

function InfoContent({ tech }: { tech: Tech }) {
  if (tech.type === "UPGRADE") {
    return (
      <div
        className="myriadPro flexColumn"
        style={{
          width: "100%",
          padding: rem(4),
          whiteSpace: "pre-line",
          textAlign: "center",
          fontSize: rem(32),
          gap: rem(32),
        }}
      >
        <FormattedDescription description={tech.description} />
        <div className="flexColumn" style={{ width: "100%" }}>
          {tech.abilities.length > 0 ? (
            <div
              className={styles.UpgradeTechAbilities}
              style={{
                whiteSpace: "nowrap",
                fontFamily: "var(--main-font)",
                paddingLeft: rem(8),
                rowGap: rem(2),
                width: "100%",
              }}
            >
              {tech.abilities.map((ability) => {
                return <div key={ability}>{ability.toUpperCase()}</div>;
              })}
            </div>
          ) : null}
          <UnitStats
            stats={tech.stats}
            type={tech.unitType}
            className={styles.UnitStats}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className="myriadPro flexColumn"
      style={{
        width: "100%",
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
        gap: rem(32),
      }}
    >
      <FormattedDescription description={tech.description} />
    </div>
  );
}

interface TechRowProps {
  className?: string;
  techId: TechId;
  removeTech?: (techId: TechId) => void;
  addTech?: (techId: TechId) => void;
  opts?: TechRowOptions;
  researchAgreement?: boolean;
}

interface TechRowOptions {
  hideInfo?: boolean;
  hideSymbols?: boolean;
  hideIcon?: boolean;
  fade?: boolean;
}

export function TechRow({
  className = "",
  techId,
  removeTech,
  addTech,
  researchAgreement,
  opts = {},
}: TechRowProps) {
  const tech = useTech(techId);
  const viewOnly = useViewOnly();
  if (!tech) {
    return null;
  }

  return (
    <SelectableRow
      itemId={techId}
      selectItem={addTech}
      removeItem={removeTech}
      viewOnly={viewOnly}
    >
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "stretch" }}
      >
        <div
          className={className}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            opacity: opts.fade ? 0.25 : undefined,
          }}
        >
          <div
            className="flexRow"
            style={{
              position: "relative",
              // display: "flex",
              color: getTechColor(tech),
              zIndex: 0,
            }}
          >
            {tech.name}
            {tech.type === "UPGRADE" ? <UnitIcon type={tech.unitType} /> : null}
            {tech.faction && !opts.hideIcon ? (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: "70%",
                  height: "100%",
                  zIndex: -2,
                  top: rem(-4),
                  right: rem(-16),
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <FactionIcon factionId={tech.faction} size={24} />
                </div>
              </div>
            ) : null}
            <TechPrereqDots prereqs={tech.prereqs} />
          </div>
          <InfoModal
            title={
              <div
                className="flexRow"
                style={{ fontSize: rem(40), gap: rem(20) }}
              >
                {tech.name}
                {tech.type === "UPGRADE" ? (
                  <UnitIcon type={tech.unitType} size={40} />
                ) : null}
                <TechPrereqDots prereqs={tech.prereqs} width={8} />
              </div>
            }
            style={{ marginLeft: rem(8) }}
          >
            <InfoContent tech={tech} />
          </InfoModal>
        </div>
        {opts.hideSymbols ? null : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: "80%",
              flexShrink: 0,
            }}
          >
            {tech.prereqs.map((prereq, index) => {
              return <TechIcon key={index} type={prereq} size={20} />;
            })}
          </div>
        )}
        {researchAgreement ? <ResearchAgreement tech={tech} /> : null}
      </div>
    </SelectableRow>
  );
}

function ResearchAgreement({ tech }: { tech: Tech }) {
  const researchAgreement = useLogEntries<AddTechData>(
    "ADD_TECH",
    (entry) =>
      !!entry.data.event.researchAgreement && entry.data.event.tech === tech.id,
  )[0];
  const dataUpdate = useDataUpdate();
  const factions = useFactions();
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const selectedFaction = researchAgreement?.data.event.faction;

  const orderedFactionIds = getMapOrderedFactionIds(factions);
  const fadedFactions = objectEntries(factions)
    .filter(([factionId, faction]) => {
      if (tech.faction && factionId !== tech.faction) {
        return true;
      }
      return hasTech(faction, tech) && factionId !== selectedFaction;
    })
    .map(([factionId, _]) => factionId);

  if (!selectedFaction && fadedFactions.length === orderedFactionIds.length) {
    return null;
  }

  return (
    <FactionSelectRadialMenu
      factions={orderedFactionIds}
      borderColor={
        selectedFaction ? getFactionColor(factions[selectedFaction]) : undefined
      }
      size={28}
      invalidFactions={fadedFactions}
      selectedFaction={selectedFaction}
      onSelect={(factionId, prevFaction) => {
        if (factionId) {
          dataUpdate(Events.AddTechEvent(factionId, tech.id, undefined, true));
        }
        if (prevFaction) {
          dataUpdate(Events.RemoveTechEvent(prevFaction, tech.id));
        }
      }}
      tag={
        <InfoModal
          title={
            <FormattedMessage
              id="Universities of Jol-Nar.Promissories.Research Agreement.Title"
              description="Title of Faction Promissory: Research Agreement"
              defaultMessage="Research Agreement"
            />
          }
        >
          <FormattedMessage
            id="Universities of Jol-Nar.Promissories.Research Agreement.Description"
            description="Description for Faction Promissory: Research Agreement"
            defaultMessage="After the Jol-Nar player researches a technology that is not a faction technology:{br}Gain that technology.{br}Then, return this card to the Jol-Nar player."
            values={{ br: "\n\n" }}
          />
        </InfoModal>
      }
      viewOnly={viewOnly}
    />
  );
}
