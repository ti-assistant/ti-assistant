"use client";

import Image from "next/image";
import { useState } from "react";
import Modal, { ModalContent } from "../Modal/Modal";
import { rem } from "../../util/util";
import { useSharedModal } from "../../data/SharedModal";

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
        style={{
          cursor: cursor,
          display: "flex",
          alignItems: "flex-start",
          borderRadius: rem(22),
          height: rem(16),
          width: rem(16),
          paddingTop: rem(2),
          paddingLeft: rem(2),
          boxShadow: `0px 0px ${"2px"} ${"1px"} purple`,
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            position: "relative",
            width: rem(12),
            height: rem(12),
          }}
        >
          <Image
            src="/images/legendary_planet.svg"
            alt="Legendary Planet Icon"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </>
  );
}
