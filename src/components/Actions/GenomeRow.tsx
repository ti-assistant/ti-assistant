import { useGameId, useGenomes, useViewOnly } from "../../context/dataHooks";
import { loseTFCardAsync } from "../../dynamic/api";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import FactionComponents from "../FactionComponents/FactionComponents";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import styles from "./GenomeRow.module.scss";

export default function GenomeRow({ genome }: { genome: TFGenome }) {
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  return (
    <SelectableRow
      itemId={genome.id}
      removeItem={() => {
        if (!genome.owner) {
          return;
        }
        loseTFCardAsync(gameId, genome.owner, {
          genome: genome.id,
          type: "GENOME",
        });
      }}
      viewOnly={viewOnly}
    >
      <InfoRow
        infoTitle={genome.name}
        infoContent={
          <>
            <FormattedDescription description={genome.description} />
            {genome.id === "Clever Genome" && !!genome.owner ? (
              <AllGenomesList owner={genome.owner} />
            ) : null}
          </>
        }
      >
        {genome.name}
      </InfoRow>
    </SelectableRow>
  );
}

function AllGenomesList({ owner }: { owner: FactionId }) {
  const genomes = useGenomes();

  const genomeList = Object.values(genomes).filter((genome) => {
    return (
      genome.id !== "Clever Genome" && !!genome.owner && genome.owner !== owner
    );
  });
  genomeList.sort((a, b) => ((a.owner ?? "") > (b.owner ?? "") ? 1 : -1));

  return (
    <ul className={`flexColumn ${styles.AllGenomesList}`}>
      {genomeList.map((genome) => {
        return (
          <div
            key={genome.id}
            className="flexRow"
            style={{ justifyContent: "flex-start" }}
          >
            <FactionComponents.Icon factionId={genome.owner} size={16} />
            <div>
              <FormattedDescription description={genome.description} />
            </div>
          </div>
        );
      })}
    </ul>
  );
}
