import Image from "next/image";
import { useState } from "react";
import Modal from "../Modal/Modal";

function InfoContent({ ability }: { ability: string }) {
  const description = ability.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
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
  const [showInfoModal, setShowInfoModal] = useState(false);

  const cursor = ability ? "pointer" : "auto";
  return (
    <>
      {planetName && ability ? (
        <Modal
          closeMenu={() => setShowInfoModal(false)}
          level={2}
          visible={showInfoModal}
          title={<div style={{ fontSize: "40px" }}>{planetName}</div>}
        >
          <InfoContent ability={ability} />
        </Modal>
      ) : null}
      <div
        onClick={() => setShowInfoModal(true)}
        style={{
          cursor: cursor,
          display: "flex",
          alignItems: "flex-start",
          borderRadius: "22px",
          height: "16px",
          width: "16px",
          paddingTop: "2px",
          paddingLeft: "2px",
          boxShadow: `0px 0px ${"2px"} ${"1px"} purple`,
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "12px",
            height: "12px",
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
