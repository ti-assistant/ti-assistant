interface TFBaseParadigm {
  description: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFParadigmId;
  name: string;
  origin: FactionId;
  timing: Timing;
}

interface TFGameParadigm {
  owner: FactionId;
}

type TFParadigm = TFBaseParadigm & TFGameParadigm;
