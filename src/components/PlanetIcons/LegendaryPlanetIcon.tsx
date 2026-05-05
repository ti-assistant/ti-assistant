"use client";

import { use } from "react";
import { ModalContext } from "../../context/contexts";
import LegendaryPlanetSVG from "../../icons/planets/LegendaryPlanet";
import { em, rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import { ModalContent } from "../Modal/Modal";

function InfoContent({ ability }: { ability: string }) {
  const description = ability.replaceAll("\\n", "\n");
  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
        gap: rem(32),
      }}
    >
      <FormattedDescription description={description} />
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
  const { openModal } = use(ModalContext);

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
            </ModalContent>,
          );
        }}
        className="flexRow"
        style={{
          cursor,
          borderRadius: "100%",
          height: em(16),
          width: em(16),
          boxShadow: `0px 0px ${em(2)} ${em(1.5)} purple`,
          backgroundColor: "var(--background-color)",
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: em(12),
            height: em(12),
          }}
        >
          <LegendaryPlanetSVG />
        </div>
      </div>
    </>
  );
}
