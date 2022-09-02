const FACTIONS = {
  Arborec: {
    colors: {
      Green: 1.6,
      Black: 0.1,
      Yellow: 0.1,
      Blue: 0.1
    }
  },
  "Argent Flight": {
    colors: {
      Orange: 1.6,
      Blue: 0.15,
      Green: 0.15
    }
  },
  "Barony of Letnev": {
    colors: {
      Red: 0.95,
      Black: 0.8,
      Blue: 0.1
    }
  },
  "Clan of Saar": {
    colors: {
      Orange: 0.85,
      Green: 0.5,
      Yellow: 0.4
    }
  },
  "Council Keleres": {
    colors: {
      Purple: 0.7,
      Blue: 0.5,
      Orange: 0.35,
      Yellow: 0.35
    }
  },
  "Embers of Muaat": {
    colors: {
      Red: 1.25,
      Orange: 0.65
    }
  },
  "Emirates of Hacan": {
    colors: {
      Yellow: 1.2,
      Orange: 0.7
    }
  },
  Empyrean: {
    colors: {
      Purple: 1.6,
      Red: 0.15,
      Magenta: 0.15
    }
  },
  "Federation of Sol": {
    colors: {
      Blue: 1.15,
      Yellow: 0.75
    }
  },
  "Ghosts of Creuss": {
    colors: {
      Blue: 1.7,
      Black: 0.1,
      Purple: 0.1
    }
  },
  "L1Z1X Mindnet": {
    colors: {
      Black: 0.7,
      Blue: 0.6,
      Red: 0.6
    }
  },
  "Mahact Gene-Sorcerers": {
    colors: {
      Yellow: 1.6,
      Purple: 0.3
    }
  },
  "Mentak Coalition": {
    colors: {
      Orange: 0.95,
      Black: 0.5,
      Yellow: 0.45
    }
  },
  "Naalu Collective": {
    colors: {
      Green: 1.15,
      Yellow: 0.45,
      Orange: 0.3
    }
  },
  "Naaz-Rokha Alliance": {
    colors: {
      Green: 1.6,
      Yellow: 0.3
    }
  },
  "Nekro Virus": {
    colors: {
      Red: 1.75,
      Black: 0.15
    }
  },
  Nomad: {
    colors: {
      Blue: 1.25,
      Purple: 0.65
    }
  },
  "Sardakk N'orr": {
    colors: {
      Black: 1.0,
      Red: 0.9
    }
  },
  "Titans of Ul": {
    colors: {
      Magenta: 1.9
    }
  },
  "Universities of Jol'Nar": {
    colors: {
      Blue: 1.6,
      Purple: 0.3
    }
  },
  "Vuil'Raith Cabal": {
    colors: {
      Red: 1.35,
      Black: 0.4,
      Magenta: 0.1
    }
  },
  Winnu: {
    colors: {
      Orange: 0.75,
      Purple: 0.6,
      Yellow: 0.55
    }
  },
  "Xxcha Kingdom": {
    colors: {
      Green: 1.1,
      Blue: 0.8
    }
  },
  "Yin Brotherhood": {
    colors: {
      Purple: 1.05,
      Black: 0.6,
      Yellow: 0.25
    }
  },
  "Yssaril Tribes": {
    colors: {
      Green: 0.93,
      Yellow: 0.63,
      Red: 0.25,
      Black: 0.1
    }
  }
};

export default function handler(req, res) {
  res.status(200).json(FACTIONS);
}