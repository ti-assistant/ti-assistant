interface TFBaseAbility {
  description: string;
  expansion?: Expansion; // In addition to Twilight's Fall.
  id: TFAbilityId;
  name: string;
  origin: FactionId;
  timing: Timing;
  type: TechType;
}

interface TFGameAbility {
  owner: FactionId;
}

type TFAbility = TFBaseAbility & TFGameAbility;
