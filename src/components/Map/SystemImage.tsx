import Image from "next/image";
import Hexagon from "../../../public/images/systems/Hexagon.png";
import { validSystemNumber } from "../../util/map";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import styles from "./GameMap.module.scss";
import PlanetOverlay, { OverlayDetails } from "./PlanetOverlay";
import { useSystem } from "../../context/dataHooks";

function getRotationClass(key: string) {
  switch (key) {
    case "rotateSixty":
      return styles.rotateSixty;
    case "rotateOneTwenty":
      return styles.rotateOneTwenty;
    case "rotateOneEighty":
      return styles.rotateOneEighty;
    case "rotateTwoForty":
      return styles.rotateTwoForty;
    case "rotateThreeHundred":
      return styles.rotateThreeHundred;
  }
  return undefined;
}

function getRotationClassFromNumber(key: number) {
  switch (key) {
    case 1:
      return styles.rotateSixty;
    case 2:
      return styles.rotateOneTwenty;
    case 3:
      return styles.rotateOneEighty;
    case 4:
      return styles.rotateTwoForty;
    case 5:
      return styles.rotateThreeHundred;
  }
  return undefined;
}

function EmptyHex() {
  return (
    <div
      className="flexRow"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Image
        src={Hexagon}
        alt={`System Tile`}
        sizes={rem(64)}
        fill
        style={{ opacity: "10%", objectFit: "contain" }}
        priority
      />
    </div>
  );
}

export default function SystemImage({
  onClick,
  overlayDetails,
  planets,
  selectable,
  systemNumber,
}: {
  onClick?: (systemId: string) => void;
  overlayDetails: OverlayDetails;
  planets: Partial<Record<PlanetId, Planet>>;
  selectable?: boolean;
  systemNumber: Optional<string>;
}) {
  const system = useSystem(systemNumber as SystemId);
  if (!systemNumber || systemNumber === "0") {
    return <EmptyHex />;
  }

  if (system && system.purged) {
    return null;
  }

  // Systems with a rotation applied to them.
  if (systemNumber.split(":").length > 1) {
    const classNames = getRotationClass(systemNumber.split(":")[0] ?? "");
    const actualSystemNumber = systemNumber.split(":")[1] ?? "";
    return (
      <div
        className={`flexRow ${classNames}`}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: selectable ? "pointer" : undefined,
          opacity: onClick && !selectable ? 0.25 : undefined,
        }}
      >
        <Image
          sizes={rem(256)}
          src={`/images/systems/ST_${actualSystemNumber}.png`}
          alt={`System ${actualSystemNumber} Tile`}
          fill
          style={{ objectFit: "contain" }}
        />
        <PlanetOverlay
          details={overlayDetails}
          planets={planets}
          systemNumber={systemNumber}
        />
      </div>
    );
  }

  if (!validSystemNumber(systemNumber)) {
    return <EmptyHex />;
  }

  let classNames: Optional<string> = "";
  if (systemNumber.includes("A") && systemNumber.split("A").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("A")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("A")[0] ?? ""}A`;
  }
  if (systemNumber.includes("B") && systemNumber.split("B").length > 1) {
    classNames = getRotationClassFromNumber(
      parseInt(systemNumber.split("B")[1] ?? "0")
    );
    systemNumber = `${systemNumber.split("B")[0] ?? ""}B`;
  }

  return (
    <div
      className={`flexRow ${classNames}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: selectable ? "pointer" : undefined,
        opacity: onClick && !selectable ? 0.25 : undefined,
      }}
      onClick={() => {
        if (!onClick || !systemNumber) {
          return;
        }
        onClick(systemNumber);
      }}
    >
      <Image
        src={`/images/systems/ST_${systemNumber}.png`}
        alt={`System ${systemNumber} Tile`}
        sizes={rem(256)}
        fill
        style={{ objectFit: "contain" }}
        priority={
          systemNumber === "299" ||
          systemNumber === "18" ||
          systemNumber === "82A"
        }
      />
      <PlanetOverlay
        details={overlayDetails}
        planets={planets}
        systemNumber={systemNumber}
      />
    </div>
  );
}
