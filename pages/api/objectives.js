const { getFirestore } = require('firebase-admin/firestore');

export default async function handler(req, res) {
  const db = getFirestore();

  // const objectivesRef = db.collection('objectives').get();

  // let objectives = {};
  // objectivesRef.data().forEach((val) => {
  //   objectives[val.id] = val.data();
  // });

  res.status(200).json({});
}