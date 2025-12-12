interface TFBaseEdict {
  description: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFEdictId;
  name: string;
}

interface TFGameEdict {}

type TFEdict = TFBaseEdict & TFGameEdict;
