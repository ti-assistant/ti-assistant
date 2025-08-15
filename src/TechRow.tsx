import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { SelectableRow } from "./SelectableRow";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "./components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import { ModalContent } from "./components/Modal/Modal";
import TechIcon from "./components/TechIcon/TechIcon";
import { useGameId, useLogEntries, useViewOnly } from "./context/dataHooks";
import { useFactions } from "./context/factionDataHooks";
import { useSharedModal } from "./data/SharedModal";
import { addTechAsync, removeTechAsync } from "./dynamic/api";
import { hasTech } from "./util/api/techs";
import { getFactionColor, getMapOrderedFactionIds } from "./util/factions";
import { getTechColor } from "./util/techs";
import { objectEntries, rem } from "./util/util";
import UnitIcon from "./components/Units/Icons";

export function UnitStat({
  name,
  stat,
}: {
  name: ReactNode;
  stat: number | string;
}) {
  return (
    <div
      className="centered"
      style={{
        width: rem(82),
        boxSizing: "border-box",
        border: "1px solid #eee",
        borderRadius: rem(10),
      }}
    >
      <div
        style={{
          fontSize: rem(24),
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div
        style={{
          lineHeight: rem(18),
          fontSize: rem(11),
          padding: `0 ${rem(6)}`,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function UnitStatBlock({ stats }: { stats?: UnitStats }) {
  if (!stats) {
    return null;
  }
  return (
    <div
      className="flexRow"
      style={{
        gap: rem(3),
        padding: `0 ${rem(4)}`,
        margin: `${rem(4)} ${rem(4)} ${rem(4)} 0`,
        fontFamily: "Slider",
        alignItems: "stretch",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Cost"
            defaultMessage="COST"
            description="Label for unit stat block - cost of the unit."
          />
        }
        stat={stats.cost ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Combat"
            defaultMessage="COMBAT"
            description="Label for unit stat block - combat value of the unit."
          />
        }
        stat={stats.combat ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Move"
            defaultMessage="MOVE"
            description="Label for unit stat block - move value of the unit."
          />
        }
        stat={stats.move ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Capacity"
            defaultMessage="CAPACITY"
            description="Label for unit stat block - capacity value of the unit."
          />
        }
        stat={stats.capacity ?? "-"}
      />
    </div>
  );
}

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
        }}
      >
        {tech.description ? tech.description.replaceAll("\\n", "\n") : null}
        {tech.abilities.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridAutoFlow: "row",
              whiteSpace: "nowrap",
              gridTemplateColumns: "repeat(2, 1fr)",
              fontFamily: "Slider",
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
        <UnitStatBlock stats={tech.stats} />
      </div>
    );
  }
  const description = tech.description.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      {description}
    </div>
  );
}

interface TechRowProps {
  className?: string;
  tech: Tech;
  removeTech?: (techId: TechId) => void;
  addTech?: (techId: TechId) => void;
  leftContent?: ReactNode;
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
  tech,
  removeTech,
  addTech,
  leftContent,
  researchAgreement,
  opts = {},
}: TechRowProps) {
  const viewOnly = useViewOnly();
  const { openModal } = useSharedModal();

  return (
    <SelectableRow
      itemId={tech.id}
      selectItem={addTech}
      removeItem={removeTech}
      viewOnly={viewOnly}
    >
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "stretch" }}
      >
        {leftContent ? <div>{leftContent}</div> : null}
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
          </div>

          <div
            className="popupIcon"
            style={{
              display: opts.hideInfo ? "none" : "block",
              fontSize: rem(16),
            }}
            onClick={(e) => {
              e.stopPropagation();
              openModal(
                <ModalContent
                  title={<div style={{ fontSize: rem(40) }}>{tech.name}</div>}
                >
                  <InfoContent tech={tech} />
                </ModalContent>
              );
            }}
          >
            &#x24D8;
          </div>
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
      !!entry.data.event.researchAgreement && entry.data.event.tech === tech.id
  )[0];
  const factions = useFactions();
  const gameId = useGameId();
  const viewOnly = useViewOnly();
  const { openModal } = useSharedModal();

  const selectedFaction = researchAgreement?.data.event.faction;

  const orderedFactionIds = getMapOrderedFactionIds(factions);
  const fadedFactions = objectEntries(factions)
    .filter(([factionId, faction]) => {
      return hasTech(faction, tech.id) && factionId !== selectedFaction;
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
          addTechAsync(gameId, factionId, tech.id, true);
        }
        if (prevFaction) {
          removeTechAsync(gameId, prevFaction, tech.id);
        }
      }}
      tag={
        <div
          className="popupIcon hoverParent"
          style={{ marginLeft: 0, color: "#999", fontSize: rem(10) }}
          onClick={() =>
            openModal(
              <ModalContent
                title={
                  <div style={{ fontSize: rem(40) }}>
                    <FormattedMessage
                      id="Universities of Jol-Nar.Promissories.Research Agreement.Title"
                      description="Title of Faction Promissory: Research Agreement"
                      defaultMessage="Research Agreement"
                    />
                  </div>
                }
              >
                <div
                  className="flexRow myriadPro"
                  style={{
                    boxSizing: "border-box",
                    maxWidth: rem(800),
                    width: "100%",
                    minWidth: rem(320),
                    padding: rem(4),
                    whiteSpace: "pre-line",
                    textAlign: "center",
                    fontSize: rem(32),
                  }}
                >
                  <FormattedMessage
                    id="Universities of Jol-Nar.Promissories.Research Agreement.Description"
                    description="Description for Faction Promissory: Research Agreement"
                    defaultMessage="After the Jol-Nar player researches a technology that is not a faction technology:{br}Gain that technology.{br}Then, return this card to the Jol-Nar player."
                    values={{ br: "\n\n" }}
                  />
                </div>
              </ModalContent>
            )
          }
        >
          &#x24D8;
        </div>
      }
      viewOnly={viewOnly}
    />
  );
}
