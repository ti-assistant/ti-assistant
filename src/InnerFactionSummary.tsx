import { use, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getTechs } from "../server/data/techs";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import SiteLogo from "./components/SiteLogo/SiteLogo";
import TechSummary from "./components/TechSummary/TechSummary";
import TimerDisplay from "./components/TimerDisplay/TimerDisplay";
import { SettingsContext } from "./context/contexts";
import styles from "./FactionSummary.module.scss";
import { SummaryLabel, SummarySection } from "./util/settings";
import { rem } from "./util/util";

const TOP_RIGHT = { x: 22, y: -38 };

export default function DummyFactionSummary() {
  const intl = useIntl();
  const techs = getTechs(intl);
  const { settings } = use(SettingsContext);

  const ownedTechs: Set<TechId> = new Set(["Sarween Tools"]);

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
      types: ["CULTURAL"],
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
      types: [],
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
      types: ["HAZARDOUS"],
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
      types: ["CULTURAL"],
    },
  ];

  return (
    <div
      className={styles.FactionSummary}
      style={{ justifyContent: "space-evenly" }}
    >
      <SummaryPart
        techs={techs}
        ownedTechs={ownedTechs}
        planets={planets}
        section={settings["fs-left"]}
      />
      <SummaryPart
        techs={techs}
        ownedTechs={ownedTechs}
        planets={planets}
        section={settings["fs-center"]}
      />
      <SummaryPart
        techs={techs}
        ownedTechs={ownedTechs}
        planets={planets}
        section={settings["fs-right"]}
      />
    </div>
  );
}

function SummaryPart({
  techs,
  ownedTechs,
  planets,
  section,
}: {
  techs: Record<TechId, Tech>;
  ownedTechs: Set<TechId>;
  planets: Planet[];
  section: SummarySection;
}) {
  const [VPs, setVPs] = useState(0);
  switch (section) {
    case "NONE":
      return null;
    case "TECHS":
      return (
        <TechSummary
          factionId="Vuil'raith Cabal"
          techs={techs}
          ownedTechs={ownedTechs}
        />
      );
    case "OBJECTIVES":
      return (
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
      );
    case "PLANETS":
      return (
        <PlanetSummary
          factionId="Vuil'raith Cabal"
          planets={planets}
          hasXxchaHero={false}
        />
      );
    case "TIMER":
      return <TimerDisplay time={6454} width={84} />;
  }
}

export function DummySummaryLabel({
  factionId,
  label,
}: {
  factionId: FactionId;
  label: SummaryLabel;
}) {
  switch (label) {
    case "NONE":
      return null;
    case "NAME":
      return "Faction Name";
    case "TIMER":
      return <TimerDisplay time={6454} width={84} />;
    case "VPS":
      return (
        <FormattedMessage
          id="PzyYtG"
          description="Shortened version of Victory Points."
          defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
          values={{ count: 8 }}
        />
      );
  }
}
