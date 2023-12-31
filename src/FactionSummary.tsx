import { useRouter } from "next/router";
import { useContext } from "react";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechIcon from "./components/TechIcon/TechIcon";
import {
  AttachmentContext,
  FactionContext,
  ObjectiveContext,
  PlanetContext,
  StateContext,
  TechContext,
} from "./context/Context";
import { manualVPUpdateAsync } from "./dynamic/api";
import { computeVPs } from "./util/factions";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "./util/planets";
import { filterToOwnedTechs } from "./util/techs";
import { pluralize, responsivePixels } from "./util/util";

export function TechSummary({ techs }: { techs: Tech[] }) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder: TechType[] = ["RED", "GREEN", "BLUE", "YELLOW", "UPGRADE"];

  techs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff: number = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <div className="techSummaryGrid">
      <div className="centered">{redTechs.length || "-"}</div>
      <TechIcon type={"RED"} size={16} />
      <div>&nbsp;</div>
      <div className="centered">{greenTechs.length || "-"}</div>
      <TechIcon type={"GREEN"} size={16} />
      <div className="centered">{blueTechs.length || "-"}</div>
      <TechIcon type={"BLUE"} size={16} />
      <div>&nbsp;</div>
      <div className="centered">{yellowTechs.length || "-"}</div>
      <TechIcon type={"YELLOW"} size={16} />
      <div className="centered">{upgradeTechs.length || "-"}</div>
      <div>{pluralize("Upgrade", upgradeTechs.length)}</div>
    </div>
  );
}

//  function computeVPs(
//   factions: Partial<Record<FactionId, Faction>>,
//   factionId: FactionId,
//   objectives: Partial<Record<ObjectiveId, Objective>>
// ) {
//   const faction = factions[factionId];
//   if (!faction) {
//     return 0;
//   }
//   return (
//     (faction.vps ?? 0) +
//     Object.values(objectives)
//       .filter((objective) => {
//         return (objective.scorers ?? []).includes(factionId);
//       })
//       .reduce((total, objective) => {
//         const count = (objective.scorers ?? []).reduce((count, scorer) => {
//           if (scorer === factionId) {
//             return count + 1;
//           }
//           return count;
//         }, 0);
//         return Math.max(0, total + count * objective.points);
//       }, 0)
//   );
// }

interface FactionSummaryProps {
  factionId?: FactionId;
  options?: {
    hidePlanets?: boolean;
    hideTechs?: boolean;
    showIcon?: boolean;
  };
}

export function FactionSummary({
  factionId,
  options = {},
}: FactionSummaryProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);
  const techs = useContext(TechContext);

  let ownedTechs: Tech[] = [];
  let updatedPlanets: Planet[] = [];
  let VPs = 0;
  let factionHero: LeaderState = "locked";
  if (factionId) {
    const faction = factions[factionId];

    if (!faction) {
      throw new Error("Faction " + factionId + " not found");
    }

    ownedTechs = filterToOwnedTechs(techs ?? {}, faction);

    const ownedPlanets = factionId
      ? filterToClaimedPlanets(planets ?? {}, factionId)
      : [];
    updatedPlanets = applyAllPlanetAttachments(ownedPlanets, attachments);

    VPs = computeVPs(factions ?? {}, factionId, objectives ?? {});

    factionHero = faction.hero;
  }

  function manualVpAdjust(increase: boolean) {
    if (!gameid || !factionId) {
      return;
    }
    const value = increase ? 1 : -1;
    manualVPUpdateAsync(gameid, factionId, value);
  }

  const editable = state?.phase !== "END";

  return (
    <div className="factionSummary">
      {options.hideTechs ? null : <TechSummary techs={ownedTechs} />}
      <div className="vpGrid">
        {options.showIcon ? (
          <div
            className="flexColumn"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "absolute",
                zIndex: -1,
                opacity: 0.5,
                width: responsivePixels(60),
                height: responsivePixels(60),
              }}
            >
              <FactionIcon factionId={factionId} size="100%" />
            </div>
          </div>
        ) : null}
        <div
          className="flexRow"
          style={{
            gap: responsivePixels(4),
            justifyContent: "space-between",
            fontSize: responsivePixels(28),
          }}
        >
          {VPs > 0 && editable ? (
            <div
              className="arrowDown"
              onClick={() => manualVpAdjust(false)}
            ></div>
          ) : (
            <div style={{ width: responsivePixels(12) }}></div>
          )}
          <div className="flexRow" style={{ width: responsivePixels(24) }}>
            {VPs}
          </div>
          {editable ? (
            <div className="arrowUp" onClick={() => manualVpAdjust(true)}></div>
          ) : (
            <div style={{ width: responsivePixels(12) }}></div>
          )}
        </div>
        <div className="centered" style={{ fontSize: responsivePixels(20) }}>
          {pluralize("VP", VPs)}
        </div>
      </div>
      {options.hidePlanets ? null : (
        <PlanetSummary
          planets={updatedPlanets}
          hasXxchaHero={
            factionId === "Xxcha Kingdom" && factionHero === "readied"
          }
        />
      )}
    </div>
  );
}
