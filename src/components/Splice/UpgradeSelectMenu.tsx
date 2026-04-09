import { CSSProperties, ReactNode } from "react";
import { useUpgrades, useViewOnly } from "../../context/dataHooks";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { getTechTypeColor } from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
import UnitIcon from "../Units/Icons";
import styles from "./Splice.module.scss";

export default function UpgradeSelectMenu({
  factionId,
  filter,
  label,
  selectUpgrade,
  steal,
  style,
}: {
  factionId?: FactionId;
  filter?: (upgrade: TFUnitUpgrade) => boolean;
  label: ReactNode;
  selectUpgrade: (upgrade: TFUnitUpgradeId) => void;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const upgrades = useUpgrades();

  let availableUpgrades = Object.values(upgrades)
    .filter((upgrade) => !upgrade.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableUpgrades = Object.values(upgrades)
      .filter((upgrade) => !!upgrade.owner && upgrade.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  if (filter) {
    availableUpgrades = availableUpgrades.filter(filter);
  }

  const upgradesByType: Partial<Record<UnitType, TFUnitUpgrade[]>> = {};
  availableUpgrades.forEach((upgrade) => {
    const units = upgradesByType[upgrade.unitType] ?? [];
    units.push(upgrade);
    upgradesByType[upgrade.unitType] = units;
  });

  const orderedUpgrades = objectEntries(upgradesByType).sort((a, b) => {
    return a[0] > b[0] ? 1 : -1;
  });

  return (
    <ClientOnlyHoverMenu
      label={label}
      style={style}
      buttonStyle={{ fontSize: rem(14) }}
      renderProps={(innerCloseFn) => (
        <div
          className={styles.OuterTechSelectMenu}
          style={{
            padding: rem(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          {orderedUpgrades.map(([unitType, upgrades]) => {
            return (
              <InnerUpgradeSelectMenu
                upgrades={upgrades}
                selectUpgrade={selectUpgrade}
                outerCloseFn={innerCloseFn}
                label={<UnitIcon type={unitType} size="1.25em" />}
              />
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}

function InnerUpgradeSelectMenu({
  upgrades,
  label,
  selectUpgrade,
  outerCloseFn,
}: {
  upgrades: TFUnitUpgrade[];
  label: ReactNode;
  selectUpgrade: (upgrade: TFUnitUpgradeId) => void;
  outerCloseFn: () => void;
}) {
  const viewOnly = useViewOnly();

  if (upgrades.length === 0) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: rem(14) }}
      borderColor={getTechTypeColor("UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(8, upgrades.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {upgrades.map((upgrade) => {
            return (
              <button
                key={upgrade.id}
                onClick={(e) => {
                  e.stopPropagation();
                  innerCloseFn();
                  outerCloseFn();
                  selectUpgrade(upgrade.id);
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
                {upgrade.name}
                <UnitIcon type={upgrade.unitType} size={16} />
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
