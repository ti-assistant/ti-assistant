interface TFBaseGenome {
  description: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFGenomeId;
  name: string;
  origin: FactionId;
  subName: string;
  timing: Timing;
}

interface TFGameGenome {
  owner?: FactionId;
}

type TFGenome = TFBaseGenome & TFGameGenome;

type TFGenomeId = TwilightsFall.TFGenomeId;
