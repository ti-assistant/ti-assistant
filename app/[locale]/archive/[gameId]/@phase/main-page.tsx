import Header from "../../../../../src/components/Header/Header";
import ResultsPhase from "../../../game/[gameId]/main/@phase/results/ResultsPhase";

export default function MainScreenPage() {
  return (
    <>
      <Header archive />
      <ResultsPhase />
    </>
  );
}
