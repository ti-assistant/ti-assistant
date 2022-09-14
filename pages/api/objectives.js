const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  const objectivesRef = db.collection('objectives');
  const objectiveQueries = await objectivesRef.get();

  let objectives = [];
  objectiveQueries.forEach((val) => {
    objectives.push(val.data());
  });

  res.status(200).json(objectives);
}