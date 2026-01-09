"use client";

import React, { CSSProperties, ReactNode, use } from "react";
import { FormattedMessage } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { SelectableRow } from "../../../../../../src/SelectableRow";
import GainRelic from "../../../../../../src/components/Actions/GainRelic";
import GainTFCard from "../../../../../../src/components/Actions/GainSplicedCard";
import Conditional from "../../../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../../../src/components/FactionComponents/FactionComponents";
import FormattedDescription from "../../../../../../src/components/FormattedDescription/FormattedDescription";
import FrontierExploration from "../../../../../../src/components/FrontierExploration/FrontierExploration";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../src/components/LabeledLine/LabeledLine";
import { ModalContent } from "../../../../../../src/components/Modal/Modal";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import TechResearchSection from "../../../../../../src/components/TechResearchSection/TechResearchSection";
import { ModalContext } from "../../../../../../src/context/contexts";
import {
  useActionCards,
  useActionLog,
  useComponents,
  useCurrentTurn,
  useGameId,
  useLeaders,
  useOptions,
  usePlanets,
  useRelics,
  useTechs,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import {
  playComponentAsync,
  selectSubComponentAsync,
  unplayComponentAsync,
} from "../../../../../../src/dynamic/api";
import RelicMenuSVG from "../../../../../../src/icons/ui/RelicMenu";
import {
  getClaimedPlanets,
  getSelectedSubComponent,
} from "../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../src/util/api/actionLog";
import { hasTech } from "../../../../../../src/util/api/techs";
import { Optional } from "../../../../../../src/util/types/types";
import { objectEntries, rem } from "../../../../../../src/util/util";
import ComponentActions from "./ComponentActions/ComponentActions";
import StrategicActions from "./StrategicActions/StrategicActions";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function InfoContent({
  component,
}: {
  component: ActionCard | Component | Relic;
}) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: rem(20),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <div className="flexColumn" style={{ gap: rem(32) }}>
        <FormattedDescription description={component.description} />
      </div>
    </div>
  );
}

function ComponentSelect({
  components,
  selectComponent,
  factionId,
}: {
  components: Component[];
  selectComponent: (componentName: string) => void;
  factionId: FactionId;
}) {
  const allActionCards = useActionCards();
  const factions = useFactions();
  const options = useOptions();
  const leaders = useLeaders();
  const relics = useRelics();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const faction = factions[factionId];

  const nonTechComponents: (BaseComponent & GameComponent)[] =
    components.filter(
      (component) => component.type !== "TECH"
    ) as (BaseComponent & GameComponent)[];
  const actionCards = Object.values(allActionCards)
    .filter((actionCard) => actionCard.timing === "COMPONENT_ACTION")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const techComponents = components.filter(
    (component) => component.type === "TECH"
  );
  const leaderComponents = nonTechComponents
    .filter((component) => component.type === "LEADER")
    .filter((component) => {
      const leader = leaders[component.id as LeaderId];
      if (!leader) {
        return false;
      }
      return leader.state !== "purged";
    })
    .sort((a, b) => {
      if (a.leader === "AGENT") {
        return -1;
      }
      if (a.leader === "HERO") {
        return 1;
      }
      return 0;
    });
  const exploration = [
    ...nonTechComponents.filter(
      (component) => component.type === "EXPLORATION"
    ),
    ...Object.values(relics).filter((relic) => {
      return (
        relic.timing === "COMPONENT_ACTION" &&
        relic.owner === factionId &&
        relic.state !== "purged"
      );
    }),
  ].sort((a, b) => (a.name > b.name ? 1 : -1));
  const events = nonTechComponents
    .filter((component) => component.type === "EVENT")
    .filter((event) => {
      if (event.requiresTech) {
        if (!faction) {
          return false;
        }
        const tech = techs[event.requiresTech];
        return hasTech(faction, tech);
      }
      return true;
    });
  const promissory = nonTechComponents.filter(
    (component) => component.type === "PROMISSORY"
  );
  const promissoryByFaction: Partial<Record<FactionId, Component[]>> = {};
  promissory.forEach((component) => {
    if (!component.faction) {
      return;
    }
    const factionComponents = promissoryByFaction[component.faction] ?? [];
    factionComponents.push(component);
    promissoryByFaction[component.faction] = factionComponents;
  });
  const others = nonTechComponents
    .filter(
      (component) =>
        component.type !== "LEADER" &&
        component.type !== "CARD" &&
        component.type !== "RELIC" &&
        component.type !== "PROMISSORY" &&
        component.type !== "EXPLORATION" &&
        component.type !== "EVENT"
    )
    .filter(
      (component) =>
        component.type !== "BREAKTHROUGH" ||
        (faction?.breakthrough?.state &&
          faction.breakthrough.state !== "locked")
    )
    .filter(
      (component) =>
        component.type !== "ABILITY" || component.owner === factionId
    )
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const numRows = options.expansions.includes("THUNDERS EDGE") ? 12 : 10;
  const innerStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${numRows}, auto)`,
    gap: rem(4),
    maxWidth: "85vw",
    overflowX: "auto",
    justifyContent: "flex-start",
  };

  const className = window.innerWidth < 900 ? "flexColumn" : "flexRow";

  return (
    <div
      className={className}
      style={{
        padding: rem(8),
        alignItems: "stretch",
        gap: rem(4),
        justifyContent: "flex-start",
        maxWidth: "85vw",
      }}
    >
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="HW1UF8"
            description="Cards that are used to make actions."
            defaultMessage="Action Cards"
          />
        }
      >
        <div
          className="flexRow"
          style={{
            ...innerStyle,
            fontSize: options.expansions.includes("DISCORDANT STARS")
              ? rem(12)
              : undefined,
          }}
        >
          {actionCards.map((actionCard) => {
            return (
              <button
                key={actionCard.id}
                style={{
                  writingMode: "horizontal-tb",
                  fontSize: options.expansions.includes("DISCORDANT STARS")
                    ? rem(14)
                    : undefined,
                }}
                className={actionCard.state === "discarded" ? "faded" : ""}
                onClick={() => selectComponent(actionCard.id)}
                disabled={viewOnly}
              >
                {actionCard.name}
              </button>
            );
          })}
        </div>
      </ClientOnlyHoverMenu>
      {techComponents.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="ys7uwX"
              description="Shortened version of technologies."
              defaultMessage="Techs"
            />
          }
        >
          <div
            className="flexRow"
            style={{
              ...innerStyle,
              gridTemplateRows: `repeat(${Math.min(
                techComponents.length,
                10
              )}, auto)`,
            }}
          >
            {techComponents.map((component) => {
              if (!faction) {
                return null;
              }
              const gameTech = faction.techs[component.id as TechId];
              return (
                <button
                  key={component.id}
                  style={{ writingMode: "horizontal-tb" }}
                  className={gameTech && !gameTech.ready ? "faded" : ""}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {leaderComponents.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="/MkeMw"
              description="Agent, commander, and hero cards."
              defaultMessage="Leaders"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8) }}
          >
            {leaderComponents.map((component) => {
              const leader = leaders[component.id as LeaderId];
              if (!leader || leader.state === "purged") {
                return null;
              }
              return (
                <div className="flexColumn" key={component.id}>
                  <LabeledLine
                    leftLabel={capitalizeFirstLetter(component.leader ?? "")}
                  />
                  <button
                    className={leader.state === "exhausted" ? "faded" : ""}
                    onClick={() => selectComponent(component.id)}
                    disabled={viewOnly}
                  >
                    {component.name}
                  </button>
                </div>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {exploration.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="t0EFbu"
              description="Abilities related to exploration and relics."
              defaultMessage="Exploration/Relic"
            />
          }
        >
          <div
            className="flexColumn"
            style={{
              gap: rem(4),
              alignItems: "stretch",
              padding: rem(8),
            }}
          >
            {exploration.map((component) => {
              const isRelic = !component.hasOwnProperty("type");
              const faded =
                component.state === "exhausted" || component.state === "used";
              return (
                <button
                  key={component.id}
                  className={`flexRow ${faded ? "faded" : ""}`}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                  style={{ position: "relative", justifyContent: "flex-start" }}
                >
                  {component.name}
                  {isRelic ? (
                    <>
                      <div style={{ width: rem(4) }}></div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: rem(4),
                          right: rem(4),
                          width: rem(10),
                        }}
                      >
                        <RelicMenuSVG color={faded ? "#555" : undefined} />
                      </div>
                    </>
                  ) : null}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {events.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="WVs5Hr"
              description="Event actions."
              defaultMessage="Events"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8), width: "100%" }}
          >
            {events.map((component) => {
              return (
                <button
                  key={component.id}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {promissory.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="+IA3Oz"
              description="Promissory note actions."
              defaultMessage="Promissory"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8), width: "100%" }}
          >
            {objectEntries(promissoryByFaction).map(([id, components]) => {
              return (
                <div
                  className="flexColumn"
                  key={id}
                  style={{ width: "100%", alignItems: "flex-start" }}
                >
                  <LabeledLine
                    leftLabel={<FactionComponents.Name factionId={id} />}
                    style={{ width: "100%" }}
                  />
                  {components.map((component) => {
                    return (
                      <button
                        key={component.id}
                        className={
                          component.state === "exhausted" ||
                          component.state === "used"
                            ? "faded"
                            : ""
                        }
                        onClick={() => selectComponent(component.id)}
                        disabled={viewOnly}
                      >
                        {component.name}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {others.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="sgqLYB"
              description="Text on a button used to select a non-listed value"
              defaultMessage="Other"
            />
          }
        >
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", padding: rem(8), gap: rem(4) }}
          >
            {others.map((component) => {
              if (component.type === "FLAGSHIP") {
                return (
                  <div className="flexColumn" key={component.id}>
                    <LabeledLine
                      leftLabel={capitalizeFirstLetter(component.type)}
                    />
                    <button
                      className={
                        component.state === "exhausted" ||
                        component.state === "used"
                          ? "faded"
                          : ""
                      }
                      onClick={() => selectComponent(component.id)}
                      disabled={viewOnly}
                    >
                      {component.name}
                    </button>
                  </div>
                );
              }
              if (component.type === "BREAKTHROUGH") {
                const state = faction?.breakthrough?.state;
                return (
                  <div
                    className="flexColumn"
                    key={component.id}
                    style={{ minWidth: rem(150), alignItems: "flex-start" }}
                  >
                    <LabeledLine
                      leftLabel={capitalizeFirstLetter(component.type)}
                    />
                    <button
                      className={
                        state === "exhausted" || state === "used" ? "faded" : ""
                      }
                      onClick={() => selectComponent(component.id)}
                      disabled={viewOnly}
                    >
                      {component.name}
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={component.id}
                  onClick={() => selectComponent(component.id)}
                  disabled={viewOnly}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
    </div>
  );
}

function ComponentDetails({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();

  let leftLabel: Optional<ReactNode> = (
    <FormattedMessage
      id="fVAave"
      description="Label for a section containing additional details."
      defaultMessage="Details"
    />
  );
  let label: Optional<ReactNode>;
  let rightLabel: Optional<ReactNode>;
  let lineColor: Optional<string>;
  let innerContent: Optional<ReactNode>;
  let conditional: Optional<AppSection>;

  let componentName = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  if (componentName === "Ssruu") {
    componentName = getSelectedSubComponent(currentTurn);
  }

  let requiredNeighbors = 2;
  let nonHomeNeighbors = false;
  switch (componentName) {
    case "Enigmatic Device":
    case "Focused Research": {
      conditional = "TECHS";
      innerContent = <TechResearchSection factionId={factionId} />;
      break;
    }
    case "Share Knowledge": {
      conditional = "TECHS";
      innerContent = <ComponentActions.ShareKnowledge factionId={factionId} />;
      break;
    }
    case "Plagiarize": {
      conditional = "TECHS";
      innerContent = <ComponentActions.Plagiarize factionId={factionId} />;
      break;
    }
    case "Divert Funding": {
      conditional = "TECHS";
      innerContent = <ComponentActions.DivertFunding factionId={factionId} />;
      break;
    }
    case "Visionaria Select": {
      conditional = "TECHS";
      innerContent = <ComponentActions.VisionariaSelect />;
      break;
    }
    case "Dynamis Core": {
      innerContent = <ComponentActions.DynamisCore factionId={factionId} />;
      break;
    }
    case "Exploration Probe":
    case "Circlet of the Void":
      const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
      const mirageClaimed = claimedPlanets.reduce((claimed, planet) => {
        if (planet.planet === "Mirage") {
          return true;
        }
        return claimed;
      }, false);
      leftLabel = (
        <FormattedMessage
          id="GyiC2A"
          description="Text on a hover menu for selecting the result of frontier exploration."
          defaultMessage="Frontier Exploration"
        />
      );
      if (mirageClaimed) {
        leftLabel = "Mirage";
      }
      innerContent = <FrontierExploration factionId={factionId} />;
      break;
    case "Gain Relic":
    case "Black Market Forgery":
    case "Hesh and Prit":
    case "Create":
    case "Fabrication":
    case "Forge Legend": {
      conditional = "RELICS";
      innerContent = (
        <div className="flexColumn" style={{ width: "100%" }}>
          <GainRelic factionId={factionId} />
        </div>
      );
      break;
    }
    case "Stellar Converter": {
      conditional = "PLANETS";
      leftLabel = <ComponentActions.PurgePlanet.Label />;
      innerContent = (
        <ComponentActions.PurgePlanet.Content
          planetFilter={(planet) =>
            !planet.home &&
            !planet.attributes.includes("legendary") &&
            planet.id !== "Mecatol Rex"
          }
        />
      );
      break;
    }
    case "Conventions of War Abandoned": {
      conditional = "PLANETS";
      leftLabel = <ComponentActions.PurgePlanet.Label />;
      innerContent = <ComponentActions.PurgePlanet.Content />;
      break;
    }
    case "Nano-Forge": {
      conditional = "PLANETS";
      leftLabel = (
        <ComponentActions.AttachToPlanet.LeftLabel attachmentId="Nano-Forge" />
      );
      innerContent = (
        <ComponentActions.AttachToPlanet.Content
          attachmentId="Nano-Forge"
          factionId={factionId}
          planetFilter={(planet) =>
            planet.owner === factionId &&
            !planet.home &&
            !planet.attributes.includes("legendary")
          }
        />
      );
      break;
    }
    case "Terraform": {
      conditional = "PLANETS";
      leftLabel = (
        <ComponentActions.AttachToPlanet.LeftLabel attachmentId="Terraform" />
      );
      innerContent = (
        <ComponentActions.AttachToPlanet.Content
          attachmentId="Nano-Forge"
          factionId={factionId}
          planetFilter={(planet) =>
            planet.owner === factionId &&
            !planet.home &&
            planet.id !== "Mecatol Rex"
          }
        />
      );
      break;
    }
    case "Blessing of the Yin":
    case "Dannel of the Tenth": {
      innerContent = (
        <ComponentActions.DannelOfTheTenth factionId={factionId} />
      );
      break;
    }
    case "Changing the Ways":
    case "Riftwalker Meian": {
      innerContent = <ComponentActions.RiftwalkerMeian />;
      break;
    }
    case "Z'eu": {
      leftLabel = undefined;
      label = <ComponentActions.Zeu.Label />;
      rightLabel = <ComponentActions.Zeu.RightLabel />;
      innerContent = <ComponentActions.Zeu.Content />;
      break;
    }
    case "UNITDSGNFLAYESH": {
      conditional = "TECHS";
      innerContent = (
        <TechResearchSection
          factionId={factionId}
          filter={(tech) => !tech.faction && tech.type !== "UPGRADE"}
          gain
        />
      );
      break;
    }
    case "Planetary Rigs": {
      conditional = "PLANETS";
      innerContent = <ComponentActions.PlanetaryRigs factionId={factionId} />;
      break;
    }
    case "Overrule": {
      innerContent = <ComponentActions.Overrule factionId={factionId} />;
      break;
    }
    case "Strategize":
    case "Sins of the Father": {
      innerContent = <ComponentActions.Strategize factionId={factionId} />;
      break;
    }
    case "Vaults of the Heir": {
      innerContent = <ComponentActions.VaultsOfTheHeir factionId={factionId} />;
      break;
    }
    case "Ta Zern (Deepwrought)": {
      conditional = "TECHS";
      innerContent = (
        <ComponentActions.TaZernDeepwrought factionId={factionId} />
      );
      break;
    }
    case "The Silver Flame": {
      innerContent = (
        <ComponentActions.SilverFlame.Content factionId={factionId} />
      );
      break;
    }
    case "Executive Order": {
      leftLabel = <ComponentActions.ExecutiveOrder.Label />;
      innerContent = (
        <ComponentActions.ExecutiveOrder.Content factionId={factionId} />
      );
      break;
    }
    case "Coerce": {
      innerContent = (
        <GainTFCard factionId={factionId} steal numToGain={{ abilities: 1 }} />
      );
      break;
    }
    case "Elevate": {
      innerContent = (
        <GainTFCard factionId={factionId} numToGain={{ paradigms: 1 }} />
      );
      break;
    }
    case "Eternity's End":
    case "Evolve": {
      innerContent = (
        <GainTFCard
          factionId={factionId}
          numToGain={{ abilities: 1, genomes: 1, upgrades: 1, total: 1 }}
        />
      );
      break;
    }
    case "Irradiate": {
      innerContent = (
        <GainTFCard factionId={factionId} numToGain={{ upgrades: 1 }} />
      );
      break;
    }
    case "Mutate": {
      // TODO: Add ability removal.
      innerContent = (
        <GainTFCard factionId={factionId} numToGain={{ abilities: 1 }} />
      );
      break;
    }
    case "Brillance of the Hylar": {
      innerContent = (
        <GainTFCard
          factionId={factionId}
          numToGain={{ abilities: 1, genomes: 1, upgrades: 1 }}
        />
      );
      break;
    }
    case "Devour World": {
      innerContent = (
        <GainTFCard factionId={factionId} numToGain={{ abilities: 1 }} />
      );
      break;
    }
    case "Witching Hour": {
      innerContent = <StrategicActions.Tyrannus.Primary />;
      break;
    }
    // case "Repeal Law": {
    //   if (!agendas) {
    //     break;
    //   }
    //   const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    //     return agenda.passed && agenda.type === "law";
    //   });
    //   const selectStyle: CSSProperties = {
    //     fontFamily: "Myriad Pro",
    //     padding: rem(8),
    //     display: "grid",
    //     gridAutoFlow: "column",
    //     gridTemplateRows: "repeat(14, auto)",
    //     gap: rem(4),
    //     maxWidth: "85vw",
    //     overflowX: "auto",
    //     justifyContent: "flex-start",
    //   };

    //   const repealedAgenda = getRepealedAgenda(currentTurn);

    //   innerContent = (
    //     <div className="flexColumn" style={{ width: "100%" }}>
    //       {repealedAgenda ? (
    //         <LabeledDiv label="Repealed Law">
    //           <AgendaRow
    //             agenda={repealedAgenda}
    //             removeAgenda={removeRepealedAgenda}
    //           />
    //         </LabeledDiv>
    //       ) : passedLaws.length > 0 ? (
    //         <ClientOnlyHoverMenu label="Repeal Law">
    //           <div className="flexRow" style={selectStyle}>
    //             {passedLaws.map((law) => {
    //               return (
    //                 <button
    //                   key={law.name}
    //                   style={{ writingMode: "horizontal-tb" }}
    //                   onClick={() => repealLaw(law.name)}
    //                 >
    //                   {law.name}
    //                 </button>
    //               );
    //             })}
    //           </div>
    //         </ClientOnlyHoverMenu>
    //       ) : (
    //         "No laws to repeal"
    //       )}
    //     </div>
    //   );
    //   break;
    // }
    case "Industrial Initiative": {
      conditional = "PLANETS";
      innerContent = (
        <ComponentActions.IndustrialInitiative factionId={factionId} />
      );
      break;
    }
    case "Mining Initiative": {
      conditional = "PLANETS";
      innerContent = (
        <ComponentActions.MiningInitiative factionId={factionId} />
      );
      break;
    }
    case "Total War":
      innerContent = (
        <div className="flexRow" style={{ width: "100%" }}>
          +1 VP
        </div>
      );
      break;
    case "Book of Latvinia":
      innerContent = <ComponentActions.BookOfLatvinia factionId={factionId} />;
      break;
    case "Age of Exploration":
      requiredNeighbors = 2;
      nonHomeNeighbors = true;
    case "Star Chart":
    case "Azdel's Key": {
      leftLabel = <ComponentActions.AddSystemToMap.LeftLabel />;
      innerContent = (
        <ComponentActions.AddSystemToMap.Content
          requiredNeighbors={requiredNeighbors}
          nonHomeNeighbors={nonHomeNeighbors}
        />
      );
      break;
    }
  }
  if (!innerContent) {
    return null;
  }

  if (conditional) {
    return (
      <Conditional appSection={conditional}>
        <div className="flexColumn" style={{ width: "100%", gap: rem(4) }}>
          <LabeledLine
            leftLabel={leftLabel}
            label={label}
            rightLabel={rightLabel}
            color={lineColor}
          />
          <div
            className="flexColumn"
            style={{ alignItems: "flex-start", width: "100%" }}
          >
            {innerContent}
          </div>
        </div>
      </Conditional>
    );
  }
  return (
    <div className="flexColumn" style={{ width: "100%", gap: rem(4) }}>
      <LabeledLine
        leftLabel={leftLabel}
        label={label}
        rightLabel={rightLabel}
        color={lineColor}
      />
      <div
        className="flexColumn"
        style={{ alignItems: "flex-start", width: "100%" }}
      >
        {innerContent}
      </div>
    </div>
  );
}

export function ComponentAction({ factionId }: { factionId: FactionId }) {
  const actionCards = useActionCards();
  const actionLog = useActionLog();
  const components = useComponents();
  const factions = useFactions();
  const gameId = useGameId();
  const leaders = useLeaders();
  const planets = usePlanets();
  const relics = useRelics();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const currentTurn = getCurrentTurnLogEntries(actionLog);

  const { openModal } = use(ModalContext);

  const playedComponent = currentTurn
    .filter((logEntry) => logEntry.data.action === "PLAY_COMPONENT")
    .map((logEntry) => (logEntry.data as PlayComponentData).event.name)[0];

  let component: Optional<Component | ActionCard | Relic>;
  if (playedComponent) {
    component = components[playedComponent];
    if (!component) {
      component = actionCards[playedComponent as ActionCardId];
    }
    if (!component) {
      component = relics[playedComponent as RelicId];
    }
  }

  async function selectComponent(componentName: string) {
    if (!gameId) {
      return;
    }
    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    playComponentAsync(gameId, updatedName, factionId);
  }

  function unselectComponent(componentName: string) {
    if (!gameId) {
      return;
    }

    const updatedName = componentName
      .replace(/\./g, "")
      .replace(/,/g, "")
      .replace(/ Ω/g, "");
    unplayComponentAsync(gameId, updatedName, factionId);
  }

  if (!factions) {
    return null;
  }

  const faction = factions[factionId];

  if (!faction) {
    return null;
  }

  const unownedRelics = Object.values(relics ?? {})
    .filter((relic) => !relic.owner)
    .map((relic) => relic.id);

  const agentsForSsruu = Object.values(components ?? {}).filter((component) => {
    if (component.type !== "LEADER") {
      return false;
    }
    if (component.leader !== "AGENT") {
      return false;
    }
    if (component.id === "Ssruu") {
      return false;
    }
    return true;
  });

  if (!component) {
    const filteredComponents = Object.values(components).filter((component) => {
      if (component.type === "PROMISSORY") {
        if (
          component.faction &&
          (!factions[component.faction] || component.faction === factionId)
        ) {
          return false;
        }
      }
      if (
        component.faction &&
        component.type !== "PROMISSORY" &&
        component.type !== "TECH" &&
        component.type !== "PLANET"
      ) {
        if (component.faction !== factionId) {
          return false;
        }
      }

      if (
        unownedRelics.length === 0 &&
        (component.id === "Gain Relic" ||
          component.id === "Black Market Forgery")
      ) {
        return false;
      }

      if (
        "subFaction" in component &&
        component.subFaction &&
        component.subFaction !== faction.startswith?.faction
      ) {
        return false;
      }

      if (component.type === "RELIC") {
        const relic = (relics ?? {})[component.id as RelicId];
        if (!relic) {
          return false;
        }
        if (relic.owner !== factionId) {
          return false;
        }
      }

      if (component.type === "TECH") {
        const tech = techs[component.id];
        if (!tech) {
          return false;
        }
        return hasTech(faction, tech);
      }

      if (component.state === "purged") {
        return false;
      }

      if (component.id === "Ssruu" && agentsForSsruu.length === 0) {
        return false;
      }

      if ("leader" in component && component.leader === "HERO") {
        const hero = leaders[component.id as LeaderId];
        if (!hero) {
          return false;
        }
        if (hero.state !== "readied") {
          return false;
        }
      }

      const darkEnergyTap = techs["Dark Energy Tap"];
      if (
        component.id === "Age of Exploration" &&
        darkEnergyTap &&
        !hasTech(faction, darkEnergyTap)
      ) {
        return false;
      }

      if (component.type === "PLANET") {
        const planet = planets[component.id as PlanetId];
        if (!planet) {
          return false;
        }
        return planet.owner === factionId;
      }

      return true;
    });

    return (
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="mkUb00"
            description="Text on a hover menu for selecting a component action."
            defaultMessage="Select Component"
          />
        }
      >
        <ComponentSelect
          components={filteredComponents}
          selectComponent={selectComponent}
          factionId={factionId}
        />
      </ClientOnlyHoverMenu>
    );
  }

  return (
    <React.Fragment>
      <div
        className="flexColumn largeFont"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <LabeledDiv
          blur
          label={
            <FormattedMessage
              id="43UU69"
              description="Text on a button that will select a component action."
              defaultMessage="Component"
            />
          }
          style={{ width: "90%" }}
        >
          <SelectableRow
            itemId={component.id}
            removeItem={() => unselectComponent(component.id)}
            viewOnly={viewOnly}
          >
            {component.name}
            <div
              className="popupIcon"
              onClick={() =>
                openModal(
                  <ModalContent
                    title={
                      <div className="flexColumn" style={{ fontSize: rem(40) }}>
                        {component.name}
                      </div>
                    }
                  >
                    <InfoContent component={component} />
                  </ModalContent>
                )
              }
              style={{ fontSize: rem(16) }}
            >
              &#x24D8;
            </div>
          </SelectableRow>
          {component.id === "Ssruu" ? (
            <div className="flexRow" style={{ paddingLeft: rem(16) }}>
              Using the ability of
              <Selector
                hoverMenuLabel="Select Agent"
                options={agentsForSsruu}
                selectedItem={getSelectedSubComponent(currentTurn)}
                toggleItem={(agent, add) => {
                  const updatedName = agent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(/ Ω/g, "");
                  selectSubComponentAsync(gameId, add ? updatedName : "None");
                }}
                viewOnly={viewOnly}
              />
            </div>
          ) : null}
          <ComponentDetails factionId={factionId} />
        </LabeledDiv>
      </div>
    </React.Fragment>
  );

  return null;
}
