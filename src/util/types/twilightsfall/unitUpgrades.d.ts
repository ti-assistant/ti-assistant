interface TFBaseUnitUpgrade {
  abilities: string[];
  description?: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFUnitUpgradeId;
  name: string;
  origin: FactionId;
  stats: UnitStats;
  unitType: UnitType;
}

interface TFGameUnitUpgrade {
  owner?: FactionId;
}

type TFUnitUpgrade = TFBaseUnitUpgrade & TFGameUnitUpgrade;

type TFUnitUpgradeId = TwilightsFall.TFUnitUpgradeId;
