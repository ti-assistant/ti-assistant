interface TFBaseGenome {
  description: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFUnitUpgradeId;
  name: string;
  origin: FactionId;
  subName: string;
  timing: Timing;
}

interface TFGameGenome {
  owner: FactionId;
}

type TFGenome = TFBaseGenome & TFGameGenome;
