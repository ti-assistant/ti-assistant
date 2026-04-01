import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  useGenomes,
  useViewOnly,
} from "../../context/dataHooks";
import GenomeSVG from "../../icons/twilightsfall/genome";
import FullScreenModal from "../../modals/FullScreenModal";
import { CollapsibleSection } from "../CollapsibleSection";
import { Selector } from "../Selector/Selector";
import { rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import {
  getGainedTFCards,
  getGainedTFCardsByType,
  getRevealedTFCards,
} from "../../util/actionLog";
import FactionIcon from "../FactionIcon/FactionIcon";
import { useState } from "react";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import Toggle from "../Toggle/Toggle";
import { SelectableRow } from "../../SelectableRow";
import { Optional } from "../../util/types/types";

export default function SpliceModal({
  activeFactionId,
}: {
  activeFactionId: FactionId;
}) {
  return (
    <FullScreenModal title="Genome Splice">
      <SpliceModalContent activeFactionId={activeFactionId} />
    </FullScreenModal>
  );
}

function SpliceModalContent({
  activeFactionId,
}: {
  activeFactionId: FactionId;
}) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );
  const localOrder = [...orderedFactionIds];
  localOrder.shift();
  localOrder.reverse();
  localOrder.unshift(activeFactionId);
  console.log("Ordered", localOrder);
  const [participants, setParticipants] = useState<Set<FactionId>>(new Set());
  const currentTurn = useCurrentTurn();

  const totalCards = participants.size + 1;

  const revealedTFCards = getRevealedTFCards(currentTurn);
  const gainedTFCards = getGainedTFCards(currentTurn);

  const remaining = Math.max(0, totalCards - revealedTFCards.length);

  const currentFaction = localOrder[gainedTFCards.length];

  if (!currentFaction) {
    console.log("No factions left");
  }

  return (
    <div>
      <div className="flexRow" style={{ width: "fit-content" }}>
        {localOrder.map((factionId) => {
          return (
            <Toggle
              key={factionId}
              selected={participants.has(factionId)}
              toggleFn={(prev) => {
                const updatedSet = new Set(participants);
                if (prev) {
                  updatedSet.delete(factionId);
                } else {
                  updatedSet.add(factionId);
                }
                setParticipants(updatedSet);
              }}
            >
              <FactionIcon factionId={factionId} size={16} />
            </Toggle>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(3, 1fr)",
          width: "98vw",
          gap: "1rem",
        }}
      >
        {revealedTFCards.map((card) => {
          if (card.data.event.type !== "GENOME") {
            return null;
          }
          return (
            <SpliceCard
              key={card.data.event.genome}
              genomeId={card.data.event.genome}
              factionId={currentFaction}
              selectedBy={gainedTFCards.reduce(
                (gained: Optional<FactionId>, curr) => {
                  if (
                    curr.data.event.type === "GENOME" &&
                    card.data.event.type === "GENOME" &&
                    curr.data.event.genome === card.data.event.genome
                  ) {
                    return curr.data.event.faction;
                  }
                  return gained;
                },
                undefined,
              )}
            />
          );
        })}
        {Array(remaining)
          .fill(0)
          .map((_, index) => {
            return (
              <SpliceCard
                key={index + revealedTFCards.length}
                factionId={currentFaction}
              />
            );
          })}
      </div>
    </div>
  );
  return "Potato";
}

function SpliceCard({
  genomeId,
  factionId,
  selectedBy,
}: {
  genomeId?: TFGenomeId;
  factionId?: FactionId;
  selectedBy?: FactionId;
}) {
  const genomes = useGenomes();
  const dataUpdate = useDataUpdate();

  if (!genomeId) {
    return <CollapsibleSection title={<GenomeSelector />}></CollapsibleSection>;
  }

  const genome = genomes[genomeId];

  if (!genome) {
    return null;
  }

  return (
    <CollapsibleSection
      title={
        <SelectableRow
          itemId={genome.id}
          removeItem={
            selectedBy
              ? undefined
              : () => {
                  dataUpdate(
                    Events.HideTFCardEvent({
                      type: "GENOME",
                      genome: genome.id,
                    }),
                  );
                }
          }
          style={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          <span
            className="flexRow"
            style={{
              fontSize: "1.5rem",
              justifyContent: "center",
              filter: "grayscale(1)",
            }}
          >
            {genome?.name}
            <FactionIcon factionId={genome.origin} size={16} />
          </span>
        </SelectableRow>
      }
    >
      <div
        className="flexColumn"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0.25rem 0.5rem",
          height: "100%",
        }}
      >
        <div
          className="flexColumn"
          style={{
            alignItems: "flex-start",
            marginBlockEnd: "auto",
          }}
        >
          <FormattedDescription description={genome.description} />
        </div>
        {selectedBy ? (
          <FactionIcon factionId={selectedBy} size={24} />
        ) : (
          <button
            className="outline"
            style={{ marginInline: "auto" }}
            onClick={() => {
              if (!factionId) {
                return;
              }
              dataUpdate(
                Events.GainTFCardEvent(factionId, {
                  type: "GENOME",
                  genome: genome.id,
                }),
              );
            }}
          >
            <div className="flexRow">
              Choose Genome
              <FactionIcon factionId={factionId} size={16} />
            </div>
          </button>
        )}
      </div>
    </CollapsibleSection>
  );
}

function GenomeSelector() {
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();
  const currentTurn = useCurrentTurn();
  const revealedTFCards = getRevealedTFCards(currentTurn);

  let availableGenomes = Object.values(genomes)
    .filter((genome) => !genome.owner)
    .filter((genome) => {
      for (const revealedCard of revealedTFCards) {
        if (
          revealedCard.data.event.type === "GENOME" &&
          revealedCard.data.event.genome === genome.id
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  return (
    <div className="flexRow" style={{ textAlign: "left", fontSize: "1.5rem" }}>
      <Selector
        hoverMenuLabel={
          <div
            className="flexRow"
            style={{ gap: rem(6), width: "fit-content", fontSize: "1.25rem" }}
          >
            <span style={{ width: "0.61em" }}>
              <GenomeSVG />
            </span>
            <FormattedMessage
              id="cxkvcc"
              description="Text on a button that will reveal a Genome card"
              defaultMessage="Reveal Genome"
            />
          </div>
        }
        hoverMenuStyle={{ fontSize: rem(14) }}
        options={availableGenomes}
        toggleItem={(genomeId, add) => {
          if (add) {
            dataUpdate(
              Events.RevealTFCardEvent({
                type: "GENOME",
                genome: genomeId,
              }),
            );
          }
        }}
        viewOnly={viewOnly}
        itemsPerColumn={11}
      />
    </div>
  );
}
