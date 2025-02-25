"use client";

import { useSharedModal } from "../../data/SharedModal";
import LegendaryPlanetSVG from "../../icons/planets/LegendaryPlanet";
import { rem } from "../../util/util";
import { ModalContent } from "../Modal/Modal";

function InfoContent({ ability }: { ability: string }) {
  const description = ability.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      {description}
    </div>
  );
}

export default function LegendaryPlanetIcon({
  planetName,
  ability,
}: {
  planetName?: string;
  ability?: string;
}) {
  const { openModal } = useSharedModal();

  const cursor = ability ? "pointer" : "auto";
  return (
    <>
      <div
        onClick={() => {
          if (!planetName || !ability) {
            return;
          }
          openModal(
            <ModalContent
              title={<div style={{ fontSize: rem(40) }}>{planetName}</div>}
            >
              <InfoContent ability={ability} />
            </ModalContent>
          );
        }}
        className="flexRow"
        style={{
          cursor,
          borderRadius: "100%",
          height: rem(16),
          width: rem(16),
          boxShadow: `0px 0px ${rem(2)} ${rem(1.5)} purple`,
          backgroundColor: "black",
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: rem(12),
            height: rem(12),
          }}
        >
          <LegendaryPlanetSVG />
        </div>
      </div>
    </>
  );
}
