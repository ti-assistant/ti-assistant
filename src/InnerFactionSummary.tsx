import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getTechs } from "../server/data/techs";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import SiteLogo from "./components/SiteLogo/SiteLogo";
import TechSummary from "./components/TechSummary/TechSummary";
import styles from "./FactionSummary.module.scss";
import { rem } from "./util/util";

const TOP_RIGHT = { x: 22, y: -38 };

export default function DummyFactionSummary() {
  const intl = useIntl();
  const techs = getTechs(intl);

  const [VPs, setVPs] = useState(0);

  // const techs: Techs = {
  //   "Sarween Tools": {
  //     description: "",
  //     id: "Sarween Tools",
  //     expansion: "BASE",
  //     name: "Sarween Tools",
  //     prereqs: [],
  //     type: "YELLOW",
  //   },
  // };

  const ownedTechs: TechId[] = ["Sarween Tools"];

  const planets: Planet[] = [
    {
      attributes: [],
      expansion: "POK",
      influence: 0,
      id: "Abaddon",
      name: "Abaddon",
      position: TOP_RIGHT,
      resources: 1,
      system: 75,
      type: "CULTURAL",
    },
    {
      attributes: [],
      expansion: "POK",
      faction: "Vuil'raith Cabal",
      home: true,
      influence: 0,
      id: "Acheron",
      name: "Acheron",
      position: TOP_RIGHT,
      resources: 4,
      system: 54,
      type: "NONE",
    },
    {
      attributes: [],
      expansion: "POK",
      influence: 0,
      id: "Ashtroth",
      name: "Ashtroth",
      position: TOP_RIGHT,
      resources: 2,
      system: 75,
      type: "HAZARDOUS",
    },
    {
      attributes: [],
      expansion: "POK",
      influence: 2,
      id: "Loki",
      name: "Loki",
      position: TOP_RIGHT,
      resources: 1,
      system: 75,
      type: "CULTURAL",
    },
  ];

  return (
    <div className={styles.FactionSummary}>
      <TechSummary
        factionId="Vuil'raith Cabal"
        techs={techs}
        ownedTechs={ownedTechs}
      />
      <div className={styles.VPGrid}>
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
              opacity: 0.25,
              width: rem(60),
              height: rem(60),
              userSelect: "none",
            }}
          >
            <SiteLogo />
          </div>
        </div>
        <div
          className="flexRow"
          style={{
            gap: rem(4),
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {VPs > 0 ? (
            <div
              className="arrowDown"
              onClick={() => setVPs((vps) => vps - 1)}
            ></div>
          ) : (
            <div style={{ width: rem(12) }}></div>
          )}
          <div
            className="flexRow"
            style={{ width: rem(24), lineHeight: rem(20) }}
          >
            {VPs}
          </div>
          <div
            className="arrowUp"
            onClick={() => setVPs((vps) => vps + 1)}
          ></div>
        </div>
        <div
          className="centered"
          style={{ fontSize: rem(20), lineHeight: rem(20) }}
        >
          <FormattedMessage
            id="PzyYtG"
            description="Shortened version of Victory Points."
            defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
            values={{ count: VPs }}
          />
        </div>
        {/* <ObjectiveDots /> */}
      </div>
      <PlanetSummary planets={planets} hasXxchaHero={false} />
    </div>
  );
}
