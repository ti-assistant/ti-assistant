const { getFirestore, FieldValue } = require('firebase-admin/firestore');

function getNextPlayer(factions, nextorder) {
  for (const faction of Object.values(factions)) {
    if (faction.order === nextorder) {
      return faction;
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  const data = req.body;

  const gameid = req.query.game;
  const db = getFirestore();

  const gameRef = await db.collection('games').doc(gameid).get();

  if (!gameRef.exists) {
    res.status(404);
  }

  switch (data.action) {
    case "ADVANCE_PHASE":
      let nextPhase;
      let activefaction;
      let round = gameRef.data().state.round ?? 1;
      switch (gameRef.data().state.phase) {
        case "SETUP":
          nextPhase = "STRATEGY";
          activefaction = getNextPlayer(gameRef.data().factions, 1);
          break;
        case "STRATEGY":
          nextPhase = "ACTION";
          break;
        case "ACTION":
          nextPhase = "STATUS";
          break;
        case "STATUS":
          // TODO(jboman): Update to handle agenda phase not starting.
          nextPhase = "AGENDA";
          break;
        case "AGENDA":
          nextPhase = "STRATEGY";
          activefaction = getNextPlayer(gameRef.data().factions, 1);
          ++round;
          break;
      }
      if (!nextPhase) {
        return res.status(500);
      }
      await db.collection('games').doc(gameid).update({
        "state.phase": nextPhase,
        "state.activeplayer": activefaction ? activefaction.name : "None",
        "state.round": round,
      });
      break;
    case "ADVANCE_PLAYER":
      if (gameRef.data().state.phase === "STRATEGY") {
        const factions = gameRef.data().factions;
        const currentFaction = factions[gameRef.data().state.activeplayer];
        const nextorder = currentFaction.order + 1;
        // const nextorder = Math.max((currentFaction.order + 1) % (Object.keys(factions).length + 1), 1);
        let ondeckfaction;
        for (const faction of Object.values(factions)) {
          if (faction.order === nextorder) {
            ondeckfaction = faction;
            break;
          }
        }
        await db.collection('games').doc(gameid).update({
          "state.activeplayer": ondeckfaction ? ondeckfaction.name : "None",
        });
      }
      // TODO: Action phase
      break;

  }

  const responseRef = await db.collection('games').doc(gameid).get();

  return res.status(200).json(responseRef.data());
}