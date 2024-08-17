export function getFactionColor(faction: Faction | undefined) {
  if (!faction) {
    return "#555";
  }
  return convertToFactionColor(faction.color);
}

export function convertToFactionColor(color: string | undefined) {
  if (!color) {
    return "#555";
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

export function getFactionName(faction: Faction | undefined) {
  if (!faction) {
    return "Loading Faction...";
  }
  if (faction.playerName) {
    return faction.playerName + " - " + faction.shortname;
  }
  return faction.name;
}

export function getFactionShortName(faction: Faction | undefined) {
  if (!faction) {
    return null;
  }
  if (faction.playerName) {
    return faction.playerName;
  }
  return faction.shortname;
}

export function computeVPs(
  factions: Partial<Record<FactionId, Faction>>,
  factionId: FactionId,
  objectives: Partial<Record<ObjectiveId, Objective>>
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
  objectives: Partial<Record<ObjectiveId, Objective>>
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
