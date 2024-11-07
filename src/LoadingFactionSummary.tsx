import { FormattedMessage } from "react-intl";
import styles from "./FactionSummary.module.scss";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import PlanetSummary from "./components/PlanetSummary/PlanetSummary";
import TechSummary from "./components/TechSummary/TechSummary";
import { rem } from "./util/util";

export default function LoadingFactionSummary() {
  let ownedTechs: Tech[] = [];
  let updatedPlanets: Planet[] = [];
  let VPs = 0;

  return (
    <div className={styles.FactionSummary}>
      <TechSummary techs={ownedTechs} />
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
            <FactionIcon factionId={undefined} size="100%" />
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
          <div style={{ width: rem(12) }}></div>
          <div
            className="flexRow"
            style={{ width: rem(24), lineHeight: rem(20) }}
          >
            {VPs}
          </div>
          <div style={{ width: rem(12) }}></div>
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
        <ObjectiveDots />
      </div>
      <PlanetSummary planets={updatedPlanets} hasXxchaHero={false} />
    </div>
  );
}

function ObjectiveDots() {
  const stageOnes = {
    scored: 0,
    revealed: 0,
  };
  const stageTwos = {
    scored: 0,
    revealed: 0,
  };

  return (
    <div className="flexColumn" style={{ width: "100%", gap: rem(4) }}>
      <div
        className="flexRow"
        style={{
          gap: rem(2),
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div className="flexRow" style={{ gap: rem(2), height: rem(4) }}>
          {Array(stageOnes.revealed)
            .fill(0)
            .map((_, index) => {
              const scored = index < stageOnes.scored;
              return (
                <div
                  key={index}
                  style={{
                    width: rem(4),
                    height: rem(4),
                    border: "1px solid orange",
                    borderRadius: "100%",
                    backgroundColor: scored ? "orange" : undefined,
                  }}
                ></div>
              );
            })}
        </div>
        <div className="flexRow" style={{ gap: rem(2), height: rem(4) }}>
          {Array(stageTwos.revealed)
            .fill(0)
            .map((_, index) => {
              const scored = index < stageTwos.scored;
              return (
                <div
                  key={index}
                  style={{
                    width: rem(4),
                    height: rem(4),
                    border: "1px solid royalblue",
                    borderRadius: "100%",
                    backgroundColor: scored ? "royalblue" : undefined,
                  }}
                ></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
