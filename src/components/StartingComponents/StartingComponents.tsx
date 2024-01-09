import { useRouter } from "next/router";
import { useContext } from "react";
import { SelectableRow } from "../../SelectableRow";
import {
  FactionContext,
  OptionContext,
  TechContext,
} from "../../context/Context";
import {
  chooseStartingTechAsync,
  chooseSubFactionAsync,
  removeStartingTechAsync,
} from "../../dynamic/api";
import { getTechColor } from "../../util/techs";
import { pluralize, responsivePixels } from "../../util/util";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import styles from "./StartingComponents.module.scss";

interface StartingComponentsProps {
  factionId: FactionId;
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

const techOrder: TechType[] = ["RED", "GREEN", "BLUE", "YELLOW", "UPGRADE"];

export default function StartingComponents({
  factionId,
}: StartingComponentsProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const options = useContext(OptionContext);
  const techs = useContext(TechContext);

  const faction = factions[factionId];

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
    if (!gameid) {
      return;
    }
    chooseStartingTechAsync(gameid, factionId, techId);
  }

  function removeTech(techId: TechId) {
    if (!gameid) {
      return;
    }
    removeStartingTechAsync(gameid, factionId, techId);
  }

  function selectSubFaction(subFaction: SubFaction) {
    if (!gameid || factionId !== "Council Keleres") {
      return;
    }
    chooseSubFactionAsync(gameid, "Council Keleres", subFaction);
  }

  let numToChoose = !startswith.choice
    ? 0
    : startswith.choice.select - (startswith.techs ?? []).length;
  if (orderedChoices.length < numToChoose) {
    numToChoose = orderedChoices.length;
  }

  return (
    <div className={styles.StartingComponents}>
      {startswith.planetchoice ? (
        <div
          className="flexRow"
          style={{
            gap: responsivePixels(4),
            paddingLeft: responsivePixels(4),
          }}
        >
          Sub-Faction:
          <FactionSelectRadialMenu
            factions={startswith.planetchoice.options.filter(
              (faction) => options["allow-double-council"] || !factions[faction]
            )}
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
              fontSize: responsivePixels(14),
              // paddingLeft: "4px",
            }}
          >
            No Starting Tech
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
                fontSize: responsivePixels(14),
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
            label="Choose Starting Tech"
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
          paddingLeft: responsivePixels(4),
          paddingRight: responsivePixels(4),
          fontFamily: "Myriad Pro",
          // justifyContent: "stretch",
          // alignItems: "flex-start",
          columnGap: responsivePixels(8),
          fontSize: responsivePixels(14),
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {orderedUnits.map(([unit, number]) => {
          return <div key={unit}>{`${number} ${pluralize(unit, number)}`}</div>;
        })}
      </div>
    </div>
  );
}
