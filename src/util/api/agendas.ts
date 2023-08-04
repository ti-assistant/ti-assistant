import { Expansion } from "./options";

export type OutcomeType =
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

export type AgendaType = "LAW" | "DIRECTIVE";

export type AgendaUpdateAction = "RESOLVE_AGENDA" | "REPEAL_AGENDA";

export interface AgendaUpdateData {
  action?: AgendaUpdateAction;
  agenda?: string;
  target?: string;
  timestamp?: number;
}

export interface BaseAgenda {
  description: string;
  elect: OutcomeType;
  expansion: Expansion;
  name: string;
  omega?: {
    description: string;
    expansion: Expansion;
  };
  passedText?: string;
  failedText?: string;
  type: AgendaType;
}

export interface GameAgenda {
  activeRound?: number;
  // Used to undo New Constitution.
  affected?: string[];
  name?: string;
  passed?: boolean;
  resolved?: boolean;
  target?: string;
}

export type Agenda = BaseAgenda & GameAgenda;
