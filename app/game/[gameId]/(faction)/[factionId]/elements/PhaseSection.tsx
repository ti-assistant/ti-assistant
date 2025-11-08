import { usePhase } from "../../../../../../src/context/stateDataHooks";
import FactionActionPhase from "./FactionActionPhase";
import FactionAgendaPhase from "./FactionAgendaPhase";
import FactionSetupPhase from "./FactionSetupPhase";
import FactionStatusPhase from "./FactionStatusPhase";
import FactionStrategyPhase from "./FactionStrategyPhase";

export default function PhaseSection({ factionId }: { factionId: FactionId }) {
  const phase = usePhase();

  let phaseContent = null;
  switch (phase) {
    case "SETUP":
      phaseContent = <FactionSetupPhase factionId={factionId} />;
      break;
    case "STRATEGY":
      phaseContent = <FactionStrategyPhase factionId={factionId} />;
      break;
    case "ACTION":
      phaseContent = <FactionActionPhase factionId={factionId} />;
      break;
    case "STATUS":
      phaseContent = <FactionStatusPhase factionId={factionId} />;
      break;
    case "AGENDA":
      phaseContent = <FactionAgendaPhase factionId={factionId} />;
      break;
  }
  if (!phaseContent) {
    return null;
  }

  return <div className="flexColumn largeFont">{phaseContent}</div>;
}
