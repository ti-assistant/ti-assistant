import React, { PropsWithChildren, ReactNode, useState } from "react";
import { GenericModal } from "../Modal";
import { responsivePixels } from "../util/util";
import { ObjectivePanel } from "./ObjectivePanel";
import { CollapsibleSection } from "./CollapsibleSection";
import { LabeledDiv, LabeledLine } from "../LabeledDiv";
import { UnitStats, hasTech } from "../util/api/techs";
import { TechIcon, WrappedTechIcon } from "../TechRow";
import { useRouter } from "next/router";
import {
  buildBaseTechs,
  buildFaction,
  buildLeaders,
  useGameData,
} from "../data/GameData";
import { BASE_FACTIONS, FactionId } from "../../server/data/factions";
import { BASE_TECHS } from "../../server/data/techs";
import parse from "html-react-parser";
import { BASE_LEADERS } from "../../server/data/leaders";
import { addTech, removeTech } from "../util/api/addTech";
import { Options } from "../util/api/options";
import styles from "./FactionPanel.module.scss";

function AbilitySection({
  leftLabel,
  label,
  rightLabel,
  children,
}: PropsWithChildren<{
  leftLabel: ReactNode;
  label?: ReactNode;
  rightLabel?: ReactNode;
}>) {
  return (
    <div
      className="flexColumn"
      style={{
        position: "relative",
        width: "100%",
        gap: responsivePixels(4),
      }}
    >
      <LabeledLine
        leftLabel={leftLabel}
        label={label}
        rightLabel={rightLabel}
      />
      <div
        className="flexColumn"
        style={{
          fontFamily: "Myriad Pro",
          alignItems: "flex-start",
          width: "100%",
          padding: `0 ${responsivePixels(8)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const KEYWORDS = ["ACTION:", "DEPLOY:", "UNLOCK:"];

const ABILITY_REGEX = [
  /PRODUCTION( [1-9]| X)?/gi,
  /ANTI-FIGHTER BARRAGE( [1-9] \(x[1-9]\))?/gi,
  /BOMBARDMENT( [1-9] \(x[1-9]\))?/gi,
  /SPACE CANNON( [1-9]( \(x[1-9]\))?)?/gi,
  /SUSTAIN DAMAGE/gi,
  /PLANETARY SHIELD/gi,
  // Faction specific keywords
  /MITOSIS/gi,
  /AWAKEN/gi,
  /STAR FORGE/gi,
  /ORBITAL DROP/gi,
  /PILLAGE/gi,
  /TELEPATHIC/gi,
  /TECHNOLOGICAL SINGULARITY/gi,
  /FRAGILE/gi,
  /INDOCTRINATION/gi,
  /STALL TACTICS/gi,
];

function formatDescription(description: string) {
  const parsedSections = [];
  const sections = description.split("\n\n");
  for (const section of sections) {
    let updated = section;
    for (const keyword of KEYWORDS) {
      updated = updated.replaceAll(
        keyword,
        `<i class="keyword">${keyword}</i>`
      );
    }
    for (const regex of ABILITY_REGEX) {
      updated = updated.replaceAll(regex, `<span class="ability">$&</span>`);
    }
    if (updated.endsWith(":")) {
      updated = `<b>${updated}</b>`;
    }
    parsedSections.push(parse(updated));
  }
  return parsedSections;
}

function UnitStatBlock({ stats }: { stats?: UnitStats }) {
  if (!stats) {
    return null;
  }
  return (
    <div className="flexRow" style={{ width: "100%" }}>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: responsivePixels(4),
          fontFamily: "Slider",
          // alignItems: "stretch",
          // justifyContent: "center",
          width: "fit-content",
          boxSizing: "border-box",
        }}
      >
        {stats.cost ? (
          <UnitStat name="COST" stat={stats.cost ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.combat ? (
          <UnitStat name="COMBAT" stat={stats.combat ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.move ? (
          <UnitStat name="MOVE" stat={stats.move ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.capacity ? (
          <UnitStat name="CAPACITY" stat={stats.capacity ?? "-"} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
function UnitStat({ name, stat }: { name: string; stat: number | string }) {
  return (
    <div
      className="centered"
      style={{
        width: responsivePixels(80),
        border: "1px solid #eee",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: responsivePixels(24),
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div style={{ fontSize: responsivePixels(14), padding: "0px 6px" }}>
        {name}
      </div>
    </div>
  );
}

// function FactionPanelContent({ factionName }: { factionName: string }) {
//   return (
//     <div
//       style={{
//         display: "grid",
//         width: "100%",
//         gap: responsivePixels(8),
//         gridAutoFlow: "row",
//         gridTemplateColumns: "1fr 1fr 1fr",
//         // gridTemplateRows: "1fr 2fr 1fr",
//         // gridTemplateRows: "repeat(2 1fr)",
//         outline: "2px solid orange",
//       }}
//     >
//       <div className="flexColumn" style={{ height: "100%" }}>
//         <CollapsibleSection title="Abilities" style={{ height: "100%" }}>
//           <div
//             className="flexColumn"
//             style={{
//               display: "grid",
//               gridAutoFlow: "row",
//               gridTemplateRows: "repeat(3, 1fr)",
//               gap: responsivePixels(4),
//               padding: responsivePixels(4),
//               fontSize: responsivePixels(14),
//             }}
//           >
//             <AbilitySection leftLabel="Galactic Threat">
//               You cannot vote on agendas. Once per agenda phase, after an agenda
//               is revealed, you may predict aloud the outcome of that agenda. If
//               your prediction is correct, gain 1 technology that is owned by a
//               player who voted how you predicted.
//             </AbilitySection>
//             <AbilitySection leftLabel="Technological Singularity">
//               Once per combat, after 1 of your opponent's units is destroyed,
//               you may gain 1 technology that is owned by that player.
//             </AbilitySection>
//             <AbilitySection leftLabel="Propagation">
//               You cannot research technology. When you would research a
//               technology, gain 3 command tokens instead.
//             </AbilitySection>
//           </div>
//         </CollapsibleSection>
//         <CollapsibleSection title="Promissory Note" style={{ height: "100%" }}>
//           <div
//             className="flexColumn"
//             style={{
//               display: "grid",
//               gridAutoFlow: "row",
//               // gridTemplateRows: "repeat(3, 1fr)",
//               gap: responsivePixels(4),
//               padding: responsivePixels(4),
//               fontSize: responsivePixels(14),
//             }}
//           >
//             <AbilitySection leftLabel="Terraform">
//               <div>
//                 <i style={{ fontFamily: "Slider" }}>ACTION:</i> Attach this card
//                 to a non-home planet you control other than Mecatol Rex.
//               </div>
//               Its resource and influence values are each increased by 1 and it
//               is treated as having all 3 planet traits (Cultural, Hazardous, and
//               Industrial).
//             </AbilitySection>
//           </div>
//         </CollapsibleSection>
//       </div>
//       <div className="flexColumn" style={{ height: "100%" }}>
//         <CollapsibleSection title="Faction Units">
//           <div
//             className="flexColumn"
//             style={{
//               display: "grid",
//               gridAutoFlow: "row",
//               // gridTemplateRows: "repeat(5, 1fr)",
//               gap: responsivePixels(4),
//               padding: responsivePixels(4),
//               fontSize: responsivePixels(14),
//             }}
//           >
//             <AbilitySection leftLabel="Hil Colesh" rightLabel="FLAGSHIP">
//               <div>
//                 <i>DEPLOY:</i> After you activate a system that contains 1 or
//                 more of your PDS, you may replace 1 of those PDS with this unit.
//               </div>
//               <div
//                 style={{
//                   fontFamily: "Slider",
//                   paddingLeft: responsivePixels(8),
//                 }}
//               >
//                 SUSTAIN DAMAGE
//               </div>
//               <UnitStatBlock
//                 stats={{ cost: 8, combat: "7(x2)", capacity: 3, move: 1 }}
//               />
//             </AbilitySection>
//             <AbilitySection leftLabel="Z-Grav Eidolon" rightLabel="MECH">
//               If this unit is in the space area of the active system, it is also
//               a ship. At the end of a space battle in the active system, flip
//               this card. (This card begins the game with this side face down)
//               <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
//             </AbilitySection>
//             <AbilitySection leftLabel="Saturn Engine I" rightLabel="CRUISER">
//               <UnitStatBlock
//                 stats={{ cost: 2, combat: 7, capacity: 1, move: 2 }}
//               />
//             </AbilitySection>
//             <AbilitySection leftLabel="Hel-Titan I" rightLabel="PDS">
//               This unit is treated as both a structure and a ground force. It
//               cannot be transported.
//               <div
//                 style={{
//                   display: "grid",
//                   gridAutoFlow: "row",
//                   gridTemplateColumns: "repeat(2, 1fr)",
//                   fontFamily: "Slider",
//                   paddingLeft: responsivePixels(8),
//                   rowGap: responsivePixels(2),
//                   width: "100%",
//                 }}
//               >
//                 <div>PLANETARY SHIELD</div>
//                 <div>SUSTAIN DAMAGE</div>
//                 <div>SPACE CANNON 6</div>
//                 <div>PRODUCTION 1</div>
//               </div>
//               <UnitStatBlock stats={{ combat: 7 }} />
//             </AbilitySection>
//           </div>
//         </CollapsibleSection>
//         <CollapsibleSection title="Faction Tech">
//           <div
//             className="flexColumn"
//             style={{
//               display: "grid",
//               gridAutoFlow: "row",
//               gridTemplateRows: "repeat(2, 1fr)",
//               gap: responsivePixels(4),
//               padding: responsivePixels(4),
//               fontSize: responsivePixels(14),
//             }}
//           >
//             <div
//               className="flexColumn"
//               style={{ gap: responsivePixels(4), width: "100%" }}
//             >
//               <AbilitySection
//                 leftLabel={
//                   <div className="flexRow" style={{ gap: responsivePixels(4) }}>
//                     Supercharge
//                     <WrappedTechIcon type="RED" size={20} />
//                   </div>
//                 }
//               >
//                 At the start of a combat round, you may exhaust this card to
//                 apply +1 to the result of each of your unit's combat rolls
//                 during this combat round.
//               </AbilitySection>
//               <AbilitySection
//                 leftLabel={
//                   <div className="flexRow" style={{ gap: responsivePixels(4) }}>
//                     Pre-Fab Arcologies
//                     <div className="flexRow" style={{ gap: 0 }}>
//                       <WrappedTechIcon type="GREEN" size={20} />
//                       <WrappedTechIcon type="GREEN" size={20} />
//                       <WrappedTechIcon type="GREEN" size={20} />
//                     </div>
//                   </div>
//                 }
//               >
//                 At the start of a combat round, you may exhaust this card to
//                 apply +1 to the result of each of your unit's combat rolls
//                 during this combat round.
//               </AbilitySection>
//             </div>
//           </div>
//         </CollapsibleSection>
//       </div>
//       <CollapsibleSection title="Leaders">
//         <div
//           className="flexColumn"
//           style={{
//             display: "grid",
//             gridAutoFlow: "row",
//             gridTemplateRows: "repeat(5, 1fr)",
//             gap: responsivePixels(4),
//             padding: `0 ${responsivePixels(4)} ${responsivePixels(4)}`,
//             fontSize: responsivePixels(14),
//           }}
//         >
//           <AbilitySection leftLabel="Artuno the Betrayer" rightLabel="AGENT">
//             <b>When you gain trade goods from the supply:</b>
//             You may exhaust this card to place an equal number of trade goods on
//             this card. When this card readies, gain the trade goods on this
//             card.
//           </AbilitySection>
//           <AbilitySection leftLabel="Field Marshal Mercer" rightLabel="AGENT">
//             <b>At the end of a player's turn: </b>
//             You may exhaust this card to allow that player to remove up to 2 of
//             their ground forces from the game board and place them on planets
//             they control in the active system.
//           </AbilitySection>
//           <AbilitySection leftLabel="The Thundarian" rightLabel="AGENT">
//             <b>After the "Roll Dice" step of combat:</b>
//             You may exhaust this card. If you do, hits are not assigned to
//             either players' units. Return to the start of this combat round's
//             "Roll Dice" step
//           </AbilitySection>
//           <AbilitySection leftLabel="Navarch Feng" rightLabel="COMMANDER">
//             You can produce your flagship without spending resources.
//           </AbilitySection>
//           <AbilitySection leftLabel="Ahk-Syl Siven" rightLabel="HERO">
//             <div>
//               <i style={{ fontFamily: "Slider" }}>ACTION:</i> Place this card
//               near the game board; your flagship and units it transports can
//               move out of systems that contain your command tokens during this
//               game round.
//             </div>
//             At the end of that game round, purge this card.
//           </AbilitySection>
//         </div>
//       </CollapsibleSection>
//       {/* <CollapsibleSection title="Mech">
//         <div
//           className="flexColumn"
//           style={{
//             display: "grid",
//             gridAutoFlow: "row",
//             // gridTemplateRows: "repeat(5, 1fr)",
//             gap: responsivePixels(4),
//             padding: responsivePixels(4),
//             fontSize: responsivePixels(14),
//           }}
//         >
//           <LabeledLine leftLabel="Z-Grav Eidolon" />
//           <div
//             style={{
//               fontFamily: "Myriad Pro",
//               padding: `0 ${responsivePixels(8)}`,
//             }}
//           >
//             If this unit is in the space area of the active system, it is also a
//             ship. At the end of a space battle in the active system, flip this
//             card. (This card begins the game with this side face down)
//           </div>
//           <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
//         </div>
//       </CollapsibleSection> */}
//       {/* <CollapsibleSection title="Mech">
//         <div
//           className="flexColumn"
//           style={{
//             display: "grid",
//             gridAutoFlow: "row",
//             // gridTemplateRows: "repeat(5, 1fr)",
//             gap: responsivePixels(4),
//             padding: responsivePixels(4),
//             fontSize: responsivePixels(14),
//           }}
//         >
//           <LabeledLine leftLabel="Z-Grav Eidolon" />
//           <div
//             style={{
//               fontFamily: "Myriad Pro",
//               padding: `0 ${responsivePixels(8)}`,
//             }}
//           >
//             If this unit is in the space area of the active system, it is also a
//             ship. At the end of a space battle in the active system, flip this
//             card. (This card begins the game with this side face down)
//           </div>
//           <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
//         </div>
//       </CollapsibleSection> */}
//     </div>
//   );
// }

function FactionPanelContent({
  factionName,
  options,
}: {
  factionName: string;
  options: Options;
}) {
  // const router = useRouter();
  // const { game: gameid }: { game?: string } = router.query;
  // const gameData = useGameData(gameid, ["factions", "leaders", "techs"]);

  const techs = buildBaseTechs(options);
  const leaders = buildLeaders(options);
  const faction = buildFaction(factionName, options);

  if (!faction) {
    return null;
  }

  const factionTechs = Object.values(techs).filter(
    (tech) => tech.faction === factionName
  );
  const factionLeaders = Object.values(leaders)
    .filter((leader) => leader.faction === factionName)
    .sort((a, b) => {
      if (a.type !== b.type) {
        if (a.type === "HERO") {
          return 1;
        }
        if (b.type === "HERO") {
          return -1;
        }
        if (a.type === "AGENT") {
          return -1;
        }
        if (b.type === "AGENT") {
          return 1;
        }
      }
      return a.name > b.name ? 1 : -1;
    });

  if (!faction) {
    return null;
  }

  return (
    <div className={styles.factionInfoGrid}>
      <div
        className="flexColumn"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {factionLeaders.length > 0 ? (
          <CollapsibleSection title="Leaders" style={{ width: "100%" }}>
            <div
              className="flexColumn"
              style={{
                // display: "grid",
                // gridAutoFlow: "row",
                width: "100%",
                // gridTemplateRows: `repeat(${factionLeaders.length}, 1fr)`,
                gap: responsivePixels(4),
                padding: `0 ${responsivePixels(4)} ${responsivePixels(4)}`,
                fontSize: responsivePixels(14),
              }}
            >
              {factionLeaders.map((leader) => {
                let state = "readied";
                // switch (leader.type) {
                //   case "HERO":
                //     state = faction.hero;
                //     break;
                //   case "COMMANDER":
                //     state = faction.commander;
                //     break;
                // }
                let innerContent = undefined;
                let leftLabel = undefined;
                switch (state) {
                  case "readied":
                    leftLabel = <div className="flexRow">{leader.name}</div>;
                    innerContent = (
                      <div
                        className="flexColumn"
                        style={{ width: "100%", alignItems: "flex-start" }}
                      >
                        {formatDescription(leader.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )}
                      </div>
                    );
                    break;
                  case "locked":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{ gap: responsivePixels(4) }}
                        >
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // if (!gameid) {
                              //   return null;
                              // }
                              alert("WIP - Will unlock later");
                            }}
                          >
                            UNLOCK
                          </div>
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div>{formatDescription(`UNLOCK: ${leader.unlock}`)}</div>
                    );
                    break;
                  case "unlocked":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{ gap: responsivePixels(4) }}
                        >
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // if (!gameid) {
                              //   return null;
                              // }
                              alert("WIP - Will lock later");
                            }}
                          >
                            LOCK
                          </div>
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // if (!gameid) {
                              //   return null;
                              // }
                              alert("WIP - Will purge later");
                            }}
                          >
                            PURGE
                          </div>
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div
                        className="flexColumn"
                        style={{ width: "100%", alignItems: "flex-start" }}
                      >
                        {formatDescription(leader.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )}
                      </div>
                    );
                    break;
                  case "purged":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{ gap: responsivePixels(4) }}
                        >
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // if (!gameid) {
                              //   return null;
                              // }
                              alert("WIP - Will unpurge later");
                            }}
                          >
                            UNPURGE
                          </div>
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div
                        className="flexRow"
                        style={{
                          width: "100%",
                          fontSize: responsivePixels(20),
                          fontFamily: "Slider",
                        }}
                      >
                        PURGED
                      </div>
                    );
                    break;
                }
                return (
                  <AbilitySection
                    key={leader.name}
                    leftLabel={leftLabel}
                    rightLabel={leader.type}
                  >
                    {innerContent}
                  </AbilitySection>
                );
              })}
              {/* <AbilitySection leftLabel="Artuno the Betrayer" rightLabel="AGENT">
              <b>When you gain trade goods from the supply:</b>
              You may exhaust this card to place an equal number of trade goods
              on this card. When this card readies, gain the trade goods on this
              card.
            </AbilitySection>
            <AbilitySection leftLabel="Field Marshal Mercer" rightLabel="AGENT">
              <b>At the end of a player's turn: </b>
              You may exhaust this card to allow that player to remove up to 2
              of their ground forces from the game board and place them on
              planets they control in the active system.
            </AbilitySection>
            <AbilitySection leftLabel="The Thundarian" rightLabel="AGENT">
              <b>After the "Roll Dice" step of combat:</b>
              You may exhaust this card. If you do, hits are not assigned to
              either players' units. Return to the start of this combat round's
              "Roll Dice" step
            </AbilitySection>
            <AbilitySection leftLabel="Navarch Feng" rightLabel="COMMANDER">
              You can produce your flagship without spending resources.
            </AbilitySection>
            <AbilitySection leftLabel="Ahk-Syl Siven" rightLabel="HERO">
              <div>
                <i style={{ fontFamily: "Slider" }}>ACTION:</i> Place this card
                near the game board; your flagship and units it transports can
                move out of systems that contain your command tokens during this
                game round.
              </div>
              At the end of that game round, purge this card.
            </AbilitySection> */}
            </div>
          </CollapsibleSection>
        ) : null}

        {factionTechs.length > 0 ? (
          <CollapsibleSection title="Faction Tech">
            <div
              className="flexColumn"
              style={{
                // display: "grid",
                // gridAutoFlow: "row",
                // gridTemplateRows: `repeat(${factionTechs.length}, 1fr)`,
                gap: responsivePixels(4),
                padding: responsivePixels(4),
                fontSize: responsivePixels(14),
              }}
            >
              {factionTechs.map((tech) => {
                return (
                  <AbilitySection
                    key={tech.name}
                    leftLabel={
                      <div
                        className="flexRow"
                        style={{ gap: responsivePixels(4) }}
                      >
                        {tech.name}
                        {tech.prereqs.map((prereq, index) => {
                          return (
                            <WrappedTechIcon
                              key={index}
                              type={prereq}
                              size={20}
                            />
                          );
                        })}
                      </div>
                    }
                  >
                    {tech.description
                      ? formatDescription(tech.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )
                      : null}
                    {tech.type === "UPGRADE" ? (
                      <React.Fragment>
                        {tech.abilities.length > 0 ? (
                          <div
                            style={{
                              display: "grid",
                              gridAutoFlow: "row",
                              whiteSpace: "nowrap",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              fontFamily: "Slider",
                              paddingLeft: responsivePixels(8),
                              rowGap: responsivePixels(2),
                              width: "100%",
                            }}
                          >
                            {tech.abilities.map((ability) => {
                              return (
                                <div key={ability}>{ability.toUpperCase()}</div>
                              );
                            })}
                          </div>
                        ) : null}
                        <UnitStatBlock stats={tech.stats} />
                      </React.Fragment>
                    ) : null}
                  </AbilitySection>
                );
              })}

              {/* <div
                className="flexColumn"
                style={{ gap: responsivePixels(4), width: "100%" }}
              > */}
              {/* <AbilitySection
                leftLabel={
                  <div className="flexRow" style={{ gap: responsivePixels(4) }}>
                    Supercharge
                    <WrappedTechIcon type="RED" size={20} />
                  </div>
                }
              >
                At the start of a combat round, you may exhaust this card to
                apply +1 to the result of each of your unit's combat rolls
                during this combat round.
              </AbilitySection>
              <AbilitySection
                leftLabel={
                  <div className="flexRow" style={{ gap: responsivePixels(4) }}>
                    Pre-Fab Arcologies
                    <div className="flexRow" style={{ gap: 0 }}>
                      <WrappedTechIcon type="GREEN" size={20} />
                      <WrappedTechIcon type="GREEN" size={20} />
                      <WrappedTechIcon type="GREEN" size={20} />
                    </div>
                  </div>
                }
              >
                At the start of a combat round, you may exhaust this card to
                apply +1 to the result of each of your unit's combat rolls
                during this combat round.
              </AbilitySection> */}
              {/* </div> */}
            </div>
          </CollapsibleSection>
        ) : null}
      </div>
      <div
        className="flexColumn"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <CollapsibleSection title="Abilities" style={{ width: "100%" }}>
          <div
            className="flexColumn"
            style={{
              width: "100%",
              // display: "grid",
              // gridAutoFlow: "row",
              // gridTemplateRows: `repeat(${faction.abilities.length}, 1fr)`,
              gap: responsivePixels(4),
              padding: responsivePixels(4),
              fontSize: responsivePixels(14),
            }}
          >
            {faction.abilities.map((ability) => {
              return (
                <AbilitySection
                  key={ability.name}
                  leftLabel={ability.name.toUpperCase()}
                >
                  {formatDescription(ability.description).map(
                    (section, index) => {
                      return <div key={index}>{section}</div>;
                    }
                  )}
                </AbilitySection>
              );
            })}
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Promissory Note" style={{ width: "100%" }}>
          <div
            className="flexColumn"
            style={{
              // display: "grid",
              // gridAutoFlow: "row",
              // gridTemplateRows: "repeat(3, 1fr)",
              gap: responsivePixels(4),
              padding: responsivePixels(4),
              fontSize: responsivePixels(14),
              width: "100%",
            }}
          >
            {faction.promissories.map((promissory) => {
              return (
                <AbilitySection
                  key={promissory.name}
                  leftLabel={promissory.name}
                >
                  {formatDescription(promissory.description).map(
                    (section, index) => {
                      return <div key={index}>{section}</div>;
                    }
                  )}
                </AbilitySection>
              );
            })}
            {/* <AbilitySection leftLabel="Terraform">
              <div>
                <i style={{ fontFamily: "Slider" }}>ACTION:</i> Attach this card
                to a non-home planet you control other than Mecatol Rex.
              </div>
              Its resource and influence values are each increased by 1 and it
              is treated as having all 3 planet traits (Cultural, Hazardous, and
              Industrial).
            </AbilitySection> */}
          </div>
        </CollapsibleSection>
      </div>
      <CollapsibleSection title="Faction Unique Units">
        <div
          className="flexColumn"
          style={{
            // display: "grid",
            // gridAutoFlow: "row",
            // gridTemplateRows: "repeat(5, 1fr)",
            gap: responsivePixels(4),
            padding: responsivePixels(4),
            fontSize: responsivePixels(14),
          }}
        >
          {faction.units.map((unit, index) => {
            const localUnit = { ...unit };
            let hasUpgrade = false;
            let leftLabel: ReactNode = unit.name;
            // if (unit.upgrade) {
            //   const upgradeTech = techs[unit.upgrade];
            //   if (!upgradeTech || upgradeTech.type !== "UPGRADE") {
            //     throw new Error("Invalid upgrade tech");
            //   }
            //   hasUpgrade = hasTech(faction, unit.upgrade);
            //   if (hasUpgrade) {
            //     localUnit.description = upgradeTech.description;
            //     localUnit.name = upgradeTech.name;
            //     localUnit.stats = upgradeTech.stats;
            //     localUnit.abilities = upgradeTech.abilities;
            //     leftLabel = (
            //       <div className="flexRow">
            //         {localUnit.name}
            //         <div
            //           className="flexRow"
            //           style={{ gap: responsivePixels(4) }}
            //         >
            //           <div
            //             className="downArrow"
            //             style={{
            //               fontSize: responsivePixels(8),
            //               color: "#eee",
            //               border: "1px solid #eee",
            //               padding: "2px 2px",
            //               borderRadius: "2px",
            //               cursor: "pointer",
            //             }}
            //             onClick={() => {
            //               if (!gameid) {
            //                 return null;
            //               }
            //               removeTech(gameid, factionName, upgradeTech.name);
            //             }}
            //           >
            //             DOWNGRADE
            //           </div>
            //         </div>
            //       </div>
            //     );
            //   } else {
            //     leftLabel = (
            //       <div className="flexRow">
            //         {localUnit.name}
            //         <div
            //           className="upArrow"
            //           style={{
            //             fontSize: responsivePixels(8),
            //             color: "#eee",
            //             border: "1px solid #eee",
            //             padding: "2px 2px",
            //             borderRadius: "2px",
            //             cursor: "pointer",
            //           }}
            //           onClick={() => {
            //             if (!gameid) {
            //               return null;
            //             }
            //             addTech(gameid, factionName, upgradeTech.name);
            //           }}
            //         >
            //           UPGRADE
            //         </div>
            //       </div>
            //     );
            //   }
            // }
            return (
              <AbilitySection
                key={index}
                leftLabel={leftLabel}
                rightLabel={localUnit.type.toUpperCase()}
              >
                {localUnit.description
                  ? formatDescription(localUnit.description).map(
                      (section, index) => {
                        return <div key={index}>{section}</div>;
                      }
                    )
                  : null}
                {(localUnit.abilities ?? []).length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridAutoFlow: "row",
                      whiteSpace: "nowrap",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      fontFamily: "Slider",
                      paddingLeft: responsivePixels(8),
                      rowGap: responsivePixels(2),
                      width: "100%",
                    }}
                  >
                    {localUnit.abilities?.map((ability) => {
                      return <div key={ability}>{ability.toUpperCase()}</div>;
                    })}
                  </div>
                ) : null}
                <UnitStatBlock stats={localUnit.stats} />
              </AbilitySection>
            );
          })}
          {/* <AbilitySection leftLabel="Hil Colesh" rightLabel="FLAGSHIP">
              <div>
                <i>DEPLOY:</i> After you activate a system that contains 1 or
                more of your PDS, you may replace 1 of those PDS with this unit.
              </div>
              <div
                style={{
                  fontFamily: "Slider",
                  paddingLeft: responsivePixels(8),
                }}
              >
                SUSTAIN DAMAGE
              </div>
              <UnitStatBlock
                stats={{ cost: 8, combat: "7(x2)", capacity: 3, move: 1 }}
              />
            </AbilitySection>
            <AbilitySection leftLabel="Z-Grav Eidolon" rightLabel="MECH">
              If this unit is in the space area of the active system, it is also
              a ship. At the end of a space battle in the active system, flip
              this card. (This card begins the game with this side face down)
              <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
            </AbilitySection>
            <AbilitySection leftLabel="Saturn Engine I" rightLabel="CRUISER">
              <UnitStatBlock
                stats={{ cost: 2, combat: 7, capacity: 1, move: 2 }}
              />
            </AbilitySection>
            <AbilitySection leftLabel="Hel-Titan I" rightLabel="PDS">
              This unit is treated as both a structure and a ground force. It
              cannot be transported.
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "row",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  fontFamily: "Slider",
                  paddingLeft: responsivePixels(8),
                  rowGap: responsivePixels(2),
                  width: "100%",
                }}
              >
                <div>PLANETARY SHIELD</div>
                <div>SUSTAIN DAMAGE</div>
                <div>SPACE CANNON 6</div>
                <div>PRODUCTION 1</div>
              </div>
              <UnitStatBlock stats={{ combat: 7 }} />
            </AbilitySection> */}
        </div>
      </CollapsibleSection>

      {/* <CollapsibleSection title="Mech">
        <div
          className="flexColumn"
          style={{
            display: "grid",
            gridAutoFlow: "row",
            // gridTemplateRows: "repeat(5, 1fr)",
            gap: responsivePixels(4),
            padding: responsivePixels(4),
            fontSize: responsivePixels(14),
          }}
        >
          <LabeledLine leftLabel="Z-Grav Eidolon" />
          <div
            style={{
              fontFamily: "Myriad Pro",
              padding: `0 ${responsivePixels(8)}`,
            }}
          >
            If this unit is in the space area of the active system, it is also a
            ship. At the end of a space battle in the active system, flip this
            card. (This card begins the game with this side face down)
          </div>
          <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
        </div>
      </CollapsibleSection> */}
      {/* <CollapsibleSection title="Mech">
        <div
          className="flexColumn"
          style={{
            display: "grid",
            gridAutoFlow: "row",
            // gridTemplateRows: "repeat(5, 1fr)",
            gap: responsivePixels(4),
            padding: responsivePixels(4),
            fontSize: responsivePixels(14),
          }}
        >
          <LabeledLine leftLabel="Z-Grav Eidolon" />
          <div
            style={{
              fontFamily: "Myriad Pro",
              padding: `0 ${responsivePixels(8)}`,
            }}
          >
            If this unit is in the space area of the active system, it is also a
            ship. At the end of a space battle in the active system, flip this
            card. (This card begins the game with this side face down)
          </div>
          <UnitStatBlock stats={{ cost: 2, combat: "8(x2)" }} />
        </div>
      </CollapsibleSection> */}
    </div>
  );
}

export function FactionPanel({
  factionName,
  options,
}: {
  factionName: string;
  options: Options;
}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <React.Fragment>
      <GenericModal visible={showPanel} closeMenu={() => setShowPanel(false)}>
        <div
          className="flexColumn"
          style={{
            whiteSpace: "normal",
            textShadow: "none",
            width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(24)}))`,
            justifyContent: "flex-start",
            height: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
            }}
          >
            {factionName}
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                24
              )}))`,
              justifyContent: "flex-start",
              overflow: "auto",
              height: "fit-content",
              // paddingBottom: responsivePixels(24),
            }}
          >
            <FactionPanelContent factionName={factionName} options={options} />
          </div>
        </div>
      </GenericModal>
      <div
        className="popupIcon"
        style={{
          fontSize: responsivePixels(16),
        }}
        onClick={() => setShowPanel(true)}
      >
        &#x24D8;
      </div>
    </React.Fragment>
  );
}
