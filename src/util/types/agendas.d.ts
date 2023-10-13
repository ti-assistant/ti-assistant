type OutcomeType =
  | "For/Against"
  | "Planet"
  | "Cultural Planet"
  | "Hazardous Planet"
  | "Industrial Planet"
  | "Player"
  | "Strategy Card"
  | "Law"
  | "Scored Secret Objective"
  | "Non-Home Planet Other Than Mecatol Rex"
  | "???";

type AgendaType = "LAW" | "DIRECTIVE";

type AgendaUpdateAction = "RESOLVE_AGENDA" | "REPEAL_AGENDA";

interface AgendaUpdateData {
  action?: AgendaUpdateAction;
  agenda?: string;
  target?: string;
  timestamp?: number;
}

interface BaseAgenda {
  description: string;
  elect: OutcomeType;
  expansion: Expansion;
  id: AgendaId;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  passedText?: string;
  failedText?: string;
  type: AgendaType;
}

interface GameAgenda {
  activeRound?: number;
  // Used to undo New Constitution.
  affected?: string[];
  name?: string;
  passed?: boolean;
  resolved?: boolean;
  target?: string;
}

type Agenda = BaseAgenda & GameAgenda;

type AgendaId =
  | "Anti-Intellectual Revolution"
  | "Archived Secret"
  | "Armed Forces Standardization"
  | "Arms Reduction"
  | "Articles of War"
  | "Checks and Balances"
  | "Clandestine Operations"
  | "Classified Document Leaks"
  | "Colonial Redistribution"
  | "Committee Formation"
  | "Compensated Disarmament"
  | "Conventions of War"
  | "Core Mining"
  | "Covert Legislation"
  | "Demilitarized Zone"
  | "Economic Equality"
  | "Enforced Travel Ban"
  | "Executive Sanctions"
  | "Fleet Regulations"
  | "Galactic Crisis Pact"
  | "Holy Planet of Ixth"
  | "Homeland Defense Act"
  | "Imperial Arbiter"
  | "Incentive Program"
  | "Ixthian Artifact"
  | "Judicial Abolishment"
  | "Minister of Antiques"
  | "Minister of Commerce"
  | "Minister of Exploration"
  | "Minister of Industry"
  | "Minister of Peace"
  | "Minister of Policy"
  | "Minister of Sciences"
  | "Minister of War"
  | "Miscount Disclosed"
  | "Mutiny"
  | "New Constitution"
  | "Nexus Sovereignty"
  | "Political Censure"
  | "Prophecy of Ixth"
  | "Public Execution"
  | "Publicize Weapon Schematics"
  | "Rearmament Agreement"
  | "Regulated Conscription"
  | "Representative Government"
  | "Research Grant Reallocation"
  | "Research Team: Biotic"
  | "Research Team: Cybernetic"
  | "Research Team: Propulsion"
  | "Research Team: Warfare"
  | "Search Warrant"
  | "Seed of an Empire"
  | "Senate Sanctuary"
  | "Shard of the Throne"
  | "Shared Research"
  | "Swords to Plowshares"
  | "Terraforming Initiative"
  | "The Crown of Emphidia"
  | "The Crown of Thalnos"
  | "Unconventional Measures"
  | "Wormhole Reconstruction"
  | "Wormhole Research";
