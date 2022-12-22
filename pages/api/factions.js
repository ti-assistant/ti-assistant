const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const factionsRef = await db.collection('factions').get();

  let factions = {};
  factionsRef.forEach((val) => {
    factions[val.id] = val.data();
  });

  res.status(200).json(factions);
}