const { getFirestore } = require('firebase-admin/firestore');

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  let players = req.body.players;

  const db = getFirestore();

  const playerPromises = players.map(async (player) => {
    const homePlanetsRef = await db.collection('planets').where('faction', '==', player.faction).get();
    const homePlanets = [];
    homePlanetsRef.forEach((planet) => {
      homePlanets.push(planet.data());
    });
    return {
      ...player,
      planets: homePlanets,
    };
  });

  players = await Promise.all(playerPromises);

  const gameState = {
    speaker: req.body.speaker,
    players: players,
  }

  let gameid = makeid(6);

  let game = await db.collection('games').doc(gameid).get();
  while (game.exists) {
    gameid = makeid(6);
    game = await db.collection('games').doc(gameid).get();
  }

  const result = await db.collection('games').doc(gameid).set(gameState);

  // console.log(req.body);
  res.status(200).json({gameid: gameid});
}