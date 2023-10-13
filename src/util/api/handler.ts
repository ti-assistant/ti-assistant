export function updateGameData(
  currentData: StoredGameData,
  updates: Record<string, any>
) {
  for (const [path, value] of Object.entries(updates)) {
    const pathSections = path.split(".");
    const key = pathSections.pop();
    if (!key) {
      return;
    }
    let dataRef = currentData;
    for (const section of pathSections) {
      if (!dataRef[section]) {
        dataRef[section] = {};
      }
      dataRef = dataRef[section];
    }

    if (value === "DELETE") {
      delete dataRef[key];
    } else if (value === "INCREMENT") {
      dataRef[key] = (dataRef[key] ?? 0) + 1;
    } else {
      dataRef[key] = value;
    }
  }
}
