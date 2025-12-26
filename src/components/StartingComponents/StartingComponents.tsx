import { FormattedMessage, useIntl } from "react-intl";
import { getFactions } from "../../../server/data/factions";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { SelectableRow } from "../../SelectableRow";
import {
  useGameId,
  useOptions,
  useTechs,
  useViewOnly,
} from "../../context/dataHooks";
import { useFaction, useFactions } from "../../context/factionDataHooks";
import {
  chooseStartingTechAsync,
  chooseSubFactionAsync,
  chooseTFFactionAsync,
  removeStartingTechAsync,
} from "../../dynamic/api";
import SynergySVG from "../../icons/ui/Synergy";
import CarrierSVG from "../../icons/units/Carrier";
import CruiserSVG from "../../icons/units/Cruiser";
import DestroyerSVG from "../../icons/units/Destroyer";
import DreadnoughtSVG from "../../icons/units/Dreadnought";
import FighterSVG from "../../icons/units/Fighter";
import FlagshipSVG from "../../icons/units/Flagship";
import InfantrySVG from "../../icons/units/Infantry";
import MechSVG from "../../icons/units/Mech";
import PDSSVG from "../../icons/units/PDS";
import SpaceDockSVG from "../../icons/units/SpaceDock";
import WarSunSVG from "../../icons/units/WarSun";
import { getFactionColor } from "../../util/factions";
import {
  canResearchTech,
  getFactionPreReqs,
  getTechColor,
} from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
import ExpansionIcon from "../ExpansionIcon/ExpansionIcon";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import TechIcon from "../TechIcon/TechIcon";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { Strings } from "../strings";
import styles from "./StartingComponents.module.scss";
import FactionComponents from "../FactionComponents/FactionComponents";

interface StartingComponentsProps {
  factionId: FactionId;
  showFactionIcon?: boolean;
}

const unitOrder = [
  "Carrier",
  "Cruiser",
  "Destroyer",
  "Dreadnought",
  "Flagship",
  "War Sun",
  "Fighter",
  "Infantry",
  "Space Dock",
  "PDS",
];

const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

export default function StartingComponents({
  factionId,
  showFactionIcon = false,
}: StartingComponentsProps) {
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const options = useOptions();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const intl = useIntl();

  if (!faction) {
    return null;
  }

  const startswith: StartsWith = faction.startswith ?? { units: {} };

  const orderedUnits = objectEntries(startswith.units ?? {}).sort(
    (a, b) => unitOrder.indexOf(a[0]) - unitOrder.indexOf(b[0])
  );
  const orderedTechs = techs
    ? (startswith.techs ?? [])
        .filter((tech) => {
          return !!techs[tech];
        })
        .map((tech) => {
          return techs[tech] as Tech;
        })
        .sort((a, b) => {
          const typeDiff =
            techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
          if (typeDiff !== 0) {
            return typeDiff;
          }
          const prereqDiff = a.prereqs.length - b.prereqs.length;
          if (prereqDiff !== 0) {
            return prereqDiff;
          }
          if (a.name < b.name) {
            return -1;
          } else {
            return 1;
          }
        })
    : [];
  let choices = (startswith.choice ?? {}).options ?? [];
  if (factionId === "Deepwrought Scholarate") {
    const factionPreReqs = getFactionPreReqs(
      faction,
      techs,
      options,
      /* planets= */ [],
      /* relics= */ {}
    );
    choices = Object.values(techs)
      .filter((tech) => {
        return (
          canResearchTech(
            tech,
            options,
            factionPreReqs,
            faction,
            false,
            techs
          ) &&
          (!tech.faction || tech.faction === faction.id)
        );
      })
      .map((tech) => tech.id);
  }
  const orderedChoices = choices
    .filter((tech) => {
      return !(startswith.techs ?? []).includes(tech);
    })
    .filter((tech) => {
      return !!techs[tech];
    })
    .filter((tech) => {
      if (factionId !== "Edyn Mandate") {
        return true;
      }
      const selectedTypes = (startswith.techs ?? []).map(
        (tech) => techs[tech]?.type
      );
      return !selectedTypes.includes(techs[tech]?.type);
    })
    .map((tech) => {
      return techs[tech] as Tech;
    })
    .filter((tech) => !tech.faction || tech.faction === factionId)
    .sort((a, b) => {
      const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
      if (typeDiff !== 0) {
        return typeDiff;
      }
      const prereqDiff: number = a.prereqs.length - b.prereqs.length;
      if (prereqDiff !== 0) {
        return prereqDiff;
      }
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

  function selectSubFaction(subFaction: SubFaction) {
    if (factionId !== "Council Keleres") {
      return;
    }
    chooseSubFactionAsync(gameId, "Council Keleres", subFaction);
  }

  let numToChoose = !startswith.choice
    ? 0
    : startswith.choice.select - (startswith.techs ?? []).length;
  if (orderedChoices.length < numToChoose) {
    numToChoose = orderedChoices.length;
  }

  return (
    <div className={styles.StartingComponents}>
      {showFactionIcon ? (
        <div className={styles.FactionIcon}>
          <FactionIcon factionId={factionId} size={60} />
        </div>
      ) : null}
      {options.expansions.includes("TWILIGHTS FALL") ? (
        <>
          <div className="flexRow" style={{ fontFamily: "Myriad Pro" }}>
            Planet Faction:{" "}
            <TFFactionSelect factionId={factionId} type="Planet" />
          </div>
          <div className="flexRow" style={{ fontFamily: "Myriad Pro" }}>
            Unit Faction: <TFFactionSelect factionId={factionId} type="Unit" />
          </div>
        </>
      ) : null}
      {startswith.planetchoice ? (
        <div
          className="flexRow"
          style={{
            gap: rem(4),
            paddingLeft: rem(4),
          }}
        >
          <FormattedMessage
            id="RlIQB2"
            description="The faction that Council Keleres chooses."
            defaultMessage="Sub-Faction"
          />
          :
          <FactionSelectRadialMenu
            factions={startswith.planetchoice.options}
            onSelect={(faction) => {
              if (!faction) {
                if (!startswith.faction) {
                  return;
                }
                selectSubFaction(startswith.faction);
                return;
              }
              selectSubFaction(faction as SubFaction);
            }}
            selectedFaction={startswith.faction}
            size={36}
            viewOnly={viewOnly}
          />
        </div>
      ) : null}
      <>
        {orderedTechs.length === 0 &&
        !startswith.choice &&
        !options.expansions.includes("TWILIGHTS FALL") ? (
          <div
            style={{
              fontFamily: "Myriad Pro",
              fontSize: rem(14),
            }}
          >
            <FormattedMessage
              id="NEiUw9"
              description="Message explaining that a faction has no starting tech."
              defaultMessage="No Starting Tech"
            />
          </div>
        ) : null}
        {orderedTechs.map((tech) => {
          if (startswith.choice) {
            return (
              <SelectableRow
                key={tech.id}
                itemId={tech.id}
                removeItem={() =>
                  removeStartingTechAsync(gameId, factionId, tech.id)
                }
                style={{
                  color: getTechColor(tech),
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  fontFamily: "Myriad Pro",
                }}
                viewOnly={viewOnly}
              >
                {tech.name}
              </SelectableRow>
            );
          }
          return (
            <div
              key={tech.id}
              style={{
                whiteSpace: "nowrap",
                fontFamily: "Myriad Pro",
                color: getTechColor(tech),
                fontSize: rem(14),
              }}
            >
              {tech.name}
            </div>
          );
        })}
      </>
      {numToChoose > 0 ? (
        <div>
          <TechSelectHoverMenu
            factionId={factionId}
            ignorePrereqs
            techs={orderedChoices}
            label={intl.formatMessage({
              id: "/sF4zW",
              description:
                "Label on a hover menu used to select starting techs.",
              defaultMessage: "Choose Starting Tech",
            })}
            selectTech={(tech) =>
              chooseStartingTechAsync(gameId, factionId, tech.id)
            }
          />
        </div>
      ) : null}
      {factionId === "Crimson Rebellion" ? (
        <div className="flexRow">
          <div className="flexRow" style={{ gap: rem(2) }}>
            <TechIcon
              type={faction.breakthrough?.synergy?.left ?? "RED"}
              size={16}
            />
            <div className="flexRow" style={{ width: rem(24) }}>
              <SynergySVG />
            </div>
            <TechIcon
              type={faction.breakthrough?.synergy?.right ?? "BLUE"}
              size={16}
            />
          </div>
          {faction.breakthrough?.name}
        </div>
      ) : null}
      {/* Units */}
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${Math.ceil(
            orderedUnits.length / 2
          )}, 1fr)`,
          fontFamily: "Myriad Pro",
          columnGap: rem(8),
          fontSize: rem(14),
          width: "100%",
        }}
      >
        {orderedUnits.map(([unit, number]) => {
          return (
            <div
              key={unit}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: rem(2),
              }}
            >
              <Strings.Units unit={unit} count={number} />
              <UnitIcon unit={unit} color={getFactionColor(faction)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
function UnitIcon({ unit, color }: { unit: UnitType; color: string }) {
  const iconColor = "#eee"; // color === "Black" ? "#eee" : color;
  const size = 14;
  switch (unit) {
    case "Carrier":
      return <CarrierSVG size={size} color={iconColor} />;
    case "Cruiser":
      return <CruiserSVG size={size} color={iconColor} />;
    case "Destroyer":
      return <DestroyerSVG size={size} color={iconColor} />;
    case "Dreadnought":
      return <DreadnoughtSVG size={size} color={iconColor} />;
    case "Fighter":
      return <FighterSVG size={size} color={iconColor} />;
    case "Flagship":
      return <FlagshipSVG size={size} color={iconColor} />;
    case "Infantry":
      return <InfantrySVG size={size} color={iconColor} />;
    case "Mech":
      return <MechSVG size={size} color={iconColor} />;
    case "PDS":
      return <PDSSVG size={size} color={iconColor} />;
    case "Space Dock":
      return <SpaceDockSVG size={size} color={iconColor} />;
    case "War Sun":
      return <WarSunSVG size={size} color={iconColor} />;
  }
}

function TFFactionSelect({
  factionId,
  type,
}: {
  factionId: FactionId;
  type: "Unit" | "Planet";
}) {
  const intl = useIntl();
  const allFactions = getFactions(intl);
  const factions = useFactions();
  const gameId = useGameId();
  const options = useOptions();
  const viewOnly = useViewOnly();

  const alreadyChosen = Object.values(factions).reduce((set, faction) => {
    if (faction.startswith?.planetFaction) {
      set.add(faction.startswith.planetFaction);
    }
    if (faction.startswith?.unitFaction) {
      set.add(faction.startswith.unitFaction);
    }
    return set;
  }, new Set<FactionId>());

  const filteredFactions = Object.values(allFactions).filter((faction) => {
    if (faction.locked) {
      return false;
    }
    if (alreadyChosen.has(faction.id)) {
      return false;
    }
    if (faction.expansion === "TWILIGHTS FALL") {
      return false;
    }
    if (faction.id === "Council Keleres") {
      return false;
    }
    if (
      faction.expansion !== "BASE" &&
      !options.expansions.includes(faction.expansion)
    ) {
      return false;
    }
    return true;
  });
  filteredFactions.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const selectedFaction =
    type === "Unit"
      ? faction.startswith?.unitFaction
      : faction.startswith?.planetFaction;

  if (selectedFaction) {
    return (
      <SelectableRow
        itemId={selectedFaction}
        removeItem={
          viewOnly
            ? undefined
            : () => chooseTFFactionAsync(gameId, factionId, undefined, type)
        }
      >
        <FactionComponents.Icon size={24} factionId={selectedFaction} />
      </SelectableRow>
    );
  }

  if (viewOnly) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="Cw3noi"
          description="Text on a hover menu for selecting a player's faction"
          defaultMessage="Pick Faction"
        />
      }
      buttonStyle={{ fontSize: rem(14) }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${Math.min(
            filteredFactions.length,
            10
          )}, minmax(0, 1fr))`,
          gap: rem(4),
          padding: rem(8),
          maxWidth: `min(80vw, ${rem(700)})`,
          overflowX: "auto",
        }}
      >
        {filteredFactions.map((faction) => {
          const faded = alreadyChosen.has(faction.id);
          return (
            <button
              key={faction.id}
              className={`flexRow ${faded ? "faded" : ""}`}
              style={{
                position: "relative",
                justifyContent: "flex-start",
                alignItems: "center",
                fontSize: rem(16),
              }}
              onClick={() =>
                chooseTFFactionAsync(gameId, factionId, faction.id, type)
              }
            >
              <FactionIcon factionId={faction.id} size={20} />
              {faction.name}
              {faction.expansion !== "BASE" ? (
                <>
                  <div style={{ width: rem(4) }}></div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: rem(4),
                      right: rem(4),
                    }}
                  >
                    <ExpansionIcon
                      expansion={faction.expansion}
                      size={8}
                      color={faded ? "#555" : undefined}
                    />
                  </div>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </ClientOnlyHoverMenu>
  );
}
