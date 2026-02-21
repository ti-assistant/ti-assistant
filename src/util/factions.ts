import { Optional } from "./types/types";
import { objectEntries } from "./util";

export function getFactionColor(faction: Optional<Faction>) {
  if (!faction) {
    return "var(--neutral-border)";
  }
  return convertToFactionColor(faction.color);
}

export function convertToFactionColor(color: Optional<string>) {
  if (!color) {
    return "var(--neutral-border)";
  }
  switch (color) {
    case "Blue":
      return "cornflowerblue";
    case "Purple":
      return "mediumpurple";
    case "Magenta":
      return "hotpink";
    case "Yellow":
      return "gold";
    // TODO: Mess around with other colors.
  }
  return color;
}

export function getFactionName(faction: Optional<Faction>) {
  if (!faction) {
    return "Loading Faction...";
  }
  if (faction.playerName) {
    let clipped = faction.playerName;
    if (clipped.length > 12) {
      clipped = `${clipped.substring(0, 12).trim()}...`;
    }

    return `${clipped} - ${faction.shortname}`;
  }
  return faction.name;
}

export function getFactionShortName(faction: Optional<Faction>) {
  if (!faction) {
    return null;
  }
  if (faction.playerName) {
    return faction.playerName;
  }
  return faction.shortname;
}

export function computeVPs(
  factions: Partial<Record<FactionId, GameFaction>>,
  factionId: FactionId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
) {
  const faction = factions[factionId];
  if (!faction) {
    return 0;
  }
  const factionVPs = faction.vps ?? 0;
  return factionVPs + computeScoredVPs(factionId, objectives);
}

export function computeScoredVPs(
  factionId: FactionId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
) {
  return Object.values(objectives)
    .filter((objective) => {
      return (objective.scorers ?? []).includes(factionId);
    })
    .reduce((total, objective) => {
      const count = (objective.scorers ?? []).reduce((count, scorer) => {
        if (scorer === factionId) {
          return count + 1;
        }
        return count;
      }, 0);
      return Math.max(0, total + count * objective.points);
    }, 0);
}

export function computeVPsByCategory(
  factions: Partial<Record<FactionId, GameFaction>>,
  factionId: FactionId,
  objectives: Partial<Record<ObjectiveId, Objective>>,
) {
  const emptyGroup: Record<ObjectiveType, number> = {
    "STAGE ONE": 0,
    "STAGE TWO": 0,
    SECRET: 0,
    OTHER: 0,
  };
  const faction = factions[factionId];
  if (!faction) {
    return emptyGroup;
  }
  const group = Object.values(objectives)
    .filter((objective) => {
      return (objective.scorers ?? []).includes(factionId);
    })
    .reduce((group: Record<ObjectiveType, number>, objective) => {
      const count = (objective.scorers ?? []).reduce((count, scorer) => {
        if (scorer === factionId) {
          return count + 1;
        }
        return count;
      }, 0);
      group[objective.type] += objective.points * count;
      return group;
    }, emptyGroup);
  const factionVPs = faction.vps ?? 0;
  group.OTHER += factionVPs;
  return group;
}

export function getMapOrderedFactionIds(
  factions: Partial<Record<FactionId, Faction>>,
) {
  return objectEntries(factions)
    .sort(([_, a], [__, b]) => {
      return a.mapPosition - b.mapPosition;
    })
    .map(([id, _]) => id);
}

export function hasLeader(
  leaderId: LeaderId,
  faction: Faction,
  leaders: Partial<Record<LeaderId, Leader>>,
) {
  const leader = leaders[leaderId];
  if (!leader) {
    return false;
  }
  switch (leader.type) {
    case "AGENT":
      return leader.faction === faction.id;
    case "COMMANDER":
      if (leader.state !== "readied") {
        return false;
      }
      if (leader.faction === faction.id) {
        return true;
      }
      return !!faction.alliances?.includes(leader.faction);
    case "HERO":
      return leader.state === "readied" && leader.faction === faction.id;
  }
}
