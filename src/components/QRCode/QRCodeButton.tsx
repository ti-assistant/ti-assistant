"use client";

import { usePathname } from "next/navigation";
import { use } from "react";
import { ModalContext } from "../../context/contexts";
import { useAllPlanets, useOptions, usePlanets } from "../../context/dataHooks";
import { useFactions, useNumFactions } from "../../context/factionDataHooks";
import MapMenuSVG from "../../icons/ui/MapMenu";
import QRCodeSVG from "../../icons/ui/QRCode";
import { getWormholeNexusSystemNumber } from "../../util/map";
import { getMapString } from "../../util/options";
import { fracturePlanetsOwned } from "../../util/planets";
import { rem } from "../../util/util";
import GameMap from "../Map/GameMap";
import QRCodeModal from "./QRCodeModal";

export default function QRCodeButton({
  gameId,
  qrCode,
}: {
  gameId: string;
  qrCode: string;
}) {
  const { openModal } = use(ModalContext);

  return (
    <button
      className="iconButton"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        fontSize: "1rem",
      }}
      onClick={() => {
        openModal(<QRCodeModal gameId={gameId} qrCode={qrCode} />);
      }}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        <QRCodeSVG />
      </div>
    </button>
  );
}

export function MapButton({}) {
  const pathname = usePathname();
  const allPlanets = useAllPlanets();
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();
  const numFactions = useNumFactions();
  const { openModal } = use(ModalContext);

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition,
  );

  const mapString = getMapString(options, numFactions);

  if (!mapString) {
    return null;
  }

  if (!pathname.includes("/game/") && !pathname.includes("/archive/")) {
    return null;
  }

  return (
    <button
      className="iconButton"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        fontSize: "1rem",
      }}
      onClick={() => {
        openModal(
          <div
            style={{
              position: "relative",
              width: "min(100dvh, 100dvw)",
              height: "min(100dvh, 100dvw)",
            }}
          >
            <GameMap
              factions={mapOrderedFactions}
              mapString={mapString}
              mapStyle={options["map-style"]}
              wormholeNexus={getWormholeNexusSystemNumber(
                options,
                planets,
                factions,
              )}
              planets={allPlanets}
              expansions={options.expansions}
              hideFracture={!fracturePlanetsOwned(allPlanets)}
            />
          </div>,
        );
      }}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        <MapMenuSVG />
      </div>
    </button>
  );
}
