import { useRouter } from "next/router";
import { StrategyCardElement } from "../StrategyCard";
import { getOnDeckFaction } from "../util/helpers";
import { strategyCardOrder, StrategyCard } from "../util/api/cards";
import { Faction } from "../util/api/factions";
import { responsivePixels } from "../util/util";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import { FactionCard } from "../FactionCard";
import { Modal } from "../Modal";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { NumberedItem } from "../NumberedItem";
import { hasTech } from "../util/api/techs";
import { Agenda } from "../util/api/agendas";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { Selector } from "../Selector";
import { useGameData } from "../data/GameData";
import { advancePhase } from "../util/api/advancePhase";
import { assignStrategyCard } from "../util/api/assignStrategyCard";
import { giftOfPrescience } from "../util/api/giftOfPrescience";
import { swapStrategyCards } from "../util/api/swapStrategyCards";

function ChecksAndBalancesMenu({
  faction,
  factions,
  strategyCards,
  agendas,
  onSelect,
  mobile,
}: {
  faction: Faction | undefined;
  factions: Record<string, Faction>;
  strategyCards: StrategyCard[];
  agendas: Record<string, Agenda>;
  onSelect: (factionName: string) => void;
  mobile: boolean;
}) {
  const checksAndBalances = agendas["Checks and Balances"];
  if (!faction || !checksAndBalances || !checksAndBalances.passed) {
    return null;
  }

  const numPlayers = Object.keys(factions).length;

  const cardsPerFaction: Record<string, number> = {};
  strategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    if (!cardsPerFaction[card.faction]) {
      cardsPerFaction[card.faction] = 0;
    }
    cardsPerFaction[card.faction] += 1;
  });
  const otherFactions = Object.keys(factions).filter((factionName) => {
    if (faction.name === factionName) {
      return false;
    }
    const numCards = cardsPerFaction[factionName] ?? 0;
    if (numPlayers > 4) {
      return numCards < 1;
    }
    return numCards < 2;
  });

  // If no other factions remaining, allow picking it yourself
  if (otherFactions.length === 0) {
    otherFactions.push(faction.name);
  }

  return (
    <Selector
      buttonStyle={mobile ? { fontSize: responsivePixels(16) } : {}}
      hoverMenuLabel="Give to"
      options={otherFactions}
      toggleItem={(factionName, _) => {
        onSelect(factionName);
      }}
    />
  );
}

function QuantumDatahubNode({
  faction,
  strategyCards,
}: {
  faction: Faction | undefined;
  strategyCards: StrategyCard[];
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [quantum, setQuantum] = useState<{
    mainCard: string | undefined;
    otherCard: string | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    const cardOne = strategyCards.find(
      (card) => card.name === quantum.mainCard
    );
    const cardTwo = strategyCards.find(
      (card) => card.name === quantum.otherCard
    );
    if (!cardOne || !cardTwo) {
      return;
    }

    swapStrategyCards(gameid, quantum.mainCard, quantum.otherCard);
  }

  if (!faction || !hasTech(faction, "Quantum Datahub Node")) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
    >
      <ClientOnlyHoverMenu label="Quantum Datahub Node">
        <div
          className="flexColumn"
          style={{
            padding: responsivePixels(8),
            gap: responsivePixels(4),
            boxSizing: "border-box",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          Swap
          <Selector
            hoverMenuLabel="Strategy Card"
            autoSelect={true}
            options={strategyCards
              .filter((card) => card.faction === faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
              setQuantum((quantum) => {
                return { ...quantum, mainCard: localCardName };
              });
            }}
            selectedItem={quantum.mainCard}
          />
          for
          <Selector
            hoverMenuLabel="Strategy Card"
            options={strategyCards
              .filter((card) => card.faction && card.faction !== faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
              setQuantum((quantum) => {
                return { ...quantum, otherCard: localCardName };
              });
            }}
            selectedItem={quantum.otherCard}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: responsivePixels(4),
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <button
              disabled={!quantum.mainCard || !quantum.otherCard}
              onClick={() => {
                quantumDatahubNode();
                setQuantum({
                  mainCard: undefined,
                  otherCard: undefined,
                });
              }}
            >
              Confirm Swap
            </button>
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}

function ImperialArbiter({ strategyCards }: { strategyCards: StrategyCard[] }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["agendas", "factions"]);
  const agendas = gameData.agendas ?? {};
  const factions = gameData.factions;

  const [quantum, setQuantum] = useState<{
    mainCard: string | undefined;
    otherCard: string | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });
  const arbiter = agendas["Imperial Arbiter"];

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    swapStrategyCards(gameid, quantum.mainCard, quantum.otherCard, true);
  }

  if (!arbiter || !arbiter.resolved) {
    return null;
  }

  const faction = factions[arbiter.target ?? ""];

  if (!faction) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
    >
      <ClientOnlyHoverMenu label="Imperial Arbiter">
        <div
          className="flexColumn"
          style={{
            padding: responsivePixels(8),
            gap: responsivePixels(4),
            alignItems: "flex-start",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          Swap
          <Selector
            hoverMenuLabel="Strategy Card"
            autoSelect={true}
            options={strategyCards
              .filter((card) => card.faction === faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
              setQuantum((quantum) => {
                return { ...quantum, mainCard: localCardName };
              });
            }}
            selectedItem={quantum.mainCard}
          />
          for
          <Selector
            hoverMenuLabel="Strategy Card"
            options={strategyCards
              .filter((card) => card.faction && card.faction !== faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
              setQuantum((quantum) => {
                return { ...quantum, otherCard: localCardName };
              });
            }}
            selectedItem={quantum.otherCard}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: responsivePixels(4),
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <button
              disabled={!quantum.mainCard || !quantum.otherCard}
              onClick={() => {
                quantumDatahubNode();
                setQuantum({
                  mainCard: undefined,
                  otherCard: undefined,
                });
              }}
            >
              Discard to Swap
            </button>
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}

function InfoContent({ children }: PropsWithChildren) {
  return (
    <div
      className="myriadPro"
      style={{
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {children}
    </div>
  );
}

export function StrategyCardSelectList({ mobile }: { mobile: boolean }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "agendas",
    "factions",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  function pickStrategyCard(
    card: StrategyCard,
    faction: Faction,
    pickedBy: string
  ) {
    if (!gameid) {
      return;
    }

    assignStrategyCard(gameid, faction.name, card.name, pickedBy);
  }

  const orderedStrategyCards = Object.values(strategyCards).sort(
    (a, b) => strategyCardOrder[a.name] - strategyCardOrder[b.name]
  );

  const activefaction = factions
    ? factions[state?.activeplayer ?? ""]
    : undefined;
  const cab = (agendas ?? {})["Checks and Balances"];

  const checksAndBalances = !!cab && !!cab.passed;

  return (
    <React.Fragment>
      {orderedStrategyCards.map((card) => {
        return (
          <StrategyCardElement
            key={card.name}
            card={card}
            active={
              card.faction || !activefaction || card.invalid ? false : true
            }
            onClick={
              checksAndBalances ||
              card.faction ||
              !activefaction ||
              card.invalid
                ? undefined
                : () =>
                    pickStrategyCard(card, activefaction, activefaction.name)
            }
            fontSize={mobile ? 20 : 24}
          >
            <ChecksAndBalancesMenu
              faction={activefaction}
              factions={factions ?? {}}
              strategyCards={orderedStrategyCards}
              mobile={mobile}
              agendas={agendas ?? {}}
              onSelect={(factionName) => {
                const faction = (factions ?? {})[factionName];
                if (!faction || !activefaction) {
                  return;
                }
                pickStrategyCard(card, faction, activefaction.name);
              }}
            />
          </StrategyCardElement>
        );
      })}
    </React.Fragment>
  );
}

export function advanceToActionPhase(gameid: string) {
  advancePhase(gameid);
}

export default function StrategyPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "actionLog",
    "agendas",
    "factions",
    "state",
    "strategycards",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function nextPhase() {
    if (!gameid) {
      return;
    }
    advanceToActionPhase(gameid);
  }

  function showInfoModal(title: string, content: ReactNode) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  interface Ability {
    name: string;
    description: string;
  }

  function getStartOfStrategyPhaseAbilities() {
    let abilities: Record<string, Ability[]> = {};
    abilities["Every Player"] = [];
    const aiRevolution = agendas
      ? agendas["Anti-Intellectual Revolution"]
      : undefined;
    if (
      aiRevolution &&
      aiRevolution.resolved &&
      aiRevolution.target === "Against" &&
      aiRevolution.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "Anti-Intellectual Revolution [Against]",
        description: aiRevolution.failedText ?? aiRevolution.description,
      });
    }
    const armsReduction = agendas ? agendas["Arms Reduction"] : undefined;
    if (
      armsReduction &&
      armsReduction.resolved &&
      armsReduction.target === "Against" &&
      armsReduction.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "Arms Reduction [Against]",
        description: armsReduction.failedText ?? armsReduction.description,
      });
    }
    const newConstitution = agendas ? agendas["New Constitution"] : undefined;
    if (
      newConstitution &&
      newConstitution.resolved &&
      newConstitution.target === "For" &&
      newConstitution.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "New Constitution [For]",
        description: newConstitution.passedText ?? newConstitution.description,
      });
    }
    if (abilities["Every Player"].length === 0) {
      delete abilities["Every Player"];
    }
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.name === "Council Keleres") {
        factionAbilities.push({
          name: "Council Patronage",
          description: "Replenish your commodities, then gain 1 trade good",
        });
      }
      if (factionAbilities.length > 0) {
        abilities[getFactionName(faction)] = factionAbilities;
      }
    }
    return abilities;
  }

  function hasStartOfStrategyPhaseAbilities() {
    for (const abilities of Object.values(getStartOfStrategyPhaseAbilities())) {
      if (abilities.length > 0) {
        return true;
      }
    }
    return false;
  }

  function hasEndOfStrategyPhaseAbilities() {
    if (!factions) {
      return false;
    }
    if (factions["Naalu Collective"]) {
      return true;
    }
    const hacan = factions["Emirates of Hacan"];
    if (hacan && hasTech(hacan, "Quantum Datahub Node")) {
      return true;
    }
    const nekro = factions["Nekro Virus"];
    if (nekro && hasTech(nekro, "Quantum Datahub Node")) {
      return true;
    }
    if (!agendas) {
      return false;
    }
    const arbiter = agendas["Imperial Arbiter"];
    if (arbiter && arbiter.resolved && arbiter.target) {
      return true;
    }
    return false;
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions ?? {}).length;
    let numPicked = Object.values(strategyCards).reduce((num, card) => {
      if (card.faction) {
        return num + 1;
      }
      return num;
    }, 0);
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  if (!state) {
    return null;
  }

  const activefaction = factions
    ? factions[state?.activeplayer ?? ""]
    : undefined;
  const onDeckFaction = getOnDeckFaction(state, factions ?? {}, strategyCards);

  function canUndo() {
    return (gameData.actionLog ?? []).length > 0;
  }
  const updatedStrategyCards = Object.values(strategyCards).map((card) => {
    const updatedCard = structuredClone(card);

    return updatedCard;
  });

  const orderedStrategyCards = updatedStrategyCards.sort(
    (a, b) => strategyCardOrder[a.name] - strategyCardOrder[b.name]
  );

  function getFirstCardForFaction(factionName: string) {
    for (const strategyCard of orderedStrategyCards) {
      if (strategyCard.faction === factionName) {
        return strategyCard;
      }
    }
    return undefined;
  }

  function gift(factionName: string | undefined) {
    if (!gameid) {
      return;
    }
    giftOfPrescience(gameid, factionName ?? "Naalu Collective");
  }

  const giftFaction = Object.values(strategyCards).reduce(
    (faction: string | undefined, card) => {
      if (card.order === 0 && card.faction !== "Naalu Collective") {
        return card.faction;
      }
      return faction;
    },
    undefined
  );

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setInfoModal({ show: false })}
        visible={infoModal.show}
        title={
          <div style={{ fontSize: responsivePixels(40) }}>
            {infoModal.title}
          </div>
        }
      >
        <InfoContent>{infoModal.content}</InfoContent>
      </Modal>
      <div
        className="flexColumn"
        style={{
          alignItems: "center",
          width: responsivePixels(280),
          height: "100svh",
        }}
      >
        {hasStartOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            Start of Strategy Phase
            <ol className="flexColumn" style={{ alignItems: "stretch" }}>
              {Object.entries(getStartOfStrategyPhaseAbilities()).map(
                ([factionName, abilities]) => {
                  if (abilities.length === 0) {
                    return null;
                  }
                  const label =
                    factions && factionName !== "Every Player"
                      ? getFactionName(factions[factionName])
                      : factionName;
                  return (
                    <NumberedItem key={factionName}>
                      <LabeledDiv
                        label={label}
                        color={
                          factions
                            ? getFactionColor(factions[factionName])
                            : "#eee"
                        }
                      >
                        <div
                          className="flexColumn"
                          style={{ width: "100%", alignItems: "flex-start" }}
                        >
                          {abilities.map((ability) => {
                            return (
                              <div key={ability.name} className="flexRow">
                                {ability.name}
                                <div
                                  className="popupIcon"
                                  onClick={() =>
                                    showInfoModal(
                                      ability.name,
                                      ability.description
                                    )
                                  }
                                >
                                  &#x24D8;
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    </NumberedItem>
                  );
                }
              )}
            </ol>
          </div>
        ) : null}
        {haveAllFactionsPicked() && hasEndOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            End of Strategy Phase
            {factions && factions["Naalu Collective"] ? (
              <Selector
                hoverMenuLabel="Gift of Prescience"
                selectedLabel="Gift of Prescience"
                options={Object.values(factions ?? {})
                  .map((faction) => faction.name)
                  .filter((name) => name !== "Naalu Collective")}
                toggleItem={(factionName, add) => {
                  const localFactionName = add ? factionName : undefined;
                  gift(localFactionName);
                }}
                selectedItem={giftFaction}
              />
            ) : null}
            <QuantumDatahubNode
              faction={(factions ?? {})["Emirates of Hacan"]}
              strategyCards={orderedStrategyCards}
            />
            <QuantumDatahubNode
              faction={(factions ?? {})["Nekro Virus"]}
              strategyCards={orderedStrategyCards}
            />
            <ImperialArbiter strategyCards={orderedStrategyCards} />
          </div>
        ) : null}
      </div>
      <div
        className="flexColumn"
        style={{
          marginTop: "40px",
          height: "calc(100svh - 40px)",
        }}
      >
        <div
          className="flexRow"
          style={{ position: "relative", maxWidth: "100%" }}
        >
          {activefaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              Active Player
              <FactionCard
                faction={activefaction}
                style={{ height: responsivePixels(80) }}
                opts={{
                  iconSize: responsivePixels(60),
                  fontSize: responsivePixels(24),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: responsivePixels(4),
                    height: "100%",
                  }}
                >
                  <FactionTimer
                    factionName={activefaction.name}
                    style={{ fontSize: responsivePixels(28) }}
                  />
                </div>
              </FactionCard>
            </div>
          ) : (
            <div
              style={{
                fontSize: responsivePixels(30),
                paddingTop: responsivePixels(24),
              }}
            >
              Strategy Phase Complete
            </div>
          )}
          {onDeckFaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              On Deck
              <FactionCard
                faction={onDeckFaction}
                style={{ height: responsivePixels(64) }}
                opts={{
                  iconSize: responsivePixels(44),
                  fontSize: responsivePixels(24),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: responsivePixels(4),
                    height: "100%",
                  }}
                >
                  <StaticFactionTimer
                    factionName={onDeckFaction.name}
                    style={{
                      fontSize: responsivePixels(18),
                    }}
                    width={96}
                  />
                </div>
              </FactionCard>
            </div>
          ) : null}
        </div>
        <div
          className="flexColumn"
          style={{
            gap: responsivePixels(4),
            alignItems: "stretch",
            marginTop: responsivePixels(8),
            width: responsivePixels(420),
          }}
        >
          <StrategyCardSelectList mobile={false} />
        </div>
        {/* {canUndo() ? (
          <div className="flexRow" style={{ gap: responsivePixels(16) }}>
            <button onClick={() => undoPick()}>Undo SC Pick</button>
            <button onClick={() => resetPhase()}>Reset Phase</button>
          </div>
        ) : null} */}
        {activefaction ? null : (
          <button
            style={{ fontSize: responsivePixels(20) }}
            onClick={() => nextPhase()}
          >
            Advance to Action Phase
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
