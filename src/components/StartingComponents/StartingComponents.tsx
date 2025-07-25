import { FormattedMessage, useIntl } from "react-intl";
import { SelectableRow } from "../../SelectableRow";
import { useGameId, useTechs } from "../../context/dataHooks";
import { useFaction } from "../../context/factionDataHooks";
import {
  chooseStartingTechAsync,
  chooseSubFactionAsync,
  removeStartingTechAsync,
} from "../../dynamic/api";
import { getTechColor } from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { Strings } from "../strings";
import styles from "./StartingComponents.module.scss";
import FighterSVG from "../../icons/units/Fighter";
import InfantrySVG from "../../icons/units/Infantry";
import CarrierSVG from "../../icons/units/Carrier";
import CruiserSVG from "../../icons/units/Cruiser";
import DestroyerSVG from "../../icons/units/Destroyer";
import PDSSVG from "../../icons/units/PDS";
import DreadnoughtSVG from "../../icons/units/Dreadnought";
import { getFactionColor } from "../../util/factions";
import SpaceDockSVG from "../../icons/units/SpaceDock";
import FlagshipSVG from "../../icons/units/Flagship";
import WarSunSVG from "../../icons/units/WarSun";
import MechSVG from "../../icons/units/Mech";

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
  const techs = useTechs();

  const intl = useIntl();

  if (!faction) {
    return null;
  }

  const startswith = faction.startswith;

  const orderedUnits = objectEntries(startswith.units).sort(
    (a, b) => unitOrder.indexOf(a[0]) - unitOrder.indexOf(b[0])
  );
  const orderedTechs = techs
    ? (startswith.techs ?? [])
        .filter((tech) => {
          if (!techs) {
            return false;
          }
          return !!techs[tech];
        })
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
  const orderedChoices = techs
    ? ((startswith.choice ?? {}).options ?? [])
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
        .sort((a, b) => {
          const typeDiff =
            techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
          if (typeDiff !== 0) {
            return typeDiff;
          }
          const prereqDiff: number = a.prereqs.length - b.prereqs.length;
          if (prereqDiff !== 0) {
            return prereqDiff;
          }
          if (a.id < b.id) {
            return -1;
          } else {
            return 1;
          }
        })
    : [];

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
          />
        </div>
      ) : null}
      <div style={{}}>
        {orderedTechs.length === 0 && !startswith.choice ? (
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
      </div>
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
