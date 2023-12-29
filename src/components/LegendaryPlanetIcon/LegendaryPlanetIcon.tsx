import Image from "next/image";
import { useState } from "react";
import { responsivePixels } from "../../util/util";
import Modal from "../Modal/Modal";

function InfoContent({ ability }: { ability: string }) {
  const description = ability.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
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
          title={
            <div style={{ fontSize: responsivePixels(40) }}>{planetName}</div>
          }
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
          borderRadius: responsivePixels(22),
          height: responsivePixels(16),
          width: responsivePixels(16),
          paddingTop: responsivePixels(2),
          paddingLeft: responsivePixels(2),
          boxShadow: `0px 0px ${responsivePixels(2)} ${responsivePixels(
            1
          )} purple`,
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            position: "relative",
            width: responsivePixels(12),
            height: responsivePixels(12),
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
