import Image from "next/image";
import { ReactNode } from "react";
import { useAttachments } from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { getFactionColor } from "../../util/factions";
import {
  applyAllPlanetAttachments,
  getPlanetTypeColor,
} from "../../util/planets";
import { getTechTypeColor } from "../../util/techs";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import TechIcon from "../TechIcon/TechIcon";

const HEX_RATIO = 2 / Math.sqrt(3);

export type OverlayDetails =
  | "NONE"
  | "ATTACHMENTS"
  | "OWNERS"
  | "TECH_SKIPS"
  | "TYPES";

export default function PlanetOverlay({
  details,
  planets,
  systemNumber,
}: {
  details: OverlayDetails;
  planets: Partial<Record<PlanetId, Planet>>;
  systemNumber: Optional<string>;
}) {
  const attachments = useAttachments();
  const factions = useFactions();

  let systemPlanets = Object.values(planets).filter((planet) => {
    if (!systemNumber) {
      return false;
    }
    if (systemNumber === "82A" || systemNumber === "82B") {
      return planet.system === "82B" || planet.system === "82A";
    }
    return planet.system === parseInt(systemNumber);
  });
  systemPlanets = applyAllPlanetAttachments(systemPlanets, attachments);

  return (
    <>
      {systemPlanets.map((planet) => {
        let detailsSymbol: Optional<ReactNode>;
        const height =
          planet.id !== "Mallice" && planet.id !== "Creuss"
            ? `calc(24% * ${HEX_RATIO})`
            : "24%";

        if (planet.state === "PURGED") {
          return (
            <div
              key={planet.id}
              className="flexRow"
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <Image
                  src={`/images/destroyed.webp`}
                  alt={`Destroyed Planet`}
                  fill
                  sizes={rem(144)}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          );
        }
        switch (details) {
          case "OWNERS": {
            if (!planet.owner) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${getFactionColor(
                    factions[planet.owner]
                  )}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <FactionIcon factionId={planet.owner} size="75%" />
              </div>
            );
            break;
          }
          case "TYPES": {
            if (planet.type === "NONE") {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${getPlanetTypeColor(
                    planet.type
                  )}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <PlanetIcon type={planet.type} size="70%" />
              </div>
            );
            break;
          }
          case "ATTACHMENTS": {
            if ((planet.attachments ?? []).length === 0) {
              break;
            }

            detailsSymbol = (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--background-color)",
                  border: `var(--border-size) solid ${"#eee"}`,
                  borderRadius: "100%",
                  width: "24%",
                  height: height,
                  marginLeft: `${planet.position?.x}%`,
                  marginTop: `${planet.position?.y}%`,
                }}
              >
                <div
                  className="flexRow"
                  style={{ position: "relative", width: "70%", height: "70%" }}
                >
                  <div className="symbol">⎗</div>
                </div>
              </div>
            );
            break;
          }
          case "TECH_SKIPS": {
            let color: Optional<TechType>;
            let size: Optional<string>;
            for (const attribute of planet.attributes) {
              switch (attribute) {
                case "red-skip":
                  color = "RED";
                  size = "100%";
                  break;
                case "blue-skip":
                  color = "BLUE";
                  size = "95%";
                  break;
                case "green-skip":
                  color = "GREEN";
                  size = "100%";
                  break;
                case "yellow-skip":
                  color = "YELLOW";
                  size = "90%";
                  break;
              }
            }
            if (color && size) {
              detailsSymbol = (
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    backgroundColor: "var(--background-color)",
                    border: `var(--border-size) solid ${getTechTypeColor(
                      color
                    )}`,
                    borderRadius: "100%",
                    width: "24%",
                    height: height,
                    marginLeft: `${planet.position?.x}%`,
                    marginTop: `${planet.position?.y}%`,
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: "70%",
                      height: "70%",
                    }}
                  >
                    <TechIcon type={color} size={size} />
                  </div>
                </div>
              );
            }
            break;
          }
        }

        return (
          <div
            key={planet.id}
            className="flexRow"
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            {detailsSymbol}
          </div>
        );
      })}
      {systemNumber === "18" && !systemPlanets[0]?.owner ? (
        <div
          className="flexRow"
          style={{
            position: "absolute",
            borderRadius: "100%",
            width: "40%",
            height: `calc(40% * ${HEX_RATIO})`,
          }}
        >
          <div
            className="flexRow"
            style={{ position: "relative", width: "90%", height: "90%" }}
          >
            <Image
              sizes={rem(144)}
              src={`/images/custodians.png`}
              alt={`Custodians Token`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
