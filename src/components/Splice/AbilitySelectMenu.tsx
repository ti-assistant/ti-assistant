import { CSSProperties, ReactNode } from "react";
import { useAbilities, useViewOnly } from "../../context/dataHooks";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./Splice.module.scss";

export default function AbilitySelectMenu({
  factionId,
  filter,
  label,
  selectAbility,
  steal,
  style,
}: {
  factionId?: FactionId;
  filter?: (ability: TFAbility) => boolean;
  label: ReactNode;
  selectAbility: (ability: TFAbilityId) => void;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const abilities = useAbilities();

  let availableAbilities = Object.values(abilities)
    .filter((ability) => !ability.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableAbilities = Object.values(abilities)
      .filter((ability) => !!ability.owner && ability.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  if (filter) {
    availableAbilities = availableAbilities.filter(filter);
  }

  const redAbilities = availableAbilities.filter(
    (ability) => ability.type === "RED",
  );
  const yellowAbilities = availableAbilities.filter(
    (ability) => ability.type === "YELLOW",
  );
  const blueAbilities = availableAbilities.filter(
    (ability) => ability.type === "BLUE",
  );
  const greenAbilities = availableAbilities.filter(
    (ability) => ability.type === "GREEN",
  );

  return (
    <ClientOnlyHoverMenu
      label={label}
      style={{ whiteSpace: "nowrap", ...style }}
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
          <InnerAbilitySelectMenu
            abilities={greenAbilities}
            label={<TechIcon type="GREEN" size="1.5em" />}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={blueAbilities}
            label={<TechIcon type="BLUE" size="1.5em" />}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={yellowAbilities}
            label={<TechIcon type="YELLOW" size="1.5em" />}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={redAbilities}
            label={<TechIcon type="RED" size="1.5em" />}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}

// TODO: Add faction icons (simplified?).
function InnerAbilitySelectMenu({
  abilities,
  label,
  selectAbility,
  outerCloseFn,
}: {
  abilities: TFAbility[];
  label: ReactNode;
  selectAbility: (ability: TFAbilityId) => void;
  outerCloseFn: () => void;
}) {
  const viewOnly = useViewOnly();

  if (abilities.length === 0) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: rem(14) }}
      borderColor={getTechTypeColor(abilities[0]?.type ?? "UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(8, abilities.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {abilities.map((ability) => {
            return (
              <button
                key={ability.id}
                onClick={(e) => {
                  e.stopPropagation();
                  innerCloseFn();
                  outerCloseFn();
                  selectAbility(ability.id);
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: rem(16),
                  gap: rem(8),
                }}
                disabled={viewOnly}
              >
                {ability.name}
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
