import { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { SelectableRow } from "../../SelectableRow";
import { GameIdContext } from "../../context/Context";
import {
  chooseStartingTechAsync,
  chooseSubFactionAsync,
  removeStartingTechAsync,
} from "../../dynamic/api";
import { getTechColor } from "../../util/techs";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { Strings } from "../strings";
import styles from "./StartingComponents.module.scss";
import FactionIcon from "../FactionIcon/FactionIcon";
import { useFaction, useTechs } from "../../context/dataHooks";

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
  const gameId = useContext(GameIdContext);
  const faction = useFaction(factionId);
  const techs = useTechs();

  const intl = useIntl();

  if (!faction) {
    return null;
  }

  const startswith = faction.startswith;

  const orderedPlanets = (startswith.planets ?? []).sort((a, b) => {
    if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  const orderedUnits = Object.entries(startswith.units).sort(
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

  function addTech(techId: TechId) {
    if (!gameId) {
      return;
    }
    chooseStartingTechAsync(gameId, factionId, techId);
  }

  function removeTech(techId: TechId) {
    if (!gameId) {
      return;
    }
    removeStartingTechAsync(gameId, factionId, techId);
  }

  function selectSubFaction(subFaction: SubFaction) {
    if (!gameId || factionId !== "Council Keleres") {
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
            gap: "4px",
            paddingLeft: "4px",
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
              fontSize: "14px",
              // paddingLeft: "4px",
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
                removeItem={() => removeTech(tech.id)}
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
                fontSize: "14px",
                // paddingLeft: "4px",
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
            selectTech={(tech) => addTech(tech.id)}
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
          paddingLeft: "4px",
          paddingRight: "4px",
          fontFamily: "Myriad Pro",
          // justifyContent: "stretch",
          // alignItems: "flex-start",
          columnGap: "8px",
          fontSize: "14px",
          width: "100%",
        }}
      >
        {orderedUnits.map(([unit, number]) => {
          return (
            <div key={unit}>
              <Strings.Units unit={unit as UnitType} count={number} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
